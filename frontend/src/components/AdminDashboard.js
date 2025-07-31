// src/components/AdminDashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./admin/components/Sidebar";
import TopNavigation from "./admin/components/TopNavigation";
import Dashboard from "./admin/components/Dashboard";
import UserManagement from "./admin/components/UserManagement";
import CoralManagement from "./admin/components/CoralManagement";
import ProfileManagement from "./admin/components/ProfileManagement";
import { getAdminStyles } from "./admin/styles/adminStyles";

function AdminDashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading, logout, checkAuthStatus } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("Dashboard");

  // Inject dynamic styles
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = getAdminStyles(sidebarOpen);
    document.head.appendChild(styleElement);

    return () => {
      // Clean up the style element when component unmounts
      document.head.removeChild(styleElement);
    };
  }, [sidebarOpen]); // Re-run when sidebarOpen changes

  // Verify authentication status
  useEffect(() => {
    document.title = "Admin Dashboard | DeepCoral";
    const verifyAuth = async () => {
      await checkAuthStatus();
      if (!user || user.roletype.toLowerCase() !== "admin") {
        navigate("/login");
      }
    };
    verifyAuth();
  }, [user, checkAuthStatus, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
      window.location.href = "/";
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!user || user.roletype.toLowerCase() !== "admin") {
    return null;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "Profile Management":
        return <ProfileManagement user={user} />;
      case "Manage Users":
        return <UserManagement />;
      case "Manage Coral LifeForms":
        return <CoralManagement />;
      case "Dashboard":
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="admin-dashboard">
      <TopNavigation
        user={user}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        handleLogout={handleLogout}
      />

      <div className="dashboard-container">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sidebarOpen={sidebarOpen}
        />

        <main className="main-content">{renderContent()}</main>
      </div>
    </div>
  );
}

export default AdminDashboard;
