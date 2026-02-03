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
  FiX, // Add this import
} from "react-icons/fi";
import SystemSettingsModal from "./SystemSettingsModal";
import "../styles/topnav.css";

function TopNavigation({
  user,
  sidebarOpen,
  setSidebarOpen,
  darkMode,
  setDarkMode,
  handleLogout,
  setActiveTab,
  activeTab,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] =
    useState(false);
  const [systemSettingsOpen, setSystemSettingsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // Add this state

  // Refs for click outside detection
  const profileDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 480);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
        setSystemSettingsOpen(false);
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

  // Helper function to check if profile-related items should be active
  const isProfileActive = () => {
    return activeTab === "Profile Management";
  };

  // Handle profile dropdown close
  const handleCloseProfileDropdown = () => {
    setProfileDropdownOpen(false);
  };

  // Handle dropdown header click (for mobile close functionality)
  const handleDropdownHeaderClick = (event) => {
    // Only close on mobile and if clicking in the close button area
    if (isMobile) {
      const rect = event.currentTarget.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickY = event.clientY - rect.top;

      // Close button area (top-right corner, roughly 40x40px area)
      if (clickX > rect.width - 40 && clickY < 40) {
        setProfileDropdownOpen(false);
      }
    }
  };

  // Handle profile dropdown menu item clicks
  const handleProfileMenuClick = (action) => {
    setProfileDropdownOpen(false);

    switch (action) {
      case "profile":
        setActiveTab("Profile Management");
        console.log("Navigated to Profile Management");
        break;
      case "settings":
        setSystemSettingsOpen(true);
        console.log("Opening System Settings Modal");
        break;
      case "reports":
        setActiveTab("Generate Report");
        console.log("Navigate to reports");
        break;
      case "help":
        console.log("Open help center");
        break;
      case "logout":
        handleLogout();
        break;
      default:
        break;
    }
  };

  return (
    <>
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

          <div
            className={`profile-container ${profileDropdownOpen ? "open" : ""}`}
            ref={profileDropdownRef}
          >
            <button
              className="profile-trigger"
              onClick={() => {
                setProfileDropdownOpen(!profileDropdownOpen);
                setNotificationDropdownOpen(false);
              }}
            >
              <div className="profile-avatar">
                {user?.profile_image ? (
                  <img
                    src={`${process.env.REACT_APP_API_URL}/profile_uploads/${user.profile_image}`}
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
              <div className="profile-infos">
                <span className="profile-name">
                  {user?.firstname} {user?.lastname}
                </span>
                <span className="profile-role">Administrator</span>
              </div>
              <FiChevronDown className="dropdown-arrow" size={16} />
            </button>

            {profileDropdownOpen && (
              <div className="profile-dropdown">
                <div
                  className={`dropdown-header ${
                    isMobile ? "has-close-btn" : ""
                  }`}
                  onClick={handleDropdownHeaderClick}
                >
                  {/* Add real close button for mobile */}
                  {isMobile && (
                    <button
                      className="mobile-close-btn"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent header click
                        handleCloseProfileDropdown();
                      }}
                      aria-label="Close profile menu"
                    >
                      <FiX size={16} />
                    </button>
                  )}

                  <div className="profile-summary">
                    <div className="profile-avatar-larges">
                      {user?.profile_image ? (
                        <img
                          src={`${process.env.REACT_APP_API_URL}/profile_uploads/${user.profile_image}`}
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
                      className={`dropdown-item ${
                        isProfileActive() ? "active" : ""
                      }`}
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
                      {isProfileActive() && (
                        <div className="active-indicator"></div>
                      )}
                    </button>

                    <button
                      className={`dropdown-item ${
                        systemSettingsOpen ? "active" : ""
                      }`}
                      onClick={() => handleProfileMenuClick("settings")}
                    >
                      <div className="item-icon">
                        <FiSettings size={16} />
                      </div>
                      <div className="item-content">
                        <span className="item-title">System Settings</span>
                        <span className="item-subtitle">
                          Model & System Settings
                        </span>
                      </div>
                      {systemSettingsOpen && (
                        <div className="active-indicator"></div>
                      )}
                    </button>

                    <button
                      className={`dropdown-item ${
                        activeTab === "Generate Report" ? "active" : ""
                      }`}
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
                      {activeTab === "Generate Report" && (
                        <div className="active-indicator"></div>
                      )}
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
                        <span className="item-subtitle">
                          End current session
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* System Settings Modal */}
      <SystemSettingsModal
        isOpen={systemSettingsOpen}
        onClose={() => setSystemSettingsOpen(false)}
        darkMode={darkMode}
      />
    </>
  );
}

export default TopNavigation;
