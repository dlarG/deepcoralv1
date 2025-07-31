// src/components/admin/components/Sidebar.js
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

function Sidebar({ activeTab, setActiveTab, sidebarOpen }) {
  const navItems = [
    { icon: FiHome, label: "Dashboard", value: "Dashboard" },
    { icon: FiUsers, label: "Manage Users", value: "Manage Users" },
    { icon: FiImage, label: "Add Images", value: "Add Images" },
    { icon: FiFileText, label: "Generate Report", value: "Generate Report" },
    {
      icon: FiDatabase,
      label: "Manage LifeForms",
      value: "Manage Coral LifeForms",
    },
    { icon: FiPieChart, label: "Distribution", value: "Coral Distribution" },
    { icon: FiCheckCircle, label: "Validate", value: "Validate" },
    { icon: FiUser, label: "Profile Management", value: "Profile Management" },
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
            >
              <div className="nav-item-content">
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
