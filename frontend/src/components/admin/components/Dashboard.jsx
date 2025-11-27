import React, { useState } from "react"; // Add useState import
import {
  FiUsers,
  FiImage,
  FiActivity,
  FiDatabase,
  FiTrendingUp,
  FiMapPin,
  FiEye,
  FiRefreshCw,
} from "react-icons/fi";
import useDashboardData from "../hooks/useDashboard";
import AnalyticsModal from "./AnalyticsModal"; // Import the AnalyticsModal
import "../styles/adminDashboardStyle.css";

const Dashboard = ({ user, setActiveTab }) => {
  // Add state for analytics modal
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);

  const {
    stats,
    recentUsers,
    recentActivities,
    loading,
    error,
    refreshDashboard,
    formatTimeAgo,
    getActivityIcon,
    getCategoryColor,
  } = useDashboardData();

  const formatLastLogin = (lastLogin) => {
    if (!lastLogin) return "Never";
    const date = new Date(lastLogin);
    return date.toLocaleString();
  };

  const handleViewAllUsers = () => {
    setActiveTab("Manage Users");
  };

  const handleViewAllActivities = () => {
    setActiveTab("Generate Report");
  };

  // Update this function to show the modal
  const handleViewAnalytics = () => {
    setShowAnalyticsModal(true);
  };

  // Function to close the modal
  const handleCloseAnalytics = () => {
    setShowAnalyticsModal(false);
  };

  if (loading) {
    return (
      <div className="content-section">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-section">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Failed to Load Dashboards</h3>
          <p>{error}</p>
          <button className="retry-btn" onClick={refreshDashboard}>
            <FiRefreshCw size={16} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="content-section">
      {/* Welcome Section */}
      <div className="user-greetings">
        <div className="welcome-header">
          <div className="welcome-content">
            <h2 className="report-title">
              Welcome back, {user?.firstname} {user?.lastname} 👋
            </h2>
            <p className="welcome-subtitle">
              Here's what's happening with your coral analysis platform today.
            </p>
          </div>
          <div className="welcome-actions">
            <button
              className="quick-action-btn primary"
              onClick={handleViewAnalytics}
            >
              <FiTrendingUp size={16} />
              View Analytics
            </button>
            <button
              className="quick-action-btn secondary"
              onClick={refreshDashboard}
              title="Refresh Dashboard"
            >
              <FiRefreshCw size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-cards users">
          <div className="stats-icon">
            <FiUsers size={24} />
          </div>
          <div className="stat-info">
            <h3>Active Members</h3>
            <p className="stat-number">{stats.approved_users}</p>
            <span className="stat-trend positive">
              <FiTrendingUp size={12} />+
              {Math.floor(stats.approved_users * 0.12)} this week
            </span>
          </div>
        </div>

        <div className="stat-cards images">
          <div className="stats-icon">
            <FiImage size={24} />
          </div>
          <div className="stat-info">
            <h3>Coral Images</h3>
            <p className="stat-number">{stats.total_images}</p>
            <span className="stat-trend positive">
              <FiTrendingUp size={12} />+{Math.floor(stats.total_images * 0.08)}{" "}
              this month
            </span>
          </div>
        </div>

        <div className="stat-cards analysis">
          <div className="stats-icon">
            <FiActivity size={24} />
          </div>
          <div className="stat-info">
            <h3>Analysis Sessions</h3>
            <p className="stat-number">{stats.analysis_sessions}</p>
            <span className="stat-trend positive">
              <FiTrendingUp size={12} />+
              {Math.floor(stats.analysis_sessions * 0.15)} today
            </span>
          </div>
        </div>

        <div className="stat-cards species">
          <div className="stats-icon">
            <FiDatabase size={24} />
          </div>
          <div className="stat-info">
            <h3>Coral Species</h3>
            <p className="stat-number">{stats.coral_species}</p>
            <span className="stat-trend neutral">
              <FiDatabase size={12} />
              In database
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Recent Users */}
        <div className="dashboard-card recent-users-card">
          <div className="card-header">
            <h3>Recent Members</h3>
            <button
              className="view-all-btn"
              onClick={handleViewAllUsers}
              title="Go to User Management"
            >
              <FiUsers size={14} />
              View All
            </button>
          </div>
          <div className="card-content">
            {recentUsers.length > 0 ? (
              <div className="users-list">
                {recentUsers.map((user) => (
                  <div key={user.id} className="user-item">
                    <div className="dashboard-user-avatar">
                      {user.profile_picture ? (
                        <img
                          src={`/profile_uploads/${user.profile_picture}`}
                          alt={`${user.firstname} ${user.lastname}`}
                        />
                      ) : (
                        <div className="avatar-placeholders">
                          {user.firstname?.[0]}
                          {user.lastname?.[0]}
                        </div>
                      )}
                      <div
                        className={`status-indicators ${formatLastLogin(
                          user?.last_login
                        )}`}
                      ></div>
                    </div>
                    <div className="user-info">
                      <h4>
                        {user.firstname} {user.lastname}
                      </h4>
                      <p>@{user.username}</p>
                      <span className={`role-badge ${user.roletype}`}>
                        {user.roletype}
                      </span>
                    </div>
                    <div className="user-meta">
                      <span className="join-date">
                        {formatTimeAgo(user.created_at)}
                      </span>
                      <span className="institution">{user.institution}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <FiUsers size={48} />
                <p>No recent users</p>
                <button
                  className="empty-action-btn"
                  onClick={handleViewAllUsers}
                >
                  <FiUsers size={16} />
                  Manage Users
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="dashboard-card recent-activities-card">
          <div className="card-header">
            <h3>Recent Activities</h3>
            <button
              className="view-all-btn"
              onClick={handleViewAllActivities}
              title="View All Activities"
            >
              <FiActivity size={14} />
              View All
            </button>
          </div>
          <div className="card-content">
            {recentActivities.length > 0 ? (
              <div className="activities-lisst">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="activity-items">
                    <div
                      className={`activity-icon ${activity.activity_type}`}
                      style={{
                        backgroundColor: getCategoryColor(activity.category),
                        color: "white",
                      }}
                    >
                      <span>{getActivityIcon(activity.activity_type)}</span>
                    </div>
                    <div className="activity-content">
                      <p className="activity-description">
                        {activity.activity_description}
                      </p>
                      <div className="activity-meta">
                        <span className="activity-user">
                          {activity.user_name}
                        </span>
                        <span className="activity-categories">
                          {activity.category?.replace("_", " ")}
                        </span>
                        <span className="activity-times">
                          {formatTimeAgo(activity.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <FiActivity size={48} />
                <p>No recent activities</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats
        <div className="dashboard-card quick-stats-card">
          <div className="card-header">
            <h3>Quick Insights</h3>
            <button
              className="refresh-btn"
              onClick={refreshDashboard}
              title="Refresh Insights"
            >
              <FiRefreshCw size={14} />
            </button>
          </div>
          <div className="card-content">
            <div className="quick-stat trending-up">
              <div className="quick-stat-icon">
                <FiTrendingUp size={20} />
              </div>
              <div className="quick-stat-info">
                <h4>Coral Coverage Trend</h4>
                <p className="trend-positive">
                  +{stats.coral_coverage_change}% this month
                </p>
                <span className="insight-detail">
                  Hard coral coverage improving across {stats.active_sites}{" "}
                  sites
                </span>
              </div>
            </div>

            <div className="quick-stat geographic">
              <div className="quick-stat-icon">
                <FiMapPin size={20} />
              </div>
              <div className="quick-stat-info">
                <h4>Geographic Coverage</h4>
                <p>
                  {stats.regions_covered} regions, {stats.provinces_covered}{" "}
                  provinces
                </p>
                <span className="insight-detail">
                  Latest data from {stats.most_recent_location}
                </span>
              </div>
            </div>

            <div className="quick-stat activity">
              <div className="quick-stat-icon">
                <FiActivity size={20} />
              </div>
              <div className="quick-stat-info">
                <h4>Analysis Quality</h4>
                <p>{stats.avg_confidence}% average AI confidence</p>
                <span className="insight-detail">
                  {stats.high_quality_analyses} high-quality analyses today
                </span>
              </div>
            </div>

            <div className="quick-stat users">
              <div className="quick-stat-icon">
                <FiUsers size={20} />
              </div>
              <div className="quick-stat-info">
                <h4>User Engagement</h4>
                <p>{stats.active_users_today} active users today</p>
                <span className="insight-detail">
                  {stats.peak_hour} was the peak activity hour
                </span>
              </div>
            </div>

            <div className="quick-stat data-quality">
              <div className="quick-stat-icon">
                <FiDatabase size={20} />
              </div>
              <div className="quick-stat-info">
                <h4>Data Quality Score</h4>
                <p className="quality-score">{stats.data_quality_score}/10</p>
                <span className="insight-detail">
                  Based on image quality, coverage, and validation
                </span>
              </div>
            </div>

            <div className="quick-stat system-health">
              <div className="quick-stat-icon">
                <FiEye size={20} />
              </div>
              <div className="quick-stat-info">
                <h4>System Health</h4>
                <p className={`health-status ${stats.system_status}`}>
                  {stats.system_status}
                </p>
                <span className="insight-detail">
                  {stats.processing_queue} items in processing queue
                </span>
              </div>
            </div>
          </div>
        </div> */}
      </div>

      {/* Analytics Modal - Add this at the end */}
      <AnalyticsModal
        isOpen={showAnalyticsModal}
        onClose={handleCloseAnalytics}
      />
    </div>
  );
};

export default Dashboard;
