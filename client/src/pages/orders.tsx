import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Order } from "@shared/schema";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import { Plus } from "lucide-react";
import StatusBadge from "@/components/ui/status-badge";

export default function Orders() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['/api/orders'],
    queryFn: async () => {
      const response = await fetch('/api/orders');
      if (!response.ok) throw new Error('Failed to fetch orders');
      return response.json() as Promise<Order[]>;
    },
  });

  const columns = [
    {
      header: "Order Number",
      accessor: "orderNumber",
    },
    {
      header: "Date",
      accessor: (order: Order) => formatRelativeTime(order.timestamp),
    },
    {
      header: "Status",
      accessor: "status",
      cell: (order: Order) => (
        <StatusBadge status={order.status as any} />
      ),
    },
    {
      header: "Total",
      accessor: (order: Order) => formatCurrency(order.total),
    },
    {
      header: "Actions",
      accessor: (order: Order) => (
        <Button variant="ghost" size="sm" asChild>
          <a href={`/orders/${order.id}`}>View</a>
        </Button>
      ),
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage incoming and outgoing orders.
          </p>
        </div>
        <Button asChild>
          <a href="/orders/new">
            <Plus className="h-4 w-4 mr-2" />
            New Order
          </a>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>Manage your customer and supplier orders</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={orders || []}
            isLoading={isLoading}
            keyAccessor="id"
            emptyMessage="No orders found"
            pagination={{
              pageIndex: 0,
              pageSize: 10,
              pageCount: Math.ceil((orders?.length || 0) / 10),
              onPageChange: () => {},
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
