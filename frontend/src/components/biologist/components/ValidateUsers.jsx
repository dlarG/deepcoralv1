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
  FiFilter,
  FiSearch,
  FiRefreshCw,
  FiSettings,
} from "react-icons/fi";
import { useAuth } from "../../../context/AuthContext";
import SuccessModal from "../../SuccessMessage";
import "../../admin/styles/validateStyle.css";

function ValidateUsers() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState("images"); // Changed default to users

  // Image validation state
  const [pendingUploads, setPendingUploads] = useState([]);
  const [expandedUser, setExpandedUser] = useState(null);
  const [selectedImages, setSelectedImages] = useState(new Set());

  // User validation state
  const [pendingUsers, setPendingUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(new Set());

  // NEW: Notification counts state
  const [notificationCounts, setNotificationCounts] = useState({
    pendingUsers: 0,
    pendingImages: 0,
  });

  // Common state
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({});

  // NEW: Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  // NEW: Fetch notification counts independently
  const fetchNotificationCounts = async () => {
    try {
      // Fetch pending users count
      const usersResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/biologist/pending-users`,
        { method: "GET", credentials: "include" }
      );

      // Fetch pending images count
      const imagesResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/biologist/pending-image-uploads`,
        { method: "GET", credentials: "include" }
      );

      let pendingUsersCount = 0;
      let pendingImagesCount = 0;

      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        pendingUsersCount = usersData.pending_users?.length || 0;
      }

      if (imagesResponse.ok) {
        const imagesData = await imagesResponse.json();
        pendingImagesCount =
          imagesData.pending_uploads?.reduce(
            (sum, upload) => sum + (upload.pending_count || 0),
            0
          ) || 0;
      }

      setNotificationCounts({
        pendingUsers: pendingUsersCount,
        pendingImages: pendingImagesCount,
      });
    } catch (error) {
      console.error("Error fetching notification counts:", error);
    }
  };

  const shouldShowBulkActions = () => {
    return (
      (activeFilter === "users" && selectedUsers.size > 0) ||
      (activeFilter === "images" && selectedImages.size > 0)
    );
  };

  const getSelectionInfo = () => {
    if (activeFilter === "users") {
      return {
        count: selectedUsers.size,
        type: "user",
        plural: selectedUsers.size !== 1 ? "s" : "",
      };
    } else {
      return {
        count: selectedImages.size,
        type: "image",
        plural: selectedImages.size !== 1 ? "s" : "",
      };
    }
  };

  // NEW: Initial load - fetch all data
  useEffect(() => {
    // Always fetch notification counts
    fetchNotificationCounts();

    // Fetch specific data based on active tab
    if (activeFilter === "images") {
      fetchPendingUploads();
    } else if (activeFilter === "users") {
      fetchPendingUsers();
    }
  }, [activeFilter]);

  // NEW: Refresh notification counts every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchNotificationCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  // Image validation functions
  const fetchPendingUploads = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/biologist/pending-image-uploads`,
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
        `${process.env.REACT_APP_API_URL}/biologist/pending-users`,
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

  // NEW: Filter and search functions
  const filteredUsers = pendingUsers
    .filter((user) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        user.firstname.toLowerCase().includes(searchLower) ||
        user.lastname.toLowerCase().includes(searchLower) ||
        user.username.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at) - new Date(a.created_at);
        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at);
        case "name":
          return (a.firstname + a.lastname).localeCompare(
            b.firstname + b.lastname
          );
        default:
          return 0;
      }
    });

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
    const currentUsers = filteredUsers.map((user) => user.id);
    const newSelection = new Set(selectedUsers);

    const allSelected = currentUsers.every((id) => newSelection.has(id));

    if (allSelected) {
      // Deselect all visible users
      currentUsers.forEach((id) => newSelection.delete(id));
    } else {
      // Select all visible users
      currentUsers.forEach((id) => newSelection.add(id));
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
      const csrfResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/csrf-token`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!csrfResponse.ok) {
        throw new Error("Failed to get CSRF token");
      }

      const csrfData = await csrfResponse.json();

      const itemIds = Array.from(selectedItems);
      let endpoint = "";
      let requestData = {};

      if (isUserAction) {
        // User validation endpoints
        endpoint = `${process.env.REACT_APP_API_URL}/biologist/manage-user-validation`;
        requestData = { user_ids: itemIds, action };
      } else {
        // Image validation endpoints
        if (action === "delete") {
          endpoint = `${process.env.REACT_APP_API_URL}/validation/biologist/delete-pending-images`;
          requestData = { image_ids: itemIds };
        } else {
          endpoint = `${process.env.REACT_APP_API_URL}/validation/biologist/manage-image-uploads`;
          requestData = { image_ids: itemIds, action };
        }
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfData.csrf_token,
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

        // Refresh the appropriate data and notification counts
        if (isUserAction) {
          await fetchPendingUsers();
          setSelectedUsers(new Set());
        } else {
          await fetchPendingUploads();
          setSelectedImages(new Set());
          setExpandedUser(null);
        }

        // Always refresh notification counts after any action
        await fetchNotificationCounts();
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

  // NEW: Get priority level for users (based on waiting time)
  const getUserPriority = (createdAt) => {
    const hoursWaiting = Math.floor(
      (new Date() - new Date(createdAt)) / (1000 * 60 * 60)
    );
    if (hoursWaiting > 48) return "urgent";
    if (hoursWaiting > 24) return "high";
    if (hoursWaiting > 12) return "medium";
    return "normal";
  };

  return (
    <div className="validate-container">
      {/* Enhanced Header */}
      <div className="validate-header">
        <div className="header-content">
          <div className="header-left">
            <div className="title-section">
              <h1 className="page-title">
                <FiShield className="title-icon" />
                Validation Center
              </h1>
              <p className="page-subtitle">
                Review and manage pending requests with enhanced controls
              </p>
            </div>
          </div>

          <div className="header-right">
            <button
              className="validate-refresh-btn"
              onClick={fetchNotificationCounts}
              disabled={loading}
            >
              <FiRefreshCw className={loading ? "spinning" : ""} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {shouldShowBulkActions() && (
        <div className="bulk-actions-bar">
          <div className="selection-info">
            <span className="selected-count">{getSelectionInfo().count}</span>
            <span className="selected-label">
              {getSelectionInfo().type}
              {getSelectionInfo().plural} selected
            </span>
          </div>

          <div className="bulk-actions">
            <button
              className="bulk-action-btn approve"
              onClick={() => handleBulkAction("approve")}
              disabled={actionLoading}
            >
              <FiCheckCircle />
              Approve Selected
            </button>
            <button
              className="bulk-action-btn reject"
              onClick={() => handleBulkAction("reject")}
              disabled={actionLoading}
            >
              <FiXCircle />
              Reject Selected
            </button>
            {/* Only show delete for images */}
            {activeFilter === "images" && (
              <button
                className="bulk-action-btn delete"
                onClick={() => handleBulkAction("delete")}
                disabled={actionLoading}
              >
                <FiTrash2 />
                Delete Selected
              </button>
            )}
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="validation-content">
        {/* IMAGE VALIDATION SECTION (Enhanced but keeping existing logic) */}
        {activeFilter === "images" && (
          <div className="images-validation-section">
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner-large"></div>
                <h3>Loading image uploads...</h3>
                <p>Please wait while we fetch pending submissions</p>
              </div>
            ) : pendingUploads.length === 0 ? (
              <div className="validate-empty-state">
                <div className="validate-empty-icon">
                  <FiImage />
                </div>
                <h3>No pending image uploads</h3>
                <p>
                  All image uploads have been processed. New submissions will
                  appear here.
                </p>
              </div>
            ) : (
              <>
                {/* Enhanced Upload Groups */}
                <div className="upload-groups">
                  {pendingUploads.map((upload) => (
                    <div key={upload.uploader_id} className="upload-group-card">
                      <div className="upload-group-header">
                        <div className="uploader-info">
                          <div className="uploader-avatar">
                            <div className="avatar-initials">
                              {upload.firstname?.charAt(0)?.toUpperCase()}
                              {upload.lastname?.charAt(0)?.toUpperCase()}
                            </div>
                          </div>

                          <div className="uploader-details">
                            <h4 className="uploader-name">
                              {upload.firstname} {upload.lastname}
                            </h4>
                            <p className="uploader-username">
                              @{upload.username}
                            </p>
                            <span className={`role-badge ${upload.roletype}`}>
                              <FiShield />
                              {upload.roletype.charAt(0).toUpperCase() +
                                upload.roletype.slice(1)}
                            </span>
                          </div>
                        </div>

                        <div className="upload-stats">
                          <div className="stat-item">
                            <div className="stat-number">
                              {upload.pending_count}
                            </div>
                            <div className="stat-label">Pending Images</div>
                          </div>
                          <div className="stat-item">
                            <div className="stat-time">
                              {getTimeSince(upload.last_upload)}
                            </div>
                            <div className="stat-label">Last Upload</div>
                          </div>
                        </div>

                        <div className="group-controls">
                          <button
                            className="control-btn select-all"
                            onClick={() => selectAllUserImages(upload.images)}
                          >
                            <FiCheck />
                            Select All
                          </button>

                          <button
                            className="control-btn expand"
                            onClick={() =>
                              toggleUserExpansion(upload.uploader_id)
                            }
                          >
                            {expandedUser === upload.uploader_id ? (
                              <>
                                <FiChevronUp />
                                Hide Images
                              </>
                            ) : (
                              <>
                                <FiChevronDown />
                                View Images
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {expandedUser === upload.uploader_id && (
                        <div className="upload-images-section">
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

                                <div className="validate-image-preview">
                                  <img
                                    src={`${process.env.REACT_APP_API_URL}/crops/${image.filename}`}
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
                                    <FiImage />
                                    <span>Preview unavailable</span>
                                  </div>
                                </div>

                                <div className="image-metadata">
                                  <div className="validate-metadata-item">
                                    <FiClock />
                                    <span>
                                      {getTimeSince(image.uploaded_at)}
                                    </span>
                                  </div>

                                  {image.analysis_confidence && (
                                    <div className="validate-metadata-item">
                                      <FiEye />
                                      <span>
                                        {(
                                          image.analysis_confidence * 100
                                        ).toFixed(1)}
                                        %
                                      </span>
                                    </div>
                                  )}

                                  <div className="validate-metadata-item">
                                    <span
                                      className={`status-badge ${image.processing_status}`}
                                    >
                                      {image.processing_status}
                                    </span>
                                  </div>
                                </div>

                                <div className="validate-image-actions">
                                  <button
                                    className="validate-action-btn view"
                                    onClick={() =>
                                      window.open(
                                        `${process.env.REACT_APP_API_URL}/crops/${image.filename}`,
                                        "_blank"
                                      )
                                    }
                                    title="View full image"
                                  >
                                    <FiEye />
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

      {/* Enhanced Loading Overlay */}
      {actionLoading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner-large"></div>
            <div className="loading-text">
              <h3>Processing Action</h3>
              <p>Please wait while we process your request...</p>
            </div>
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

export default ValidateUsers;
