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
  FiPhone,
  FiEye,
} from "react-icons/fi";
import { decryptId } from "../../../utils/encryption";
import "../styles/userProfileStyles.css";

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
          `http://${process.env.REACT_APP_API_URL}/biologist/users/${decryptedId}`,
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
          `http://${process.env.REACT_APP_API_URL}/csrf-token`,
          {
            withCredentials: true,
          }
        );
        const csrfToken = csrfResponse.data.csrf_token;

        await axios.delete(
          `http://${process.env.REACT_APP_API_URL}/biologist/users/${decryptedId}`,
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
      <div className="userprofile-loading">
        <div className="userprofile-loading-wrapper">
          <div className="userprofile-loading-spinner"></div>
          <div className="userprofile-loading-text">
            <h3>Loading Profile</h3>
            <p>Please wait while we fetch the user details...</p>
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="userprofile-error">
        <div className="userprofile-error-wrapper">
          <div className="userprofile-error-icon">
            <FiUser size={48} />
          </div>
          <h3>Unable to Load Profile</h3>
          <p className="userprofile-error-message">{error}</p>
          <button onClick={handleGoBack} className="userprofile-back-button">
            <FiArrowLeft size={20} />
            <span>Back to User Management</span>
          </button>
        </div>
      </div>
    );

  if (!user)
    return (
      <div className="userprofile-not-found">
        <div className="userprofile-not-found-wrapper">
          <div className="userprofile-not-found-icon">
            <FiUser size={48} />
          </div>
          <h3>User Not Found</h3>
          <p>The requested user profile could not be located.</p>
          <button onClick={handleGoBack} className="userprofile-back-button">
            <FiArrowLeft size={20} />
            <span>Back to User Management</span>
          </button>
        </div>
      </div>
    );

  return (
    <div className="userprofile-container">
      {/* Navigation Header */}
      <div className="userprofile-navigation">
        <button onClick={handleGoBack} className="userprofile-nav-back-button">
          <FiArrowLeft size={18} />
          <span>Back to Users</span>
        </button>

        <div className="userprofile-actions">
          <div className="userprofile-action-dropdown">
            <button
              onClick={toggleDropdown}
              className="userprofile-action-menu-trigger"
            >
              <FiMoreVertical size={20} />
            </button>
            {dropdownOpen && (
              <div className="userprofile-action-dropdown-menu">
                <button
                  onClick={handleEditUser}
                  className="userprofile-dropdown-action userprofile-edit"
                >
                  <FiEdit2 size={16} />
                  <span>Edit Profile</span>
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="userprofile-dropdown-action userprofile-delete"
                >
                  <FiTrash2 size={16} />
                  <span>Delete User</span>
                </button>
                <button className="userprofile-dropdown-action userprofile-download">
                  <FiDownload size={16} />
                  <span>Export Data</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Profile Content */}
      <div className="userprofile-content">
        {/* Profile Header Card */}
        <div className="userprofile-header-card">
          <div className="userprofile-cover-section">
            <div className="userprofile-cover-pattern"></div>
          </div>

          <div className="userprofile-header-content">
            <div className="userprofile-avatar-section">
              <div className="userprofile-avatar-container">
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
                  className="userprofile-avatar-initials"
                  style={{ display: user.profile_image ? "none" : "flex" }}
                >
                  {user.firstname?.charAt(0)?.toUpperCase()}
                  {user.lastname?.charAt(0)?.toUpperCase()}
                </div>
                <div className="userprofile-avatar-status">
                  <div className="userprofile-status-indicator active"></div>
                </div>
              </div>
            </div>

            <div className="userprofile-info-section">
              <div className="userprofile-name-section">
                <h1 className="userprofile-display-name">
                  {user.firstname} {user.lastname}{" "}
                  <span>({user.username})</span>
                </h1>

                <div className="userprofile-biography">{user.bio}</div>
              </div>

              <div className="userprofile-meta-section">
                <div className="userprofile-meta-item">
                  <FiCalendar size={16} />
                  <span>
                    Joined{" "}
                    {new Date(user.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                    })}
                  </span>
                </div>
                <div className="userprofile-meta-item">
                  <FiActivity size={16} />
                  <span>{user.institution}</span>
                </div>
              </div>
            </div>

            <div className="userprofile-role-section">
              <div
                className={`userprofile-role-badge ${user.roletype?.toLowerCase()}`}
              >
                <FiShield size={14} />
                <span>
                  {user.roletype?.charAt(0).toUpperCase() +
                    user.roletype?.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="userprofile-details-grid">
          {/* Personal Information Card */}
          <div className="userprofile-detail-card">
            <div className="userprofile-card-header">
              <div className="userprofile-card-icon personal">
                <FiUser size={20} />
              </div>
              <h3>Personal Information</h3>
            </div>
            <div className="userprofile-card-content">
              <div className="userprofile-detail-item">
                <div className="userprofile-detail-label">
                  <FiUser size={14} />
                  <span>Full Name</span>
                </div>
                <div className="userprofile-detail-value">
                  {user.firstname} {user.lastname}
                </div>
              </div>
              <div className="userprofile-detail-item">
                <div className="userprofile-detail-label">
                  <FiMail size={14} />
                  <span>Username</span>
                </div>
                <div className="userprofile-detail-value">@{user.username}</div>
              </div>
              <div className="userprofile-detail-item">
                <div className="userprofile-detail-label">
                  <FiMail size={14} />
                  <span>Email</span>
                </div>
                <div className="userprofile-detail-value">
                  {user.email || "Not provided"}
                </div>
              </div>
              <div className="userprofile-detail-item">
                <div className="userprofile-detail-label">
                  <FiPhone size={14} />
                  <span>Phone</span>
                </div>
                <div className="userprofile-detail-value">
                  {user.phone || "Not provided"}
                </div>
              </div>
            </div>
          </div>

          {/* Account Status Card */}
          <div className="userprofile-detail-card">
            <div className="userprofile-card-header">
              <div className="userprofile-card-icon security">
                <FiShield size={20} />
              </div>
              <h3>Account Status</h3>
            </div>
            <div className="userprofile-card-content">
              <div className="userprofile-detail-item">
                <div className="userprofile-detail-label">
                  <FiShield size={14} />
                  <span>Role</span>
                </div>
                <div className="userprofile-detail-value">
                  <span
                    className={`userprofile-role-chip ${user.roletype?.toLowerCase()}`}
                  >
                    {user.roletype?.charAt(0).toUpperCase() +
                      user.roletype?.slice(1)}
                  </span>
                </div>
              </div>
              <div className="userprofile-detail-item">
                <div className="userprofile-detail-label">
                  <FiActivity size={14} />
                  <span>Status</span>
                </div>
                <div className="userprofile-detail-value">
                  <span className="userprofile-status-indicator-small active">
                    Active
                  </span>
                </div>
              </div>
              <div className="userprofile-detail-item">
                <div className="userprofile-detail-label">
                  <FiEye size={14} />
                  <span>Profile Image</span>
                </div>
                <div className="userprofile-detail-value">
                  <span
                    className={`userprofile-image-status ${
                      user.profile_image ? "uploaded" : "not-set"
                    }`}
                  >
                    {user.profile_image ? "Uploaded" : "Not Set"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Account Timeline Card */}
          <div className="userprofile-detail-card userprofile-timeline-card">
            <div className="userprofile-card-header">
              <div className="userprofile-card-icon timeline">
                <FiClock size={20} />
              </div>
              <h3>Account Timeline</h3>
            </div>
            <div className="userprofile-card-content">
              <div className="userprofile-timeline">
                <div className="userprofile-timeline-event">
                  <div className="userprofile-event-marker created"></div>
                  <div className="userprofile-event-content">
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
                  <div className="userprofile-timeline-event">
                    <div className="userprofile-event-marker updated"></div>
                    <div className="userprofile-event-content">
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
                <div className="userprofile-timeline-event">
                  <div className="userprofile-event-marker created"></div>
                  <div className="userprofile-event-content">
                    <h4>Last Seen</h4>
                    <p>
                      {new Date(user.last_login).toLocaleString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="userprofile-detail-card userprofile-actions-card">
            <div className="userprofile-card-header">
              <div className="userprofile-card-icon actions">
                <FiActivity size={20} />
              </div>
              <h3>Quick Actions</h3>
            </div>
            <div className="userprofile-card-content">
              <div className="userprofile-quick-actions">
                <button
                  onClick={handleEditUser}
                  className="userprofile-quick-action userprofile-edit-action"
                >
                  <FiEdit2 size={18} />
                  <span>Edit Profile</span>
                </button>
                <button className="userprofile-quick-action userprofile-message-action">
                  <FiMail size={18} />
                  <span>Send Message</span>
                </button>
                <button className="userprofile-quick-action userprofile-export-action">
                  <FiDownload size={18} />
                  <span>Export Data</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BiologistUserProfile;
