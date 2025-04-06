import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Mock data for analytics charts
const monthlyInventoryData = [
  { name: "Jan", stock: 1200 },
  { name: "Feb", stock: 1300 },
  { name: "Mar", stock: 1250 },
  { name: "Apr", stock: 1420 },
  { name: "May", stock: 1350 },
  { name: "Jun", stock: 1450 },
  { name: "Jul", stock: 1500 },
  { name: "Aug", stock: 1580 },
  { name: "Sep", stock: 1620 },
  { name: "Oct", stock: 1700 },
  { name: "Nov", stock: 1800 },
  { name: "Dec", stock: 1900 },
];

const categoryData = [
  { name: "Electronics", value: 42 },
  { name: "Wearables", value: 18 },
  { name: "Audio", value: 25 },
  { name: "Accessories", value: 15 },
];

const revenueVsInventoryData = [
  { name: "Jan", revenue: 45000, inventory: 1200 },
  { name: "Feb", revenue: 52000, inventory: 1300 },
  { name: "Mar", revenue: 48000, inventory: 1250 },
  { name: "Apr", revenue: 61000, inventory: 1420 },
  { name: "May", revenue: 55000, inventory: 1350 },
  { name: "Jun", revenue: 67000, inventory: 1450 },
  { name: "Jul", revenue: 72000, inventory: 1500 },
];

const topSellingProducts = [
  { name: "Wireless Headphones", sales: 285 },
  { name: "Smart Watches", sales: 255 },
  { name: "Bluetooth Speakers", sales: 190 },
  { name: "USB-C Cables", sales: 160 },
  { name: "Phone Cases", sales: 140 },
];

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export default function Analytics() {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">
          View detailed insights and trends about your inventory and sales performance.
        </p>
      </div>
      
      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Monthly Inventory Trends */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Inventory Trends (12 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyInventoryData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white',
                      borderRadius: '0.375rem',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="stock"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Inventory by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value} items`, "Quantity"]}
                    contentStyle={{ 
                      backgroundColor: 'white',
                      borderRadius: '0.375rem',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Revenue vs Inventory */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue vs Inventory Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueVsInventoryData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip
                    formatter={(value, name) => [
                      name === "revenue" ? `$${value}` : value,
                      name === "revenue" ? "Revenue" : "Inventory"
                    ]}
                    contentStyle={{ 
                      backgroundColor: 'white',
                      borderRadius: '0.375rem',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--chart-3))"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="inventory"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Top Selling Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topSellingProducts}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis
                    dataKey="name"
                    type="category"
                    scale="band"
                    tick={{ fontSize: 12 }}
                    width={150}
                  />
                  <Tooltip
                    formatter={(value) => [`${value} units`, "Sales"]}
                    contentStyle={{ 
                      backgroundColor: 'white',
                      borderRadius: '0.375rem',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
