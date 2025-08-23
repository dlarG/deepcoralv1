// src/components/guest/components/ProfileManagement.js
import React from "react";
import {
  FiUser,
  FiEdit2,
  FiTrash2,
  FiCamera,
  FiCalendar,
  FiShield,
  FiLock,
  FiX,
  FiSave,
  FiUpload,
  FiActivity,
  FiSettings,
} from "react-icons/fi";
import useProfileManagement from "../hooks/useProfileManagement";
import dayjs from "dayjs";

function ProfileManagement({ user }) {
  const {
    showProfileModal,
    showDeleteModal,
    deletePassword,
    setDeletePassword,
    deleteLoading,
    deleteError,
    profileFormData,
    profileImagePreview,
    profileLoading,
    profileTab,
    profileErrors,
    handleProfileInputChange,
    handleProfileImageChange,
    openProfileModal,
    closeProfileModal,
    openDeleteModal,
    closeDeleteModal,
    handleProfileSubmit,
    handleDeleteProfile,
    setProfileTab,
  } = useProfileManagement(user);

  if (!user) {
    return (
      <div className="content-section">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modern-guest-profile">
      {/* Hero Section with Gradient Background */}
      <div className="guest-profile-hero">
        <div className="hero-background">
          <div className="gradient-overlay"></div>
          <div className="floating-elements">
            <div className="float-element element-1"></div>
            <div className="float-element element-2"></div>
            <div className="float-element element-3"></div>
          </div>
        </div>

        <div className="hero-content">
          <div className="profile-header-actions">
            <button className="modern-settings-btn" onClick={openProfileModal}>
              <FiSettings size={20} />
              <span>Manage Profile</span>
            </button>
          </div>

          <div className="profile-hero-info">
            <div className="profile-avatar-container">
              <div className="avatar-wrapper">
                <div className="profile-avatar-modern">
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
                    className="avatar-fallback-modern"
                    style={{ display: user.profile_image ? "none" : "flex" }}
                  >
                    {user.firstname?.charAt(0)?.toUpperCase()}
                    {user.lastname?.charAt(0)?.toUpperCase()}
                  </div>
                </div>
                <div className="avatar-status-indicator">
                  <div className="status-dot active"></div>
                </div>
              </div>

              <div className="profile-role-indicator">
                <span
                  className={`modern-role-badge ${user.roletype?.toLowerCase()}`}
                >
                  <FiShield size={14} />
                  {user.roletype?.charAt(0).toUpperCase() +
                    user.roletype?.slice(1)}
                </span>
              </div>
            </div>

            <div className="profile-hero-text">
              <h1 className="profile-name-hero">
                {user.firstname} {user.lastname}
              </h1>
              <p className="profile-username-hero">@{user.username}</p>
              <p className="profile-bio-hero">
                {user.bio ||
                  "Marine biologist and coral reef researcher passionate about ocean conservation."}
              </p>

              <div className="profile-stats-hero">
                <div className="stat-item-hero">
                  <FiCalendar size={16} />
                  <span>
                    Joined {dayjs(user.created_at).format("MMMM YYYY")}
                  </span>
                </div>
                <div className="stat-item-hero">
                  <FiActivity size={16} />
                  <span>Active Member</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Info Cards */}
      <div className="guest-profile-content">
        <div className="profile-cards-grid">
          <div className="profile-card personal-card">
            <div className="card-header">
              <div className="card-icon personal">
                <FiUser size={24} />
              </div>
              <h3>Personal Information</h3>
            </div>
            <div className="card-content">
              <div className="info-item">
                <span className="info-label">Full Name</span>
                <span className="info-value">
                  {user.firstname} {user.lastname}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Username</span>
                <span className="info-value">@{user.username}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Bio</span>
                <span className="info-value">
                  {user.bio || "No bio added yet"}
                </span>
              </div>
            </div>
          </div>

          <div className="profile-card account-card">
            <div className="card-header">
              <div className="card-icon account">
                <FiCalendar size={24} />
              </div>
              <h3>Account Information</h3>
            </div>
            <div className="card-content">
              <div className="info-item">
                <span className="info-label">Member Since</span>
                <span className="info-value">
                  {new Date(user.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Account Type</span>
                <span className="info-value">
                  {user.roletype?.charAt(0).toUpperCase() +
                    user.roletype?.slice(1)}{" "}
                  User
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Profile Picture</span>
                <span
                  className={`status-indicator ${
                    user.profile_image ? "has-image" : "no-image"
                  }`}
                >
                  {user.profile_image ? "Uploaded" : "Not set"}
                </span>
              </div>
            </div>
          </div>

          <div className="profile-card security-card">
            <div className="card-header">
              <div className="card-icon security">
                <FiShield size={24} />
              </div>
              <h3>Security & Access</h3>
            </div>
            <div className="card-content">
              <div className="info-item">
                <span className="info-label">Account Status</span>
                <span className="status-badge active">Active</span>
              </div>
              <div className="info-item">
                <span className="info-label">Role</span>
                <span className={`role-chip ${user.roletype?.toLowerCase()}`}>
                  {user.roletype?.charAt(0).toUpperCase() +
                    user.roletype?.slice(1)}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Last Activity</span>
                <span className="info-value">Recently Active</span>
              </div>
            </div>
          </div>

          <div className="profile-card actions-card">
            <div className="card-header">
              <div className="card-icon actions">
                <FiSettings size={24} />
              </div>
              <h3>Account Actions</h3>
            </div>
            <div className="card-content">
              <div className="action-buttons-grid">
                <button
                  className="action-btn primary"
                  onClick={openProfileModal}
                >
                  <FiEdit2 size={18} />
                  <span>Edit Profile</span>
                </button>
                <button className="action-btn danger" onClick={openDeleteModal}>
                  <FiTrash2 size={18} />
                  <span>Delete Account</span>
                </button>
              </div>
              <div className="security-notice">
                <div className="notice-icon">
                  <FiShield size={16} />
                </div>
                <p>
                  Account changes require verification for security purposes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Keep existing modals (they're already well-designed) */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <div className="delete-modal-header">
              <div className="delete-warning-icon">
                <FiTrash2 size={32} />
              </div>
              <h3>Delete Account</h3>
              <p>
                This action cannot be undone. Please confirm your password to
                proceed.
              </p>
            </div>

            <div className="delete-modal-body">
              <div className="form-group">
                <label className="form-label">Confirm Your Password</label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`form-input ${deleteError ? "error" : ""}`}
                  autoFocus
                />
                {deleteError && (
                  <span className="error-text">{deleteError}</span>
                )}
              </div>

              <div className="delete-warning">
                <h4>⚠️ Warning</h4>
                <ul>
                  <li>Your account will be permanently deleted</li>
                  <li>All your data will be lost</li>
                  <li>This action cannot be reversed</li>
                </ul>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                onClick={closeDeleteModal}
                className="cancel-btn"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteProfile}
                className="delete-confirm-btn"
                disabled={deleteLoading || !deletePassword.trim()}
              >
                {deleteLoading ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Edit Modal (keep existing - it's already good) */}
      {showProfileModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Edit Profile</h3>
              <button onClick={closeProfileModal} className="modal-close-btn">
                <FiX size={20} />
              </button>
            </div>

            <div className="modal-tabs">
              <button
                className={`tab-btn ${profileTab === "info" ? "active" : ""}`}
                onClick={() => setProfileTab("info")}
              >
                <FiUser size={16} />
                Personal Info
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
              <div className="modal-body">
                {profileErrors.general && (
                  <div className="error-message general-error">
                    {profileErrors.general}
                  </div>
                )}

                {profileTab === "info" && (
                  <div className="tab-content">
                    <div className="form-group">
                      <label className="form-label">Profile Picture</label>
                      <div className="image-upload-section">
                        <div className="current-image">
                          {profileImagePreview ? (
                            <img
                              src={profileImagePreview}
                              alt="Profile preview"
                              className="image-preview"
                            />
                          ) : (
                            <div className="image-placeholder">
                              <FiCamera size={24} />
                              <span>No image</span>
                            </div>
                          )}
                        </div>
                        <div className="upload-controls">
                          <input
                            type="file"
                            id="profile_image"
                            name="profile_image"
                            accept="image/*"
                            onChange={handleProfileImageChange}
                            className="file-input"
                          />
                          <label htmlFor="profile_image" className="upload-btn">
                            <FiUpload size={16} />
                            Choose Image
                          </label>
                          <p className="upload-hint">
                            JPG, PNG, or GIF (max 5MB)
                          </p>
                        </div>
                      </div>
                      {profileErrors.profile_image && (
                        <span className="error-text">
                          {profileErrors.profile_image}
                        </span>
                      )}
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="firstname" className="form-label">
                          First Name *
                        </label>
                        <input
                          type="text"
                          id="firstname"
                          name="firstname"
                          value={profileFormData.firstname}
                          onChange={handleProfileInputChange}
                          className={`form-input ${
                            profileErrors.firstname ? "error" : ""
                          }`}
                          required
                        />
                        {profileErrors.firstname && (
                          <span className="error-text">
                            {profileErrors.firstname}
                          </span>
                        )}
                      </div>

                      <div className="form-group">
                        <label htmlFor="lastname" className="form-label">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          id="lastname"
                          name="lastname"
                          value={profileFormData.lastname}
                          onChange={handleProfileInputChange}
                          className={`form-input ${
                            profileErrors.lastname ? "error" : ""
                          }`}
                          required
                        />
                        {profileErrors.lastname && (
                          <span className="error-text">
                            {profileErrors.lastname}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="username" className="form-label">
                        Username *
                      </label>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={profileFormData.username}
                        onChange={handleProfileInputChange}
                        className={`form-input ${
                          profileErrors.username ? "error" : ""
                        }`}
                        required
                      />
                      {profileErrors.username && (
                        <span className="error-text">
                          {profileErrors.username}
                        </span>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="bio" className="form-label">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        value={profileFormData.bio}
                        onChange={handleProfileInputChange}
                        className="form-textarea"
                        rows="4"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </div>
                )}

                {profileTab === "security" && (
                  <div className="tab-content">
                    <div className="security-notice">
                      <FiLock size={20} />
                      <div>
                        <h4>Change Password</h4>
                        <p>
                          Leave blank if you don't want to change your password
                        </p>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="current_password" className="form-label">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="current_password"
                        name="current_password"
                        value={profileFormData.current_password}
                        onChange={handleProfileInputChange}
                        className={`form-input ${
                          profileErrors.current_password ? "error" : ""
                        }`}
                        placeholder="Enter current password"
                      />
                      {profileErrors.current_password && (
                        <span className="error-text">
                          {profileErrors.current_password}
                        </span>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="new_password" className="form-label">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="new_password"
                        name="new_password"
                        value={profileFormData.new_password}
                        onChange={handleProfileInputChange}
                        className={`form-input ${
                          profileErrors.new_password ? "error" : ""
                        }`}
                        placeholder="Enter new password (min 8 characters)"
                      />
                      {profileErrors.new_password && (
                        <span className="error-text">
                          {profileErrors.new_password}
                        </span>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="confirm_password" className="form-label">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirm_password"
                        name="confirm_password"
                        value={profileFormData.confirm_password}
                        onChange={handleProfileInputChange}
                        className={`form-input ${
                          profileErrors.confirm_password ? "error" : ""
                        }`}
                        placeholder="Confirm new password"
                      />
                      {profileErrors.confirm_password && (
                        <span className="error-text">
                          {profileErrors.confirm_password}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={closeProfileModal}
                  className="cancel-btn"
                  disabled={profileLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="save-btn"
                  disabled={profileLoading}
                >
                  {profileLoading ? (
                    <span className="loading-text">Saving...</span>
                  ) : (
                    <>
                      <FiSave size={16} />
                      Save Changes
                    </>
                  )}
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
