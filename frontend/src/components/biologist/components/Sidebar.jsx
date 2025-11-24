import React, { useState, useEffect } from "react";
import {
  FiHome,
  FiCamera,
  FiDatabase,
  FiFileText,
  FiUser,
  FiUpload,
  FiUsers,
  FiUserPlus,
  FiMap,
} from "react-icons/fi";
import axios from "axios";
import "../styles/sidebar.css";

function Sidebar({ activeTab, setActiveTab, sidebarOpen }) {
  // NEW: State for notifications (images only)
  const [notifications, setNotifications] = useState({
    pendingImages: 0,
  });

  // NEW: Fetch notifications data
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/biologist/notifications`,
        {
          withCredentials: true,
          timeout: 10000, // 10 second timeout
        }
      );

      if (response.data && response.data.success) {
        setNotifications({
          pendingImages: response.data.pending_images || 0,
        });
      }
    } catch (error) {
      console.error("❌ Error fetching biologist notifications:", error);
      // Set to 0 on error to avoid showing stale notifications
      setNotifications({
        pendingImages: 0,
      });
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

  // NEW: Refresh notifications when active tab changes (in case user just approved something)
  useEffect(() => {
    if (activeTab === "Validate") {
      fetchNotifications();
    }
  }, [activeTab]);

  // UPDATED: Navigation items with notification support
  const navigationItems = [
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
      id: "Coral Distribution",
      label: "Coral Map",
      description: "Coral Distribution on Map",
      icon: FiMap,
    },
    {
      id: "Validate",
      label: "Validate",
      description: "Validate User Uploads",
      icon: FiUserPlus,
      // NEW: Add notification count for pending images only
      notificationCount: notifications.pendingImages,
      notificationColor: "#ef4444",
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

  // NEW: Enhanced navigation item rendering with notification support
  const renderNavItem = (item) => {
    const isActive = activeTab === item.id;
    const hasNotification = item.notificationCount > 0;

    return (
      <li key={item.id} className="nav-item">
        <button
          className={`nav-link ${isActive ? "active" : ""}`}
          onClick={() => setActiveTab(item.id)}
          title={!sidebarOpen ? item.label : ""}
        >
          <div className="nav-icon-container">
            <div className="nav-icon">
              <item.icon size={24} />
            </div>

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

          <div className="nav-content">
            <span className="nav-label">{item.label}</span>
            {sidebarOpen && (
              <span className="nav-description">{item.description}</span>
            )}
          </div>
        </button>
      </li>
    );
  };

  return (
    <aside className="bio-sidebar">
      <div className="sidebar-content">
        <nav className="sidebar-nav">
          <div className="nav-section">
            <ul className="nav-menu">{navigationItems.map(renderNavItem)}</ul>
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
