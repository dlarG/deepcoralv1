import React, { useState } from "react";
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

function TopNavigation({
  user,
  sidebarOpen,
  setSidebarOpen,
  darkMode,
  setDarkMode,
  handleLogout,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] =
    useState(false);

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

  return (
    <nav className="bio-top-nav">
      <div className="nav-left">
        <button
          className="sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <FiMenu size={20} />
        </button>

        <div className="nav-brand">
          <h1>DeepCoral AI</h1>
          <span className="role-badge">Biologist Portal</span>
        </div>
      </div>

      <div className="nav-center">
        <div className="search-container">
          <FiSearch className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search coral species, analysis results, reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="nav-right">
        <button
          className="nav-action-btn"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>

        <div className="notification-container">
          <button
            className="nav-action-btn"
            onClick={() =>
              setNotificationDropdownOpen(!notificationDropdownOpen)
            }
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

        <div className="profile-container">
          <button
            className="profile-trigger"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
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
            </div>
            <div className="profile-info">
              <span className="profile-name">
                {user?.firstname} {user?.lastname}
              </span>
              <span className="profile-role">Marine Biologist</span>
            </div>
            <FiChevronDown className="dropdown-arrow" size={16} />
          </button>

          {profileDropdownOpen && (
            <div className="profile-dropdown">
              <div className="dropdown-header">
                <div className="profile-summary">
                  <div className="profile-avatar-large">
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
                  </div>
                  <div className="profile-details">
                    <h3>
                      {user?.firstname} {user?.lastname}
                    </h3>
                    <p>@{user?.username}</p>
                    <span className="role-tag">Biologist</span>
                  </div>
                </div>
              </div>

              <div className="dropdown-menu">
                <button className="dropdown-item">
                  <FiUser size={16} />
                  <span>View Profile</span>
                </button>
                <button className="dropdown-item">
                  <FiSettings size={16} />
                  <span>Account Settings</span>
                </button>
                <button className="dropdown-item">
                  <FiFileText size={16} />
                  <span>My Reports</span>
                </button>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item logout" onClick={handleLogout}>
                  <FiLogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default TopNavigation;
