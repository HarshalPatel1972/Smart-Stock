import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ShoppingCart, FileText, Truck } from "lucide-react";
import { Link } from "wouter";

interface ActionItem {
  icon: React.ReactNode;
  title: string;
  href: string;
}

export default function QuickActions() {
  const actions: ActionItem[] = [
    {
      icon: <Plus className="text-xl text-primary-600 mb-2" size={24} />,
      title: "Add Product",
      href: "/inventory/new"
    },
    {
      icon: <ShoppingCart className="text-xl text-primary-600 mb-2" size={24} />,
      title: "New Order",
      href: "/orders/new"
    },
    {
      icon: <FileText className="text-xl text-primary-600 mb-2" size={24} />,
      title: "Generate Report",
      href: "/reports"
    },
    {
      icon: <Truck className="text-xl text-primary-600 mb-2" size={24} />,
      title: "Contact Supplier",
      href: "/suppliers"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <Link key={index} href={action.href}>
              <div className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-primary-50 hover:border-primary-200 transition duration-150 cursor-pointer">
                {action.icon}
                <span className="text-sm font-medium text-gray-900">{action.title}</span>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
