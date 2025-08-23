// src/components/admin/components/ProfileManagement.js
import React from "react";
import {
  FiEdit2,
  FiTrash2,
  FiUser,
  FiShield,
  FiCalendar,
  FiLock,
  FiSave,
  FiUpload,
  FiX,
  FiCamera,
  FiAward,
  FiActivity,
  FiSettings,
} from "react-icons/fi";
import useProfileManagement from "../hooks/useProfileManagement";
import dayjs from "dayjs";
import SuccessModal from "../../SuccessMessage";

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
    handleProfileInputChange,
    handleProfileImageChange,
    openProfileModal,
    closeProfileModal,
    openDeleteModal,
    closeDeleteModal,
    handleProfileSubmit,
    handleDeleteProfile,
    setProfileTab,
    showModal,
    modalConfig,
    setShowModal,
    confirmDeleteProfile,
    cancelDeleteProfile,
  } = useProfileManagement(user);

  return (
    <div className="modern-profile-container">
      <div className="profile-hero-section">
        <div className="hero-background">
          <div className="gradient-overlay"></div>
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>

        <div className="hero-content">
          <div className="profile-header-actions">
            <button className="modern-edit-btn" onClick={openProfileModal}>
              <FiSettings size={20} />
              Manage Profile
            </button>
          </div>

          <div className="profile-main-info">
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
                    {user.firstname?.charAt(0)}
                    {user.lastname?.charAt(0)}
                  </div>
                </div>
                <div className="avatar-status">
                  <div className="status-dot online"></div>
                </div>
              </div>
              <div className="role-indicator">
                <span
                  className={`modern-role-badge ${user.roletype?.toLowerCase()}`}
                >
                  <FiShield size={14} />
                  {user.roletype?.charAt(0).toUpperCase() +
                    user.roletype?.slice(1)}
                </span>
              </div>
            </div>

            <div className="profile-text-info">
              <h1 className="profile-name-modern">
                {user.firstname} {user.lastname}
              </h1>
              <p className="profile-username-modern">@{user.username}</p>
              <p className="profile-bio-modern">
                {user.bio ||
                  "Marine biologist and coral reef researcher passionate about ocean conservation."}
              </p>

              <div className="profile-stats">
                <div className="stat-item">
                  <FiCalendar size={16} />
                  <span>
                    Joined {dayjs(user.created_at).format("MMMM YYYY")}
                  </span>
                </div>
                <div className="stat-item">
                  <FiActivity size={16} />
                  <span>Active Member</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-info-grid">
        <div className="info-card personal-info">
          <div className="card-header">
            <div className="card-icon personal">
              <FiUser size={24} />
            </div>
            <h3>Personal Information</h3>
          </div>
          <div className="card-content">
            <div className="info-row">
              <span className="label">Full Name</span>
              <span className="value">
                {user.firstname} {user.lastname}
              </span>
            </div>
            <div className="info-row">
              <span className="label">Username</span>
              <span className="value">@{user.username}</span>
            </div>
            <div className="info-row">
              <span className="label">User ID</span>
              <span className="value">#{user.id}</span>
            </div>
          </div>
        </div>

        <div className="info-card security-info">
          <div className="card-header">
            <div className="card-icon security">
              <FiShield size={24} />
            </div>
            <h3>Account Security</h3>
          </div>
          <div className="card-content">
            <div className="info-row">
              <span className="label">Role</span>
              <span className={`role-chip ${user.roletype?.toLowerCase()}`}>
                {user.roletype?.charAt(0).toUpperCase() +
                  user.roletype?.slice(1)}
              </span>
            </div>
            <div className="info-row">
              <span className="label">Status</span>
              <span className="status-chip active">Active</span>
            </div>
            <div className="info-row">
              <span className="label">Last Login</span>
              <span className="value">Recently Active</span>
            </div>
          </div>
        </div>

        <div className="info-card membership-info">
          <div className="card-header">
            <div className="card-icon membership">
              <FiAward size={24} />
            </div>
            <h3>Membership Details</h3>
          </div>
          <div className="card-content">
            <div className="info-row">
              <span className="label">Member Since</span>
              <span className="value">
                {dayjs(user.created_at).format("MMMM D, YYYY")}
              </span>
            </div>
            <div className="info-row">
              <span className="label">Account Type</span>
              <span className="value">Professional</span>
            </div>
          </div>
        </div>

        <div className="info-card actions-card">
          <div className="card-header">
            <div className="card-icon actions">
              <FiSettings size={24} />
            </div>
            <h3>Account Actions</h3>
          </div>
          <div className="card-content">
            <div className="action-buttons-modern">
              <button
                className="action-btn-modern primary"
                onClick={openProfileModal}
              >
                <FiEdit2 size={18} />
                <span>Edit Profile</span>
              </button>
              <button
                className="action-btn-modern danger"
                onClick={openDeleteModal}
              >
                <FiTrash2 size={18} />
                <span>Delete Account</span>
              </button>
            </div>
            <div className="security-note">
              <p>Account changes require verification for security purposes.</p>
            </div>
          </div>
        </div>
      </div>
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
                <label>Confirm Your Password</label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Enter your password"
                  className={deleteError ? "error" : ""}
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

            <div className="delete-modal-actions">
              <button
                type="button"
                onClick={closeDeleteModal}
                className="cancels-btn"
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
      <SuccessModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        autoClose={modalConfig.autoClose}
        autoCloseDelay={3000}
        customActions={modalConfig.customActions}
        onConfirm={modalConfig.customActions ? confirmDeleteProfile : null}
        onCancel={modalConfig.customActions ? cancelDeleteProfile : null}
      />
    </div>
  );
}

export default ProfileManagement;
