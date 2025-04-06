import { cn } from "@/lib/utils";
import { Menu, Search, Bell, User } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "wouter";

interface HeaderProps {
  sidebarOpen: boolean;
  onSidebarOpen: (open: boolean) => void;
}

export default function Header({ sidebarOpen, onSidebarOpen }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      {/* Mobile Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between md:hidden">
        <div className="flex items-center">
          <button
            onClick={() => onSidebarOpen(!sidebarOpen)}
            className="text-gray-500 focus:outline-none focus:text-primary"
          >
            <Menu size={24} />
          </button>
          <span className="ml-3 text-lg font-semibold text-gray-800">SmartStock</span>
        </div>
        
        <div className="flex items-center">
          <button className="p-1 rounded-full text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary">
            <Bell size={20} />
          </button>
          <div className="ml-3 relative">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-700">
              JD
            </div>
          </div>
        </div>
      </div>
      
      {/* Desktop Header */}
      <div className="hidden md:flex md:justify-between md:items-center md:h-16 bg-white border-b border-gray-200 px-4 sm:px-6">
        <div className="flex-1 flex">
          <div className="max-w-xs w-full">
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                className="pl-10 pr-3"
                placeholder="Search inventory, orders..."
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="ml-4 flex items-center md:ml-6">
          {/* Notifications */}
          <button className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary">
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5" />
          </button>
          
          {/* Profile dropdown */}
          <div className="ml-3 relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-primary">
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-700">
                    JD
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <Link href="/settings/profile" className="w-full">
                    Your Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/settings" className="w-full">
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </>
  );
}
