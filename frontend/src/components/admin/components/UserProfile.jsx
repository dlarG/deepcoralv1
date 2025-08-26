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
} from "react-icons/fi";
import { decryptId } from "../../../utils/encryption";

function UserProfile({ darkMode }) {
  const { userId: encodedUserId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

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
          `http://localhost:5000/admin/users/${decryptedId}`,
          { withCredentials: true }
        );
        setUser(response.data.user);
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
          "http://localhost:5000/csrf-token",
          {
            withCredentials: true,
          }
        );
        const csrfToken = csrfResponse.data.csrf_token;

        await axios.delete(`http://localhost:5000/admin/users/${decryptedId}`, {
          withCredentials: true,
          headers: {
            "X-CSRF-Token": csrfToken,
          },
        });

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
            <div className="loading-spinner">
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
            </div>
            <h3>Loading Profile</h3>
            <p>Fetching user details...</p>
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
        <div className="hero-background">
          <div className="gradient-overlay"></div>
          <div className="pattern-overlay"></div>
        </div>

        <div className="hero-content">
          <div className="profile-avatar-section">
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
                <div
                  className="avatar-initials"
                  style={{
                    display:
                      user.profile_image && imageLoaded ? "none" : "flex",
                    backgroundColor: getRoleColor(user.roletype),
                  }}
                >
                  {user.firstname?.charAt(0)?.toUpperCase()}
                  {user.lastname?.charAt(0)?.toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          <div className="profile-info">
            <div className="user-identity">
              <h1 className="user-name">
                {user.firstname} {user.lastname}
              </h1>
              <p className="user-handle">@{user.username}</p>
            </div>

            <div className="user-role">
              <div
                className="role-badge"
                style={{ backgroundColor: getRoleColor(user.roletype) }}
              >
                <FiShield size={14} />
                <span>
                  {user.roletype?.charAt(0).toUpperCase() +
                    user.roletype?.slice(1)}
                </span>
              </div>
            </div>

            <div className="user-meta">
              <div className="meta-item">
                <FiCalendar size={16} />
                <span>
                  Joined{" "}
                  {new Date(user.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                  })}
                </span>
              </div>
              <div className="meta-item">
                <FiActivity size={16} />
                <span>
                  Last seen {getTimeAgo(user.updated_at || user.created_at)}
                </span>
              </div>
            </div>
          </div>

          <div className="profile-stats">
            <div className="stat-card">
              <div className="stat-icon">
                <FiUsers size={20} />
              </div>
              <div className="stat-info">
                <h3>Active</h3>
                <p>Status</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <FiStar size={20} />
              </div>
              <div className="stat-info">
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
          <div className="info-card">
            <div className="card-header">
              <div className="header-icon personal">
                <FiUser size={20} />
              </div>
              <div className="header-content">
                <h2>Personal Information</h2>
                <p>Basic account details and information</p>
              </div>
            </div>

            <div className="card-body">
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-label">
                    <FiUser size={16} />
                    <span>Full Name</span>
                  </div>
                  <div className="info-value">
                    <strong>
                      {user.firstname} {user.lastname}
                    </strong>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-label">
                    <FiMail size={16} />
                    <span>Username</span>
                  </div>
                  <div className="info-value">
                    <code>@{user.username}</code>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-label">
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

                <div className="info-item">
                  <div className="info-label">
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
          <div className="info-card">
            <div className="card-header">
              <div className="header-icon timeline">
                <FiClock size={20} />
              </div>
              <div className="header-content">
                <h2>Account Timeline</h2>
                <p>Important account events and milestones</p>
              </div>
            </div>

            <div className="card-body">
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

          {/* Quick Actions Card */}
          <div className="info-card actions-card">
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

                <button
                  onClick={handleDeleteUser}
                  className="action-btn danger"
                >
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

      <style jsx>{`
        .user-profile-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          transition: all 0.3s ease;
        }

        .user-profile-container.dark {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        }

        .profile-header-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .dark .profile-header-nav {
          background: rgba(15, 23, 42, 0.8);
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }

        .nav-back-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-weight: 600;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .nav-back-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .actions-dropdown {
          position: relative;
        }

        .actions-trigger {
          padding: 0.75rem;
          background: rgba(107, 114, 128, 0.1);
          border: none;
          border-radius: 0.5rem;
          color: inherit;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .actions-trigger:hover {
          background: rgba(107, 114, 128, 0.2);
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 0.5rem;
          min-width: 180px;
          background: white;
          border-radius: 0.75rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(0, 0, 0, 0.1);
          overflow: hidden;
          z-index: 50;
        }

        .dark .dropdown-menu {
          background: #1e293b;
          border-color: rgba(255, 255, 255, 0.1);
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          padding: 0.75rem 1rem;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          transition: all 0.3s ease;
          color: inherit;
        }

        .dropdown-item:hover {
          background: rgba(107, 114, 128, 0.1);
        }

        .dropdown-item.delete:hover {
          background: rgba(220, 38, 38, 0.1);
          color: #dc2626;
        }

        .dropdown-divider {
          height: 1px;
          background: rgba(0, 0, 0, 0.1);
          margin: 0.25rem 0;
        }

        .dark .dropdown-divider {
          background: rgba(255, 255, 255, 0.1);
        }

        .profile-hero {
          position: relative;
          padding: 3rem 2rem;
          overflow: hidden;
        }

        .hero-background {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .gradient-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(59, 130, 246, 0.9) 0%,
            rgba(147, 51, 234, 0.9) 100%
          );
        }

        .pattern-overlay {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(
            circle at 1px 1px,
            rgba(255, 255, 255, 0.15) 1px,
            transparent 0
          );
          background-size: 20px 20px;
        }

        .hero-content {
          position: relative;
          z-index: 10;
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 2rem;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
        }

        .avatar-wrapper {
          position: relative;
        }

        .avatar-container {
          position: relative;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          overflow: hidden;
          border: 4px solid white;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .avatar-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-initials {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          font-size: 2rem;
          font-weight: bold;
          color: white;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .avatar-status {
          position: absolute;
          bottom: 8px;
          right: 8px;
          background: white;
          border-radius: 50%;
          padding: 3px;
        }

        .avatar-actions {
          position: absolute;
          top: -10px;
          right: -10px;
        }

        .avatar-action-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
        }

        .avatar-action-btn:hover {
          transform: scale(1.1);
        }

        .profile-info {
          color: white;
        }

        .user-name {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .user-handle {
          font-size: 1.1rem;
          opacity: 0.9;
          margin: 0 0 1rem 0;
        }

        .role-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 2rem;
          color: white;
          font-weight: 600;
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }

        .user-meta {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          opacity: 0.9;
        }

        .profile-stats {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 0.75rem;
          backdrop-filter: blur(10px);
          min-width: 140px;
        }

        .stat-icon {
          color: white;
          opacity: 0.9;
        }

        .stat-info h3 {
          color: white;
          margin: 0;
          font-weight: 600;
        }

        .stat-info p {
          color: white;
          opacity: 0.8;
          margin: 0;
          font-size: 0.875rem;
        }

        .profile-content {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .content-grid .actions-card {
          grid-column: 1 / -1;
        }

        .info-card {
          background: white;
          border-radius: 1rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(0, 0, 0, 0.05);
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .info-card:hover {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .dark .info-card {
          background: #1e293b;
          border-color: rgba(255, 255, 255, 0.1);
        }

        .card-header {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.5rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }

        .dark .card-header {
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }

        .header-icon {
          width: 40px;
          height: 40px;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .header-icon.personal {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        }

        .header-icon.timeline {
          background: linear-gradient(135deg, #10b981, #059669);
        }

        .header-icon.actions {
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
        }

        .header-content h2 {
          margin: 0 0 0.25rem 0;
          font-size: 1.25rem;
          font-weight: 700;
        }

        .header-content p {
          margin: 0;
          opacity: 0.7;
          font-size: 0.875rem;
        }

        .card-body {
          padding: 1.5rem;
        }

        .info-grid {
          display: grid;
          gap: 1.5rem;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: rgba(107, 114, 128, 0.05);
          border-radius: 0.5rem;
          transition: all 0.3s ease;
        }

        .info-item:hover {
          background: rgba(107, 114, 128, 0.1);
        }

        .info-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
          opacity: 0.8;
        }

        .info-value strong {
          font-weight: 600;
        }

        .info-value code {
          background: rgba(107, 114, 128, 0.1);
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-family: "Monaco", "Menlo", monospace;
          font-size: 0.875rem;
        }

        .role-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .status-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .status-chip.success {
          background: rgba(16, 185, 129, 0.15);
          color: #059669;
        }

        .status-chip.neutral {
          background: rgba(107, 114, 128, 0.15);
          color: #6b7280;
        }

        .timeline {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .timeline-item {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .timeline-marker {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .timeline-marker.created {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        }

        .timeline-marker.updated {
          background: linear-gradient(135deg, #10b981, #059669);
        }

        .timeline-marker.current {
          background: linear-gradient(135deg, #f59e0b, #d97706);
        }

        .timeline-content h4 {
          margin: 0 0 0.5rem 0;
          font-weight: 600;
        }

        .timeline-date {
          margin: 0;
          font-weight: 500;
        }

        .timeline-time {
          margin: 0;
          opacity: 0.7;
          font-size: 0.875rem;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 0.75rem;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
        }

        .dark .action-btn {
          background: #334155;
          border-color: rgba(255, 255, 255, 0.1);
        }

        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .action-btn.primary {
          border-color: #3b82f6;
          background: linear-gradient(
            135deg,
            rgba(59, 130, 246, 0.05),
            rgba(29, 78, 216, 0.05)
          );
        }

        .action-btn.primary:hover {
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
        }

        .action-btn.danger {
          border-color: #dc2626;
          background: linear-gradient(
            135deg,
            rgba(220, 38, 38, 0.05),
            rgba(185, 28, 28, 0.05)
          );
        }

        .action-btn.danger:hover {
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2);
        }

        .action-icon {
          width: 40px;
          height: 40px;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .action-btn.primary .action-icon {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        }

        .action-btn.neutral .action-icon {
          background: linear-gradient(135deg, #6b7280, #4b5563);
        }

        .action-btn.danger .action-icon {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
        }

        .action-content h3 {
          margin: 0 0 0.25rem 0;
          font-weight: 600;
        }

        .action-content p {
          margin: 0;
          opacity: 0.7;
          font-size: 0.875rem;
        }

        .profile-loading,
        .profile-error {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
        }

        .loading-content,
        .error-content {
          text-align: center;
          max-width: 400px;
        }

        .loading-spinner {
          position: relative;
          width: 60px;
          height: 60px;
          margin: 0 auto 2rem;
        }

        .spinner-ring {
          position: absolute;
          width: 60px;
          height: 60px;
          border: 3px solid transparent;
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .spinner-ring:nth-child(2) {
          width: 45px;
          height: 45px;
          top: 7.5px;
          left: 7.5px;
          border-top-color: #10b981;
          animation-duration: 0.8s;
          animation-direction: reverse;
        }

        .spinner-ring:nth-child(3) {
          width: 30px;
          height: 30px;
          top: 15px;
          left: 15px;
          border-top-color: #f59e0b;
          animation-duration: 1.2s;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .error-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 2rem;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        @media (max-width: 768px) {
          .hero-content {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 2rem;
          }

          .content-grid {
            grid-template-columns: 1fr;
          }

          .profile-header-nav {
            padding: 1rem;
          }

          .profile-hero {
            padding: 2rem 1rem;
          }

          .profile-content {
            padding: 1rem;
          }

          .user-name {
            font-size: 2rem;
          }

          .actions-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default UserProfile;
