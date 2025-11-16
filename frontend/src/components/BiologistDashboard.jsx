import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TopNavigation from "./biologist/components/TopNavigation";
import Sidebar from "./biologist/components/Sidebar";
import Dashboard from "./biologist/components/Dashboard";
import UserManagement from "./biologist/components/UserManagement";
import ProfileManagement from "./biologist/components/ProfileManagement";
import ImageUpload from "./biologist/components/ImageUpload";
import CoralDatabase from "./biologist/components/CoralDatabase";
// import Reports from "./biologist/components/Reports";
// import ResearchTools from "./biologist/components/ResearchTools";
// import ProfileManagement from "./biologist/components/ProfileManagement";
import { getBiologistStyle } from "./biologist/styles/biologistStyle";
import CoralDistribution from "../components/biologist/components/CoralDistribution";

function BiologistDashboard() {
  const { user, checkAuthStatus, logout, authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Verify authentication status
  useEffect(() => {
    document.title = "Biologist Dashboard | DeepCoral";
    const verifyAuth = async () => {
      await checkAuthStatus();
      if (!user || user.roletype.toLowerCase() !== "biologist") {
        navigate("/login");
      }
    };
    verifyAuth();
  }, [user, checkAuthStatus, navigate]);

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

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
      <div className="biologist-loading">
        <div className="loading-spinner-bio"></div>
        <p>Loading Biologist Dashboard...</p>
      </div>
    );
  }
  const handleNavigate = (tabName) => {
    setActiveTab(tabName);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return (
          <Dashboard
            user={user}
            darkMode={darkMode}
            onNavigate={handleNavigate}
          />
        );
      case "User":
        return <UserManagement />;
      case "Coral Distribution":
        return <CoralDistribution />;
      case "Image Analysis":
        return <ImageUpload user={user} darkMode={darkMode} />;
      case "Coral Database":
        return <CoralDatabase user={user} darkMode={darkMode} />;
      case "Profile":
        return <ProfileManagement user={user} darkMode={darkMode} />;
      default:
        return (
          <Dashboard
            user={user}
            darkMode={darkMode}
            onNavigate={handleNavigate}
          />
        );
    }
  };

  return (
    <>
      <style>{getBiologistStyle(sidebarOpen, darkMode)}</style>
      <div className={`biologist-dashboard ${darkMode ? "dark-mode" : ""}`}>
        <TopNavigation
          user={user}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          handleLogout={handleLogout}
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
    </>
  );
}

export default BiologistDashboard;
