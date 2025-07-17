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
} from "react-icons/fi";

function AdminDashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading, logout, checkAuthStatus } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("Manage Users");

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
      case "Dashboard":
        return (
          <div className="dashboard-content">
            Dashboard Overview Coming Soon
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
      case "Manage Users":
      default:
        return (
          <>
            <h2 className="content-title">User Management</h2>
            {loading ? (
              <div className="loading">Loading users...</div>
            ) : error ? (
              <div className="error-message">Error: {error}</div>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Username</th>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{user.firstname}</td>
                        <td>{user.lastname}</td>
                        <td>{user.roletype}</td>
                        <td>
                          <button
                            className="action-button edit-button"
                            onClick={() => handleEdit(user.id)}
                          >
                            Edit
                          </button>
                          <button
                            className="action-button delete-button"
                            onClick={() => handleDelete(user.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        );
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Top Navigation Bar */}
      <nav className="top-nav">
        <div className="nav-left">
          <button
            className="menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          <h1 className="nav-title">DeepCoral Admin</h1>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          <FiLogOut className="logout-icon" />
          <span>Logout</span>
        </button>
      </nav>

      <div className="dashboard-container">
        {/* Sidebar Navigation */}
        <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
          <nav className="sidebar-nav">
            <ul>
              <li
                className={activeTab === "Dashboard" ? "active" : ""}
                onClick={() => setActiveTab("Dashboard")}
              >
                <FiHome className="nav-icon" />
                <span>Dashboard</span>
              </li>
              <li
                className={activeTab === "Manage Users" ? "active" : ""}
                onClick={() => setActiveTab("Manage Users")}
              >
                <FiUsers className="nav-icon" />
                <span>Manage Users</span>
              </li>
              <li
                className={activeTab === "Add Images" ? "active" : ""}
                onClick={() => setActiveTab("Add Images")}
              >
                <FiImage className="nav-icon" />
                <span>Add Images</span>
              </li>
              <li
                className={activeTab === "Generate Report" ? "active" : ""}
                onClick={() => setActiveTab("Generate Report")}
              >
                <FiFileText className="nav-icon" />
                <span>Generate Report</span>
              </li>
              <li
                className={
                  activeTab === "Manage Coral LifeForms" ? "active" : ""
                }
                onClick={() => setActiveTab("Manage Coral LifeForms")}
              >
                <FiDatabase className="nav-icon" />
                <span>Manage Coral LifeForms</span>
              </li>
              <li
                className={activeTab === "Coral Distribution" ? "active" : ""}
                onClick={() => setActiveTab("Coral Distribution")}
              >
                <FiPieChart className="nav-icon" />
                <span>Coral Distribution</span>
              </li>
              <li
                className={activeTab === "Validate" ? "active" : ""}
                onClick={() => setActiveTab("Validate")}
              >
                <FiCheckCircle className="nav-icon" />
                <span>Validate</span>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="main-content">{renderContent()}</main>
      </div>

      {/* CSS Styles */}
      <style jsx>{`
        .admin-dashboard {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f5f7fa;
        }

        .top-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 20px;
          height: 60px;
          background: linear-gradient(135deg, #26c6da 0%, #00acc1 100%);
          color: white;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .nav-left {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .menu-toggle {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 5px;
          border-radius: 4px;
          transition: background-color 0.2s;
        }

        .menu-toggle:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .nav-title {
          font-size: 1.2rem;
          font-weight: 600;
          margin: 0;
        }

        .logout-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
          padding: 8px 15px;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
          font-weight: 500;
        }

        .logout-button:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .dashboard-container {
          display: flex;
          flex: 1;
          overflow: hidden;
        }

        .sidebar {
          width: 250px;
          background-color: white;
          box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease;
          height: calc(100vh - 60px);
          position: sticky;
          top: 60px;
        }

        .sidebar.closed {
          transform: translateX(-250px);
          position: fixed;
        }

        .sidebar-nav ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .sidebar-nav li {
          padding: 12px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          color: #555;
          transition: all 0.2s;
          border-left: 3px solid transparent;
        }

        .sidebar-nav li:hover {
          background-color: #f0f4f8;
          color: #00796b;
        }

        .sidebar-nav li.active {
          background-color: #e0f7fa;
          color: #00796b;
          border-left: 3px solid #26c6da;
          font-weight: 500;
        }

        .nav-icon {
          font-size: 1.1rem;
        }

        .main-content {
          flex: 1;
          padding: 25px;
          overflow-y: auto;
          background-color: #f5f7fa;
        }

        .content-title {
          color: #00796b;
          margin-bottom: 20px;
          font-size: 1.5rem;
        }

        .loading,
        .error-message {
          padding: 20px;
          text-align: center;
          color: #555;
        }

        .error-message {
          color: #d32f2f;
        }

        .table-container {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table th {
          background-color: #f0f4f8;
          padding: 12px 15px;
          text-align: left;
          color: #00796b;
          font-weight: 500;
        }

        .data-table td {
          padding: 12px 15px;
          border-bottom: 1px solid #eee;
          color: #555;
        }

        .data-table tr:hover {
          background-color: #f9f9f9;
        }

        .action-button {
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.85rem;
          margin-right: 8px;
          transition: all 0.2s;
        }

        .edit-button {
          background-color: #26c6da;
          color: white;
        }

        .edit-button:hover {
          background-color: #00acc1;
        }

        .delete-button {
          background-color: #f44336;
          color: white;
        }

        .delete-button:hover {
          background-color: #d32f2f;
        }

        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            z-index: 90;
            height: calc(100vh - 60px);
          }

          .main-content {
            padding: 15px;
          }
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;
