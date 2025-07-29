import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiLogOut,
  FiUsers,
  FiImage,
  FiFileText,
  FiDatabase,
  FiPieChart,
  FiCheckCircle,
  FiHome,
  FiMenu,
  FiX,
  FiUser,
  FiTrash2,
  FiUserPlus,
  FiCheck,
  FiEdit2,
  FiEdit,
  FiTrash,
  FiPlus,
  FiUpload,
  FiEye,
  FiCamera,
  FiSave,
  FiMail,
  FiShield,
  FiCalendar,
  FiLock,
} from "react-icons/fi";
import Logo from "./Logo"; // Import the Logo component
import dayjs from "dayjs"; // Import dayjs for date formatting

function AdminDashboard() {
  const navigate = useNavigate();
  const {
    user,
    loading: authLoading,
    logout,
    updateUser,
    checkAuthStatus,
    fetchCsrfToken,
  } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const { authAxios } = useAuth();

  // State for coral management
  const [coralData, setCoralData] = useState([]);
  const [showCoralModal, setShowCoralModal] = useState(false);
  const [coralModalMode, setCoralModalMode] = useState("add");
  const [currentCoral, setCurrentCoral] = useState(null);
  const [coralFormData, setCoralFormData] = useState({
    coral_type: "",
    coral_subtype: "",
    classification: "",
    scientific_name: "",
    common_name: "",
    identification: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [coralLoading, setCoralLoading] = useState(false);

  // State for user management modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    roletype: "guest",
  });

  // State for profile management
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileFormData, setProfileFormData] = useState({
    username: "",
    firstname: "",
    lastname: "",
    bio: "",
    profile_image: null,
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileTab, setProfileTab] = useState("info"); // "info", "security", "image"

  // Verify authentication status and role when component mounts
  useEffect(() => {
    document.title = "Admin Dashboard | DeepCoral";
    const verifyAuth = async () => {
      await checkAuthStatus();

      // If not authenticated or not admin, redirect to login
      if (!user || user.roletype.toLowerCase() !== "admin") {
        navigate("/login");
      }
    };

    verifyAuth();
  }, [user, checkAuthStatus, navigate]);

  useEffect(() => {
    if (activeTab === "Manage Coral LifeForms") {
      authAxios
        .get("/coral_info")
        .then((response) => {
          console.log("Coral data:", response.data);
          setCoralData(response.data.data || []);
        })
        .catch((err) => {
          console.error("Failed to fetch coral data:", err);
          // Handle 401 by redirecting to login
          if (err.response?.status === 401) {
            navigate("/login");
          }
        });
    }
  }, [activeTab, authAxios, navigate]);

  // Fetch users only if authenticated and admin
  useEffect(() => {
    if (user && user.roletype.toLowerCase() === "admin") {
      const fetchUsers = async () => {
        try {
          const response = await axios.get(
            "http://localhost:5000/admin/users",
            {
              withCredentials: true,
            }
          );
          setUsers(response.data.users);
        } catch (err) {
          setError(err.response?.data?.error || "Failed to fetch users");
          if (err.response?.status === 401 || err.response?.status === 403) {
            // Unauthorized or Forbidden - redirect to login
            logout();
            navigate("/login");
          }
        } finally {
          setLoading(false);
        }
      };

      fetchUsers();
    }
  }, [user, navigate, logout]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const csrfResponse = await axios.get("http://localhost:5000/csrf-token", {
        withCredentials: true,
      });
      const csrfToken = csrfResponse.data.csrf_token;

      const response = await axios.post(
        "http://localhost:5000/admin/users",
        formData,
        {
          withCredentials: true,
          headers: {
            "X-CSRF-Token": csrfToken,
            "Content-Type": "application/json",
          },
        }
      );

      setUsers([...users, response.data.user]);
      setShowCreateModal(false);
      setFormData({
        username: "",
        password: "",
        firstname: "",
        lastname: "",
        roletype: "guest",
      });
      alert("User created successfully");
    } catch (error) {
      console.error("Create failed:", error);
      setError(error.response?.data?.error || "Failed to create user");
    }
  };

  const handleEdit = (user) => {
    setCurrentUser(user);
    setFormData({
      username: user.username,
      password: "",
      firstname: user.firstname,
      lastname: user.lastname,
      roletype: user.roletype,
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const csrfResponse = await axios.get("http://localhost:5000/csrf-token", {
        withCredentials: true,
      });
      const csrfToken = csrfResponse.data.csrf_token;

      const response = await axios.put(
        `http://localhost:5000/admin/users/${currentUser.id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "X-CSRF-Token": csrfToken,
            "Content-Type": "application/json",
          },
        }
      );

      setUsers(
        users.map((u) => (u.id === currentUser.id ? response.data.user : u))
      );
      setShowEditModal(false);
      setCurrentUser(null);
      alert("User updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
      setError(error.response?.data?.error || "Failed to update user");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogout = async () => {
    try {
      // 1. Perform logout
      await logout();

      // 2. Clear any local storage
      localStorage.clear();
      sessionStorage.clear();

      // 3. Force a hard redirect to ensure complete state reset
      window.location.href = "/";

      // 4. Add a small delay to ensure everything clears
      setTimeout(() => {
        window.location.href = "/";
      }, 100);
    } catch (error) {
      console.error("Logout failed:", error);
      window.location.href = "/";
    }
  };

  // Profile management functions
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        alert("Please select a valid image file (JPEG, PNG, or GIF)");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Please select an image smaller than 5MB");
        return;
      }

      setProfileFormData((prev) => ({ ...prev, profile_image: file }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setProfileImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openProfileModal = () => {
    setProfileFormData({
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      bio: user.bio || "",
      profile_image: null,
      current_password: "",
      new_password: "",
      confirm_password: "",
    });

    // Fix the image preview path - use correct path
    setProfileImagePreview(
      user.profile_image ? `/profile_uploads/${user.profile_image}` : null
    );

    setShowProfileModal(true);
    setProfileTab("info");
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
    setProfileFormData({
      username: "",
      firstname: "",
      lastname: "",
      bio: "",
      profile_image: null,
      current_password: "",
      new_password: "",
      confirm_password: "",
    });
    setProfileImagePreview(null);
    setProfileTab("info");
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);

    try {
      // Validate password fields if changing password
      if (profileFormData.new_password) {
        if (!profileFormData.current_password) {
          alert("Current password is required to change password");
          return;
        }
        if (profileFormData.new_password !== profileFormData.confirm_password) {
          alert("New password and confirmation don't match");
          return;
        }
        if (profileFormData.new_password.length < 8) {
          alert("New password must be at least 8 characters");
          return;
        }
      }

      const formData = new FormData();

      // Add basic profile data
      formData.append("username", profileFormData.username);
      formData.append("firstname", profileFormData.firstname);
      formData.append("lastname", profileFormData.lastname);
      formData.append("bio", profileFormData.bio);

      // Add password data if changing
      if (profileFormData.new_password) {
        formData.append("current_password", profileFormData.current_password);
        formData.append("new_password", profileFormData.new_password);
      }

      // Add profile image if selected
      if (profileFormData.profile_image) {
        formData.append("profile_image", profileFormData.profile_image);
      }

      const csrfToken = await fetchCsrfToken();

      const response = await axios.put(
        "http://localhost:5000/profile",
        formData,
        {
          headers: {
            "X-CSRF-Token": csrfToken,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      // Update user context
      updateUser(response.data.user);

      closeProfileModal();
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update failed:", error);
      alert(
        `Failed to update profile: ${
          error.response?.data?.error || error.message
        }`
      );
    } finally {
      setProfileLoading(false);
    }
  };

  const renderProfileManagement = () => (
    <div className="content-section">
      <div className="profile-management-header">
        <h2 className="content-title">Profile Management</h2>
        <button className="edit-profile-btn" onClick={openProfileModal}>
          <FiEdit2 size={20} />
          Edit Profile
        </button>
      </div>

      <div className="profile-dashboard">
        <div className="profile-card">
          <div className="profile-card-header">
            <div className="profile-avatar-section">
              <div className="profile-avatar-large">
                {user.profile_image ? (
                  <img
                    src={`/profile_uploads/${user.profile_image}`}
                    alt={`${user.firstname} ${user.lastname}`}
                    onError={(e) => {
                      console.log("Image failed to load:", e.target.src);
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className="avatar-fallback"
                  style={{ display: user.profile_image ? "none" : "flex" }}
                >
                  {user.firstname?.charAt(0)}
                  {user.lastname?.charAt(0)}
                </div>
              </div>
              <div className="profile-status">
                <span
                  className={`status-badge ${user.roletype?.toLowerCase()}`}
                >
                  {user.roletype?.charAt(0).toUpperCase() +
                    user.roletype?.slice(1)}
                </span>
              </div>
            </div>

            <div className="profile-info-section">
              <h3 className="profile-name">
                {user.firstname} {user.lastname}
              </h3>
              <p className="profile-username">@{user.username}</p>
              <p className="profile-bio">
                {user.bio || "No biography provided"}
              </p>
            </div>
          </div>

          {/* Rest of the profile card remains the same */}
          <div className="profile-details-grid">
            <div className="detail-card">
              <div className="detail-icon">
                <FiUser size={24} />
              </div>
              <div className="detail-content">
                <h4>Full Name</h4>
                <p>
                  {user.firstname} {user.lastname}
                </p>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-icon">
                <FiMail size={24} />
              </div>
              <div className="detail-content">
                <h4>Username</h4>
                <p>{user.username}</p>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-icon">
                <FiShield size={24} />
              </div>
              <div className="detail-content">
                <h4>Role</h4>
                <p>
                  {user.roletype?.charAt(0).toUpperCase() +
                    user.roletype?.slice(1)}
                </p>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-icon">
                <FiCalendar size={24} />
              </div>
              <div className="detail-content">
                <h4>Member Since</h4>
                <p>
                  {user.created_at
                    ? dayjs(user.created_at).format("MMMM D, YYYY")
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="profile-actions-section">
            <div className="action-buttons">
              <button className="action-btn primary" onClick={openProfileModal}>
                <FiEdit2 size={16} />
                Edit Profile
              </button>
              <button
                className="action-btn danger"
                onClick={handleDeleteProfile}
              >
                <FiTrash2 size={16} />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {showProfileModal && renderProfileModal()}
    </div>
  );

  const renderProfileModal = () => (
    <div className="modal-overlay">
      <div className="profile-modal">
        <div className="profile-modal-header">
          <h3>Edit Profile</h3>
          <button className="close-btn" onClick={closeProfileModal}>
            <FiX size={24} />
          </button>
        </div>

        <div className="profile-modal-tabs">
          <button
            className={`tab-btn ${profileTab === "info" ? "active" : ""}`}
            onClick={() => setProfileTab("info")}
          >
            <FiUser size={16} />
            Personal Info
          </button>
          <button
            className={`tab-btn ${profileTab === "image" ? "active" : ""}`}
            onClick={() => setProfileTab("image")}
          >
            <FiCamera size={16} />
            Profile Picture
          </button>
          <button
            className={`tab-btn ${profileTab === "security" ? "active" : ""}`}
            onClick={() => setProfileTab("security")}
          >
            <FiLock size={16} />
            Security
          </button>
        </div>

        <form onSubmit={handleProfileSubmit}>
          <div className="profile-modal-body">
            {profileTab === "info" && (
              <div className="tab-content">
                <div className="form-row">
                  <div className="form-group">
                    <label>Username *</label>
                    <input
                      type="text"
                      name="username"
                      value={profileFormData.username}
                      onChange={handleProfileInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      name="firstname"
                      value={profileFormData.firstname}
                      onChange={handleProfileInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      name="lastname"
                      value={profileFormData.lastname}
                      onChange={handleProfileInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Biography</label>
                  <textarea
                    name="bio"
                    value={profileFormData.bio}
                    onChange={handleProfileInputChange}
                    rows="4"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
            )}

            {profileTab === "image" && (
              <div className="tab-content">
                <div className="profile-image-section">
                  <div className="current-image">
                    <div className="image-container">
                      {profileImagePreview ? (
                        <img src={profileImagePreview} alt="Profile" />
                      ) : (
                        <div className="image-placeholder">
                          <FiUser size={48} />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="image-upload-section">
                    <div className="upload-container">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfileImageChange}
                        className="file-input"
                        id="profile-image"
                      />
                      <label htmlFor="profile-image" className="upload-button">
                        <FiUpload size={20} />
                        Choose New Photo
                      </label>
                      <p className="upload-hint">
                        Recommended: Square image, at least 200x200px
                        <br />
                        Max file size: 5MB (JPEG, PNG, GIF)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {profileTab === "security" && (
              <div className="tab-content">
                <div className="security-info">
                  <h4>Change Password</h4>
                  <p>
                    Leave password fields empty if you don't want to change your
                    password.
                  </p>
                </div>

                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    name="current_password"
                    value={profileFormData.current_password}
                    onChange={handleProfileInputChange}
                    placeholder="Enter your current password"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>New Password</label>
                    <input
                      type="password"
                      name="new_password"
                      value={profileFormData.new_password}
                      onChange={handleProfileInputChange}
                      placeholder="Enter new password (min 8 characters)"
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      name="confirm_password"
                      value={profileFormData.confirm_password}
                      onChange={handleProfileInputChange}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="profile-modal-actions">
            <button
              type="button"
              onClick={closeProfileModal}
              className="cancel-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="save-btn"
              disabled={profileLoading}
            >
              <FiSave size={16} />
              {profileLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        // Get fresh CSRF token for important operations
        const csrfResponse = await axios.get(
          "http://localhost:5000/csrf-token",
          {
            withCredentials: true,
          }
        );
        const csrfToken = csrfResponse.data.csrf_token;

        await axios.delete(`http://localhost:5000/admin/users/${userId}`, {
          withCredentials: true,
          headers: {
            "X-CSRF-Token": csrfToken,
          },
        });
        // Refresh users after deletion
        setUsers(users.filter((user) => user.id !== userId));
        alert("User deleted successfully!");
      } catch (error) {
        console.error("Delete failed:", error);
        setError("Failed to delete user");
        if (error.response?.status === 401 || error.response?.status === 403) {
          logout();
          navigate("/login");
        }
      }
    }
  };

  const handleDeleteProfile = async () => {
    if (
      window.confirm(
        "⚠️ Warning: This action cannot be undone. Are you sure you want to delete your account?"
      )
    ) {
      try {
        // Get CSRF token
        const csrfResponse = await axios.get(
          "http://localhost:5000/csrf-token",
          {
            withCredentials: true,
          }
        );
        const csrfToken = csrfResponse.data.csrf_token;
        await axios.delete(`http://localhost:5000/admin/users/${user.id}`, {
          withCredentials: true,
          headers: {
            "X-CSRF-Token": csrfToken,
            "Content-Type": "application/json",
          },
        });

        // Clear auth state and redirect
        logout();
        navigate("/login");
      } catch (error) {
        console.error("Profile deletion failed:", error);
        setError(error.response?.data?.error || "Failed to delete profile");
      }
    }
  };

  // Coral management functions
  const handleCoralImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoralFormData((prev) => ({ ...prev, image: file }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };
  const handleCoralInputChange = (e) => {
    const { name, value } = e.target;
    setCoralFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openCoralModal = (mode, coral = null) => {
    setCoralModalMode(mode);
    setCurrentCoral(coral);

    if (mode === "add") {
      setCoralFormData({
        coral_type: "",
        coral_subtype: "",
        classification: "",
        scientific_name: "",
        common_name: "",
        identification: "",
        image: null,
      });
      setImagePreview(null);
    } else if (mode === "edit" && coral) {
      setCoralFormData({
        coral_type: coral.coral_type,
        coral_subtype: coral.coral_subtype,
        classification: coral.classification,
        scientific_name: coral.scientific_name,
        common_name: coral.common_name,
        identification: coral.identification,
        image: null,
      });
      setImagePreview(
        coral.image ? `/uploaded_coral_information/${coral.image}` : null
      );
    }

    setShowCoralModal(true);
  };

  const closeCoralModal = () => {
    setShowCoralModal(false);
    setCurrentCoral(null);
    setCoralFormData({
      coral_type: "",
      coral_subtype: "",
      classification: "",
      scientific_name: "",
      common_name: "",
      identification: "",
      image: null,
    });
    setImagePreview(null);
  };

  const handleCoralSubmit = async (e) => {
    e.preventDefault();
    setCoralLoading(true);

    try {
      const formData = new FormData();
      Object.keys(coralFormData).forEach((key) => {
        if (coralFormData[key] !== null && coralFormData[key] !== "") {
          formData.append(key, coralFormData[key]);
        }
      });

      const csrfToken = await fetchCsrfToken();

      let response;
      if (coralModalMode === "add") {
        response = await axios.post(
          "http://localhost:5000/admin/corals",
          formData,
          {
            headers: {
              "X-CSRF-Token": csrfToken,
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
        setCoralData((prev) => [...prev, response.data.coral]);
      } else if (coralModalMode === "edit") {
        response = await axios.put(
          `http://localhost:5000/admin/corals/${currentCoral.id}`,
          formData,
          {
            headers: {
              "X-CSRF-Token": csrfToken,
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
        setCoralData((prev) =>
          prev.map((c) => (c.id === currentCoral.id ? response.data.coral : c))
        );
      }

      closeCoralModal();
      alert(
        `Coral ${coralModalMode === "add" ? "added" : "updated"} successfully!`
      );
    } catch (error) {
      console.error("Coral operation failed:", error);
      alert(
        `Failed to ${coralModalMode} coral: ${
          error.response?.data?.error || error.message
        }`
      );
    } finally {
      setCoralLoading(false);
    }
  };

  const handleDeleteCoral = async (coralId) => {
    if (
      !window.confirm("Are you sure you want to delete this coral information?")
    )
      return;

    try {
      const csrfToken = await fetchCsrfToken();
      await axios.delete(`http://localhost:5000/admin/corals/${coralId}`, {
        headers: { "X-CSRF-Token": csrfToken },
        withCredentials: true,
      });

      setCoralData((prev) => prev.filter((c) => c.id !== coralId));
      alert("Coral deleted successfully!");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete coral");
    }
  };

  const renderCoralModal = () => (
    <div className="modal-overlay">
      <div className="coral-modal">
        <div className="coral-modal-header">
          <h3>
            {coralModalMode === "add"
              ? "Add New Coral"
              : coralModalMode === "edit"
              ? "Edit Coral"
              : "View Coral"}
          </h3>
          <button className="close-btn" onClick={closeCoralModal}>
            <FiX size={24} />
          </button>
        </div>

        <div className="coral-modal-body">
          {coralModalMode === "view" ? (
            <div className="coral-view">
              <div className="coral-view-image">
                <img
                  src={
                    currentCoral?.image
                      ? `/uploaded_coral_information/${currentCoral.image}`
                      : "/default-coral.jpg"
                  }
                  alt={currentCoral?.common_name}
                />
              </div>
              <div className="coral-view-info">
                <h2>{currentCoral?.common_name}</h2>
                <p className="scientific-name">
                  {currentCoral?.scientific_name}
                </p>
                <div className="coral-details">
                  <div className="detail-item">
                    <span className="label">Type:</span>
                    <span className="value">{currentCoral?.coral_type}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Subtype:</span>
                    <span className="value">{currentCoral?.coral_subtype}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Classification:</span>
                    <span className="value">{currentCoral.classification}</span>
                  </div>
                </div>
                <div className="identification">
                  <h4>Identification:</h4>
                  <p>{currentCoral?.identification}</p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCoralSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Coral Type *</label>
                  <input
                    type="text"
                    name="coral_type"
                    value={coralFormData.coral_type}
                    onChange={handleCoralInputChange}
                    required
                    placeholder="e.g., Hard Coral, Soft Coral"
                  />
                </div>
                <div className="form-group">
                  <label>Coral Subtype *</label>
                  <input
                    type="text"
                    name="coral_subtype"
                    value={coralFormData.coral_subtype}
                    onChange={handleCoralInputChange}
                    required
                    placeholder="e.g., Branching, Massive"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Classification *</label>
                  <select
                    name="classification"
                    value={coralFormData.classification}
                    onChange={handleCoralInputChange}
                    required
                  >
                    <option value="">Select Classification</option>
                    <option value="hard coral">Hard Coral</option>
                    <option value="soft coral">Soft Coral</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Common Name *</label>
                  <input
                    type="text"
                    name="common_name"
                    value={coralFormData.common_name}
                    onChange={handleCoralInputChange}
                    required
                    placeholder="e.g., Staghorn Coral"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Scientific Name *</label>
                <input
                  type="text"
                  name="scientific_name"
                  value={coralFormData.scientific_name}
                  onChange={handleCoralInputChange}
                  required
                  placeholder="e.g., Acropora cervicornis"
                />
              </div>

              <div className="form-group">
                <label>
                  Coral Image {coralModalMode === "add" ? "*" : "(optional)"}
                </label>
                <div className="image-upload-container">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoralImageChange}
                    className="file-input"
                    id="coral-image"
                    required={coralModalMode === "add"}
                  />
                  <label htmlFor="coral-image" className="file-label">
                    <FiUpload size={20} />
                    Choose Image
                  </label>
                  {imagePreview && (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Preview" />
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label for="identification">
                  Identification & Description *
                </label>
                <textarea
                  name="identification"
                  id="identification"
                  value={coralFormData.identification}
                  onChange={handleCoralInputChange}
                  required
                  rows="4"
                  placeholder="Describe the coral's appearance, habitat, and identifying features..."
                />
              </div>

              <div className="coral-modal-actions">
                <button
                  type="button"
                  onClick={closeCoralModal}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={coralLoading}
                >
                  {coralLoading
                    ? "Saving..."
                    : coralModalMode === "add"
                    ? "Add Coral"
                    : "Update Coral"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  const renderCoralManagement = () => (
    <div className="content-section">
      <div className="coral-management-header">
        <h2 className="content-title">Coral Information Management</h2>
        <button className="add-coral-btn" onClick={() => openCoralModal("add")}>
          <FiPlus size={20} />
          Add New Coral
        </button>
      </div>

      <div className="coral-grid-container">
        {coralData.length === 0 ? (
          <div className="empty-state">
            <FiDatabase size={48} />
            <h3>No Coral Information</h3>
            <p>Start by adding your first coral information entry.</p>
            <button
              className="add-coral-btn"
              onClick={() => openCoralModal("add")}
            >
              <FiPlus size={20} />
              Add Coral
            </button>
          </div>
        ) : (
          <div className="coral-grid">
            {coralData.map((coral) => (
              <div key={coral.id} className="coral-management-card">
                <div className="coral-card-image">
                  <img
                    src={
                      coral.image
                        ? `/uploaded_coral_information/${coral.image}`
                        : "/default-coral.jpg"
                    }
                    alt={coral.common_name}
                    onError={(e) => {
                      e.target.src = "/default-coral.jpg";
                    }}
                  />
                  <div className="coral-card-overlay">
                    <button
                      className="overlay-btn view"
                      onClick={() => openCoralModal("view", coral)}
                      title="View Details"
                    >
                      <FiEye size={18} />
                    </button>
                    <button
                      className="overlay-btn edit"
                      onClick={() => openCoralModal("edit", coral)}
                      title="Edit"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      className="overlay-btn delete"
                      onClick={() => handleDeleteCoral(coral.id)}
                      title="Delete"
                    >
                      <FiTrash size={18} />
                    </button>
                  </div>
                </div>

                <div className="coral-card-content">
                  <div className="coral-card-header">
                    <h3 className="coral-card-title">{coral.common_name}</h3>
                    <span
                      className={`classification-badge ${coral.classification.replace(
                        " ",
                        "-"
                      )}`}
                    >
                      {coral.classification}
                    </span>
                  </div>

                  <p className="coral-card-scientific">
                    {coral.scientific_name}
                  </p>

                  <div className="coral-card-info">
                    <span className="info-item">
                      <strong>Type:</strong> {coral.coral_type}
                    </span>
                    <span className="info-item">
                      <strong>Subtype:</strong> {coral.coral_subtype}
                    </span>
                  </div>

                  <p className="coral-card-description">
                    {coral.identification.length > 100
                      ? `${coral.identification.substring(0, 100)}...`
                      : coral.identification}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCoralModal && renderCoralModal()}
    </div>
  );

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!user || user.roletype.toLowerCase() !== "admin") {
    return null; // Will be redirected by the useEffect
  }

  const renderContent = () => {
    switch (activeTab) {
      case "Profile Management":
        return renderProfileManagement();
      case "Manage Users":
        return (
          <div className="content-section">
            <>
              {/* Create User Modal */}
              {showCreateModal && (
                <div className="modal-overlay">
                  <div className="modal">
                    <div className="modal-header">
                      <h3>Create New User</h3>
                      <button onClick={() => setShowCreateModal(false)}>
                        <FiX size={20} />
                      </button>
                    </div>
                    <form onSubmit={handleCreate}>
                      <div className="form-group">
                        <label>Username</label>
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Password</label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>First Name</label>
                        <input
                          type="text"
                          name="firstname"
                          value={formData.firstname}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Last Name</label>
                        <input
                          type="text"
                          name="lastname"
                          value={formData.lastname}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Role</label>
                        <select
                          name="roletype"
                          value={formData.roletype}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="guest">Guest</option>
                          <option value="biologist">Biologist</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                      <div className="modal-actions">
                        <button
                          type="button"
                          onClick={() => setShowCreateModal(false)}
                        >
                          Cancel
                        </button>
                        <button type="submit" className="primary">
                          Create User
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
              {/* Edit User Modal */}
              {showEditModal && currentUser && (
                <div className="modal-overlay">
                  <div className="modal">
                    <div className="modal-header">
                      <h3>Edit User</h3>
                      <button onClick={() => setShowEditModal(false)}>
                        <FiX size={20} />
                      </button>
                    </div>
                    <form onSubmit={handleUpdate}>
                      <div className="form-group">
                        <label>Username</label>
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Password (leave blank to keep current)</label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>First Name</label>
                        <input
                          type="text"
                          name="firstname"
                          value={formData.firstname}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Last Name</label>
                        <input
                          type="text"
                          name="lastname"
                          value={formData.lastname}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Role</label>
                        <select
                          name="roletype"
                          value={formData.roletype}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="guest">Guest</option>
                          <option value="biologist">Biologist</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                      <div className="modal-actions">
                        <button
                          type="button"
                          onClick={() => setShowEditModal(false)}
                        >
                          Cancel
                        </button>
                        <button type="submit" className="primary">
                          Update User
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
              <h2 className="content-title">User Management</h2>
              {loading ? (
                <div className="loading">Loading users...</div>
              ) : error ? (
                <div className="error-message">Error: {error}</div>
              ) : (
                <div className="users-content">
                  <div className="content-header">
                    <button
                      className="add-button"
                      onClick={() => setShowCreateModal(true)}
                    >
                      <FiUserPlus className="button-icon" />
                      Add User
                    </button>
                  </div>
                  <br />

                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Username</th>
                          <th>Name</th>
                          <th>Role</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>
                              {user.firstname} {user.lastname}
                            </td>
                            <td>
                              <span
                                className={`role-badge ${user.roletype.toLowerCase()}`}
                              >
                                {user.roletype.charAt(0).toUpperCase() +
                                  user.roletype.slice(1).toLowerCase()}
                              </span>
                            </td>
                            <td>
                              <button
                                className="action-button edit"
                                onClick={() => handleEdit(user)}
                              >
                                <FiEdit2 size={16} />
                              </button>
                              <button
                                className="action-button delete"
                                onClick={() => handleDelete(user.id)}
                              >
                                <FiTrash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          </div>
        );

      case "Add Images":
        return (
          <div className="images-content">
            Image Upload Interface Coming Soon
          </div>
        );
      case "Generate Report":
        return (
          <div className="report-content">Report Generation Coming Soon</div>
        );
      case "Manage Coral LifeForms":
        return renderCoralManagement();
      case "Coral Distribution":
        return (
          <div className="distribution-content">
            Distribution Analysis Coming Soon
          </div>
        );
      case "Validate":
        return (
          <div className="validate-content">
            Validation Interface Coming Soon
          </div>
        );
      case "Dashboard":
      default:
        return (
          <div className="dashboard-content">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon users">
                  <FiUsers size={24} />
                </div>
                <div className="stat-info">
                  <h3>Total Users</h3>
                  <p>24</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon images">
                  <FiImage size={24} />
                </div>
                <div className="stat-info">
                  <h3>Coral Images</h3>
                  <p>156</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon reports">
                  <FiFileText size={24} />
                </div>
                <div className="stat-info">
                  <h3>Reports Generated</h3>
                  <p>42</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon species">
                  <FiDatabase size={24} />
                </div>
                <div className="stat-info">
                  <h3>Coral Species</h3>
                  <p>18</p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Top Navigation Bar */}
      <nav className="top-nav">
        <div className="nav-container">
          <div className="nav-brand">
            <button
              className="menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle menu"
            >
              {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
            <div className="logo-container">
              <Logo variant="navbar" type="image" theme="light" />
              <span className="portal-tag">Admin</span>
            </div>
          </div>

          <div className="user-actions">
            <div className="user-profile">
              <div className="user-avatar">
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
                  className="avatar-text"
                  style={{ display: user.profile_image ? "none" : "flex" }}
                >
                  {user.firstname?.charAt(0)}
                  {user.lastname?.charAt(0)}
                </div>
              </div>
              <div className="user-info">
                <span className="user-name">
                  {user.firstname} {user.lastname}
                </span>
                <span className="user-role">Administrator</span>
              </div>
            </div>
            <button className="logout-button" onClick={handleLogout}>
              <FiLogOut className="logout-icon" />
            </button>
          </div>
        </div>
      </nav>

      <div className="dashboard-container">
        {/* Sidebar Navigation */}
        <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
          <div className="sidebar-header">
            <h3 className="sidebar-title">Navigation</h3>
          </div>

          <nav className="sidebar-nav">
            <ul>
              <li
                className={activeTab === "Dashboard" ? "active" : ""}
                onClick={() => setActiveTab("Dashboard")}
              >
                <div className="nav-item-content">
                  <FiHome className="nav-icon" />
                  <span className="nav-text">Dashboard</span>
                </div>
                <div className="active-indicator"></div>
              </li>
              <li
                className={activeTab === "Manage Users" ? "active" : ""}
                onClick={() => setActiveTab("Manage Users")}
              >
                <div className="nav-item-content">
                  <FiUsers className="nav-icon" />
                  <span className="nav-text">Manage Users</span>
                </div>
                <div className="active-indicator"></div>
              </li>
              <li
                className={activeTab === "Add Images" ? "active" : ""}
                onClick={() => setActiveTab("Add Images")}
              >
                <div className="nav-item-content">
                  <FiImage className="nav-icon" />
                  <span className="nav-text">Add Images</span>
                </div>
                <div className="active-indicator"></div>
              </li>
              <li
                className={activeTab === "Generate Report" ? "active" : ""}
                onClick={() => setActiveTab("Generate Report")}
              >
                <div className="nav-item-content">
                  <FiFileText className="nav-icon" />
                  <span className="nav-text">Generate Report</span>
                </div>
                <div className="active-indicator"></div>
              </li>
              <li
                className={
                  activeTab === "Manage Coral LifeForms" ? "active" : ""
                }
                onClick={() => setActiveTab("Manage Coral LifeForms")}
              >
                <div className="nav-item-content">
                  <FiDatabase className="nav-icon" />
                  <span className="nav-text">Manage LifeForms</span>
                </div>
                <div className="active-indicator"></div>
              </li>
              <li
                className={activeTab === "Coral Distribution" ? "active" : ""}
                onClick={() => setActiveTab("Coral Distribution")}
              >
                <div className="nav-item-content">
                  <FiPieChart className="nav-icon" />
                  <span className="nav-text">Distribution</span>
                </div>
                <div className="active-indicator"></div>
              </li>
              <li
                className={activeTab === "Validate" ? "active" : ""}
                onClick={() => setActiveTab("Validate")}
              >
                <div className="nav-item-content">
                  <FiCheckCircle className="nav-icon" />
                  <span className="nav-text">Validate</span>
                </div>
                <div className="active-indicator"></div>
              </li>
              <li
                className={activeTab === "Profile Management" ? "active" : ""}
                onClick={() => setActiveTab("Profile Management")}
              >
                <div className="nav-item-content">
                  <FiUser className="nav-icon" />
                  <span className="nav-text">Profile Management</span>
                </div>
                <div className="active-indicator"></div>
              </li>
            </ul>
          </nav>

          <div className="sidebar-footer">
            <div className="app-version">v2.4.1</div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="main-content">{renderContent()}</main>
      </div>

      {/* CSS Styles */}
      <style jsx>{`


      /* Coral Management Styles */
        .coral-management-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .add-coral-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: #0284c7;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .add-coral-btn:hover {
          background: #0369a1;
          transform: translateY(-1px);
        }

        .coral-grid-container {
          width: 100%;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #64748b;
        }

        .empty-state svg {
          color: #94a3b8;
          margin-bottom: 1rem;
        }

        .empty-state h3 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          color: #475569;
        }

        .empty-state p {
          margin-bottom: 2rem;
        }

        .coral-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .coral-management-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .coral-management-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .coral-card-image {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .coral-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .coral-management-card:hover .coral-card-image img {
          transform: scale(1.05);
        }

        .coral-card-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .coral-management-card:hover .coral-card-overlay {
          opacity: 1;
        }

        .overlay-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .overlay-btn.view {
          background: #0284c7;
          color: white;
        }

        .overlay-btn.edit {
          background: #059669;
          color: white;
        }

        .overlay-btn.delete {
          background: #dc2626;
          color: white;
        }

        .overlay-btn:hover {
          transform: scale(1.1);
        }

        .coral-card-content {
          padding: 1.5rem;
        }

        .coral-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.5rem;
        }

        .coral-card-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
          flex: 1;
        }

        .classification-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: capitalize;
        }

        .classification-badge.hard-coral {
          background: #dbeafe;
          color: #1e40af;
        }

        .classification-badge.soft-coral {
          background: #dcfce7;
          color: #166534;
        }

        .coral-card-scientific {
          font-style: italic;
          color: #0284c7;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }

        .coral-card-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          margin-bottom: 1rem;
        }

        .info-item {
          font-size: 0.875rem;
          color: #475569;
        }

        .coral-card-description {
          color: #64748b;
          line-height: 1.5;
          font-size: 0.875rem;
        }
          /* Modal Styles */
        .coral-modal {
          background: white;
          border-radius: 16px;
          width: 90vw;
          max-width: 800px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .coral-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .coral-modal-header h3 {
          margin: 0;
          font-size: 1.5rem;
          color: #1e293b;
        }

        .close-btn {
          background: transparent;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .close-btn:hover {
          background: #f1f5f9;
          color: #475569;
        }

        .coral-modal-body {
          padding: 1.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #374151;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 0.875rem;
          transition: border-color 0.2s;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #0284c7;
          box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1);
        }

        .image-upload-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .file-input {
          display: none;
        }

        .file-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: #f8fafc;
          border: 2px dashed #cbd5e1;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          justify-content: center;
          color: #64748b;
          font-weight: 500;
        }

        .file-label:hover {
          background: #f1f5f9;
          border-color: #94a3b8;
        }

        .image-preview {
          width: 100%;
          max-width: 200px;
          height: 150px;
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }

        .image-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .coral-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid #e2e8f0;
        }

        .cancel-btn {
          padding: 0.75rem 1.5rem;
          border: 1px solid #d1d5db;
          background: white;
          color: #374151;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .cancel-btn:hover {
          background: #f9fafb;
        }

        .submit-btn {
          padding: 0.75rem 1.5rem;
          background: #0284c7;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .submit-btn:hover:not(:disabled) {
          background: #0369a1;
        }

        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* View Mode Styles */
        .coral-view {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 2rem;
        }

        .coral-view-image {
          width: 100%;
          height: 300px;
          border-radius: 8px;
          overflow: hidden;
        }

        .coral-view-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .coral-view-info h2 {
          margin: 0 0 0.5rem 0;
          color: #1e293b;
        }

        .scientific-name {
          font-style: italic;
          color: #0284c7;
          margin-bottom: 1.5rem;
        }

        .coral-details {
          display: grid;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .detail-item {
          display: flex;
          gap: 0.5rem;
        }

        .detail-item .label {
          font-weight: 600;
          color: #374151;
          min-width: 100px;
        }

        .detail-item .value {
          color: #64748b;
        }

        .identification h4 {
          margin: 0 0 0.5rem 0;
          color: #374151;
        }

        .identification p {
          line-height: 1.6;
          color: #64748b;
        }

        @media (max-width: 768px) {
          .coral-grid {
            grid-template-columns: 1fr;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .coral-view {
            grid-template-columns: 1fr;
          }

          .coral-management-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }
        }

      
      .profile-info .created {
        font-size: 0.8rem;
      }
      
       @media (max-width: 1024px) {
        .coral-grid:not(.sidebar-collapsed),
        .coral-grid.sidebar-collapsed {
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        }
      }

      @media (max-width: 768px) {
        
        .info-cards-container {
          grid-template-columns: 1fr;
        }
        .main-content {
          margin-left: 0;
        }
        .coral-grid {
          grid-template-columns: 1fr;
        }
      }
        .admin-dashboard {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
          background-color: #f8fafc;
        }

        .content-title {
          color: #1e293b;
          font-size: 1.75rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }
        .top-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          background: white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          border-bottom: 1px solid #e2e8f0;
        }
        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 2rem;
          height: 70px;
          max-width: 100%;
        }
        .user-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 500;
          position: relative;
          overflow: hidden;
        }
          .user-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
          .avatar-text {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 500;
        }

        .user-info {
          display: flex;
          flex-direction: column;
        }

        .user-name {
          font-size: 0.875rem;
          font-weight: 500;
          color: #0f172a;
        }

        .user-role {
          font-size: 0.75rem;
          color: #64748b;
        }

        .logout-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 40px;
          border-radius: 8px;
          background: transparent;
          border: none;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
        }

        .logout-button:hover {
          background: #f1f5f9;
          color: #475569;
        }

        .nav-brand {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .menu-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: transparent;
          border: none;
          color: #334155;
          cursor: pointer;
          transition: all 0.2s;
        }

        .menu-toggle:hover {
          background: #f1f5f9;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .logo-icon {
          font-size: 1.75rem;
        }

        .nav-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #0f172a;
          margin: 0;
        }

        .portal-tag {
          font-size: 0.75rem;
          background: #e0f2fe;
          color: #0369a1;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-weight: 500;
        }

        .user-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 500;
        }

        .user-details {
          display: flex;
          flex-direction: column;
        }

        .welcome-text {
          font-size: 0.75rem;
          color: #64748b;
        }

        .username {
          font-size: 0.875rem;
          font-weight: 500;
          color: #0f172a;
        }

        .logout-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          color: #64748b;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .logout-button:hover {
          background: #f1f5f9;
          color: #475569;
        }
        .dashboard-container {
          display: flex;
          flex: 1;
          overflow: hidden;
          position: relative;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-icon.users {
          background: #e0f2fe;
          color: #0369a1;
        }

        .stat-icon.images {
          background: #ecfdf5;
          color: #059669;
        }

        .stat-icon.reports {
          background: #fef2f2;
          color: #b91c1c;
        }

        .stat-icon.species {
          background: #f5f3ff;
          color: #7c3aed;
        }

        .stat-info h3 {
          font-size: 0.875rem;
          color: #64748b;
          margin: 0 0 0.25rem;
          font-weight: 500;
        }

        .stat-info p {
          font-size: 1.5rem;
          font-weight: 600;
          color: #0f172a;
          margin: 0;
        }

        .sidebar {
          width: ${sidebarOpen ? "280px" : "80px"};
          background: white;
          border-right: 1px solid #e2e8f0;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          height: calc(100vh - 70px);
          position: fixed;
          top: 70px;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }

        .sidebar-header {
          padding: 1.5rem 1.5rem 1rem;
          border-bottom: 1px solid #f1f5f9;
        }

        .sidebar-title {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748b;
          font-weight: 600;
          margin: 0;
          opacity: ${sidebarOpen ? "1" : "0"};
          transition: opacity 0.2s;
          white-space: nowrap;
        }

        .sidebar-nav {
          flex: 1;
          padding: 0.75rem;
        }

        .sidebar-nav ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .sidebar-nav li {
          position: relative;
          margin-bottom: 0.25rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .sidebar-nav li:hover {
          background: #f8fafc;
        }

        .sidebar-nav li.active {
          background: #f0f9ff;
        }

        .sidebar-nav li.active .nav-text {
          color: #0369a1;
          font-weight: 500;
        }

        .sidebar-nav li.active .nav-icon {
          color: #0284c7;
        }

        .nav-item-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          white-space: nowrap;
        }

        .nav-icon {
          font-size: 1.25rem;
          color: #64748b;
          min-width: 24px;
          display: flex;
          justify-content: center;
        }

        .nav-text {
          font-size: 0.9375rem;
          color: #334155;
          transition: opacity 0.3s;
          opacity: ${sidebarOpen ? "1" : "0"};
        }

        .active-indicator {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: #0284c7;
          border-radius: 0 3px 3px 0;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .sidebar-nav li.active .active-indicator {
          opacity: 1;
        }

        .sidebar-footer {
          padding: 1rem;
          border-top: 1px solid #f1f5f9;
        }

        .app-version {
          font-size: 0.6875rem;
          color: #94a3b8;
          opacity: ${sidebarOpen ? "1" : "0"};
          transition: opacity 0.2s;
          white-space: nowrap;
        }
        .main-content {
          flex: 1;
          padding: 2rem;
          background: #f8fafc;
          overflow-y: auto;
          margin-left: ${sidebarOpen ? "280px" : "80px"};
          transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          height: calc(100vh - 70px);
        }
        
        .content-placeholder {
          color: #64748b;
          text-align: center;
          padding: 3rem 0;
          display: flex;
          justify-cotent-center;
          align-items:center;
          height: 300px;
        }

        @media (max-width: 768px) {
          .nav-container {
            padding: 0 1rem;
          }

          .sidebar {
            position: fixed;
            z-index: 40;
            height: calc(100vh - 70px);
            box-shadow: ${
              sidebarOpen ? "4px 0 15px rgba(0, 0, 0, 0.1)" : "none"
            };
          }

          .main-content {
            padding: 1rem;
          }

          .content-section {
            padding: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .portal-tag,
          .welcome-text {
            display: none;
          }

          .user-avatar {
            width: 32px;
            height: 32px;
            font-size: 0.875rem;
          }

          .username {
            font-size: 0.8125rem;
          }

          .logout-button span {
            display: none;
          }

          .logout-button {
            padding: 0.5rem;
            border-radius: 50%;
            width: 36px;
            height: 36px;
            justify-content: center;
          }
        }
        .add-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #06b6d4;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .add-button:hover {
          background: #0891b2;
        }

        .table-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
          overflow: hidden;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table th {
          background: #f1f5f9;
          padding: 1rem;
          text-align: left;
          color: #64748b;
          font-weight: 500;
          font-size: 0.875rem;
        }

        .data-table td {
          padding: 1rem;
          border-bottom: 1px solid #e2e8f0;
          color: #334155;
        }

        .data-table tr:hover {
          background: #f8fafc;
        }

        .role-badge {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .role-badge.admin {
          background: #e0f2fe;
          color: #0369a1;
        }

        .role-badge.biologist {
          background: #ecfdf5;
          color: #059669;
        }

        .role-badge.guest {
          background: rgb(202, 204, 206);
          color: rgb(35, 35, 35);
        }

        .action-button {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          margin-right: 0.5rem;
        }

        .action-button.edit {
          background: #e0f2fe;
          color: #0369a1;
        }

        .action-button.edit:hover {
          background: #bae6fd;
        }

        .action-button.delete {
          background: #fee2e2;
          color: #dc2626;
        }

        .action-button.delete:hover {
          background: #fecaca;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          width: 100%;
          max-width: 500px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .modal-header h3 {
          margin: 0;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }

        .modal-actions button {
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }

        .modal-actions button.primary {
          background-color: #4caf50;
          color: white;
          border: none;
        }
        /* Profile Management Styles */
        .profile-management-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .edit-profile-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: #0284c7;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .edit-profile-btn:hover {
          background: #0369a1;
          transform: translateY(-1px);
        }

        .profile-dashboard {
          max-width: 1000px;
          margin: 0 auto;
        }

        .profile-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .profile-card-header {
          background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
          color: white;
          padding: 2rem;
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .profile-avatar-section {
          position: relative;
        }

        .profile-avatar-large {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: 4px solid rgba(255, 255, 255, 0.2);
          overflow: hidden;
          position: relative;
          background: rgba(255, 255, 255, 0.1);
        }

        .profile-avatar-large img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: absolute;
          top: 0;
          left: 0;
        }

        .avatar-fallback {
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          font-weight: 600;
          color: white;
          position: absolute;
          top: 0;
          left: 0;
        }
        .profile-status {
          position: absolute;
          bottom: -8px;
          right: -8px;
        }

        .status-badge {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .status-badge.admin {
          background: #fef3c7;
          color: #92400e;
        }

        .status-badge.biologist {
          background: #d1fae5;
          color: #065f46;
        }

        .status-badge.guest {
          background: #f3f4f6;
          color: #374151;
        }

        .profile-info-section {
          flex: 1;
        }

        .profile-name {
          font-size: 2rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
        }

        .profile-username {
          font-size: 1.125rem;
          opacity: 0.8;
          margin: 0 0 1rem 0;
        }

        .profile-bio {
          font-size: 1rem;
          opacity: 0.9;
          line-height: 1.5;
          margin: 0;
        }

        .profile-details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          padding: 2rem;
        }

        .detail-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          transition: all 0.2s;
        }

        .detail-card:hover {
          border-color: #cbd5e1;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .detail-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #e0f2fe;
          color: #0369a1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .detail-content h4 {
          font-size: 0.875rem;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0 0 0.25rem 0;
        }

        .detail-content p {
          font-size: 1rem;
          color: #1e293b;
          font-weight: 500;
          margin: 0;
        }

        .profile-actions-section {
          padding: 2rem;
          border-top: 1px solid #e2e8f0;
          background: #f8fafc;
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .action-btn.primary {
          background: #0284c7;
          color: white;
        }

        .action-btn.primary:hover {
          background: #0369a1;
          transform: translateY(-1px);
        }

        .action-btn.danger {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }

        .action-btn.danger:hover {
          background: #fee2e2;
          border-color: #fca5a5;
        }

        /* Profile Modal Styles */
        .profile-modal {
          background: white;
          border-radius: 16px;
          width: 90vw;
          max-width: 600px;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .profile-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          border-bottom: 1px solid #e2e8f0;
          background: #f8fafc;
        }

        .profile-modal-header h3 {
          margin: 0;
          font-size: 1.5rem;
          color: #1e293b;
        }

        .profile-modal-tabs {
          display: flex;
          border-bottom: 1px solid #e2e8f0;
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          background: none;
          border: none;
          color: #64748b;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border-bottom: 2px solid transparent;
        }

        .tab-btn:hover {
          background: #f8fafc;
          color: #475569;
        }

        .tab-btn.active {
          color: #0284c7;
          border-bottom-color: #0284c7;
          background: #f0f9ff;
        }

        .profile-modal-body {
          padding: 2rem;
          overflow-y: auto;
          flex: 1;
        }

        .tab-content {
          animation: fadeIn 0.3s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .profile-image-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
        }

        .current-image {
          text-align: center;
        }

        .image-container {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          border: 4px solid #e2e8f0;
          overflow: hidden;
          margin: 0 auto 1rem;
          position: relative;
        }

        .image-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-placeholder {
          width: 100%;
          height: 100%;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
        }

        .image-upload-section {
          text-align: center;
        }

        .upload-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .upload-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: #0284c7;
          color: white;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .upload-button:hover {
          background: #0369a1;
        }

        .upload-hint {
          color: #64748b;
          font-size: 0.875rem;
          line-height: 1.5;
          margin: 0;
        }

        .security-info {
          background: #f0f9ff;
          padding: 1rem;
          border-radius: 8px;
          border-left: 4px solid #0284c7;
          margin-bottom: 1.5rem;
        }

        .security-info h4 {
          margin: 0 0 0.5rem 0;
          color: #0369a1;
        }

        .security-info p {
          margin: 0;
          color: #64748b;
          font-size: 0.875rem;
        }

        .profile-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          padding: 1.5rem 2rem;
          border-top: 1px solid #e2e8f0;
          background: #f8fafc;
        }

        .save-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: #0284c7;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .save-btn:hover:not(:disabled) {
          background: #0369a1;
        }

        .save-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .profile-card-header {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }

          .profile-details-grid {
            grid-template-columns: 1fr;
          }

          .action-buttons {
            flex-direction: column;
          }

          .profile-modal-tabs {
            overflow-x: auto;
          }

          .tab-btn {
            white-space: nowrap;
          }
        }
        /* Role badges */
        .role-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .role-badge.admin {
          background-color: #e0e7ff;
          color: #4f46e5;
        }

        .role-badge.biologist {
          background-color: #ecfdf5;
          color: #059669;
        }

        .role-badge.guest {
          background-color: #f5f5f5;
          color: #666;
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;
