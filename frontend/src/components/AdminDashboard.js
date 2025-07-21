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
  FiEdit2,
} from "react-icons/fi";

function AdminDashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading, logout, checkAuthStatus } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("Dashboard");

  // Verify authentication status and role when component mounts
  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuthStatus();

      // If not authenticated or not admin, redirect to login
      if (!user || user.roletype.toLowerCase() !== "admin") {
        navigate("/login");
      }
    };

    verifyAuth();
  }, [user, checkAuthStatus, navigate]);

  // Fetch users only if authenticated and admin
  useEffect(() => {
    if (user && user.roletype.toLowerCase() === "admin") {
      const fetchUsers = async () => {
        try {
          // First get a fresh CSRF token
          const csrfResponse = await axios.get(
            "http://localhost:5000/csrf-token",
            {
              withCredentials: true,
            }
          );
          const csrfToken = csrfResponse.data.csrf_token;
          localStorage.setItem("csrf_token", csrfToken);

          const response = await axios.get(
            "http://localhost:5000/admin/users",
            {
              withCredentials: true,
              headers: {
                "X-CSRF-Token": csrfToken,
              },
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

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      navigate("/login");
    }
  };

  const handleEdit = (userId) => {
    console.log("Edit user:", userId);
    // navigate(`/edit-user/${userId}`);
  };

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
      case "Manage Users":
        return (
          <>
            <h2 className="content-title">User Management</h2>
            {loading ? (
              <div className="loading">Loading users...</div>
            ) : error ? (
              <div className="error-message">Error: {error}</div>
            ) : (
              <div className="users-content">
                <div className="content-header">
                  <button className="add-button">
                    <FiUser className="button-icon" />
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
                              onClick={() => handleEdit(user.id)}
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
        return (
          <div className="lifeforms-content">
            Coral LifeForms Management Coming Soon
          </div>
        );
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
              <span className="logo-icon">
                <h1 className="deepcoral-logo">DeepCoral</h1>
              </span>
              <span className="portal-tag">Admin</span>
            </div>
          </div>

          <div className="user-actions">
            <div className="user-profile">
              <div className="user-avatar">
                {user.firstname?.charAt(0)}
                {user.lastname?.charAt(0)}
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
        .guest-dashboard {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
          background-color: #f8fafc;
        }
        .content-section {
          max-width: 100%;
          margin: 0;
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }
        .content-title {
          font-size: 1.8rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid rgba(0, 96, 100, 0.1);
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
          position: sticky;
          top: 70px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
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
        }

        .content-section {
          max-width: 1400px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }

        .content-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 1.5rem;
        }

        .content-placeholder {
          color: #64748b;
          text-align: center;
          padding: 3rem 0;
        }

        @media (max-width: 768px) {
          .nav-container {
            padding: 0 1rem;
          }

          .sidebar {
            position: fixed;
            z-index: 40;
            height: calc(100vh - 70px);
            box-shadow: ${sidebarOpen
              ? "4px 0 15px rgba(0, 0, 0, 0.1)"
              : "none"};
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
      `}</style>
    </div>
  );
}

export default AdminDashboard;
