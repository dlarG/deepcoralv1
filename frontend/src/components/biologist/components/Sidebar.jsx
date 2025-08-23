import React from "react";
import {
  FiHome,
  FiCamera,
  FiDatabase,
  FiFileText,
  FiActivity,
  FiUser,
  FiUpload,
  FiSearch,
  FiTrendingUp,
  FiAward,
  FiEye,
} from "react-icons/fi";

function Sidebar({ activeTab, setActiveTab, sidebarOpen, darkMode }) {
  const menuItems = [
    {
      section: "Main",
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
          description: "AI-Powered Detection",
          icon: FiCamera,
        },
        {
          id: "Coral Database",
          label: "Coral Database",
          description: "Species Information",
          icon: FiDatabase,
        },
      ],
    },
    {
      section: "Research",
      items: [
        {
          id: "Reports",
          label: "Reports",
          description: "Research Documentation",
          icon: FiFileText,
        },
        {
          id: "Research Tools",
          label: "Research Tools",
          description: "Advanced Analytics",
          icon: FiActivity,
        },
      ],
    },
    {
      section: "Account",
      items: [
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
    {
      label: "Search Database",
      icon: FiSearch,
      className: "info",
    },
  ];

  const stats = [
    { label: "Analyses", value: "247", icon: FiEye },
    { label: "Accuracy", value: "94.7%", icon: FiTrendingUp },
    { label: "Reports", value: "23", icon: FiAward },
  ];

  return (
    <aside className="bio-sidebar">
      <div className="sidebar-content">
        {sidebarOpen && (
          <div className="sidebar-header">
            <div className="logo-container">
              <div className="logo-icon">🐠</div>
              <div className="logo-text">
                <h2>DeepCoral</h2>
                <span>Research Platform</span>
              </div>
            </div>
          </div>
        )}

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

              <div className="nav-section">
                <div className="stats-widget">
                  <div className="stats-header">
                    <h4>Quick Stats</h4>
                  </div>
                  <div className="stats-content">
                    {stats.map((stat, index) => (
                      <div key={index} className="stat-item">
                        <div className="stat-icon">
                          <stat.icon size={16} />
                        </div>
                        <div className="stat-info">
                          <span className="stat-value">{stat.value}</span>
                          <span className="stat-label">{stat.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </nav>

        {sidebarOpen && (
          <div className="sidebar-footer">
            <div className="footer-content">
              <div className="version-info">
                <span>DeepCoral AI v2.1</span>
                <span>Last updated: Today</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
