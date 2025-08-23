// src/components/guest/components/Sidebar.js
import React from "react";
import { FiHome, FiImage, FiMap, FiFileText, FiUser } from "react-icons/fi";

function Sidebar({ activeTab, setActiveTab, sidebarOpen }) {
  const navItems = [
    { icon: FiHome, label: "Coral LifeForms", value: "Coral LifeForms" },
    { icon: FiImage, label: "Upload Image", value: "Upload Image" },
    { icon: FiMap, label: "View Map", value: "View Map" },
    { icon: FiFileText, label: "View Results", value: "View Results" },
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
