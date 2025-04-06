import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Store,
  ShoppingCart,
  LineChart,
  Truck,
  Settings,
  X
} from "lucide-react";

interface SidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function Sidebar({ open, onOpenChange }: SidebarProps) {
  const [location] = useLocation();
  
  const links = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/inventory", label: "Inventory", icon: Store },
    { href: "/orders", label: "Orders", icon: ShoppingCart },
    { href: "/analytics", label: "Analytics", icon: LineChart },
    { href: "/suppliers", label: "Suppliers", icon: Truck },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => onOpenChange(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 pt-5 pb-4 flex flex-col transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex-shrink-0 px-4 flex items-center">
          <span className="text-xl font-bold text-primary">SmartStock</span>
          <button
            onClick={() => onOpenChange(false)}
            className="md:hidden ml-auto text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Navigation Links */}
        <div className="mt-5 flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-2 space-y-1">
            {links.map((link) => {
              const isActive = location === link.href;
              const Icon = link.icon;
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                    isActive
                      ? "text-white bg-primary"
                      : "text-gray-700 hover:text-primary hover:bg-primary-50"
                  )}
                >
                  <Icon
                    className={cn(
                      "mr-3 text-xl",
                      isActive
                        ? "text-white"
                        : "text-gray-500 group-hover:text-primary"
                    )}
                    size={20}
                  />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        
        {/* User Profile */}
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex-shrink-0 group block">
            <div className="flex items-center">
              <div>
                <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-700">
                  JD
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">John Doe</p>
                <p className="text-xs font-medium text-gray-500">Inventory Manager</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
