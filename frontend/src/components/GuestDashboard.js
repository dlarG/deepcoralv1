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
  FiUser,
  FiX,
} from "react-icons/fi";
import Logo from "./Logo"; // Import the Logo component

function GuestDashboard() {
  const navigate = useNavigate();
  const { authAxios, user } = useAuth(); // Use the provided authAxios
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("Coral LifeForms");
  const [coralData, setCoralData] = useState([]);

  const [selectedClassification, setSelectedClassification] = useState("all");
  const [selectedCoral, setSelectedCoral] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCorals = coralData.filter((coral) => {
    const matchesClassification =
      selectedClassification === "all" ||
      coral.classification.toLowerCase() ===
        selectedClassification.toLowerCase();
    const matchesSearch =
      coral.common_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coral.scientific_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesClassification && matchesSearch;
  });

  const groupedCorals = filteredCorals.reduce((acc, coral) => {
    const classification = coral.classification;
    if (!acc[classification]) {
      acc[classification] = [];
    }
    acc[classification].push(coral);
    return acc;
  }, {});

  useEffect(() => {
    document.title = "Guest Dashboard | DeepCoral";
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
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      navigate("/");
    }
  };

  const renderCoralDetails = (coral) => (
    <div className="coral-detail-modal">
      <div className="coral-detail-content">
        <div className="coral-detail-header">
          <button
            className="close-detail-btn"
            onClick={() => setSelectedCoral(null)}
          >
            <FiX size={24} />
          </button>
        </div>
        <div className="coral-detail-body">
          <div className="coral-detail-image">
            <img
              src={
                coral.image
                  ? `/uploaded_coral_information/${coral.image}`
                  : "/default-coral.jpg"
              }
              alt={coral.common_name}
              onError={(e) => {
                e.target.src = "/default-coral.jpg";
              }}
            />
            <span className="coral-detail-badge">{coral.coral_type}</span>
          </div>
          <div className="coral-detail-info">
            <h2 className="coral-detail-name">{coral.common_name}</h2>
            <p className="coral-detail-scientific">{coral.scientific_name}</p>

            <div className="coral-detail-grid">
              <div className="detail-item">
                <span className="detail-label">Classification:</span>
                <span className="detail-value">{coral.classification}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Subtype:</span>
                <span className="detail-value">{coral.coral_subtype}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Type:</span>
                <span className="detail-value">{coral.coral_type}</span>
              </div>
            </div>

            <div className="coral-description">
              <h3>Identification & Information</h3>
              <p>{coral.identification}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCoralLifeForms = () => (
    <div className="content-section">
      <div className="coral-header">
        <h2 className="content-title">Coral LifeForms Database</h2>

        {/* Filter Controls */}
        <div className="coral-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search corals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-buttons">
            <button
              className={`filter-btn ${
                selectedClassification === "all" ? "active" : ""
              }`}
              onClick={() => setSelectedClassification("all")}
            >
              All Corals
            </button>
            <button
              className={`filter-btn ${
                selectedClassification === "hard coral" ? "active" : ""
              }`}
              onClick={() => setSelectedClassification("hard coral")}
            >
              Hard Corals
            </button>
            <button
              className={`filter-btn ${
                selectedClassification === "soft coral" ? "active" : ""
              }`}
              onClick={() => setSelectedClassification("soft coral")}
            >
              Soft Corals
            </button>
          </div>
        </div>
      </div>

      {coralData.length === 0 ? (
        <div className="loading-placeholder">
          <p>Loading coral data...</p>
        </div>
      ) : (
        <div className="coral-sections">
          {Object.entries(groupedCorals).map(([classification, corals]) => (
            <div key={classification} className="classification-section">
              <h3 className="classification-title">
                {classification.charAt(0).toUpperCase() +
                  classification.slice(1)}
                <span className="coral-count">({corals.length})</span>
              </h3>

              <div className="coral-list">
                {corals.map((coral) => (
                  <div
                    key={coral.id}
                    className="coral-item"
                    onClick={() => setSelectedCoral(coral)}
                  >
                    <div className="coral-item-image">
                      <img
                        src={
                          coral.image
                            ? `/uploaded_coral_information/${coral.image}`
                            : "/default-coral.jpg"
                        }
                        alt={coral.common_name}
                        onError={(e) => {
                          e.target.src = "/default-coral.jpg";
                        }}
                      />
                    </div>
                    <div className="coral-item-info">
                      <h4 className="coral-item-name">{coral.common_name}</h4>
                      <p className="coral-item-scientific">
                        {coral.scientific_name}
                      </p>
                      <span className="coral-item-subtype">
                        {coral.coral_subtype}
                      </span>
                    </div>
                    <div className="coral-item-arrow">
                      <span>→</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {filteredCorals.length === 0 && (
            <div className="no-results">
              <p>No corals found matching your criteria.</p>
            </div>
          )}
        </div>
      )}

      {selectedCoral && renderCoralDetails(selectedCoral)}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "Profile Management":
        return (
          <div className="content-section">
            <h2 className="content-title">Profile Management</h2>
            <div className="content-placeholder">
              <p>Profile management features will be implemented here.</p>
              <p>Guests can update their profile information.</p>
            </div>
          </div>
        );
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
        return renderCoralLifeForms();
    }
  };

  return (
    <div className="guest-dashboard">
      {/* Top Navigation Bar - Modern Design */}
      <nav className="top-nav">
        <div className="nav-container">
          <div className="nav-brand">
            <button
              className="menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle menu"
            >
              {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
            <div className="logo-container">
              <Logo variant="navbar" type="image" theme="light" />
              <span className="portal-tag">Guest</span>
            </div>
          </div>

          <div className="user-actions">
            {user && (
              <div className="user-profile">
                <div className="user-avatar">
                  {user.firstname?.charAt(0) || user.username?.charAt(0)}
                </div>
                <div className="user-details">
                  <span className="welcome-text">Welcome back,</span>
                  <span className="username">
                    {user.firstname} {user.lastname}
                  </span>
                </div>
              </div>
            )}
            <button className="logout-button" onClick={handleLogout}>
              <FiLogOut className="logout-icon" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="dashboard-container">
        {/* Modern Sidebar Navigation */}
        <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
          <div className="sidebar-header">
            <h3 className="sidebar-title">Navigation</h3>
          </div>
          <nav className="sidebar-nav">
            <ul>
              <li
                className={activeTab === "Coral LifeForms" ? "active" : ""}
                onClick={() => setActiveTab("Coral LifeForms")}
              >
                <div className="nav-item-content">
                  <FiHome className="nav-icon" />
                  <span className="nav-text">Coral LifeForms</span>
                </div>
                <div className="active-indicator"></div>
              </li>
              <li
                className={activeTab === "Upload Image" ? "active" : ""}
                onClick={() => setActiveTab("Upload Image")}
              >
                <div className="nav-item-content">
                  <FiImage className="nav-icon" />
                  <span className="nav-text">Upload Image</span>
                </div>
                <div className="active-indicator"></div>
              </li>
              <li
                className={activeTab === "View Map" ? "active" : ""}
                onClick={() => setActiveTab("View Map")}
              >
                <div className="nav-item-content">
                  <FiMap className="nav-icon" />
                  <span className="nav-text">View Map</span>
                </div>
                <div className="active-indicator"></div>
              </li>
              <li
                className={activeTab === "View Results" ? "active" : ""}
                onClick={() => setActiveTab("View Results")}
              >
                <div className="nav-item-content">
                  <FiFileText className="nav-icon" />
                  <span className="nav-text">View Results</span>
                </div>
                <div className="active-indicator"></div>
              </li>
              <li
                className={activeTab === "Profile Management" ? "active" : ""}
                onClick={() => setActiveTab("Profile Management")}
              >
                <div className="nav-item-content">
                  <FiUser className="nav-icon" />
                  <span className="nav-text">Profile Management</span>
                </div>
                <div className="active-indicator"></div>
              </li>
            </ul>
          </nav>
          <div className="sidebar-footer">
            <div className="app-version">v2.4.1</div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="main-content">{renderContent()}</main>
      </div>

      {/* CSS Styles */}
      <style jsx>{`
        .coral-header {
          margin-bottom: 2rem;
        }
        .coral-controls {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
          flex-wrap: wrap;
        }
        .search-container {
          flex: 1;
          min-width: 300px;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.875rem;
          background: white;
        }

        .search-input:focus {
          outline: none;
          border-color: #0284c7;
          box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1);
        }

        .filter-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .filter-btn {
          padding: 0.75rem 1.5rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: white;
          color: #64748b;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }
        .filter-btn.active {
          background: #0284c7;
          border-color: #0284c7;
          color: white;
        }
        .coral-sections {
          margin-top: 2rem;
        }

        .classification-section {
          margin-bottom: 3rem;
        }

        .classification-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e2e8f0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .coral-count {
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 400;
        }

        .coral-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1rem;
        }

        .coral-item {
          display: flex;
          align-items: center;
          padding: 1rem;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .coral-item:hover {
          border-color: #0284c7;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transform: translateY(-1px);
        }

        .coral-item-image {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          overflow: hidden;
          margin-right: 1rem;
          flex-shrink: 0;
        }

        .coral-item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .coral-item-info {
          flex: 1;
        }

        .coral-item-name {
          font-size: 1rem;
          font-weight: 600;
          color: #0f172a;
          margin: 0 0 0.25rem 0;
        }

        .coral-item-scientific {
          font-size: 0.875rem;
          color: #64748b;
          font-style: italic;
          margin: 0 0 0.5rem 0;
        }

        .coral-item-subtype {
          font-size: 0.75rem;
          background: #f1f5f9;
          color: #475569;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-weight: 500;
        }

        .coral-item-arrow {
          color: #94a3b8;
          font-size: 1.25rem;
          margin-left: 1rem;
        }
        .coral-detail-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.75);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 2rem;
        }

        .coral-detail-content {
          background: white;
          border-radius: 16px;
          max-width: 800px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        }

        .coral-detail-header {
          position: sticky;
          top: 0;
          background: white;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: flex-end;
          border-radius: 16px 16px 0 0;
        }

        .close-detail-btn {
          background: #f8fafc;
          border: none;
          border-radius: 8px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #64748b;
          transition: all 0.2s;
        }

        .close-detail-btn:hover {
          background: #f1f5f9;
          color: #475569;
        }

        .coral-detail-body {
          padding: 0 1.5rem 1.5rem;
        }

        .coral-detail-image {
          position: relative;
          height: 300px;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 1.5rem;
        }

        .coral-detail-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .coral-detail-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(0, 96, 100, 0.9);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .coral-detail-name {
          font-size: 2rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 0.5rem 0;
        }

        .coral-detail-scientific {
          font-size: 1.25rem;
          color: #0284c7;
          font-style: italic;
          margin: 0 0 2rem 0;
        }

        .coral-detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .detail-item {
          background: #f8fafc;
          padding: 1rem;
          border-radius: 8px;
          border-left: 4px solid #0284c7;
        }

        .detail-label {
          display: block;
          font-size: 0.75rem;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .detail-value {
          font-size: 1rem;
          color: #0f172a;
          font-weight: 500;
        }

        .coral-description {
          background: #f8fafc;
          padding: 1.5rem;
          border-radius: 12px;
        }

        .coral-description h3 {
          font-size: 1.25rem;
          color: #0f172a;
          margin: 0 0 1rem 0;
        }

        .coral-description p {
          line-height: 1.6;
          color: #374151;
          margin: 0;
        }

        .no-results {
          text-align: center;
          padding: 3rem;
          color: #64748b;
        }

        @media (max-width: 768px) {
          .coral-controls {
            flex-direction: column;
          }

          .filter-buttons {
            justify-content: center;
          }

          .coral-list {
            grid-template-columns: 1fr;
          }

          .coral-detail-modal {
            padding: 1rem;
          }

          .coral-detail-name {
            font-size: 1.5rem;
          }

          .coral-detail-grid {
            grid-template-columns: 1fr;
          }
        }

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
          padding: 0 2rem;
          height: 70px;
          max-width: 100%;
        }

        .nav-brand {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .menu-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: transparent;
          border: none;
          color: #334155;
          cursor: pointer;
          transition: all 0.2s;
        }

        .menu-toggle:hover {
          background: #f1f5f9;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
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
        }

        .user-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 500;
        }

        .user-details {
          display: flex;
          flex-direction: column;
        }

        .welcome-text {
          font-size: 0.75rem;
          color: #64748b;
        }

        .username {
          font-size: 0.875rem;
          font-weight: 500;
          color: #0f172a;
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
        }

        .logout-button:hover {
          background: #f1f5f9;
          color: #475569;
        }

        /* Modern Sidebar */
        .dashboard-container {
          display: flex;
          flex: 1;
          overflow: hidden;
          position: relative;
        }

        .sidebar {
          width: ${sidebarOpen ? "280px" : "80px"};
          background: white;
          border-right: 1px solid #e2e8f0;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          height: calc(100vh - 70px);
          position: fixed;
          top: 70px;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
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
          padding: 1rem 0;
        }

        .coral-grid.sidebar-collapsed {
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        }

        .coral-grid:not(.sidebar-collapsed) {
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
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
        .coral-content-container {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
        }
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
          overflow-y: auto;
          margin-left: ${sidebarOpen ? "280px" : "80px"};
          transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          height: calc(100vh - 70px);
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
          max-height: 800px;
        }

        @media (max-width: 1024px) {
          .coral-grid:not(.sidebar-collapsed),
          .coral-grid.sidebar-collapsed {
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          }
          .info-cards-container {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 768px) {
          .content-section {
            padding: 1.5rem;
          }
          .sidebar {
            z-index: 100;
            transform: ${sidebarOpen ? "translateX(0)" : "translateX(-100%)"};
            width: 280px;
          }
          .main-content {
            margin-left: 0;
          }

          .coral-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .nav-container {
            padding: 0 1rem;
          }

          .sidebar {
            position: fixed;
            z-index: 40;
            height: calc(100vh - 70px);
            box-shadow: ${sidebarOpen
              ? "4px 0 15px rgba(0, 0, 0, 0.1)"
              : "none"};
          }

          .main-content {
            padding: 1rem;
          }

          .content-section {
            padding: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .portal-tag,
          .welcome-text {
            display: none;
          }

          .user-avatar {
            width: 32px;
            height: 32px;
            font-size: 0.875rem;
          }

          .username {
            font-size: 0.8125rem;
          }

          .logout-button span {
            display: none;
          }

          .logout-button {
            padding: 0.5rem;
            border-radius: 50%;
            width: 36px;
            height: 36px;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}

export default GuestDashboard;
