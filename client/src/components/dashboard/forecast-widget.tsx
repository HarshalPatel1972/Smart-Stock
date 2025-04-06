import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";

interface ForecastData {
  percentChange: string;
  nextSevenDays: number[];
  topProducts: {
    name: string;
    expectedUnits: number;
  }[];
}

export default function ForecastWidget() {
  const { data: forecast, isLoading } = useQuery({
    queryKey: ['/api/forecast'],
    queryFn: async () => {
      const response = await fetch('/api/forecast');
      if (!response.ok) throw new Error('Failed to fetch forecast data');
      return response.json() as Promise<ForecastData>;
    },
  });

  const chartData = forecast ? [
    { name: 'Mon', value: forecast.nextSevenDays[0] },
    { name: 'Tue', value: forecast.nextSevenDays[1] },
    { name: 'Wed', value: forecast.nextSevenDays[2] },
    { name: 'Thu', value: forecast.nextSevenDays[3] },
    { name: 'Fri', value: forecast.nextSevenDays[4] },
    { name: 'Sat', value: forecast.nextSevenDays[5] },
    { name: 'Sun', value: forecast.nextSevenDays[6] },
  ] : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Demand Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-8 flex justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Next 7 Days</h3>
                <p className="text-sm text-gray-500">Expected sales volume</p>
              </div>
              <span className="text-lg font-semibold text-gray-800">
                {forecast?.percentChange}
              </span>
            </div>
            
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis 
                    dataKey="name" 
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Top Products (Expected)</h3>
              <ul className="space-y-3">
                {forecast?.topProducts.map((product, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{product.name}</span>
                    <span className="text-sm font-medium text-gray-900">{product.expectedUnits} units</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
