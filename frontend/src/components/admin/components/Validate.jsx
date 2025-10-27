import React, { useState, useEffect } from "react";
import {
  FiUsers,
  FiImage,
  FiCheck,
  FiX,
  FiClock,
  FiCalendar,
  FiUser,
  FiShield,
  FiEye,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiChevronDown,
  FiChevronUp,
  FiAlertTriangle,
  FiUserCheck,
  FiUserX,
} from "react-icons/fi";
import { useAuth } from "../../../context/AuthContext";
import SuccessModal from "../../SuccessMessage";
import "../styles/validateStyle.css";
import { API_BASE_URL } from "../../../config/api";

function Validate() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState("images");

  // Image validation state
  const [pendingUploads, setPendingUploads] = useState([]);
  const [expandedUser, setExpandedUser] = useState(null);
  const [selectedImages, setSelectedImages] = useState(new Set());

  // User validation state
  const [pendingUsers, setPendingUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(new Set());

  // Common state
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({});

  useEffect(() => {
    if (activeFilter === "images") {
      fetchPendingUploads();
    } else if (activeFilter === "users") {
      fetchPendingUsers();
    }
  }, [activeFilter]);

  // Image validation functions
  const fetchPendingUploads = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/pending-image-uploads`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPendingUploads(data.pending_uploads);
      } else {
        console.error("Failed to fetch pending uploads");
      }
    } catch (error) {
      console.error("Error fetching pending uploads:", error);
    } finally {
      setLoading(false);
    }
  };

  // User validation functions
  const fetchPendingUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/pending-users`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPendingUsers(data.pending_users);
      } else {
        console.error("Failed to fetch pending users");
      }
    } catch (error) {
      console.error("Error fetching pending users:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserSelection = (userId) => {
    const newSelection = new Set(selectedUsers);
    if (newSelection.has(userId)) {
      newSelection.delete(userId);
    } else {
      newSelection.add(userId);
    }
    setSelectedUsers(newSelection);
  };

  const selectAllUsers = () => {
    const allUserIds = pendingUsers.map((user) => user.id);
    const newSelection = new Set(selectedUsers);

    const allSelected = allUserIds.every((id) => newSelection.has(id));

    if (allSelected) {
      // Deselect all
      allUserIds.forEach((id) => newSelection.delete(id));
    } else {
      // Select all
      allUserIds.forEach((id) => newSelection.add(id));
    }

    setSelectedUsers(newSelection);
  };

  // Image functions (existing)
  const toggleUserExpansion = (uploaderId) => {
    setExpandedUser(expandedUser === uploaderId ? null : uploaderId);
    setSelectedImages(new Set());
  };

  const toggleImageSelection = (imageId) => {
    const newSelection = new Set(selectedImages);
    if (newSelection.has(imageId)) {
      newSelection.delete(imageId);
    } else {
      newSelection.add(imageId);
    }
    setSelectedImages(newSelection);
  };

  const selectAllUserImages = (userImages) => {
    const imageIds = userImages.map((img) => img.id);
    const newSelection = new Set(selectedImages);

    const allSelected = imageIds.every((id) => newSelection.has(id));

    if (allSelected) {
      imageIds.forEach((id) => newSelection.delete(id));
    } else {
      imageIds.forEach((id) => newSelection.add(id));
    }

    setSelectedImages(newSelection);
  };

  // Generic bulk action handler
  const handleBulkAction = async (action) => {
    const isUserAction = activeFilter === "users";
    const selectedItems = isUserAction ? selectedUsers : selectedImages;

    if (selectedItems.size === 0) {
      setModalConfig({
        title: "No Selection",
        message: `Please select at least one ${
          isUserAction ? "user" : "image"
        } to perform this action.`,
        type: "warning",
        autoClose: true,
      });
      setShowModal(true);
      return;
    }

    const actionText =
      action === "approve"
        ? "approve"
        : action === "reject"
        ? "reject"
        : "delete";
    const itemType = isUserAction ? "user" : "image";

    setModalConfig({
      title: `Confirm ${
        actionText.charAt(0).toUpperCase() + actionText.slice(1)
      }`,
      message: `Are you sure you want to ${actionText} ${selectedItems.size} selected ${itemType}(s)?`,
      type: "warning",
      customActions: true,
      confirmText: actionText.charAt(0).toUpperCase() + actionText.slice(1),
      cancelText: "Cancel",
    });
    setShowModal(true);

    window.pendingAction = action;
  };

  const handleConfirmAction = async () => {
    const action = window.pendingAction;
    const isUserAction = activeFilter === "users";
    const selectedItems = isUserAction ? selectedUsers : selectedImages;

    setActionLoading(true);
    setShowModal(false);

    try {
      // Get CSRF token first
      const csrfResponse = await fetch(`${API_BASE_URL}/csrf-token`, {
        method: "GET",
        credentials: "include",
      });

      if (!csrfResponse.ok) {
        throw new Error("Failed to get CSRF token");
      }

      const csrfData = await csrfResponse.json();

      const itemIds = Array.from(selectedItems);
      let endpoint = "";
      let requestData = {};

      if (isUserAction) {
        // User validation endpoints
        endpoint = `${API_BASE_URL}/admin/manage-user-validation`;
        requestData = { user_ids: itemIds, action };
      } else {
        // Image validation endpoints
        if (action === "delete") {
          endpoint =
            `${API_BASE_URL}/validation/admin/delete-pending-images`;
          requestData = { image_ids: itemIds };
        } else {
          endpoint =
            `${API_BASE_URL}/validation/admin/manage-image-uploads`;
          requestData = { image_ids: itemIds, action };
        }
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfData.csrf_token, // Add CSRF token here
        },
        credentials: "include",
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const data = await response.json();

        setModalConfig({
          title: "Success",
          message: data.message,
          type: "success",
          autoClose: true,
        });
        setShowModal(true);

        // Refresh the appropriate data
        if (isUserAction) {
          await fetchPendingUsers();
          setSelectedUsers(new Set());
        } else {
          await fetchPendingUploads();
          setSelectedImages(new Set());
          setExpandedUser(null);
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Operation failed");
      }
    } catch (error) {
      setModalConfig({
        title: "Error",
        message: error.message,
        type: "error",
        autoClose: true,
      });
      setShowModal(true);
    } finally {
      setActionLoading(false);
    }
  };

  const getTimeSince = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInHours = Math.floor((now - past) / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`;
    return `${Math.floor(diffInDays / 30)}mo ago`;
  };

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
          <h2 className="report-title">Validation Center</h2>
          <p className="report-subtitle">
            Review and approve pending requests and submissions
          </p>
        </div>
      </div>

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
          {pendingUploads.length > 0 && (
            <span className="notification-badge">
              {pendingUploads.reduce(
                (sum, upload) => sum + upload.pending_count,
                0
              )}
            </span>
          )}
        </button>
      </div>

      <div className="validation-content">
        {/* USER VALIDATION SECTION */}
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
                <h3>No Pending User Registrations</h3>
                <p>All user registrations have been processed.</p>
              </div>
            ) : (
              <>
                {/* User Bulk Actions */}
                {selectedUsers.size > 0 && (
                  <div className="bulk-actions-bar">
                    <div className="selected-count">
                      {selectedUsers.size} user(s) selected
                    </div>
                    <div className="bulk-actions">
                      <button
                        className="bulk-action-btn approve"
                        onClick={() => handleBulkAction("approve")}
                        disabled={actionLoading}
                      >
                        <FiUserCheck size={16} />
                        Approve Selected
                      </button>
                      <button
                        className="bulk-action-btn reject"
                        onClick={() => handleBulkAction("reject")}
                        disabled={actionLoading}
                      >
                        <FiUserX size={16} />
                        Reject Selected
                      </button>
                    </div>
                  </div>
                )}

                {/* Users Header */}
                <div className="users-list-header">
                  <div className="header-controls">
                    <button className="select-all-btn" onClick={selectAllUsers}>
                      {selectedUsers.size === pendingUsers.length
                        ? "Deselect All"
                        : "Select All"}
                    </button>
                  </div>
                </div>

                {/* Users List */}
                <div className="pending-users-list">
                  {pendingUsers.map((user) => (
                    <div key={user.id} className="user-card">
                      <div className="user-card-header">
                        <input
                          type="checkbox"
                          checked={selectedUsers.has(user.id)}
                          onChange={() => toggleUserSelection(user.id)}
                          className="user-checkbox"
                        />

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
                          ) : (
                            <div className="avatar-initials">
                              {user.firstname?.charAt(0)?.toUpperCase()}
                              {user.lastname?.charAt(0)?.toUpperCase()}
                            </div>
                          )}
                          <div
                            className="avatar-placeholder"
                            style={{ display: "none" }}
                          >
                            <FiUser size={24} />
                          </div>
                        </div>

                        <div className="user-info">
                          <h3 className="user-name">
                            {user.firstname} {user.lastname}
                          </h3>
                          <p className="user-username">@{user.username}</p>
                          <span className={`role-badge ${user.roletype}`}>
                            <FiShield size={12} />
                            {user.roletype.charAt(0).toUpperCase() +
                              user.roletype.slice(1)}
                          </span>
                        </div>

                        <div className="user-meta">
                          <div className="meta-item">
                            <FiCalendar size={14} />
                            <span>
                              Registered {getTimeSince(user.created_at)}
                            </span>
                          </div>
                          <div className="meta-item">
                            <FiClock size={14} />
                            <span>{formatDate(user.created_at)}</span>
                          </div>
                        </div>

                        <div className="user-actions">
                          <button
                            className="action-btn approve"
                            onClick={() => {
                              setSelectedUsers(new Set([user.id]));
                              handleBulkAction("approve");
                            }}
                            disabled={actionLoading}
                          >
                            <FiCheck size={16} />
                            Approve
                          </button>
                          <button
                            className="action-btn reject"
                            onClick={() => {
                              setSelectedUsers(new Set([user.id]));
                              handleBulkAction("reject");
                            }}
                            disabled={actionLoading}
                          >
                            <FiX size={16} />
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* IMAGE VALIDATION SECTION (existing code) */}
        {activeFilter === "images" && (
          <div className="pending-images-section">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading pending uploads...</p>
              </div>
            ) : pendingUploads.length === 0 ? (
              <div className="empty-state">
                <FiImage size={48} />
                <h3>No Pending Image Uploads</h3>
                <p>All image uploads have been processed.</p>
              </div>
            ) : (
              <>
                {/* Bulk Actions */}
                {selectedImages.size > 0 && (
                  <div className="bulk-actions-bar">
                    <div className="selected-count">
                      {selectedImages.size} image(s) selected
                    </div>
                    <div className="bulk-actions">
                      <button
                        className="bulk-action-btn approve"
                        onClick={() => handleBulkAction("approve")}
                        disabled={actionLoading}
                      >
                        <FiCheckCircle size={16} />
                        Approve Selected
                      </button>
                      <button
                        className="bulk-action-btn reject"
                        onClick={() => handleBulkAction("reject")}
                        disabled={actionLoading}
                      >
                        <FiXCircle size={16} />
                        Reject Selected
                      </button>
                      <button
                        className="bulk-action-btn delete"
                        onClick={() => handleBulkAction("delete")}
                        disabled={actionLoading}
                      >
                        <FiTrash2 size={16} />
                        Delete Selected
                      </button>
                    </div>
                  </div>
                )}

                {/* Upload Groups */}
                <div className="pending-uploads-list">
                  {pendingUploads.map((upload) => (
                    <div key={upload.uploader_id} className="upload-group">
                      <div className="upload-group-header">
                        <div className="user-info-section">
                          <div className="user-avatar">
                            <div className="avatar-initials">
                              {upload.firstname?.charAt(0)?.toUpperCase()}
                              {upload.lastname?.charAt(0)?.toUpperCase()}
                            </div>
                          </div>
                          <div className="user-details">
                            <h3 className="user-name">
                              {upload.firstname} {upload.lastname}
                            </h3>
                            <p className="user-username">@{upload.username}</p>
                            <span className={`role-badge ${upload.roletype}`}>
                              <FiShield size={12} />
                              {upload.roletype.charAt(0).toUpperCase() +
                                upload.roletype.slice(1)}
                            </span>
                          </div>
                        </div>

                        <div className="upload-summary">
                          <div className="summary-stat">
                            <span className="stat-number">
                              {upload.pending_count}
                            </span>
                            <span className="stat-label">Pending Images</span>
                          </div>
                          <div className="summary-stat">
                            <span className="stat-time">
                              {getTimeSince(upload.last_upload)}
                            </span>
                            <span className="stat-label">Last Upload</span>
                          </div>
                        </div>

                        <div className="group-actions">
                          <button
                            className="select-all-btn"
                            onClick={() => selectAllUserImages(upload.images)}
                          >
                            Select All
                          </button>
                          <button
                            className="expand-btn"
                            onClick={() =>
                              toggleUserExpansion(upload.uploader_id)
                            }
                          >
                            {expandedUser === upload.uploader_id ? (
                              <>
                                <FiChevronUp size={16} />
                                Hide Details
                              </>
                            ) : (
                              <>
                                <FiChevronDown size={16} />
                                View Details
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {expandedUser === upload.uploader_id && (
                        <div className="upload-details">
                          <div className="images-grid">
                            {upload.images.map((image) => (
                              <div
                                key={image.id}
                                className={`image-card ${
                                  selectedImages.has(image.id) ? "selected" : ""
                                }`}
                              >
                                <div className="image-header">
                                  <input
                                    type="checkbox"
                                    checked={selectedImages.has(image.id)}
                                    onChange={() =>
                                      toggleImageSelection(image.id)
                                    }
                                    className="image-checkbox"
                                  />
                                  <span className="image-filename">
                                    {image.filename}
                                  </span>
                                </div>

                                <div className="image-preview">
                                  <img
                                    src={`${API_BASE_URL}/crops/${image.filename}`}
                                    alt={image.filename}
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                      e.target.nextSibling.style.display =
                                        "flex";
                                    }}
                                  />
                                  <div
                                    className="preview-placeholder"
                                    style={{ display: "none" }}
                                  >
                                    <FiImage size={24} />
                                    <span>Preview not available</span>
                                  </div>
                                </div>

                                <div className="image-meta">
                                  <div className="meta-item">
                                    <FiClock size={12} />
                                    <span>
                                      {getTimeSince(image.uploaded_at)}
                                    </span>
                                  </div>
                                  {image.analysis_confidence && (
                                    <div className="meta-item">
                                      <FiEye size={12} />
                                      <span>
                                        {(
                                          image.analysis_confidence * 100
                                        ).toFixed(1)}
                                        %
                                      </span>
                                    </div>
                                  )}
                                  <div className="meta-item">
                                    <span
                                      className={`status-badge ${image.processing_status}`}
                                    >
                                      {image.processing_status}
                                    </span>
                                  </div>
                                </div>

                                <div className="image-actions">
                                  <button
                                    className="action-btn view"
                                    onClick={() =>
                                      window.open(
                                        `${API_BASE_URL}/crops/${image.filename}`,
                                        "_blank"
                                      )
                                    }
                                  >
                                    <FiEye size={14} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {actionLoading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <div className="loading-text">Processing action...</div>
          </div>
        </div>
      )}

      {/* Success/Error Modal */}
      <SuccessModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        autoClose={modalConfig.autoClose}
        autoCloseDelay={3000}
        customActions={modalConfig.customActions}
        onConfirm={modalConfig.customActions ? handleConfirmAction : null}
        onCancel={modalConfig.customActions ? () => setShowModal(false) : null}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
      />
    </div>
  );
}

export default Validate;
