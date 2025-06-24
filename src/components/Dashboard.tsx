import React, { useState } from "react";
import { Sidebar } from "./layout/Sidebar";
import { Header } from "./layout/Header";
import { DashboardOverview } from "./dashboard/DashboardOverview";
import { CustomerList } from "./customers/CustomerList";
import { MachineryList } from "./machinery/MachineryList";
// import { CustomerDocument } from './customers/CustomerDocument';
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, useNavigate, Outlet } from "react-router-dom";

export const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Extract active section from URL
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const activeSection = pathSegments[0] || "dashboard";
  const isDetailView = pathSegments.length > 1; // Check if we're viewing a detail page

  const renderContent = () => {
    // Handle nested routes (like customer document view)
    if (isDetailView) {
      return <Outlet />;
    }

    switch (activeSection) {
      case "dashboard":
        return <DashboardOverview />;
      case "customers":
        return user?.role === "admin" ? (
          <CustomerList />
        ) : (
          <DashboardOverview />
        );
      case "machinery":
        return <MachineryList />;
      case "analytics":
        return <DashboardOverview />;
      case "settings":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <p className="text-gray-600">Settings panel coming soon...</p>
          </div>
        );
      case "profile":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Profile</h2>
            <p className="text-gray-600">Profile management coming soon...</p>
          </div>
        );
      default:
        return <DashboardOverview />;
    }
  };

  const getSectionTitle = () => {
    // Custom title for detail views
    if (
      location.pathname.includes("/customers/") &&
      location.pathname.includes("/document")
    ) {
      return "Customer Document";
    }

    switch (activeSection) {
      case "dashboard":
        return "Dashboard";
      case "customers":
        return "Customers";
      case "machinery":
        return user?.role === "admin" ? "Machinery" : "My Machinery";
      case "analytics":
        return "Analytics";
      case "settings":
        return "Settings";
      case "profile":
        return "Profile";
      default:
        return "Dashboard";
    }
  };

  const handleSectionChange = (section: string) => {
    // Navigate to the base path when changing sections
    navigate(`/${section}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        isCollapsed={sidebarCollapsed}
      />

      <div className="flex-1 flex flex-col">
        <Header
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          title={getSectionTitle()}
        />

        <main className="flex-1 p-6 overflow-auto">{renderContent()}</main>
      </div>
    </div>
  );
};
