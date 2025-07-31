// src/components/admin/components/UserManagement.js
import useUserManagement from "../hooks/useUserManagement";
import {
  FiEdit2,
  FiTrash2,
  FiUserPlus,
  FiDownload,
  FiSearch,
  FiX,
  FiSave,
  FiUsers,
} from "react-icons/fi";
// import { encryptedId } from "../../../utils/encryption";

function UserManagement() {
  const {
    users,
    loading,
    error,
    formData,
    userFormErrors,
    isSubmitting,
    showUserModal,
    userModalMode,
    currentUsers,
    totalPages,
    currentPage,
    userSearchTerm,
    userFilterRole,
    userSortBy,
    filteredUsers,
    handleInputChange,
    openUserModal,
    closeUserModal,
    handleUserSubmit,
    handleDelete,
    setUserSearchTerm,
    setUserFilterRole,
    setUserSortBy,
    setCurrentPage,
    handleUserProfileClick,
  } = useUserManagement();

  return (
    <div className="content-section">
      {/* User management header */}
      <div className="user-management-header">
        <div className="header-left">
          <h2 className="content-title">User Management</h2>
          <p className="content-subtitle">
            Manage system users and their permissions
          </p>
        </div>
        <div className="header-actions">
          <button
            className="export-btn"
            onClick={() => alert("Export functionality coming soon!")}
          >
            <FiDownload size={18} />
            Export
          </button>
          <button
            className="add-user-btn primary"
            onClick={() => openUserModal("create")}
          >
            <FiUserPlus size={18} />
            Add User
          </button>
        </div>
      </div>

      <div className="user-controls">
        <div className="search-section">
          <div className="search-input-container">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search users by name or username..."
              value={userSearchTerm}
              onChange={(e) => {
                setUserSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page when searching
              }}
              className="search-input"
            />
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-group">
            <label>Filter by Role:</label>
            <select
              value={userFilterRole}
              onChange={(e) => {
                setUserFilterRole(e.target.value);
                setCurrentPage(1);
              }}
              className="filter-select"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="biologist">Biologist</option>
              <option value="guest">Guest</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sort by:</label>
            <select
              value={userSortBy}
              onChange={(e) => setUserSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="created_desc">Newest First</option>
              <option value="created_asc">Oldest First</option>
              <option value="name_asc">Name (A-Z)</option>
              <option value="name_desc">Name (Z-A)</option>
              <option value="username_asc">Username (A-Z)</option>
              <option value="username_desc">Username (Z-A)</option>
              <option value="role_asc">Role (A-Z)</option>
              <option value="role_desc">Role (Z-A)</option>
            </select>
          </div>
        </div>
      </div>

      {/* User Stats */}
      <div className="user-stats">
        <div className="stat-item">
          <span className="stat-number">{users.length}</span>
          <span className="stat-label">Total Users</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {users.filter((u) => u.roletype === "admin").length}
          </span>
          <span className="stat-label">Admins</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {users.filter((u) => u.roletype === "biologist").length}
          </span>
          <span className="stat-label">Biologists</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {users.filter((u) => u.roletype === "guest").length}
          </span>
          <span className="stat-label">Guests</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{filteredUsers.length}</span>
          <span className="stat-label">Filtered Results</span>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading users...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p className="error-message">Error: {error}</p>
        </div>
      ) : (
        <>
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Avatar</th>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((tableUser) => (
                  <tr key={tableUser.id} className="user-row">
                    <td>
                      <div className="user-avatar-small">
                        {tableUser.profile_image ? (
                          <img
                            src={`/profile_uploads/${tableUser.profile_image}`}
                            alt={`${tableUser.firstname} ${tableUser.lastname}`}
                            onError={(e) => {
                              console.log(
                                `Failed to load image: /profile_uploads/${tableUser.profile_image}`
                              );
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                        ) : null}
                        <div
                          className="avatar-initials"
                          style={{
                            display: tableUser.profile_image ? "none" : "flex",
                          }}
                        >
                          {tableUser.firstname?.charAt(0)?.toUpperCase()}
                          {tableUser.lastname?.charAt(0)?.toUpperCase()}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="user-name-cell">
                        <span
                          className="user-full-name clickable-name"
                          onClick={() => handleUserProfileClick(tableUser.id)}
                          title="View user profile"
                        >
                          {tableUser.firstname} {tableUser.lastname}
                        </span>
                        <span className="user-id">ID: {tableUser.id}</span>
                      </div>
                    </td>
                    <td>
                      <span className="username-cell">
                        @{tableUser.username}
                      </span>
                    </td>
                    <td>
                      <span className={`role-badge-new ${tableUser.roletype}`}>
                        {tableUser.roletype.charAt(0).toUpperCase() +
                          tableUser.roletype.slice(1)}
                      </span>
                    </td>
                    <td>
                      <span className="status-badge active">Active</span>
                    </td>
                    <td>
                      <div className="action-buttons-new">
                        <button
                          className="action-btn-new edit"
                          onClick={() => openUserModal("edit", tableUser)}
                          title="Edit User"
                        >
                          <FiEdit2 size={14} />
                        </button>
                        <button
                          className="action-btn-new delete"
                          onClick={() => handleDelete(tableUser.id)}
                          title="Delete User"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {currentUsers.length === 0 && (
              <div className="no-users-found">
                <FiUsers size={48} />
                <h3>No users found</h3>
                <p>Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination-container">
              <div className="pagination-info">Showing users information</div>
              <div className="pagination-controls">
                <button
                  className="pagination-btn"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  const isCurrentPage = pageNumber === currentPage;
                  const shouldShow =
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    Math.abs(pageNumber - currentPage) <= 2;

                  if (!shouldShow) {
                    if (
                      pageNumber === currentPage - 3 ||
                      pageNumber === currentPage + 3
                    ) {
                      return (
                        <span key={pageNumber} className="pagination-ellipsis">
                          ...
                        </span>
                      );
                    }
                    return null;
                  }

                  return (
                    <button
                      key={pageNumber}
                      className={`pagination-btn ${
                        isCurrentPage ? "active" : ""
                      }`}
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                <button
                  className="pagination-btn"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
          {showUserModal && (
            <div className="modal-overlay-new">
              <div className="user-modal-new">
                <div className="modal-header-new">
                  <div className="modal-title-section">
                    <h3>
                      {userModalMode === "create"
                        ? "Create New User"
                        : "Edit User"}
                    </h3>
                    <p>
                      {userModalMode === "create"
                        ? "Add a new user to the system"
                        : "Update user information"}
                    </p>
                  </div>
                  <button className="close-btn-new" onClick={closeUserModal}>
                    <FiX size={20} />
                  </button>
                </div>

                <form onSubmit={handleUserSubmit} className="user-form-new">
                  <div className="form-body-new">
                    <div className="form-section">
                      <h4>Personal Information</h4>

                      <div className="form-row-new">
                        <div className="form-group-new">
                          <label htmlFor="firstname">
                            First Name <span className="required">*</span>
                          </label>
                          <input
                            type="text"
                            id="firstname"
                            name="firstname"
                            value={formData.firstname}
                            onChange={handleInputChange}
                            className={userFormErrors.firstname ? "error" : ""}
                            placeholder="Enter first name"
                          />
                          {userFormErrors.firstname && (
                            <span className="error-text">
                              {userFormErrors.firstname}
                            </span>
                          )}
                        </div>

                        <div className="form-group-new">
                          <label htmlFor="lastname">
                            Last Name <span className="required">*</span>
                          </label>
                          <input
                            type="text"
                            id="lastname"
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleInputChange}
                            className={userFormErrors.lastname ? "error" : ""}
                            placeholder="Enter last name"
                          />
                          {userFormErrors.lastname && (
                            <span className="error-text">
                              {userFormErrors.lastname}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="form-section">
                      <h4>Account Information</h4>

                      <div className="form-group-new">
                        <label htmlFor="username">
                          Username <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          id="username"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          className={userFormErrors.username ? "error" : ""}
                          placeholder="Enter username"
                        />
                        {userFormErrors.username && (
                          <span className="error-text">
                            {userFormErrors.username}
                          </span>
                        )}
                      </div>

                      <div className="form-group-new">
                        <label htmlFor="password">
                          Password
                          <span className="required">*</span>
                          {userModalMode === "edit" && (
                            <span className="optional">
                              {" "}
                              (leave blank to keep current)
                            </span>
                          )}
                        </label>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className={userFormErrors.password ? "error" : ""}
                          placeholder={
                            userModalMode === "edit"
                              ? "Enter new password (optional)"
                              : "Enter password"
                          }
                        />
                        {userFormErrors.password && (
                          <div className="error-list">
                            {Array.isArray(userFormErrors.password) ? (
                              userFormErrors.password.map((error, index) => (
                                <span key={index} className="error-text">
                                  {error}
                                </span>
                              ))
                            ) : (
                              <span className="error-text">
                                {userFormErrors.password}
                              </span>
                            )}
                          </div>
                        )}
                        <div className="password-requirements">
                          <p>Password must contain:</p>
                          <ul>
                            <li>At least 8 characters</li>
                            <li>One uppercase letter</li>
                            <li>One lowercase letter</li>
                            <li>One number</li>
                            <li>One special character (!@#$%^&*)</li>
                          </ul>
                        </div>
                      </div>

                      <div className="form-group-new">
                        <label htmlFor="roletype">
                          Role <span className="required">*</span>
                        </label>
                        <select
                          id="roletype"
                          name="roletype"
                          value={formData.roletype}
                          onChange={handleInputChange}
                          className={userFormErrors.roletype ? "error" : ""}
                        >
                          <option value="guest">Guest - Limited access</option>
                          <option value="biologist">
                            Biologist - Enhanced permissions
                          </option>
                          <option value="admin">
                            Admin - Full system access
                          </option>
                        </select>
                        {userFormErrors.roletype && (
                          <span className="error-text">
                            {userFormErrors.roletype}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="modal-actions-new">
                    <button
                      type="button"
                      className="cancel-btn-new"
                      onClick={closeUserModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="submit-btn-new"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="spinner-small"></div>
                          {userModalMode === "create"
                            ? "Creating..."
                            : "Updating..."}
                        </>
                      ) : (
                        <>
                          {userModalMode === "create" ? (
                            <>
                              <FiUserPlus size={16} />
                              Create User
                            </>
                          ) : (
                            <>
                              <FiSave size={16} />
                              Update User
                            </>
                          )}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default UserManagement;
