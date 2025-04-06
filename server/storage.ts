import { 
  users, User, InsertUser,
  products, Product, InsertProduct, 
  activities, Activity, InsertActivity,
  orders, Order, InsertOrder
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product methods
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductBySku(sku: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  getLowStockProducts(): Promise<Product[]>;
  
  // Activity methods
  getActivities(limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  
  // Order methods
  getOrders(): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  getPendingOrdersCount(): Promise<number>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private activities: Map<number, Activity>;
  private orders: Map<number, Order>;
  
  private userId: number;
  private productId: number;
  private activityId: number;
  private orderId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.activities = new Map();
    this.orders = new Map();
    
    this.userId = 1;
    this.productId = 1;
    this.activityId = 1;
    this.orderId = 1;
    
    // Initialize with sample data
    this.initSampleData();
  }

  private initSampleData() {
    // Add an admin user
    this.createUser({
      username: "admin",
      password: "password",
      fullName: "Admin User",
      role: "admin"
    });
    
    // Sample products
    const productData: InsertProduct[] = [
      {
        name: "Wireless Headphones",
        sku: "WH-0023-B",
        category: "Electronics",
        quantity: 25,
        reorderLevel: 10,
        price: 7999 // $79.99
      },
      {
        name: "Smart Watches",
        sku: "SW-1010-S",
        category: "Wearables",
        quantity: 2,
        reorderLevel: 10,
        price: 12999 // $129.99
      },
      {
        name: "Bluetooth Speakers",
        sku: "BS-4560-P",
        category: "Audio",
        quantity: 42,
        reorderLevel: 15,
        price: 5999 // $59.99
      },
      {
        name: "USB-C Cables",
        sku: "CB-3454-U",
        category: "Accessories",
        quantity: 8,
        reorderLevel: 20,
        price: 1599 // $15.99
      },
      {
        name: "Phone Cases",
        sku: "PC-7890-V",
        category: "Accessories",
        quantity: 65,
        reorderLevel: 25,
        price: 1999 // $19.99
      }
    ];
    
    for (const product of productData) {
      this.createProduct(product);
    }
    
    // Sample activities
    const activityData: InsertActivity[] = [
      {
        type: "RESTOCK",
        description: "Wireless Headphones inventory increased by 50 units",
        productId: 1
      },
      {
        type: "LOW_STOCK",
        description: "Smart Watches inventory below reorder level (5 units left)",
        productId: 2
      },
      {
        type: "ORDER",
        description: "Order #45782 contains 3 items worth $245.00",
        productId: null
      },
      {
        type: "SUPPLIER",
        description: "TechSupplyCo updated their delivery timeframe to 3-5 days",
        productId: null
      }
    ];
    
    for (const activity of activityData) {
      this.createActivity(activity);
    }
    
    // Sample orders
    const orderData: InsertOrder[] = [
      {
        orderNumber: "ORD-45782",
        status: "pending",
        total: 24500 // $245.00
      },
      {
        orderNumber: "ORD-45783",
        status: "pending",
        total: 15999 // $159.99
      },
      {
        orderNumber: "ORD-45784",
        status: "shipped",
        total: 9999 // $99.99
      }
    ];
    
    for (const order of orderData) {
      this.createOrder(order);
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Product methods
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async getProductBySku(sku: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(
      (product) => product.sku === sku,
    );
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.productId++;
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    
    // Create activity for this
    await this.createActivity({
      type: "CREATE",
      description: `New product ${product.name} added to inventory`,
      productId: product.id
    });
    
    return product;
  }
  
  async updateProduct(id: number, updatedFields: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const originalQuantity = product.quantity;
    
    const updatedProduct: Product = { ...product, ...updatedFields };
    this.products.set(id, updatedProduct);
    
    // Create activity for quantity change
    if (updatedFields.quantity !== undefined && updatedFields.quantity !== originalQuantity) {
      const change = updatedFields.quantity - originalQuantity;
      const activityType = change > 0 ? "RESTOCK" : "REMOVE";
      await this.createActivity({
        type: activityType,
        description: `${product.name} inventory ${change > 0 ? 'increased' : 'decreased'} by ${Math.abs(change)} units`,
        productId: product.id
      });
      
      // Create low stock alert if needed
      if (updatedFields.quantity < product.reorderLevel) {
        await this.createActivity({
          type: "LOW_STOCK",
          description: `${product.name} inventory below reorder level (${updatedFields.quantity} units left)`,
          productId: product.id
        });
      }
    }
    
    return updatedProduct;
  }
  
  async getLowStockProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.quantity < product.reorderLevel
    );
  }
  
  // Activity methods
  async getActivities(limit?: number): Promise<Activity[]> {
    const activities = Array.from(this.activities.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
    return limit ? activities.slice(0, limit) : activities;
  }
  
  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.activityId++;
    const activity: Activity = { 
      ...insertActivity, 
      id, 
      timestamp: new Date() 
    };
    this.activities.set(id, activity);
    return activity;
  }
  
  // Order methods
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }
  
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }
  
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.orderId++;
    const order: Order = { 
      ...insertOrder, 
      id, 
      timestamp: new Date() 
    };
    this.orders.set(id, order);
    
    // Create activity for this order
    await this.createActivity({
      type: "ORDER",
      description: `New order ${order.orderNumber} created with total $${(order.total / 100).toFixed(2)}`,
      productId: null
    });
    
    return order;
  }
  
  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder: Order = { ...order, status };
    this.orders.set(id, updatedOrder);
    
    // Create activity for status change
    await this.createActivity({
      type: "ORDER_STATUS",
      description: `Order ${order.orderNumber} status updated to ${status}`,
      productId: null
    });
    
    return updatedOrder;
  }
  
  async getPendingOrdersCount(): Promise<number> {
    return Array.from(this.orders.values()).filter(
      (order) => order.status === "pending"
    ).length;
  }
}

export const storage = new MemStorage();
