import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiLogOut,
  FiHome,
  FiImage,
  FiMap,
  FiFileText,
  FiMenu,
  FiX,
} from "react-icons/fi";

function GuestDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("Coral LifeForms");

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      navigate("/login");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Upload Image":
        return (
          <div className="content-section">
            <h2 className="content-title">Upload Coral Images</h2>
            <div className="content-placeholder">
              <p>Image upload interface will be implemented here.</p>
              <p>Guests will be able to upload coral images for analysis.</p>
            </div>
          </div>
        );
      case "View Map":
        return (
          <div className="content-section">
            <h2 className="content-title">Coral Distribution Map</h2>
            <div className="content-placeholder">
              <p>
                Interactive map of coral distributions will be displayed here.
              </p>
              <p>Guests can view coral locations and hotspots.</p>
            </div>
          </div>
        );
      case "View Results":
        return (
          <div className="content-section">
            <h2 className="content-title">Analysis Results</h2>
            <div className="content-placeholder">
              <p>Results from coral analysis will be shown here.</p>
              <p>Guests can view reports and findings.</p>
            </div>
          </div>
        );
      case "Coral LifeForms":
      default:
        return (
          <div className="content-section">
            <h2 className="content-title">Coral LifeForms Information</h2>
            <div className="content-placeholder">
              <p>
                Detailed information about different coral lifeforms will be
                displayed here.
              </p>
              <p>
                This will include species data, conservation status, and images.
              </p>
              <div className="sample-coral-info">
                <h3>Sample Coral Types:</h3>
                <ul>
                  <li>Acropora (Staghorn Coral)</li>
                  <li>Porites (Massive Coral)</li>
                  <li>Pocillopora (Cauliflower Coral)</li>
                  <li>Montipora (Plate Coral)</li>
                  <li>Fungia (Mushroom Coral)</li>
                </ul>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="guest-dashboard">
      {/* Top Navigation Bar */}
      <nav className="top-nav">
        <div className="nav-left">
          <button
            className="menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          <h1 className="nav-title">DeepCoral Guest Portal</h1>
        </div>
        <div className="user-info">
          {user ? (
            <>
              <span>Welcome, {user.firstname || user.username}</span>
              <button className="logout-button" onClick={handleLogout}>
                <FiLogOut className="logout-icon" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <span>Loading user data...</span>
          )}
        </div>
      </nav>

      <div className="dashboard-container">
        {/* Sidebar Navigation */}
        <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
          <nav className="sidebar-nav">
            <ul>
              <li
                className={activeTab === "Coral LifeForms" ? "active" : ""}
                onClick={() => setActiveTab("Coral LifeForms")}
              >
                <FiHome className="nav-icon" />
                {sidebarOpen && <span>Coral LifeForms</span>}
              </li>
              <li
                className={activeTab === "Upload Image" ? "active" : ""}
                onClick={() => setActiveTab("Upload Image")}
              >
                <FiImage className="nav-icon" />
                {sidebarOpen && <span>Upload Image</span>}
              </li>
              <li
                className={activeTab === "View Map" ? "active" : ""}
                onClick={() => setActiveTab("View Map")}
              >
                <FiMap className="nav-icon" />
                {sidebarOpen && <span>View Map</span>}
              </li>
              <li
                className={activeTab === "View Results" ? "active" : ""}
                onClick={() => setActiveTab("View Results")}
              >
                <FiFileText className="nav-icon" />
                {sidebarOpen && <span>View Results</span>}
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="main-content">{renderContent()}</main>
      </div>

      {/* CSS Styles */}
      <style jsx>{`
        .guest-dashboard {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f5f7fa;
        }

        .top-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background-color: #2c3e50;
          color: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .nav-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .menu-toggle {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          font-size: 1.5rem;
        }

        .nav-title {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 500;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .logout-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background-color: #e74c3c;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .logout-button:hover {
          background-color: #c0392b;
        }

        .dashboard-container {
          display: flex;
          flex: 1;
          overflow: hidden;
        }

        .sidebar {
          width: ${sidebarOpen ? "250px" : "60px"};
          background-color: #34495e;
          color: white;
          transition: width 0.3s ease;
          overflow: hidden;
        }

        .sidebar-nav ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .sidebar-nav li {
          padding: 1rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .sidebar-nav li:hover {
          background-color: #3d566e;
        }

        .sidebar-nav li.active {
          background-color: #2980b9;
        }

        .nav-icon {
          font-size: 1.2rem;
          min-width: 24px;
        }

        .main-content {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
          background-color: white;
        }

        .content-section {
          max-width: 1200px;
          margin: 0 auto;
        }

        .content-title {
          color: #2c3e50;
          margin-bottom: 1.5rem;
          font-size: 1.8rem;
        }

        .content-placeholder {
          background-color: #f8f9fa;
          border: 1px dashed #dee2e6;
          border-radius: 4px;
          padding: 2rem;
          text-align: center;
          color: #6c757d;
        }

        .sample-coral-info {
          margin-top: 2rem;
          text-align: left;
          padding: 1rem;
          background-color: #e9ecef;
          border-radius: 4px;
        }

        .sample-coral-info h3 {
          color: #2c3e50;
          margin-bottom: 1rem;
        }

        .sample-coral-info ul {
          padding-left: 1.5rem;
        }

        .sample-coral-info li {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
}

export default GuestDashboard;
