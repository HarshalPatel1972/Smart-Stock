import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";

// Monthly mock data (in a real application, this would come from API)
const monthlyData = [
  { name: 'Jan', stockLevel: 1200, reorderLevel: 500 },
  { name: 'Feb', stockLevel: 1300, reorderLevel: 500 },
  { name: 'Mar', stockLevel: 1250, reorderLevel: 500 },
  { name: 'Apr', stockLevel: 1420, reorderLevel: 500 },
  { name: 'May', stockLevel: 1350, reorderLevel: 500 },
  { name: 'Jun', stockLevel: 1450, reorderLevel: 500 },
  { name: 'Jul', stockLevel: 1500, reorderLevel: 500 },
];

// Weekly mock data
const weeklyData = [
  { name: 'Mon', stockLevel: 1500, reorderLevel: 500 },
  { name: 'Tue', stockLevel: 1525, reorderLevel: 500 },
  { name: 'Wed', stockLevel: 1480, reorderLevel: 500 },
  { name: 'Thu', stockLevel: 1510, reorderLevel: 500 },
  { name: 'Fri', stockLevel: 1540, reorderLevel: 500 },
  { name: 'Sat', stockLevel: 1530, reorderLevel: 500 },
  { name: 'Sun', stockLevel: 1520, reorderLevel: 500 },
];

// Yearly mock data
const yearlyData = [
  { name: '2020', stockLevel: 1000, reorderLevel: 500 },
  { name: '2021', stockLevel: 1100, reorderLevel: 500 },
  { name: '2022', stockLevel: 1300, reorderLevel: 500 },
  { name: '2023', stockLevel: 1400, reorderLevel: 500 },
  { name: '2024', stockLevel: 1500, reorderLevel: 500 },
];

type TimeFrame = 'weekly' | 'monthly' | 'yearly';

export default function InventoryTrendChart() {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('weekly');
  
  // In a real app, fetch data based on timeFrame
  const { data, isLoading } = useQuery({
    queryKey: ['inventoryTrend', timeFrame],
    queryFn: async () => {
      // This would be a real API call
      return new Promise((resolve) => {
        setTimeout(() => {
          if (timeFrame === 'weekly') resolve(weeklyData);
          else if (timeFrame === 'monthly') resolve(monthlyData);
          else resolve(yearlyData);
        }, 500);
      });
    },
  });
  
  const chartData = data || [];
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between mb-2">
          <CardTitle>Inventory Trend</CardTitle>
          <div className="flex space-x-2">
            <Button
              variant={timeFrame === 'weekly' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setTimeFrame('weekly')}
            >
              Weekly
            </Button>
            <Button
              variant={timeFrame === 'monthly' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setTimeFrame('monthly')}
            >
              Monthly
            </Button>
            <Button
              variant={timeFrame === 'yearly' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setTimeFrame('yearly')}
            >
              Yearly
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[250px] w-full p-4">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
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
                  dataKey="stockLevel"
                  name="Stock Level"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                  dot={{ r: 4 }}
                  isAnimationActive={true}
                  animationDuration={1000}
                />
                <Line
                  type="monotone"
                  dataKey="reorderLevel"
                  name="Reorder Level"
                  stroke="hsl(var(--warning-500, 35 91.2% 53.9%))"
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
