import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarHeader, SidebarTrigger, SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { DashboardOverview } from "@/components/DashboardOverview";
import { ProductsManagement } from "@/components/ProductsManagement";
import { OrdersManagement } from "@/components/OrdersManagement";
import { StoreSetup } from "@/components/StoreSetup";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";

type AdminView = "dashboard" | "products" | "orders" | "setup";

const AdminDashboard = () => {
  const [currentView, setCurrentView] = useState<AdminView>("dashboard");
  const [adminData, setAdminData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for auth to load, then check if user exists
    if (!authLoading) {
      if (!user) {
        navigate("/admin", { replace: true });
        return;
      }
      fetchAdminData();
    }
  }, [user, authLoading, navigate]);

  const fetchAdminData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("admins")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // Admin record doesn't exist, needs setup
        setCurrentView("setup");
      } else if (error) {
        throw error;
      } else {
        setAdminData(data);
        if (!data.store_name) {
          setCurrentView("setup");
        }
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStoreSetupComplete = (storeData: any) => {
    setAdminData(storeData);
    setCurrentView("dashboard");
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin");
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-48 mx-auto"></div>
            <div className="h-4 bg-muted rounded w-32 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === "setup") {
    return <StoreSetup onComplete={handleStoreSetupComplete} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return <DashboardOverview adminData={adminData} />;
      case "products":
        return <ProductsManagement adminData={adminData} />;
      case "orders":
        return <OrdersManagement adminData={adminData} />;
      default:
        return <DashboardOverview adminData={adminData} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="py-16">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="marketplace-card p-6">
              <h2 className="text-xl font-semibold">Manage Products</h2>
              <p className="text-sm text-foreground-muted">
                Add, edit, or remove products from your store.
              </p>
            </div>
            <div className="marketplace-card p-6">
              <h2 className="text-xl font-semibold">View Orders</h2>
              <p className="text-sm text-foreground-muted">
                Track and manage customer orders.
              </p>
            </div>
            <div className="marketplace-card p-6">
              <h2 className="text-xl font-semibold">Analytics</h2>
              <p className="text-sm text-foreground-muted">
                View sales and performance metrics.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;