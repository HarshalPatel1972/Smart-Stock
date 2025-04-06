import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { Link } from "wouter";
import { calculatePercentage } from "@/lib/utils";

export default function LowStockAlert() {
  const { data: lowStockItems, isLoading } = useQuery({
    queryKey: ['/api/products/low-stock'],
    queryFn: async () => {
      const response = await fetch('/api/products/low-stock');
      if (!response.ok) throw new Error('Failed to fetch low stock products');
      return response.json() as Promise<Product[]>;
    },
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Low Stock Alert</CardTitle>
        <Badge variant="destructive">
          Critical
        </Badge>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-8 flex justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {lowStockItems && lowStockItems.length > 0 ? (
              lowStockItems.map((item) => {
                const percentage = calculatePercentage(item.quantity, item.reorderLevel * 2);
                const isVeryLow = item.quantity <= item.reorderLevel / 2;
                
                return (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                        <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                      </div>
                      <Badge 
                        variant={isVeryLow ? "destructive" : "warning"}
                      >
                        {item.quantity} left
                      </Badge>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                          <div 
                            className={`h-2.5 rounded-full ${isVeryLow ? 'bg-destructive' : 'bg-warning-500'}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">{percentage}%</span>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/inventory/${item.id}`}>
                          Reorder
                        </Link>
                      </Button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">No low stock items</p>
              </div>
            )}
          </div>
        )}
        
        {lowStockItems && lowStockItems.length > 0 && (
          <div className="mt-4">
            <Link href="/inventory?filter=low-stock" className="text-sm font-medium text-primary-600 hover:text-primary-700">
              View all low stock items →
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
