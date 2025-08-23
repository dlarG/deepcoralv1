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

<<<<<<< HEAD
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
=======
  // Add responsive sidebar handling
  useEffect(() => {
    const handleResize = () => {
      // Auto-minimize sidebar when screen width is less than 1024px
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Set initial state based on current window size
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
>>>>>>> 092f5d18f330fc40dac4dc2a3e24d8ba5e71cdcd

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
<<<<<<< HEAD
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

=======
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      navigate("/login");
    }
  };

>>>>>>> 092f5d18f330fc40dac4dc2a3e24d8ba5e71cdcd
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
<<<<<<< HEAD
        return <CoralLifeForms />;
=======
        return (
          <div className="content-section">
            <h2
              className="content-title"
              style={{
                fontSize: "1.8rem",
                fontWeight: "600",
                color: "#333",
                marginBottom: "2rem",
                paddingBottom: "1rem",
                borderBottom: "2px solid rgba(0, 96, 100, 0.1)",
              }}
            >
              Coral LifeForms
            </h2>

            <div className="content-placeholder">
              {coralData.length === 0 ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "300px",
                  }}
                >
                  <p
                    style={{
                      color: "#666",
                      fontSize: "1.2rem",
                    }}
                  >
                    Loading coral data...
                  </p>
                </div>
              ) : (
                <div className="coral-grid">
                  {coralData.map((coral) => (
                    <div key={coral.id} className="coral-card">
                      <div className="coral-image-container">
                        <img
                          src="/acropora_branching/acropora-staghorn-coral.jpg"
                          alt={coral.common_name}
                          className="coral-image"
                        />
                        <span className="coral-badge">{coral.coral_type}</span>
                      </div>

                      <div className="coral-content">
                        <h3 className="coral-name">{coral.common_name}</h3>

                        {/* Centered scientific name */}
                        <div
                          className="coral-scientific-name"
                          style={{
                            textAlign: "center",
                            fontStyle: "italic",
                            color: "#006064",
                            fontSize: "1.1rem",
                            marginBottom: "1rem",
                          }}
                        >
                          {coral.scientific_name}
                        </div>

                        <div className="info-cards-container">
                          <div className="info-card">
                            <div className="info-label">Subtype</div>
                            <div className="info-value">
                              {coral.coral_subtype}
                            </div>
                          </div>
                          <div className="info-card">
                            <div className="info-label">Classification</div>
                            <div className="info-value">
                              {coral.classification}
                            </div>
                          </div>
                        </div>

                        <div className="description-section">
                          <p className="description-text">
                            {coral.identification}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
>>>>>>> 092f5d18f330fc40dac4dc2a3e24d8ba5e71cdcd
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
<<<<<<< HEAD
=======

      {/* CSS Styles */}
      <style jsx>{`
        .guest-dashboard {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
          background-color: #f8fafc;
        }

        /* Modern Top Navigation */
        .top-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          background: white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          border-bottom: 1px solid #e2e8f0;
        }

        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 1rem;
          height: 70px;
          max-width: 100%;
          min-width: 0;
        }

        .nav-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          min-width: 0;
          flex-shrink: 0;
        }

        .menu-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          min-width: 40px;
          border-radius: 8px;
          background: transparent;
          border: none;
          color: #334155;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .menu-toggle:hover {
          background: #f1f5f9;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          min-width: 0;
          overflow: hidden;
        }

        .logo-icon {
          font-size: 1.75rem;
        }

        .nav-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #0f172a;
          margin: 0;
        }

        .portal-tag {
          font-size: 0.75rem;
          background: rgb(202, 204, 206);
          color: rgb(35, 35, 35);
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-weight: 500;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .user-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          min-width: 0;
          flex-shrink: 1;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          min-width: 0;
          overflow: hidden;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          min-width: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 500;
          flex-shrink: 0;
        }

        .user-details {
          display: flex;
          flex-direction: column;
          min-width: 0;
          overflow: hidden;
        }

        .welcome-text {
          font-size: 0.75rem;
          color: #64748b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .username {
          font-size: 0.875rem;
          font-weight: 500;
          color: #0f172a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .logout-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          color: #64748b;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .logout-button:hover {
          background: #f1f5f9;
          color: #475569;
        }

        /* Modern Sidebar */
        .dashboard-container {
          display: flex;
          flex: 1;
          height: calc(100vh - 70px); /* Fixed height based on viewport minus navbar */
        }

        .sidebar {
          width: ${sidebarOpen ? "280px" : "80px"};
          background: white;
          border-right: 1px solid #e2e8f0;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          height: calc(100vh - 70px); /* Full viewport height minus navbar */
          position: fixed; /* Fixed position */
          top: 70px; /* Start below navbar */
          left: 0;
          z-index: 30;
          display: flex;
          flex-direction: column;
          overflow-y: auto; /* Allow sidebar to scroll if content overflows */
          flex-shrink: 0;
        }

        .sidebar-header {
          padding: 1.5rem 1.5rem 1rem;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .sidebar-title {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748b;
          font-weight: 600;
          margin: 0;
          opacity: ${sidebarOpen ? "1" : "0"};
          transition: opacity 0.2s;
          white-space: nowrap;
        }

        .sidebar-nav {
          flex: 1;
          padding: 0.75rem;
        }

        .sidebar-nav ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .sidebar-nav li {
          position: relative;
          margin-bottom: 0.25rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .sidebar-nav li:hover {
          background: #f8fafc;
        }

        .sidebar-nav li.active {
          background: #f0f9ff;
        }

        .sidebar-nav li.active .nav-text {
          color: #0369a1;
          font-weight: 500;
        }

        .sidebar-nav li.active .nav-icon {
          color: #0284c7;
        }

        /* Coral Grid - Responsive to sidebar state */
        .coral-grid {
          display: grid;
          gap: 2rem;
          padding: 1.5rem 0;
          transition: all 0.3s ease;
        }

        .coral-grid.sidebar-collapsed {
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        }

        .coral-grid:not(.sidebar-collapsed) {
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
        }

        /* Coral Card */
        .coral-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
        }

        .coral-image-container {
          position: relative;
          height: 200px;
        }

        .coral-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .coral-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(0, 96, 100, 0.9);
          color: white;
          padding: 0.4rem 1rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .coral-content {
          padding: 1.8rem;
        }
<<<<<<< HEAD

=======
        .coral-content-container {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
        }
>>>>>>> 95abbae484b67dfbdd25073935f33b5cf1eae325
        .coral-name {
          font-size: 1.5rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 1rem;
          text-align: center;
        }

        .coral-scientific-name {
          text-align: center;
          font-style: italic;
          color: #006064;
          font-size: 1.1rem;
          margin-bottom: 1rem;
        }

        /* Info Cards - Responsive to sidebar state */
        .info-cards-container {
          display: grid;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .coral-grid.sidebar-collapsed .info-cards-container {
          grid-template-columns: 1fr;
        }

        .coral-grid:not(.sidebar-collapsed) .info-cards-container {
          grid-template-columns: repeat(2, 1fr);
        }

        .info-card {
          background: rgba(0, 96, 100, 0.05);
          border-left: 3px solid rgba(0, 96, 100, 0.9);
          padding: 1rem;
          border-radius: 4px;
        }

        .info-label {
          font-size: 0.8rem;
          color: rgba(0, 96, 100, 0.8);
          margin-bottom: 0.4rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 500;
        }

        .info-value {
          font-size: 1rem;
          color: #333;
          font-weight: 500;
        }

        .description-section {
          background: #f9f9f9;
          padding: 1.5rem;
          border-radius: 8px;
        }

        .description-text {
          color: #555;
          line-height: 1.6;
        }

        .nav-item-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          white-space: nowrap;
        }

        .nav-icon {
          font-size: 1.25rem;
          color: #64748b;
          min-width: 24px;
          display: flex;
          justify-content: center;
        }

        .nav-text {
          font-size: 0.9375rem;
          color: #334155;
          transition: opacity 0.3s;
          opacity: ${sidebarOpen ? "1" : "0"};
        }

        .active-indicator {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: #0284c7;
          border-radius: 0 3px 3px 0;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .sidebar-nav li.active .active-indicator {
          opacity: 1;
        }

        .sidebar-footer {
          padding: 1rem;
          border-top: 1px solid #f1f5f9;
        }

        .app-version {
          font-size: 0.6875rem;
          color: #94a3b8;
          opacity: ${sidebarOpen ? "1" : "0"};
          transition: opacity 0.2s;
          white-space: nowrap;
        }

        /* Main Content */
        .main-content {
          flex: 1;
          padding: 2rem;
          background: #f8fafc;
          overflow-y: auto; /* Enable vertical scrolling for content only */
          height: calc(100vh - 70px); /* Full viewport height minus navbar */
          margin-left: ${sidebarOpen ? "280px" : "80px"}; /* Push content right of sidebar */
          transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .content-section {
          max-width: 1400px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }

        .content-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 1.5rem;
        }

        .content-placeholder {
          color: #64748b;
          text-align: center;
          padding: 3rem 0;
        }

        @media (max-width: 1024px) {
          .coral-grid {
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          }

          .info-cards-container {
            grid-template-columns: 1fr !important;
          }

          .main-content {
            margin-left: ${sidebarOpen ? "280px" : "80px"};
          }
        }

        @media (max-width: 768px) {
          .content-section {
            padding: 1.5rem;
          }

          .coral-grid {
            grid-template-columns: 1fr;
          }

          .sidebar {
            width: ${sidebarOpen ? "280px" : "0px"}; /* Hide completely on mobile */
            transform: translateX(${sidebarOpen ? "0" : "-100%"});
            box-shadow: ${sidebarOpen ? "4px 0 15px rgba(0, 0, 0, 0.1)" : "none"};
          }

          .main-content {
            margin-left: 0; /* Full width on mobile */
            padding: 1rem;
          }

          .content-section {
            padding: 1.5rem;
          }
          /*NavBar*/
          .nav-container {
            padding: 0 0.75rem;
            gap: 0.5rem;
          }

          .nav-brand {
            gap: 0.5rem;
          }

          .logo-container {
            gap: 0.25rem;
          }

          .user-actions {
            gap: 0.75rem;
          }

          .user-profile {
            gap: 0.5rem;
          }

          .user-details {
            max-width: 120px;
          }
        }

        @media (max-width: 640px) {
          .nav-container {
            padding: 0 0.5rem;
          }

          .portal-tag {
            font-size: 0.6875rem;
            padding: 0.2rem 0.4rem;
          }

          .user-details {
            max-width: 100px;
          }

          .username {
            font-size: 0.8125rem;
          }

          .welcome-text {
            font-size: 0.6875rem;
          }
        }

        @media (max-width: 480px) {
          .nav-container {
            padding: 0 0.5rem;
          }

          .portal-tag,
          .welcome-text {
            display: none;
          }

          .user-avatar {
            width: 32px;
            height: 32px;
            min-width: 32px;
            font-size: 0.875rem;
          }

          .username {
            font-size: 0.8125rem;
            max-width: 80px;
          }

          .logout-button span {
            display: none;
          }

          .logout-button {
            padding: 0.5rem;
            border-radius: 50%;
            width: 36px;
            height: 36px;
            min-width: 36px;
            justify-content: center;
          }

          .user-actions {
            gap: 0.5rem;
          }

          .sidebar {
            width: ${sidebarOpen ? "280px" : "0px"};
            transform: translateX(${sidebarOpen ? "0" : "-100%"});
          }
        }
      `}</style>
>>>>>>> 092f5d18f330fc40dac4dc2a3e24d8ba5e71cdcd
    </div>
  );
}

export default GuestDashboard;
