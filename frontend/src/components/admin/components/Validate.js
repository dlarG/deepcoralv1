// src/components/admin/components/Validate.js
import React from "react";
import {
  FiUsers,
  FiImage,
  FiCheck,
  FiX,
  FiClock,
  FiCalendar,
  FiUser,
  FiMail,
  FiShield,
} from "react-icons/fi";
import useValidate from "../hooks/useValidate";

function Validate() {
  const {
    activeFilter,
    setActiveFilter,
    pendingUsers,
    loading,
    actionLoading,
    approveUser,
    rejectUser,
  } = useValidate();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="content-section">
      <div className="user-management-header">
        <div className="header-left">
          <h2 className="content-title">Validation Center</h2>
          <p className="content-subtitle">
            Review and approve pending requests and submissions
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="validation-filters">
        <button
          className={`filter-btn ${activeFilter === "users" ? "active" : ""}`}
          onClick={() => setActiveFilter("users")}
        >
          <FiUsers size={18} />
          Pending Users
          {pendingUsers.length > 0 && (
            <span className="notification-badge">{pendingUsers.length}</span>
          )}
        </button>
        <button
          className={`filter-btn ${activeFilter === "images" ? "active" : ""}`}
          onClick={() => setActiveFilter("images")}
        >
          <FiImage size={18} />
          Image Uploads
          <span className="coming-soon-badge">Coming Soon</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="validation-content">
        {activeFilter === "users" && (
          <div className="pending-users-section">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading pending users...</p>
              </div>
            ) : pendingUsers.length === 0 ? (
              <div className="empty-state">
                <FiUsers size={48} />
                <h3>No Pending Users</h3>
                <p>All user registrations have been processed.</p>
              </div>
            ) : (
              <div className="pending-users-grid">
                {pendingUsers.map((user) => (
                  <div key={user.id} className="pending-user-card">
                    <div className="user-card-header">
                      <div className="user-avatars-section">
                        <div className="user-avatars">
                          {user.profile_image ? (
                            <img
                              src={`/profile_uploads/${user.profile_image}`}
                              alt={`${user.firstname} ${user.lastname}`}
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                            />
                          ) : null}
                          <div
                            className="avatar-initials"
                            style={{
                              display: user.profile_image ? "none" : "flex",
                            }}
                          >
                            {user.firstname?.charAt(0)?.toUpperCase()}
                            {user.lastname?.charAt(0)?.toUpperCase()}
                          </div>
                        </div>
                        <div className="status-indicator pending">
                          <FiClock size={14} />
                          Pending
                        </div>
                      </div>
                      <div className="user-info">
                        <h3 className="user-name">
                          {user.firstname} {user.lastname}
                        </h3>
                        <p className="user-username">@{user.username}</p>
                      </div>
                    </div>

                    <div className="user-details">
                      <div className="detail-row">
                        <FiUser size={16} />
                        <span className="detail-label">Role:</span>
                        <span className={`role-badge ${user.roletype}`}>
                          <FiShield size={12} />
                          {user.roletype.charAt(0).toUpperCase() +
                            user.roletype.slice(1)}
                        </span>
                      </div>
                      <div className="detail-row">
                        <FiCalendar size={16} />
                        <span className="detail-label">Requested:</span>
                        <span className="detail-value">
                          {formatDate(user.created_at)}
                        </span>
                      </div>
                    </div>

                    <div className="user-actions">
                      <button
                        className="action-btn approve"
                        onClick={() => approveUser(user.id)}
                        disabled={actionLoading[user.id]}
                      >
                        {actionLoading[user.id] === "approving" ? (
                          <div className="btn-loading">
                            <div className="spinner"></div>
                            Approving...
                          </div>
                        ) : (
                          <>
                            <FiCheck size={16} />
                            Approve
                          </>
                        )}
                      </button>
                      <button
                        className="action-btn reject"
                        onClick={() => rejectUser(user.id)}
                        disabled={actionLoading[user.id]}
                      >
                        {actionLoading[user.id] === "rejecting" ? (
                          <div className="btn-loading">
                            <div className="spinner"></div>
                            Rejecting...
                          </div>
                        ) : (
                          <>
                            <FiX size={16} />
                            Reject
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeFilter === "images" && (
          <div className="coming-soon-section">
            <div className="coming-soon-content">
              <FiImage size={64} />
              <h3>Image Upload Validation</h3>
              <p>
                This feature will be available once the AI model for automatic
                image cropping and segmentation is integrated.
              </p>
              <div className="feature-list">
                <div className="feature-item">
                  <FiCheck size={16} />
                  <span>Automatic image cropping</span>
                </div>
                <div className="feature-item">
                  <FiCheck size={16} />
                  <span>Coral segmentation</span>
                </div>
                <div className="feature-item">
                  <FiCheck size={16} />
                  <span>Quality validation</span>
                </div>
                <div className="feature-item">
                  <FiCheck size={16} />
                  <span>Manual review and approval</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Validate;
