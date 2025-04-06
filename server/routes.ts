import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertProductSchema, insertActivitySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Setup WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Broadcast to all connected clients
  function broadcast(message: any) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }
  
  // WebSocket connection handling
  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    
    // Send initial data
    storage.getActivities(5).then((activities) => {
      ws.send(JSON.stringify({
        type: 'INITIAL_ACTIVITIES',
        data: activities
      }));
    });
    
    // Handle WebSocket messages
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received message:', data);
        
        // Handle specific message types if needed
        if (data.type === 'PING') {
          ws.send(JSON.stringify({ type: 'PONG' }));
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });
  });
  
  // API Routes
  // Get dashboard data
  app.get('/api/dashboard', async (req, res) => {
    try {
      const products = await storage.getProducts();
      const lowStockProducts = await storage.getLowStockProducts();
      const pendingOrdersCount = await storage.getPendingOrdersCount();
      const recentActivities = await storage.getActivities(5);
      
      // Calculate total inventory
      const totalItems = products.reduce((sum, product) => sum + product.quantity, 0);
      
      // Calculate monthly revenue (this would come from orders in a real app)
      const monthlyRevenue = 78650;
      
      res.json({
        totalItems,
        lowStockCount: lowStockProducts.length,
        pendingOrdersCount,
        monthlyRevenue,
        recentActivities
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Get all products
  app.get('/api/products', async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Get low stock products
  app.get('/api/products/low-stock', async (req, res) => {
    try {
      const lowStockProducts = await storage.getLowStockProducts();
      res.json(lowStockProducts);
    } catch (error) {
      console.error('Error fetching low stock products:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Get a single product
  app.get('/api/products/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid product ID' });
      }
      
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      res.json(product);
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Create a product
  app.post('/api/products', async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      
      // Broadcast product creation
      broadcast({
        type: 'PRODUCT_CREATED',
        data: product
      });
      
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid product data', errors: error.errors });
      }
      console.error('Error creating product:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Update a product
  app.patch('/api/products/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid product ID' });
      }
      
      // Validate partial product data
      const updateSchema = insertProductSchema.partial();
      const productData = updateSchema.parse(req.body);
      
      const updatedProduct = await storage.updateProduct(id, productData);
      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      // Broadcast product update
      broadcast({
        type: 'PRODUCT_UPDATED',
        data: updatedProduct
      });
      
      // If quantity is low, broadcast low stock alert
      if (updatedProduct.quantity < updatedProduct.reorderLevel) {
        broadcast({
          type: 'LOW_STOCK_ALERT',
          data: updatedProduct
        });
      }
      
      res.json(updatedProduct);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid product data', errors: error.errors });
      }
      console.error('Error updating product:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Get all activities
  app.get('/api/activities', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const activities = await storage.getActivities(limit);
      res.json(activities);
    } catch (error) {
      console.error('Error fetching activities:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Create an activity
  app.post('/api/activities', async (req, res) => {
    try {
      const activityData = insertActivitySchema.parse(req.body);
      const activity = await storage.createActivity(activityData);
      
      // Broadcast new activity
      broadcast({
        type: 'NEW_ACTIVITY',
        data: activity
      });
      
      res.status(201).json(activity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid activity data', errors: error.errors });
      }
      console.error('Error creating activity:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Get all orders
  app.get('/api/orders', async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Get dashboard forecast data
  app.get('/api/forecast', async (req, res) => {
    try {
      // In a real app, this would be calculated based on past orders
      // Mocking forecast data for this example
      const forecast = {
        percentChange: '+12.5%',
        nextSevenDays: [65, 59, 80, 81, 56, 55, 40],
        topProducts: [
          { name: 'Wireless Headphones', expectedUnits: 120 },
          { name: 'Smart Watches', expectedUnits: 85 },
          { name: 'Bluetooth Speakers', expectedUnits: 65 }
        ]
      };
      
      res.json(forecast);
    } catch (error) {
      console.error('Error fetching forecast data:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  return httpServer;
}
