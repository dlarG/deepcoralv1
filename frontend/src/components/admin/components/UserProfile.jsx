import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiArrowLeft,
  FiEdit2,
  FiTrash2,
  FiCalendar,
  FiUser,
  FiShield,
  FiActivity,
  FiDownload,
  FiMoreVertical,
  FiMail,
  FiClock,
  FiCheck,
  FiX,
  FiStar,
  FiUsers,
  FiImage,
  FiSettings,
  FiFilter,
  FiChevronDown,
  FiRefreshCw,
  FiSearch,
  FiEye,
  FiMonitor,
  FiDatabase,
  FiUpload,
  FiLogIn,
  FiLogOut,
} from "react-icons/fi";
import { decryptId } from "../../../utils/encryption";
import "../styles/userProfileStyles.css";

function UserProfile({ darkMode }) {
  const { userId: encodedUserId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const [activitiesSummary, setActivitiesSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const [activityFilters, setActivityFilters] = useState({
    activity_type: "all",
    category: "all",
    page: 1,
    per_page: 15,
  });
  const [activityPagination, setActivityPagination] = useState({});
  const [filtersOpen, setFiltersOpen] = useState(false);

  const getActivityIcon = (activityType, category) => {
    switch (category) {
      case "authentication":
        return activityType.includes("login") ? (
          <FiLogIn size={16} />
        ) : (
          <FiLogOut size={16} />
        );
      case "user_management":
        return <FiUsers size={16} />;
      case "coral_data":
        return <FiDatabase size={16} />;
      case "image_analysis":
        return <FiUpload size={16} />;
      case "system_admin":
        return <FiSettings size={16} />;
      case "reports":
        return <FiDownload size={16} />;
      default:
        return <FiActivity size={16} />;
    }
  };

  const getActivityColor = (category) => {
    switch (category) {
      case "authentication":
        return "#10b981"; // green
      case "user_management":
        return "#3b82f6"; // blue
      case "coral_data":
        return "#8b5cf6"; // purple
      case "image_analysis":
        return "#f59e0b"; // amber
      case "system_admin":
        return "#ef4444"; // red
      case "reports":
        return "#06b6d4"; // cyan
      default:
        return "#6b7280"; // gray
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const decodedEncryptedId = decodeURIComponent(encodedUserId);
        const decryptedId = decryptId(decodedEncryptedId);

        if (!decryptedId) {
          setError("Invalid or corrupted user ID");
          return;
        }

        const response = await axios.get(
          `http://${process.env.REACT_APP_API_URL}/admin/users/${decryptedId}`,
          { withCredentials: true }
        );
        setUser(response.data.user);

        // Fetch activities after user is loaded
        await fetchUserActivities(decryptedId);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError(err.response?.data?.error || "Failed to fetch user details");
      } finally {
        setLoading(false);
      }
    };

    if (encodedUserId) {
      fetchUser();
    } else {
      setError("No user ID provided");
      setLoading(false);
    }
  }, [encodedUserId]);

  const fetchUserActivities = async (userId) => {
    setActivitiesLoading(true);
    try {
      const params = new URLSearchParams({
        page: activityFilters.page.toString(),
        per_page: activityFilters.per_page.toString(),
        ...(activityFilters.activity_type !== "all" && {
          activity_type: activityFilters.activity_type,
        }),
        ...(activityFilters.category !== "all" && {
          category: activityFilters.category,
        }),
      });

      const response = await axios.get(
        `http://${process.env.REACT_APP_API_URL}/admin/users/${userId}/activities?${params}`,
        { withCredentials: true }
      );

      setActivities(response.data.activities);
      setActivitiesSummary(response.data.summary);
      setActivityPagination(response.data.pagination);
    } catch (err) {
      console.error("Error fetching user activities:", err);
    } finally {
      setActivitiesLoading(false);
    }
  };

  // Handle activity filter changes
  const handleFilterChange = (key, value) => {
    const newFilters = { ...activityFilters, [key]: value, page: 1 };
    setActivityFilters(newFilters);

    if (user) {
      const decodedEncryptedId = decodeURIComponent(encodedUserId);
      const decryptedId = decryptId(decodedEncryptedId);
      if (decryptedId) {
        fetchUserActivities(decryptedId);
      }
    }
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setActivityFilters((prev) => ({ ...prev, page: newPage }));

    if (user) {
      const decodedEncryptedId = decodeURIComponent(encodedUserId);
      const decryptedId = decryptId(decodedEncryptedId);
      if (decryptedId) {
        fetchUserActivities(decryptedId);
      }
    }
  };

  // Refresh activities
  const refreshActivities = () => {
    if (user) {
      const decodedEncryptedId = decodeURIComponent(encodedUserId);
      const decryptedId = decryptId(decodedEncryptedId);
      if (decryptedId) {
        fetchUserActivities(decryptedId);
      }
    }
  };

  const handleGoBack = () => {
    navigate("/admin-dashboard", {
      state: { activeTab: "Manage Users" },
    });
  };

  const handleEditUser = () => {
    const decodedEncryptedId = decodeURIComponent(encodedUserId);
    const decryptedId = decryptId(decodedEncryptedId);

    if (decryptedId) {
      navigate("/admin-dashboard", {
        state: {
          activeTab: "Manage Users",
          editUserId: decryptedId,
        },
      });
    }
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleDeleteUser = async () => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const decodedEncryptedId = decodeURIComponent(encodedUserId);
        const decryptedId = decryptId(decodedEncryptedId);

        if (!decryptedId) {
          alert("Invalid user ID");
          return;
        }

        const csrfResponse = await axios.get(
          `http://${process.env.REACT_APP_API_URL}/csrf-token`,
          {
            withCredentials: true,
          }
        );
        const csrfToken = csrfResponse.data.csrf_token;

        await axios.delete(
          `http://${process.env.REACT_APP_API_URL}/admin/users/${decryptedId}`,
          {
            withCredentials: true,
            headers: {
              "X-CSRF-Token": csrfToken,
            },
          }
        );

        alert("User deleted successfully!");
        navigate("/admin-dashboard", {
          state: { activeTab: "Manage Users" },
        });
      } catch (error) {
        console.error("Delete failed:", error);
        alert("Failed to delete user");
      }
    }
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "#dc2626"; // red-600
      case "biologist":
        return "#059669"; // emerald-600
      case "researcher":
        return "#7c3aed"; // violet-600
      default:
        return "#6b7280"; // gray-500
    }
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 30) return `${days} days ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  };

  if (loading)
    return (
      <div className={`user-profile-container ${darkMode ? "dark" : ""}`}>
        <div className="profile-loading">
          <div className="loading-content">
            {/* Enhanced Loading Spinner */}
            <div className="loading-spinner-container">
              <div className="pulse-rings">
                <div className="pulse-ring ring-1"></div>
                <div className="pulse-ring ring-2"></div>
                <div className="pulse-ring ring-3"></div>
              </div>
              <div className="center-avatar">
                <div className="avatar-placeholder">
                  <FiUser size={24} />
                </div>
              </div>
            </div>

            {/* Loading Text with Animation */}
            <div className="loading-text">
              <h3>Loading Profile</h3>
              <div className="loading-dots">
                <span>Fetching user details</span>
                <div className="dots-animation">
                  <span className="dot">.</span>
                  <span className="dot">.</span>
                  <span className="dot">.</span>
                </div>
              </div>
            </div>

            {/* Progress Indicators */}
            <div className="loading-progress">
              <div className="progress-steps">
                <div className="step active">
                  <div className="step-icon">
                    <FiUser size={16} />
                  </div>
                  <span>User Info</span>
                </div>
                <div className="step loading">
                  <div className="step-icon">
                    <FiShield size={16} />
                  </div>
                  <span>Permissions</span>
                </div>
                <div className="step">
                  <div className="step-icon">
                    <FiActivity size={16} />
                  </div>
                  <span>Activity</span>
                </div>
              </div>
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
            </div>

            {/* Alternative: Skeleton Cards Preview */}
            <div className="skeleton-preview">
              <div className="skeleton-card">
                <div className="skeleton-header">
                  <div className="skeleton-avatar"></div>
                  <div className="skeleton-text">
                    <div className="skeleton-line long"></div>
                    <div className="skeleton-line short"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className={`user-profile-container ${darkMode ? "dark" : ""}`}>
        <div className="profile-error">
          <div className="error-content">
            <div className="error-icon">
              <FiX size={48} />
            </div>
            <h3>Unable to Load Profile</h3>
            <p>{error}</p>
            <button onClick={handleGoBack} className="btn-primary">
              <FiArrowLeft size={18} />
              Back to Users
            </button>
          </div>
        </div>
      </div>
    );

  if (!user) return null;

  return (
    <div className={`user-profile-container ${darkMode ? "dark" : ""}`}>
      {/* Header Navigation */}
      <div className="profile-header-nav">
        <button onClick={handleGoBack} className="nav-back-btn">
          <FiArrowLeft size={20} />
          <span>Back to Users</span>
        </button>

        <div className="profile-actions">
          <div className="actions-dropdown">
            <button
              onClick={toggleDropdown}
              className="actions-trigger"
              aria-label="Profile actions"
            >
              <FiMoreVertical size={20} />
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <button onClick={handleEditUser} className="dropdown-item edit">
                  <FiEdit2 size={16} />
                  <span>Edit Profile</span>
                </button>
                <button className="dropdown-item export">
                  <FiDownload size={16} />
                  <span>Export Data</span>
                </button>
                <div className="dropdown-divider"></div>
                <button
                  onClick={handleDeleteUser}
                  className="dropdown-item delete"
                >
                  <FiTrash2 size={16} />
                  <span>Delete User</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Hero Section */}
      <div className="profile-hero">
        <div className="hero-background"></div>

        <div className="profile-hero-content">
          <div className="avatar-wrapper">
            <div className="avatar-container">
              {user.profile_image ? (
                <img
                  src={`/profile_uploads/${user.profile_image}`}
                  alt={`${user.firstname} ${user.lastname}`}
                  onLoad={() => setImageLoaded(true)}
                  onError={(e) => {
                    e.target.style.display = "none";
                    setImageLoaded(false);
                  }}
                  style={{ display: imageLoaded ? "block" : "none" }}
                />
              ) : null}
            </div>
          </div>

          <div className="profile-info">
            <div className="user-identity">
              <h1 className="user-name">
                {user.firstname} {user.lastname}
              </h1>
              <p className="user-handle">@{user.username}</p>
            </div>

            <div className="profile-user-role">
              <div
                className="profile-role-badge"
                style={{ backgroundColor: getRoleColor(user.roletype) }}
              >
                <FiShield size={14} />
                <span>
                  {user.roletype?.charAt(0).toUpperCase() +
                    user.roletype?.slice(1)}
                </span>
              </div>
            </div>

            <div className="profile-user-meta">
              <div className="profile-meta-item">
                <FiCalendar size={16} />
                <span>
                  Joined{" "}
                  {new Date(user.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                  })}
                </span>
              </div>
              <div className="profile-meta-item">
                <FiActivity size={16} />
                <span>
                  Last seen{" "}
                  {getTimeAgo(
                    user.last_login || user.updated_at || user.created_at
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="profile-stats">
            <div className="profile-stat-card">
              <div className="profile-stat-icon">
                <FiUsers size={20} />
              </div>
              <div className="profile-stat-info">
                <h3>Active</h3>
                <p>Status</p>
              </div>
            </div>
            <div className="profile-stat-card">
              <div className="profile-stat-icon">
                <FiStar size={20} />
              </div>
              <div className="profile-stat-info">
                <h3>Verified</h3>
                <p>Account</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="profile-content">
        <div className="content-grid">
          {/* Personal Information Card */}
          <div className="profile-info-card" style={{ gridArea: "personal" }}>
            <div className="profile-card-header">
              <div className="header-icon personal">
                <FiUser size={20} />
              </div>
              <div className="profile-header-content">
                <h2>Personal Information</h2>
                <p>Basic account details and information</p>
              </div>
            </div>

            <div className="profile-card-body">
              <div className="info-grid">
                <div className="profile-info-item">
                  <div className="profile-info-label">
                    <FiUser size={16} />
                    <span>Full Name</span>
                  </div>
                  <div className="info-value">
                    <strong>
                      {user.firstname} {user.lastname}
                    </strong>
                  </div>
                </div>

                <div className="profile-info-item">
                  <div className="profile-info-label">
                    <FiMail size={16} />
                    <span>Username</span>
                  </div>
                  <div className="info-value">
                    <code>@{user.username}</code>
                  </div>
                </div>

                <div className="profile-info-item">
                  <div className="profile-info-label">
                    <FiShield size={16} />
                    <span>Role</span>
                  </div>
                  <div className="info-value">
                    <span
                      className="role-chip"
                      style={{
                        backgroundColor: getRoleColor(user.roletype) + "20",
                        color: getRoleColor(user.roletype),
                      }}
                    >
                      {user.roletype?.charAt(0).toUpperCase() +
                        user.roletype?.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="profile-info-item">
                  <div className="profile-info-label">
                    <FiImage size={16} />
                    <span>Profile Picture</span>
                  </div>
                  <div className="info-value">
                    <span
                      className={`status-chip ${
                        user.profile_image ? "success" : "neutral"
                      }`}
                    >
                      {user.profile_image ? (
                        <>
                          <FiCheck size={14} />
                          Uploaded
                        </>
                      ) : (
                        <>
                          <FiX size={14} />
                          Not Set
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Timeline Card */}
          <div className="profile-info-card" style={{ gridArea: "timeline" }}>
            <div className="profile-card-header">
              <div className="header-icon timeline">
                <FiClock size={20} />
              </div>
              <div className="profile-header-content">
                <h2>Account Timeline</h2>
                <p>Important account events and milestones</p>
              </div>
            </div>
            <div className="profile-card-body">
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-marker created">
                    <FiCalendar size={14} />
                  </div>
                  <div className="timeline-content">
                    <h4>Account Created</h4>
                    <p className="timeline-date">
                      {new Date(user.created_at).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="timeline-time">
                      {new Date(user.created_at).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                {user.updated_at && user.updated_at !== user.created_at && (
                  <div className="timeline-item">
                    <div className="timeline-marker updated">
                      <FiActivity size={14} />
                    </div>
                    <div className="timeline-content">
                      <h4>Last Updated</h4>
                      <p className="timeline-date">
                        {new Date(user.updated_at).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="timeline-time">
                        {new Date(user.updated_at).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                )}

                <div className="timeline-item">
                  <div className="timeline-marker current">
                    <FiActivity size={14} />
                  </div>
                  <div className="timeline-content">
                    <h4>Current Status</h4>
                    <p className="timeline-date">Active Member</p>
                    <p className="timeline-time">
                      Last seen {getTimeAgo(user.updated_at || user.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="info-card activity-logs-card"
          style={{ gridArea: "activities" }}
        >
          <div className="profile-card-header">
            <div className="header-icon activities">
              <FiActivity size={20} />
            </div>
            <div className="profile-header-content">
              <h2>Activity Logs</h2>
              <p>Recent activities and actions by this user</p>
            </div>
            <div className="profile-header-actions">
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className={`filter-toggle ${filtersOpen ? "active" : ""}`}
              >
                <FiFilter size={16} />
              </button>
              <button
                onClick={refreshActivities}
                className="profile-refresh-btn"
                disabled={activitiesLoading}
              >
                <FiRefreshCw
                  size={16}
                  className={activitiesLoading ? "spinning" : ""}
                />
              </button>
            </div>
          </div>

          {/* Activity Summary */}
          <div className="activity-summary">
            <div className="profile-summary-stats">
              <div className="profile-summary-stat">
                <span className="profile-stat-value">
                  {activitiesSummary.total_activities || 0}
                </span>
                <span className="profile-stat-label">Total Activities</span>
              </div>
              <div className="profile-summary-stat">
                <span className="profile-stat-value">
                  {activitiesSummary.unique_activity_types || 0}
                </span>
                <span className="profile-stat-label">Activity Types</span>
              </div>
              <div className="profile-summary-stat">
                <span className="profile-stat-value">
                  {activitiesSummary.unique_categories || 0}
                </span>
                <span className="profile-stat-label">Categories</span>
              </div>
              {activitiesSummary.last_activity && (
                <div className="profile-summary-stat">
                  <span className="profile-stat-value">
                    {getTimeAgo(activitiesSummary.last_activity)}
                  </span>
                  <span className="profile-stat-label">Last Activity</span>
                </div>
              )}
            </div>
          </div>

          {/* Activity Filters */}
          {filtersOpen && (
            <div className="activity-filters">
              <div className="filter-row">
                <div className="filter-group">
                  <label>Category:</label>
                  <select
                    value={activityFilters.category}
                    onChange={(e) =>
                      handleFilterChange("category", e.target.value)
                    }
                  >
                    <option value="all">All Categories</option>
                    <option value="authentication">Authentication</option>
                    <option value="user_management">User Management</option>
                    <option value="coral_data">Coral Data</option>
                    <option value="image_analysis">Image Analysis</option>
                    <option value="system_admin">System Admin</option>
                    <option value="reports">Reports</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label>Activity Type:</label>
                  <select
                    value={activityFilters.activity_type}
                    onChange={(e) =>
                      handleFilterChange("activity_type", e.target.value)
                    }
                  >
                    <option value="all">All Types</option>
                    <option value="login">Login</option>
                    <option value="logout">Logout</option>
                    <option value="image_upload">Image Upload</option>
                    <option value="coral_analysis">Coral Analysis</option>
                    <option value="user_created">User Created</option>
                    <option value="user_updated">User Updated</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Activity List */}
          <div className="card-body">
            <div className="activities-container">
              {activitiesLoading ? (
                <div className="activities-loading">
                  <div className="loading-spinner"></div>
                  <p>Loading activities...</p>
                </div>
              ) : activities.length === 0 ? (
                <div className="no-activities">
                  <FiActivity size={48} />
                  <h4>No Activities Found</h4>
                  <p>No activities match the current filters.</p>
                </div>
              ) : (
                <div className="activities-list">
                  {activities.map((activity) => (
                    <div key={activity.id} className="activity-item">
                      <div className="activity-left">
                        <div
                          className="activity-icon"
                          style={{
                            backgroundColor:
                              getActivityColor(activity.category) + "20",
                          }}
                        >
                          <span
                            style={{
                              color: getActivityColor(activity.category),
                            }}
                          >
                            {getActivityIcon(
                              activity.activity_type,
                              activity.category
                            )}
                          </span>
                        </div>

                        <div className="activity-content">
                          <div className="activity-header">
                            <h4 className="activity-title">
                              {activity.activity_description}
                            </h4>
                            <span
                              className="activity-category"
                              style={{
                                backgroundColor:
                                  getActivityColor(activity.category) + "15",
                                color: getActivityColor(activity.category),
                              }}
                            >
                              {activity.category?.replace("_", " ")}
                            </span>
                          </div>

                          <div className="activity-meta">
                            <span className="activity-type">
                              {activity.activity_type}
                            </span>
                            <span className="activity-separator">•</span>
                            <span className="activity-ip">
                              IP: {activity.ip_address}
                            </span>
                            {activity.metadata &&
                              Object.keys(activity.metadata).length > 0 && (
                                <>
                                  <span className="activity-separator">•</span>
                                  <span className="activity-metadata">
                                    {Object.keys(activity.metadata).length}{" "}
                                    metadata
                                  </span>
                                </>
                              )}
                          </div>
                        </div>
                      </div>

                      <div className="activity-right">
                        <span className="activity-time">
                          {getTimeAgo(activity.created_at)}
                        </span>
                        <span className="activity-date">
                          {new Date(activity.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {activityPagination.total_pages > 1 && (
                <div className="activities-pagination">
                  <button
                    onClick={() =>
                      handlePageChange(activityPagination.current_page - 1)
                    }
                    disabled={activityPagination.current_page === 1}
                    className="pagination-btn"
                  >
                    Previous
                  </button>

                  <span className="pagination-info">
                    Page {activityPagination.current_page} of{" "}
                    {activityPagination.total_pages}(
                    {activityPagination.total_count} total)
                  </span>

                  <button
                    onClick={() =>
                      handlePageChange(activityPagination.current_page + 1)
                    }
                    disabled={
                      activityPagination.current_page ===
                      activityPagination.total_pages
                    }
                    className="pagination-btn"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="info-card actions-card" style={{ gridArea: "actions" }}>
          <div className="card-header">
            <div className="header-icon actions">
              <FiSettings size={20} />
            </div>
            <div className="header-content">
              <h2>Quick Actions</h2>
              <p>Common administrative tasks</p>
            </div>
          </div>

          <div className="card-body">
            <div className="actions-grid">
              <button onClick={handleEditUser} className="action-btn primary">
                <div className="action-icon">
                  <FiEdit2 size={20} />
                </div>
                <div className="action-content">
                  <h3>Edit Profile</h3>
                  <p>Modify user details</p>
                </div>
              </button>

              <button className="action-btn neutral">
                <div className="action-icon">
                  <FiDownload size={20} />
                </div>
                <div className="action-content">
                  <h3>Export Data</h3>
                  <p>Download user info</p>
                </div>
              </button>

              <button onClick={handleDeleteUser} className="action-btn danger">
                <div className="action-icon">
                  <FiTrash2 size={20} />
                </div>
                <div className="action-content">
                  <h3>Delete User</h3>
                  <p>Remove permanently</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
