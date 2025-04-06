import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import Dashboard from "@/pages/dashboard";
import Inventory from "@/pages/inventory";
import Orders from "@/pages/orders";
import Analytics from "@/pages/analytics";
import Suppliers from "@/pages/suppliers";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const [location] = useLocation();

  // Close sidebar on route change when on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location, isMobile]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header sidebarOpen={sidebarOpen} onSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/inventory" component={Inventory} />
            <Route path="/orders" component={Orders} />
            <Route path="/analytics" component={Analytics} />
            <Route path="/suppliers" component={Suppliers} />
            <Route path="/settings" component={Settings} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
