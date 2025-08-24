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
  FiEye,
} from "react-icons/fi";
import { decryptId } from "../../../utils/encryption";
import "../../admin/styles/profileStyles.css";

function BiologistUserProfile() {
  const { userId: encodedUserId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
          `http://localhost:5000/biologist/users/${decryptedId}`,
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
    navigate("/biologist-dashboard", {
      state: { activeTab: "User" },
    });
  };

  const handleEditUser = () => {
    const decodedEncryptedId = decodeURIComponent(encodedUserId);
    const decryptedId = decryptId(decodedEncryptedId);

    if (decryptedId) {
      navigate("/biologist-dashboard", {
        state: {
          activeTab: "User",
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

        await axios.delete(
          `http://localhost:5000/biologist/users/${decryptedId}`,
          {
            withCredentials: true,
            headers: {
              "X-CSRF-Token": csrfToken,
            },
          }
        );

        alert("User deleted successfully!");
        navigate("/biologist-dashboard", {
          state: { activeTab: "User" },
        });
      } catch (error) {
        console.error("Delete failed:", error);
        alert("Failed to delete user");
      }
    }
  };

  if (loading)
    return (
      <div className="profile-loading-modern">
        <div className="loading-wrapper">
          <div className="loading-spinner-modern"></div>
          <div className="loading-text">
            <h3>Loading Profile</h3>
            <p>Please wait while we fetch the user details...</p>
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="profile-error-modern">
        <div className="error-wrapper">
          <div className="error-icon">
            <FiUser size={48} />
          </div>
          <h3>Unable to Load Profile</h3>
          <p className="error-message">{error}</p>
          <button onClick={handleGoBack} className="back-button-modern">
            <FiArrowLeft size={20} />
            <span>Back to User Management</span>
          </button>
        </div>
      </div>
    );

  if (!user)
    return (
      <div className="profile-not-found-modern">
        <div className="not-found-wrapper">
          <div className="not-found-icon">
            <FiUser size={48} />
          </div>
          <h3>User Not Found</h3>
          <p>The requested user profile could not be located.</p>
          <button onClick={handleGoBack} className="back-button-modern">
            <FiArrowLeft size={20} />
            <span>Back to User Management</span>
          </button>
        </div>
      </div>
    );

  return (
    <div className="user-profile-modern-container">
      {/* Navigation Header */}
      <div className="profile-navigation">
        <button onClick={handleGoBack} className="nav-back-button">
          <FiArrowLeft size={18} />
          <span>Back to Users</span>
        </button>

        <div className="profile-actions">
          <div className="action-dropdown">
            <button onClick={toggleDropdown} className="action-menu-trigger">
              <FiMoreVertical size={20} />
            </button>
            {dropdownOpen && (
              <div className="action-dropdown-menu">
                <button
                  onClick={handleEditUser}
                  className="dropdown-action edit"
                >
                  <FiEdit2 size={16} />
                  <span>Edit Profile</span>
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="dropdown-action delete"
                >
                  <FiTrash2 size={16} />
                  <span>Delete User</span>
                </button>
                <button className="dropdown-action download">
                  <FiDownload size={16} />
                  <span>Export Data</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Header Section */}
      <div className="profile-header-modern">
        <div className="profile-cover">
          <div className="cover-gradient"></div>
          <div className="cover-pattern"></div>
        </div>

        <div className="profile-header-content">
          <div className="profile-avatar-section">
            <div className="avatar-container-modern">
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
                className="avatar-initials-modern"
                style={{ display: user.profile_image ? "none" : "flex" }}
              >
                {user.firstname?.charAt(0)?.toUpperCase()}
                {user.lastname?.charAt(0)?.toUpperCase()}
              </div>
              <div className="avatar-status-ring">
                <div className="status-indicator-modern active"></div>
              </div>
            </div>
          </div>

          <div className="profile-identity">
            <div className="name-section">
              <h1 className="profile-display-name">
                {user.firstname} {user.lastname}
              </h1>
              <p className="profile-handle">@{user.username}</p>
            </div>

            <div className="role-section">
              <div
                className={`role-badge-modern ${user.roletype?.toLowerCase()}`}
              >
                <FiShield size={14} />
                <span>
                  {user.roletype?.charAt(0).toUpperCase() +
                    user.roletype?.slice(1)}
                </span>
              </div>
            </div>
          </div>

          <div className="profile-quick-stats">
            <div className="quick-stat">
              <FiCalendar size={16} />
              <span>
                Joined{" "}
                {new Date(user.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                })}
              </span>
            </div>
            <div className="quick-stat">
              <FiActivity size={16} />
              <span>Active Member</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content Grid */}
      <div className="profile-content-modern">
        <div className="profile-sections-grid">
          {/* Personal Details Section */}
          <section className="profile-section personal-section">
            <div className="section-header">
              <div className="section-icon personal">
                <FiUser size={20} />
              </div>
              <h2>Personal Information</h2>
            </div>
            <div className="section-content">
              <div className="detail-group">
                <div className="detail-item-modern">
                  <div className="detail-label">
                    <FiUser size={14} />
                    <span>Full Name</span>
                  </div>
                  <div className="detail-value">
                    {user.firstname} {user.lastname}
                  </div>
                </div>
                <div className="detail-item-modern">
                  <div className="detail-label">
                    <FiMail size={14} />
                    <span>Username</span>
                  </div>
                  <div className="detail-value">@{user.username}</div>
                </div>
              </div>
            </div>
          </section>

          {/* Account Status Section */}
          <section className="profile-section security-section">
            <div className="section-header">
              <div className="section-icon security">
                <FiShield size={20} />
              </div>
              <h2>Account Status</h2>
            </div>
            <div className="section-content">
              <div className="detail-group">
                <div className="detail-item-modern">
                  <div className="detail-label">
                    <FiShield size={14} />
                    <span>Role</span>
                  </div>
                  <div className="detail-value">
                    <span
                      className={`role-chip-small ${user.roletype?.toLowerCase()}`}
                    >
                      {user.roletype?.charAt(0).toUpperCase() +
                        user.roletype?.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="detail-item-modern">
                  <div className="detail-label">
                    <FiActivity size={14} />
                    <span>Status</span>
                  </div>
                  <div className="detail-value">
                    <span className="status-indicator-small active">
                      Active
                    </span>
                  </div>
                </div>
                <div className="detail-item-modern">
                  <div className="detail-label">
                    <FiEye size={14} />
                    <span>Profile Image</span>
                  </div>
                  <div className="detail-value">
                    <span
                      className={`image-status ${
                        user.profile_image ? "uploaded" : "not-set"
                      }`}
                    >
                      {user.profile_image ? "Uploaded" : "Not Set"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Account Timeline Section */}
          <section className="profile-section timeline-section">
            <div className="section-header">
              <div className="section-icon timeline">
                <FiClock size={20} />
              </div>
              <h2>Account Timeline</h2>
            </div>
            <div className="section-content">
              <div className="timeline-modern">
                <div className="timeline-event">
                  <div className="event-marker created"></div>
                  <div className="event-content">
                    <h4>Account Created</h4>
                    <p>
                      {new Date(user.created_at).toLocaleString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                {user.updated_at && (
                  <div className="timeline-event">
                    <div className="event-marker updated"></div>
                    <div className="event-content">
                      <h4>Last Updated</h4>
                      <p>
                        {new Date(user.updated_at).toLocaleString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default BiologistUserProfile;
