import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Building2, MapPin, Phone, Mail, ExternalLink, Calendar } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";

// Mock suppliers data (would come from API in a real app)
const suppliers = [
  {
    id: 1,
    name: "TechSupplyCo",
    contactPerson: "John Smith",
    email: "john@techsupplyco.com",
    phone: "555-123-4567",
    location: "New York, NY",
    categories: ["Electronics", "Audio"],
    lastOrder: "Jul 15, 2023",
    leadTime: "3-5 days"
  },
  {
    id: 2,
    name: "GlobalWearables",
    contactPerson: "Sara Johnson",
    email: "sara@globalwearables.com",
    phone: "555-234-5678",
    location: "San Francisco, CA",
    categories: ["Wearables"],
    lastOrder: "Aug 10, 2023",
    leadTime: "7-10 days"
  },
  {
    id: 3,
    name: "AccessoriesDirect",
    contactPerson: "Michael Chen",
    email: "michael@accessoriesdirect.com",
    phone: "555-345-6789",
    location: "Chicago, IL",
    categories: ["Accessories"],
    lastOrder: "Sep 5, 2023",
    leadTime: "2-3 days"
  }
];

export default function Suppliers() {
  const columns = [
    {
      header: "Supplier",
      accessor: "name",
    },
    {
      header: "Contact Person",
      accessor: "contactPerson",
    },
    {
      header: "Categories",
      accessor: (supplier: any) => supplier.categories.join(", "),
    },
    {
      header: "Lead Time",
      accessor: "leadTime",
    },
    {
      header: "Last Order",
      accessor: "lastOrder",
    },
    {
      header: "Actions",
      accessor: (supplier: any) => (
        <Button variant="ghost" size="sm" asChild>
          <a href={`/suppliers/${supplier.id}`}>View</a>
        </Button>
      ),
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Suppliers</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your supplier relationships and inventory sources.
          </p>
        </div>
        <Button asChild>
          <a href="/suppliers/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Supplier
          </a>
        </Button>
      </div>
      
      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {suppliers.map((supplier) => (
          <Card key={supplier.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2 text-primary" />
                {supplier.name}
              </CardTitle>
              <CardDescription>{supplier.categories.join(", ")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
                  <span className="text-sm">{supplier.location}</span>
                </div>
                <div className="flex items-start">
                  <Phone className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
                  <span className="text-sm">{supplier.phone}</span>
                </div>
                <div className="flex items-start">
                  <Mail className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
                  <span className="text-sm">{supplier.email}</span>
                </div>
                <div className="flex items-start">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
                  <span className="text-sm">Lead time: {supplier.leadTime}</span>
                </div>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <a href={`/suppliers/${supplier.id}`}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Details
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Suppliers Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Suppliers</CardTitle>
          <CardDescription>A complete list of your suppliers and their details</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={suppliers}
            keyAccessor="id"
            pagination={{
              pageIndex: 0,
              pageSize: 10,
              pageCount: Math.ceil(suppliers.length / 10),
              onPageChange: () => {},
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
