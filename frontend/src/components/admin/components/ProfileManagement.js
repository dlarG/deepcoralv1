// src/components/admin/components/ProfileManagement.js
import React from "react";
import {
  FiEdit2,
  FiTrash2,
  FiUser,
  FiMail,
  FiShield,
  FiCalendar,
  FiLock,
  FiSave,
  FiUpload,
  FiX,
  FiCamera,
} from "react-icons/fi";
import useProfileManagement from "../hooks/useProfileManagement";
import dayjs from "dayjs";

function ProfileManagement({ user }) {
  const {
    showProfileModal,
    profileFormData,
    profileImagePreview,
    profileLoading,
    profileTab,
    handleProfileInputChange,
    handleProfileImageChange,
    openProfileModal,
    closeProfileModal,
    handleProfileSubmit,
    handleDeleteProfile,
    setProfileTab,
  } = useProfileManagement(user);

  return (
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

      {showProfileModal && (
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
                className={`tab-btn ${
                  profileTab === "security" ? "active" : ""
                }`}
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
                          <label
                            htmlFor="profile-image"
                            className="upload-button"
                          >
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
                        Leave password fields empty if you don't want to change
                        your password.
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
      )}
    </div>
  );
}

export default ProfileManagement;
