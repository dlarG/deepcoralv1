// src/components/GuestDashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./guest/components/Sidebar";
import TopNavigation from "./guest/components/TopNavigation";
import CoralLifeForms from "./guest/components/CoralLifeForms";
import UploadImage from "./guest/components/UploadImage";
import ViewMap from "./guest/components/ViewMap";
import ViewResults from "./guest/components/ViewResults";
import ProfileManagement from "./guest/components/ProfileManagement";
import { getGuestStyles } from "./guest/styles/GuestStyles";

function GuestDashboard() {
  const navigate = useNavigate();
  const { logout, user, loading: authLoading, checkAuthStatus } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("Coral LifeForms");

  // Inject dynamic styles
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = getGuestStyles(sidebarOpen);
    document.head.appendChild(styleElement);

    return () => {
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, [sidebarOpen]);

  // Verify authentication status
  useEffect(() => {
    document.title = "Guest Dashboard | DeepCoral";
    const verifyAuth = async () => {
      await checkAuthStatus();
      if (!user || user.roletype.toLowerCase() !== "guest") {
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

  if (!user || user.roletype.toLowerCase() !== "guest") {
    return null;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "Profile Management":
        return <ProfileManagement user={user} />;
      case "Upload Image":
        return <UploadImage />;
      case "View Map":
        return <ViewMap />;
      case "View Results":
        return <ViewResults />;
      case "Coral LifeForms":
      default:
        return <CoralLifeForms />;
    }
  };

  return (
    <div className="guest-dashboard">
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

export default GuestDashboard;
