// src/components/admin/hooks/useUserManagement.js
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { validateUserForm } from "../utils/validationUtils";

export default function useUserManagement() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { fetchCsrfToken } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    roletype: "guest",
  });
  const [userFormErrors, setUserFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userModalMode, setUserModalMode] = useState("create");
  const [selectedUser, setSelectedUser] = useState(null);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [userFilterRole, setUserFilterRole] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [userPerPage, setUserPerPage] = useState(10);
  const [userSortBy, setUserSortBy] = useState("created_desc");

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/admin/users", {
          withCredentials: true,
        });
        setUsers(response.data.users);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Filter and sort users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.firstname.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.lastname.toLowerCase().includes(userSearchTerm.toLowerCase());
    const matchesRole =
      userFilterRole === "all" || user.roletype === userFilterRole;
    return matchesSearch && matchesRole;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (userSortBy) {
      case "name_asc":
        return `${a.firstname} ${a.lastname}`.localeCompare(
          `${b.firstname} ${b.lastname}`
        );
      case "name_desc":
        return `${b.firstname} ${b.lastname}`.localeCompare(
          `${a.firstname} ${a.lastname}`
        );
      case "username_asc":
        return a.username.localeCompare(b.username);
      case "username_desc":
        return b.username.localeCompare(a.username);
      case "role_asc":
        return a.roletype.localeCompare(b.roletype);
      case "role_desc":
        return b.roletype.localeCompare(a.roletype);
      default:
        return a.id - b.id;
    }
  });

  // Pagination
  const usersPerPage = 10;
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);

  // User modal functions
  const openUserModal = (mode, user = null) => {
    setUserModalMode(mode);
    setSelectedUser(user);
    setUserFormErrors({});

    if (mode === "create") {
      setFormData({
        username: "",
        password: "",
        firstname: "",
        lastname: "",
        roletype: "guest",
      });
    } else {
      setFormData({
        username: user.username,
        password: "",
        firstname: user.firstname,
        lastname: user.lastname,
        roletype: user.roletype,
      });
    }
    setShowUserModal(true);
  };

  const closeUserModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
    setUserFormErrors({});
    setFormData({
      username: "",
      password: "",
      firstname: "",
      lastname: "",
      roletype: "guest",
    });
  };

  // Form handling
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    const errors = validateUserForm(formData);
    if (Object.keys(errors).length > 0) {
      setUserFormErrors(errors);
      setIsSubmitting(false);
      return;
    }

    try {
      const csrfToken = await fetchCsrfToken();
      let response;

      if (userModalMode === "create") {
        response = await axios.post(
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
        alert("User created successfully!");
      } else {
        response = await axios.put(
          `http://localhost:5000/admin/users/${selectedUser.id}`,
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
          users.map((u) => (u.id === selectedUser.id ? response.data.user : u))
        );
        alert("User updated successfully!");
      }

      closeUserModal();
    } catch (error) {
      console.error("User operation failed:", error);
      if (error.response?.data?.error) {
        // Handle specific backend errors
        if (error.response.data.error.includes("Username already")) {
          setUserFormErrors({ username: "Username already exists" });
        } else {
          alert(`Error: ${error.response.data.error}`);
        }
      } else {
        alert("Operation failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
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

  return {
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
  };
}
