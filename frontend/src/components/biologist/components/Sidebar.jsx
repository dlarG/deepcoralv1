import React from "react";
import {
  FiHome,
  FiCamera,
  FiDatabase,
  FiFileText,
  FiUser,
  FiUpload,
  FiUsers,
} from "react-icons/fi";

function Sidebar({ activeTab, setActiveTab, sidebarOpen, darkMode }) {
  const menuItems = [
    {
      items: [
        {
          id: "Dashboard",
          label: "Dashboard",
          description: "Overview & Analytics",
          icon: FiHome,
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
          id: "User",
          label: "Users",
          description: "User Management",
          icon: FiUsers,
        },
        {
          id: "Profile",
          label: "Profile",
          description: "Personal Settings",
          icon: FiUser,
        },
      ],
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
          {menuItems.map((section) => (
            <div key={section.section} className="nav-section">
              <h3 className="nav-section-title">{section.section}</h3>
              <ul className="nav-menu">
                {section.items.map((item) => (
                  <li key={item.id} className="nav-item">
                    <button
                      className={`nav-link ${
                        activeTab === item.id ? "active" : ""
                      }`}
                      onClick={() => setActiveTab(item.id)}
                    >
                      {activeTab === item.id && (
                        <div className="active-indicator" />
                      )}
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
          ))}
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

        {sidebarOpen && (
          <div className="sidebar-footer">
            <div className="footer-content">
              <div className="version-info">
                <span>DeepCoralAI</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
