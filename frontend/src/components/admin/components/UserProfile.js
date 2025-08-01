import { useState, useEffect } from "react";
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
} from "react-icons/fi";
import "../styles/profileStyles.css";
import { decryptId } from "../../../utils/encryption";

function UserProfile() {
  const { userId: encodedUserId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Decode the URL-encoded encrypted ID, then decrypt it
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
    // Decode and decrypt the ID for editing
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
        // Decode and decrypt the ID for deletion
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

  if (loading)
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading user profile...</p>
      </div>
    );

  if (error)
    return (
      <div className="profile-error">
        <div className="error-message">{error}</div>
        <button onClick={handleGoBack} className="btn-back">
          <FiArrowLeft /> Back to User Management
        </button>
      </div>
    );

  if (!user)
    return (
      <div className="profile-not-found">
        <h2>User not found</h2>
        <button onClick={handleGoBack} className="btn-back">
          <FiArrowLeft /> Back to User Management
        </button>
      </div>
    );

  return (
    <div className="user-profile-container">
      {/* Header Section */}
      <header className="profile-header">
        <button onClick={handleGoBack} className="btn-back">
          <FiArrowLeft size={18} />
          <span>Back to User Management</span>
        </button>

        <div className="header-actions">
          <div className="dropdown-container">
            <button onClick={toggleDropdown} className="btn-more">
              <FiMoreVertical size={20} />
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <button onClick={handleEditUser} className="dropdown-item">
                  <FiEdit2 size={16} /> Edit Profile
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="dropdown-item delete"
                >
                  <FiTrash2 size={16} /> Delete User
                </button>
                <button className="dropdown-item">
                  <FiDownload size={16} /> Export Data
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Profile Content */}
      <main className="profile-content">
        {/* Profile Hero Section */}
        <section className="profile-hero">
          <div className="avatar-container">
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
              style={{ display: user.profile_image ? "none" : "flex" }}
            >
              {user.firstname?.charAt(0)?.toUpperCase()}
              {user.lastname?.charAt(0)?.toUpperCase()}
            </div>
          </div>

          <div className="profile-info">
            <h1 className="profile-name">
              {user.firstname} {user.lastname}
              <span className="username">@{user.username}</span>
            </h1>

            <div className="profile-meta">
              <span className={`role-badge ${user.roletype}`}>
                <FiShield size={14} />
                {user.roletype.charAt(0).toUpperCase() + user.roletype.slice(1)}
              </span>

              <div className="meta-item">
                <FiCalendar size={14} />
                <span>
                  Joined{" "}
                  {new Date(user.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                  })}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Profile Details Grid */}
        <section className="profile-grid">
          {/* Personal Information Card */}
          <div className="profile-card">
            <div className="card-header">
              <FiUser size={20} />
              <h2>Personal Information</h2>
            </div>
            <div className="card-body">
              <div className="info-row">
                <span className="info-label">First Name</span>
                <span className="info-value">{user.firstname}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Last Name</span>
                <span className="info-value">{user.lastname}</span>
              </div>
            </div>
          </div>

          {/* Account Information Card */}
          <div className="profile-card">
            <div className="card-header">
              <FiActivity size={20} />
              <h2>Account Information</h2>
            </div>
            <div className="card-body">
              <div className="info-row">
                <span className="info-label">Username</span>
                <span className="info-value">@{user.username}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Account Status</span>
                <span className="info-value status-active">Active</span>
              </div>
              <div className="info-row">
                <span className="info-label">Profile Image</span>
                <span className="info-value">
                  {user.profile_image ? "Uploaded" : "Not set"}
                </span>
              </div>
            </div>
          </div>

          {/* Timeline Card */}
          <div className="profile-card">
            <div className="card-header">
              <FiCalendar size={20} />
              <h2>Account Timeline</h2>
            </div>
            <div className="card-body">
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h3>Account Created</h3>
                  <p>
                    {new Date(user.created_at).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              {user.updated_at && (
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <h3>Last Updated</h3>
                    <p>
                      {new Date(user.updated_at).toLocaleString("en-US", {
                        month: "short",
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
      </main>

      <footer className="profile-footer">
        <div className="footer-text">
          &copy; {new Date().getFullYear()} DeepCoral Portal. All rights
          reserved.
        </div>
      </footer>
    </div>
  );
}

export default UserProfile;
