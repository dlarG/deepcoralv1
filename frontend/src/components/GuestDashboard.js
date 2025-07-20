import React, { useState, useEffect } from "react";
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
  const { authAxios, user } = useAuth(); // Use the provided authAxios
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("Coral LifeForms");
  const [coralData, setCoralData] = useState([]);

  useEffect(() => {
    if (activeTab === "Coral LifeForms") {
      authAxios
        .get("/coral_info")
        .then((response) => {
          console.log("Coral data:", response.data);
          setCoralData(response.data.data || []);
        })
        .catch((err) => {
          console.error("Failed to fetch coral data:", err);
          // Handle 401 by redirecting to login
          if (err.response?.status === 401) {
            navigate("/login");
          }
        });
    }
  }, [activeTab, authAxios, navigate]);

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
                          src="/acropora-staghorn-coral.jpg"
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
          background: rgba(0, 96, 100, 0.9);
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
          margin-left: -15px;
        }

        .nav-title {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 500;
        }
        .coral-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 2rem;
          padding: 1.5rem 0;
        }

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

        .coral-name {
          font-size: 1.5rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 1rem;
        }

        .info-cards-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
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

        .description-label {
          font-size: 0.9rem;
          color: rgba(0, 96, 100, 0.9);
          margin-bottom: 0.8rem;
          font-weight: 500;
        }

        .description-text {
          color: #555;
          line-height: 1.6;
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
          background: rgba(0, 96, 100, 0.9);
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
          background: rgba(0, 96, 100, 0.9);
        }

        .sidebar-nav li.active {
          background: rgba(0, 96, 100, 0.9);
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
