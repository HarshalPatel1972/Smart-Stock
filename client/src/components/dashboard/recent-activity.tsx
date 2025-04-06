import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Activity } from "@shared/schema";
import { formatRelativeTime } from "@/lib/utils";
import { 
  Inbox, 
  AlertTriangle, 
  ShoppingCart, 
  UserCog,
  PlusCircle 
} from "lucide-react";

export default function RecentActivity() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['/api/activities'],
    queryFn: async () => {
      const response = await fetch('/api/activities?limit=5');
      if (!response.ok) throw new Error('Failed to fetch activities');
      return response.json() as Promise<Activity[]>;
    },
  });

  // Get icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'RESTOCK':
        return <Inbox className="text-primary-600" />;
      case 'LOW_STOCK':
        return <AlertTriangle className="text-warning-600" />;
      case 'ORDER':
      case 'ORDER_STATUS':
        return <ShoppingCart className="text-success-600" />;
      case 'SUPPLIER':
        return <UserCog className="text-primary-600" />;
      default:
        return <PlusCircle className="text-primary-600" />;
    }
  };

  // Get title based on activity type
  const getActivityTitle = (type: string) => {
    switch (type) {
      case 'RESTOCK':
        return 'Product Restocked';
      case 'LOW_STOCK':
        return 'Low Stock Alert';
      case 'ORDER':
        return 'New Order Placed';
      case 'ORDER_STATUS':
        return 'Order Status Updated';
      case 'SUPPLIER':
        return 'Supplier Updated';
      case 'CREATE':
        return 'Product Created';
      default:
        return 'Activity';
    }
  };

  // Get background color based on activity type
  const getIconBackground = (type: string) => {
    switch (type) {
      case 'LOW_STOCK':
        return 'bg-warning-50';
      case 'ORDER':
      case 'ORDER_STATUS':
        return 'bg-success-50';
      default:
        return 'bg-primary-50';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Recent Activity</CardTitle>
        <Badge variant="secondary">Live Updates</Badge>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flow-root">
          {isLoading ? (
            <div className="py-8 flex justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <ul className="-mb-8">
              {activities && activities.map((activity, index) => (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {index < activities.length - 1 && (
                      <span
                        className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      />
                    )}
                    <div className="relative flex items-start space-x-3">
                      <div className="relative">
                        <div className={`h-10 w-10 rounded-full ${getIconBackground(activity.type)} flex items-center justify-center ring-8 ring-white`}>
                          {getActivityIcon(activity.type)}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div>
                          <div className="text-sm">
                            <a href="#" className="font-medium text-gray-900">
                              {getActivityTitle(activity.type)}
                            </a>
                          </div>
                          <p className="mt-0.5 text-sm text-gray-500">
                            {activity.description}
                          </p>
                          <p className="mt-0.5 text-xs text-gray-400">
                            {formatRelativeTime(activity.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="mt-6 px-6 pb-6">
          <Button variant="outline" className="w-full">
            View all activity
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
