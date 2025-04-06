import { useQuery } from "@tanstack/react-query";
import KpiCard from "@/components/dashboard/kpi-card";
import InventoryTrendChart from "@/components/dashboard/inventory-trend-chart";
import RecentActivity from "@/components/dashboard/recent-activity";
import QuickActions from "@/components/dashboard/quick-actions";
import LowStockAlert from "@/components/dashboard/low-stock-alert";
import ForecastWidget from "@/components/dashboard/forecast-widget";
import { formatNumber, formatCurrency } from "@/lib/utils";
import InventoryTable from "@/components/inventory/inventory-table";
import { 
  Package2, 
  AlertTriangle, 
  ShoppingBasket, 
  LineChart, 
  Filter,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
// Restored context import after fixing context provider
import { useAppContext } from "@/context/app-context";

export default function Dashboard() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['/api/dashboard'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard');
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      return response.json();
    },
  });
  
  // Access app context for notifications
  const { newActivity, lowStockAlert, clearNotification, isConnected } = useAppContext();
  
  // Clear any notifications when dashboard mounts
  useEffect(() => {
    clearNotification();
    console.log("Dashboard mounted, WebSocket connected:", isConnected);
  }, [clearNotification, isConnected]);

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          An overview of your inventory status and performance metrics.
        </p>
      </div>
      
      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <KpiCard
          title="Total Inventory"
          value={isLoading ? "Loading..." : `${formatNumber(dashboardData?.totalItems)} items`}
          icon={Package2}
          iconBackground="bg-primary-50"
          iconColor="text-primary-600"
          linkText="View all"
          linkHref="/inventory"
        />
        <KpiCard
          title="Low Stock Alerts"
          value={isLoading ? "Loading..." : `${dashboardData?.lowStockCount} items`}
          icon={AlertTriangle}
          iconBackground="bg-warning-50"
          iconColor="text-warning-600"
          valueColor="text-warning-600"
          linkText="View alerts"
          linkHref="/inventory?filter=low-stock"
        />
        <KpiCard
          title="Orders Pending"
          value={isLoading ? "Loading..." : `${dashboardData?.pendingOrdersCount} orders`}
          icon={ShoppingBasket}
          iconBackground="bg-success-50"
          iconColor="text-success-600"
          linkText="Process orders"
          linkHref="/orders"
        />
        <KpiCard
          title="Monthly Revenue"
          value={isLoading ? "Loading..." : formatCurrency(dashboardData?.monthlyRevenue * 100)}
          icon={LineChart}
          iconBackground="bg-primary-50"
          iconColor="text-primary-600"
          linkText="View report"
          linkHref="/analytics"
        />
      </div>
      
      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Charts and Activity Section */}
        <div className="lg:col-span-2 space-y-6">
          <InventoryTrendChart />
          <RecentActivity />
        </div>
        
        {/* Sidebar Widgets */}
        <div className="space-y-6">
          <QuickActions />
          <LowStockAlert />
          <ForecastWidget />
        </div>
      </div>
      
      {/* Inventory Quick View */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900">Inventory Quick View</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button size="sm" asChild>
              <a href="/inventory/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </a>
            </Button>
          </div>
        </div>
        
        <InventoryTable />
      </div>
    </div>
  );
}
