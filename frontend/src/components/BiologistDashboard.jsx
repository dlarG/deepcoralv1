import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TopNavigation from "./biologist/components/TopNavigation";
import Sidebar from "./biologist/components/Sidebar";
import Dashboard from "./biologist/components/Dashboard";
import UserManagement from "./biologist/components/UserManagement";
// import ImageAnalysis from "./biologist/components/ImageAnalysis";
// import CoralDatabase from "./biologist/components/CoralDatabase";
// import Reports from "./biologist/components/Reports";
// import ResearchTools from "./biologist/components/ResearchTools";
// import ProfileManagement from "./biologist/components/ProfileManagement";
import { getBiologistStyle } from "./biologist/styles/biologistStyle";

function BiologistDashboard() {
  const { user, checkAuthStatus, logout, authLoading } = useAuth();
  const navigate = useNavigate();
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

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return <Dashboard user={user} darkMode={darkMode} />;
      case "User":
        return <UserManagement />;
      //   case "Image Analysis":
      //     return <ImageAnalysis user={user} darkMode={darkMode} />;
      //   case "Coral Database":
      //     return <CoralDatabase user={user} darkMode={darkMode} />;
      //   case "Reports":
      //     return <Reports user={user} darkMode={darkMode} />;
      //   case "Research Tools":
      //     return <ResearchTools user={user} darkMode={darkMode} />;
      //   case "Profile":
      //     return <ProfileManagement user={user} darkMode={darkMode} />;
      default:
        return <Dashboard user={user} darkMode={darkMode} />;
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
