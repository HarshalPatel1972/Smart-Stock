const express = require("express");
const cors = require("cors");
const { storage } = require("../server/storage");
const { insertProductSchema, insertActivitySchema } = require("@shared/schema");
const { z } = require("zod");

const app = express();
app.use(cors());
app.use(express.json());

// Get dashboard data
app.get("/api/dashboard", async (req, res) => {
  try {
    const products = await storage.getProducts();
    const lowStockProducts = await storage.getLowStockProducts();
    const pendingOrdersCount = await storage.getPendingOrdersCount();
    const recentActivities = await storage.getActivities(5);

    // Calculate total inventory
    const totalItems = products.reduce(
      (sum, product) => sum + product.quantity,
      0
    );

    // Calculate monthly revenue (this would come from orders in a real app)
    const monthlyRevenue = 78650;

    res.json({
      totalItems,
      lowStockCount: lowStockProducts.length,
      pendingOrdersCount,
      monthlyRevenue,
      recentActivities,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all products
app.get("/api/products", async (req, res) => {
  try {
    const products = await storage.getProducts();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Implement other API routes from routes.ts
// ...

module.exports = app;
