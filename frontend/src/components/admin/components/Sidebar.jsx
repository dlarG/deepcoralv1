import React, { useState, useEffect } from "react";
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
import axios from "axios";
import "../styles/sidebar.css";

function Sidebar({ activeTab, setActiveTab, sidebarOpen, darkMode }) {
  // NEW: State for notifications
  const [notifications, setNotifications] = useState({
    pendingUsers: 0,
    pendingImages: 0,
  });

  // NEW: Fetch notifications data
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `http://${
          process.env.REACT_APP_API_URL || "localhost:5000"
        }/notifications`,
        {
          withCredentials: true,
          timeout: 10000, // 10 second timeout
        }
      );

      if (response.data) {
        setNotifications({
          pendingUsers: response.data.pending_users || 0,
          pendingImages: response.data.pending_images || 0,
        });
      }
    } catch (error) {
      console.error("❌ Error fetching notifications:", error);
    }
  };

  // NEW: Fetch notifications on component mount and set up polling
  useEffect(() => {
    fetchNotifications();

    // Poll for notifications every 30 seconds
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // NEW: Refresh notifications when active tab changes (in case user just approved someone)
  useEffect(() => {
    if (activeTab === "Validate" || activeTab === "Manage Users") {
      fetchNotifications();
    }
  }, [activeTab]);

  // UPDATED: Navigation items with notification support
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
      // NEW: Add notification count
      notificationCount: notifications.pendingUsers,
      notificationColor: "#ef4444",
    },
    {
      icon: FiUser,
      label: "Profile Management",
      value: "Profile Management",
      title: "Profile Management",
    },
  ];

  // NEW: Enhanced navigation item rendering with notification support
  const renderNavItem = (item) => {
    const isActive = activeTab === item.value;
    const hasNotification = item.notificationCount > 0;

    return (
      <li
        key={item.value}
        className={`nav-item ${isActive ? "active" : ""}`}
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
          title={sidebarOpen ? "" : item.label}
        >
          <div className="nav-icon-container">
            <item.icon className="nav-icon" />

            {/* NEW: Notification Badge */}
            {hasNotification && (
              <div
                className="sidebar-notification-badge"
                style={{
                  backgroundColor: item.notificationColor || "#ef4444",
                }}
              >
                {item.notificationCount > 99 ? "99+" : item.notificationCount}
              </div>
            )}
          </div>

          <span className="nav-text">{item.label}</span>
        </div>
        <div className="active-indicator"></div>
      </li>
    );
  };

  return (
    <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <h3 className="sidebar-title">Navigation</h3>
      </div>

      <nav className="sidebar-nav">
        <ul>{navItems.map(renderNavItem)}</ul>
      </nav>

      <div className="sidebar-footer">
        <div className="app-version">v1.0.1</div>
      </div>
    </aside>
  );
}

export default Sidebar;
