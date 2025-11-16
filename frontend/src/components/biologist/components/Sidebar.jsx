import React from "react";
import {
  FiHome,
  FiCamera,
  FiDatabase,
  FiFileText,
  FiUser,
  FiUpload,
  FiUsers,
  FiMap,
} from "react-icons/fi";

function Sidebar({ activeTab, setActiveTab, sidebarOpen }) {
  const navigationItems = [
    {
      id: "Dashboard",
      label: "Dashboard",
      description: "Overview & Analytics",
      icon: FiHome,
    },
    {
      id: "User",
      label: "Users",
      description: "User Management",
      icon: FiUsers,
    },
    {
      id: "Image Analysis",
      label: "Image Analysis",
      description: "AI-Powered Segmentation",
      icon: FiCamera,
    },
    {
      id: "Coral Database",
      label: "Coral Database",
      description: "Species Information",
      icon: FiDatabase,
    },
    {
      id: "Coral Distribution",
      label: "Coral Map",
      description: "Coral Distribution on Map",
      icon: FiMap,
    },
    {
      id: "Profile",
      label: "Profile",
      description: "Personal Settings",
      icon: FiUser,
    },
  ];

  const quickActions = [
    {
      label: "Upload Images",
      icon: FiUpload,
      className: "primary",
    },
    {
      label: "Generate Report",
      icon: FiFileText,
      className: "success",
    },
  ];

  return (
    <aside className="bio-sidebar">
      <div className="sidebar-content">
        <nav className="sidebar-nav">
          <div className="nav-section">
            <ul className="nav-menu">
              {navigationItems.map((item) => (
                <li key={item.id} className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === item.id ? "active" : ""
                    }`}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <div className="nav-icon">
                      <item.icon size={24} />
                    </div>
                    <div className="nav-content">
                      <span className="nav-label">{item.label}</span>
                      {sidebarOpen && (
                        <span className="nav-description">
                          {item.description}
                        </span>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {sidebarOpen && (
            <>
              <div className="nav-section">
                <h3 className="nav-section-title">Quick Actions</h3>
                <div className="quick-actions">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      className={`quick-action-btn ${action.className}`}
                    >
                      <action.icon size={16} />
                      <span>{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
          <br />
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;
