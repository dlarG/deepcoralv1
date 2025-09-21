import React from "react";
import {
  FiHome,
  FiUsers,
  FiImage,
  FiFileText,
  FiDatabase,
  FiPieChart,
  FiCheckCircle,
  FiUser,
} from "react-icons/fi";
import "../styles/sidebar.css";

function Sidebar({ activeTab, setActiveTab, sidebarOpen, darkMode }) {
  const navItems = [
    {
      icon: FiHome,
      label: "Dashboard",
      value: "Dashboard",
      title: "Dashboard",
    },
    {
      icon: FiUsers,
      label: "Manage Users",
      value: "Manage Users",
      title: "User Management",
    },
    {
      icon: FiImage,
      label: "Add Images",
      value: "Add Images",
      title: "Image Upload",
    },
    {
      icon: FiFileText,
      label: "Generate Report",
      value: "Generate Report",
      title: "Report Generation",
    },
    {
      icon: FiDatabase,
      label: "Manage LifeForms",
      value: "Manage Coral LifeForms",
      title: "Coral Species Management",
    },
    {
      icon: FiPieChart,
      label: "Distribution",
      value: "Coral Distribution",
      title: "Coral Distribution Trends",
    },
    {
      icon: FiCheckCircle,
      label: "Validate",
      value: "Validate",
      title: "Data Validation",
    },
    {
      icon: FiUser,
      label: "Profile Management",
      value: "Profile Management",
      title: "Profile Management",
    },
  ];

  return (
    <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <h3 className="sidebar-title">Navigation</h3>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item) => (
            <li
              key={item.value}
              className={activeTab === item.value ? "active" : ""}
              onClick={() => setActiveTab(item.value)}
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setActiveTab(item.value);
                }
              }}
            >
              <div
                className="nav-item-content"
                data-tooltip={item.label}
                title={sidebarOpen ? "" : item.label} // Only show title when sidebar is closed
              >
                <item.icon className="nav-icon" />
                <span className="nav-text">{item.label}</span>
              </div>
              <div className="active-indicator"></div>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="app-version">v2.4.1</div>
      </div>
    </aside>
  );
}

export default Sidebar;
