import React, { useState, useEffect, useRef } from "react";
import {
  FiMenu,
  FiSearch,
  FiBell,
  FiSun,
  FiMoon,
  FiChevronDown,
  FiUser,
  FiSettings,
  FiLogOut,
  FiActivity,
  FiTrendingUp,
  FiFileText,
} from "react-icons/fi";
import "../styles/topnav.css";

function TopNavigation({
  user,
  sidebarOpen,
  setSidebarOpen,
  darkMode,
  setDarkMode,
  handleLogout,
  setActiveTab, // Add this prop
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] =
    useState(false);

  // Refs for click outside detection
  const profileDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close profile dropdown if clicked outside
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setProfileDropdownOpen(false);
      }

      // Close notification dropdown if clicked outside
      if (
        notificationDropdownRef.current &&
        !notificationDropdownRef.current.contains(event.target)
      ) {
        setNotificationDropdownOpen(false);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close dropdown when pressing Escape key
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        setProfileDropdownOpen(false);
        setNotificationDropdownOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  const notifications = [
    {
      id: 1,
      type: "analysis",
      title: "Analysis Complete",
      message: "Your coral species analysis has been completed successfully.",
      time: "2 minutes ago",
      unread: true,
    },
    {
      id: 2,
      type: "discovery",
      title: "New Coral Species Detected",
      message:
        "A potential new species has been identified in your recent upload.",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      type: "system",
      title: "System Update",
      message: "New AI model v2.1 is now available with improved accuracy.",
      time: "3 hours ago",
      unread: false,
    },
  ];

  // Handle profile dropdown menu item clicks
  const handleProfileMenuClick = (action) => {
    setProfileDropdownOpen(false);

    switch (action) {
      case "profile":
        // Navigate to Profile Management section
        setActiveTab("Profile Management");
        console.log("Navigated to Profile Management");
        break;
      case "settings":
        // You could create a Settings section or navigate to profile with settings mode
        setActiveTab("Profile Management");
        console.log("Navigate to settings");
        break;
      case "reports":
        // Navigate to Generate Report section
        setActiveTab("Generate Report");
        console.log("Navigate to reports");
        break;
      case "help":
        // You could open a help modal or external link
        console.log("Open help center");
        // For now, you could navigate to a help section if you have one
        // setActiveTab("Help");
        break;
      case "logout":
        handleLogout();
        break;
      default:
        break;
    }
  };

  return (
    <nav className="admin-top-nav">
      <div className="nav-left">
        <button
          className="sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <FiMenu size={20} />
        </button>
        <div className="logo-container">
          <img
            src={
              darkMode
                ? "/img/logos/LogoSideTextW.png"
                : "/img/logos/LogoSideTextB.png"
            }
            className="navbar-logo"
            alt="DeepCoral AI Logo"
            onError={(e) => {
              console.warn("Logo image failed to load:", e.target.src);
              e.target.style.display = "none";
            }}
          />
        </div>
      </div>

      <div className="nav-center">
        <div className="search-container">
          <FiSearch className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            id="searchString"
            placeholder="Search coral species, analysis results, reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="nav-right">
        <button
          className="nav-action-btn theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>

        <div className="notification-container" ref={notificationDropdownRef}>
          <button
            className="nav-action-btn notification-btn"
            onClick={() => {
              setNotificationDropdownOpen(!notificationDropdownOpen);
              setProfileDropdownOpen(false); // Close profile dropdown
            }}
            title="Notifications"
          >
            <FiBell size={18} />
            <span className="notification-badge">3</span>
          </button>

          {notificationDropdownOpen && (
            <div className="notification-dropdown">
              <div className="dropdown-header">
                <h3>Notifications</h3>
                <span className="mark-all-read">Mark all read</span>
              </div>

              <div className="notification-list">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`notification-item ${
                      notification.unread ? "unread" : ""
                    }`}
                  >
                    <div className={`notification-icon ${notification.type}`}>
                      {notification.type === "analysis" && <FiActivity />}
                      {notification.type === "discovery" && <FiTrendingUp />}
                      {notification.type === "system" && <FiSettings />}
                    </div>
                    <div className="notification-content">
                      <h4>{notification.title}</h4>
                      <p>{notification.message}</p>
                      <span className="notification-time">
                        {notification.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="dropdown-footer">
                <button className="view-all-btn">View All Notifications</button>
              </div>
            </div>
          )}
        </div>

        <div
          className={`profile-container ${profileDropdownOpen ? "open" : ""}`}
          ref={profileDropdownRef}
        >
          <button
            className="profile-trigger"
            onClick={() => {
              setProfileDropdownOpen(!profileDropdownOpen);
              setNotificationDropdownOpen(false); // Close notification dropdown
            }}
          >
            <div className="profile-avatar">
              {user?.profile_image ? (
                <img
                  src={`/profile_uploads/${user.profile_image}`}
                  alt={`${user.firstname} ${user.lastname}`}
                />
              ) : (
                <div className="avatar-initials">
                  {user?.firstname?.charAt(0)}
                  {user?.lastname?.charAt(0)}
                </div>
              )}
              <div className="avatar-status-indicator"></div>
            </div>
            <div className="profile-info">
              <span className="profile-name">
                {user?.firstname} {user?.lastname}
              </span>
              <span className="profile-role">Administrator</span>
            </div>
            <FiChevronDown className="dropdown-arrow" size={16} />
          </button>

          {profileDropdownOpen && (
            <div className="profile-dropdown">
              <div className="dropdown-header">
                <div className="profile-summary">
                  <div className="profile-avatar-larges">
                    {user?.profile_image ? (
                      <img
                        src={`/profile_uploads/${user.profile_image}`}
                        alt={`${user.firstname} ${user.lastname}`}
                      />
                    ) : (
                      <div className="avatar-initials-large">
                        {user?.firstname?.charAt(0)}
                        {user?.lastname?.charAt(0)}
                      </div>
                    )}
                    <div className="avatar-status-indicator-large"></div>
                  </div>
                  <div className="profile-details">
                    <h3 className="user-cred-name">
                      {user?.firstname} {user?.lastname}
                    </h3>
                    <p className="user-cred-uname">@{user?.username}</p>
                    <div className="role-badges">
                      <span className="role-tag primary">Administrator</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="dropdown-menu">
                <div className="menu-section">
                  <button
                    className="dropdown-item"
                    onClick={() => handleProfileMenuClick("profile")}
                  >
                    <div className="item-icon">
                      <FiUser size={16} />
                    </div>
                    <div className="item-content">
                      <span className="item-title">View Profile</span>
                      <span className="item-subtitle">
                        Personal information
                      </span>
                    </div>
                  </button>

                  <button
                    className="dropdown-item"
                    onClick={() => handleProfileMenuClick("settings")}
                  >
                    <div className="item-icon">
                      <FiSettings size={16} />
                    </div>
                    <div className="item-content">
                      <span className="item-title">Account Settings</span>
                      <span className="item-subtitle">Privacy & security</span>
                    </div>
                  </button>

                  <button
                    className="dropdown-item"
                    onClick={() => handleProfileMenuClick("reports")}
                  >
                    <div className="item-icon">
                      <FiFileText size={16} />
                    </div>
                    <div className="item-content">
                      <span className="item-title">My Reports</span>
                      <span className="item-subtitle">Analysis history</span>
                    </div>
                    <div className="item-badge">23</div>
                  </button>
                </div>

                <div className="dropdown-divider"></div>

                <div className="menu-section">
                  <button
                    className="dropdown-item logout"
                    onClick={() => handleProfileMenuClick("logout")}
                  >
                    <div className="item-icon">
                      <FiLogOut size={16} />
                    </div>
                    <div className="item-content">
                      <span className="item-title">Sign Out</span>
                      <span className="item-subtitle">End current session</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default TopNavigation;
