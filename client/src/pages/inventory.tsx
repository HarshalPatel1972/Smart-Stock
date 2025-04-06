import { useQuery } from "@tanstack/react-query";
import InventoryTable from "@/components/inventory/inventory-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Inventory() {
  const [location] = useLocation();
  
  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Inventory Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your product inventory, stock levels, and categories.
          </p>
        </div>
        <Button asChild>
          <Link href="/inventory/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>
      
      {/* Inventory Table */}
      <InventoryTable />
    </div>
  );
}
