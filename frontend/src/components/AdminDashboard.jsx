import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./admin/components/Sidebar";
import TopNavigation from "./admin/components/TopNavigation";
import Dashboard from "./admin/components/Dashboard";
import UserManagement from "./admin/components/UserManagement";
import CoralManagement from "./admin/components/CoralManagement";
import ProfileManagement from "./admin/components/ProfileManagement";
import AddImage from "./admin/components/AddImage";
import GenerateReport from "./admin/components/GenerateReport";
import CoralDistributionTrend from "./admin/components/Distribution";
import Validate from "./admin/components/Validate";
import { getAdminStyles } from "./admin/styles/adminStyles";

function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading, logout, checkAuthStatus } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);

      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("adminDarkMode");
    if (savedDarkMode !== null) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("adminDarkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = getAdminStyles(sidebarOpen, darkMode); // Pass darkMode here
    document.head.appendChild(styleElement);

    return () => {
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, [sidebarOpen, darkMode]);

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
        return <ProfileManagement user={user} darkMode={darkMode} />;
      case "Manage Users":
        return (
          <UserManagement
            editUserId={location.state?.editUserId}
            darkMode={darkMode}
          />
        );
      case "Add Images":
        return <AddImage darkMode={darkMode} />;
      case "Generate Report":
        return <GenerateReport darkMode={darkMode} />;
      case "Manage Coral LifeForms":
        return <CoralManagement darkMode={darkMode} />;
      case "Coral Distribution":
        return <CoralDistributionTrend darkMode={darkMode} />;
      case "Validate":
        return <Validate darkMode={darkMode} />;
      case "Dashboard":
      default:
        return <Dashboard darkMode={darkMode} />;
    }
  };

  return (
    <div className={`admin-dashboard ${darkMode ? "dark-mode" : ""}`}>
      <TopNavigation
        user={user}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        handleLogout={handleLogout}
        setActiveTab={setActiveTab}
      />
      <div className="dashboard-container">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sidebarOpen={sidebarOpen}
          darkMode={darkMode}
        />

        <main className="main-content">{renderContent()}</main>
      </div>
    </div>
  );
}

export default AdminDashboard;
