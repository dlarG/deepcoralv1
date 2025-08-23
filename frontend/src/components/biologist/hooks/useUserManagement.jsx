import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { validateUserForm } from "../utils/validationUtils";
import { encryptId } from "../../../utils/encryption";
import { API_ENDPOINTS, API_BASE_URL } from '../../../config/api';

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
  const [userSortBy, setUserSortBy] = useState("created_desc");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
    type: "success",
    autoClose: true,
  });

  // Modal helper functions
  const showSuccessModal = (title, message, autoClose = true) => {
    setModalConfig({
      title,
      message,
      type: "success",
      autoClose,
    });
    setShowModal(true);
  };

  const showErrorModal = (title, message) => {
    setModalConfig({
      title,
      message,
      type: "error",
      autoClose: false,
    });
    setShowModal(true);
  };

  const showWarningModal = (title, message) => {
    setModalConfig({
      title,
      message,
      type: "warning",
      autoClose: false,
    });
    setShowModal(true);
  };

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
<<<<<<< HEAD:frontend/src/components/admin/hooks/useUserManagement.js
        const response = await axios.get(`${API_BASE_URL}/admin/users`, {
          withCredentials: true,
        });
=======
        const response = await axios.get(
          "http://localhost:5000/biologist/users",
          {
            withCredentials: true,
          }
        );
>>>>>>> origin/main:frontend/src/components/biologist/hooks/useUserManagement.jsx
        setUsers(response.data.users);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch users");
        showErrorModal(
          "Failed to Load",
          "Unable to fetch users. Please try refreshing the page."
        );
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

    const errors = validateUserForm(formData, userModalMode);
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
<<<<<<< HEAD:frontend/src/components/admin/hooks/useUserManagement.js
          `${API_BASE_URL}/admin/users`,
=======
          "http://localhost:5000/biologist/users",
>>>>>>> origin/main:frontend/src/components/biologist/hooks/useUserManagement.jsx
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
        showSuccessModal(
          "User Created Successfully!",
          `User ${formData.firstname} ${formData.lastname} has been created with username "${formData.username}".`
        );
      } else {
        const updateData = { ...formData };
        if (!updateData.password?.trim()) {
          delete updateData.password;
        }

        response = await axios.put(
<<<<<<< HEAD:frontend/src/components/admin/hooks/useUserManagement.js
          `${API_BASE_URL}/admin/users/${selectedUser.id}`,
=======
          `http://localhost:5000/biologist/users/${selectedUser.id}`,
>>>>>>> origin/main:frontend/src/components/biologist/hooks/useUserManagement.jsx
          updateData,
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
        showSuccessModal(
          "User Updated Successfully!",
          `User ${updateData.firstname} ${updateData.lastname}'s details have been updated.`
        );
      }

      closeUserModal();
    } catch (error) {
      console.error("User operation failed:", error);
      if (error.response?.data?.error) {
        if (error.response.data.error.includes("Username already")) {
          setUserFormErrors({ username: "Username already exists" });
        } else {
          showErrorModal("Operation Failed", error.response.data.error);
        }
      } else {
        showErrorModal(
          "Operation Failed",
          "Unable to save user. Please check your connection and try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (userId) => {
    const userToDelete = users.find((u) => u.id === userId);
    const userName = userToDelete
      ? `${userToDelete.firstname} ${userToDelete.lastname}`
      : "this user";

    if (
      window.confirm(
        `Are you sure you want to delete ${userName}? This action cannot be undone.`
      )
    ) {
      try {
        const csrfResponse = await axios.get(
          `${API_BASE_URL}/csrf-token`,
          {
            withCredentials: true,
          }
        );
        const csrfToken = csrfResponse.data.csrf_token;

<<<<<<< HEAD:frontend/src/components/admin/hooks/useUserManagement.js
        await axios.delete(`${API_BASE_URL}/admin/users/${userId}`, {
=======
        await axios.delete(`http://localhost:5000/biologist/users/${userId}`, {
>>>>>>> origin/main:frontend/src/components/biologist/hooks/useUserManagement.jsx
          withCredentials: true,
          headers: {
            "X-CSRF-Token": csrfToken,
          },
        });

        setUsers(users.filter((user) => user.id !== userId));
        showSuccessModal(
          "User Deleted Successfully!",
          `${userName} has been removed from the system.`
        );
      } catch (error) {
        console.error("Delete failed:", error);
        setError("Failed to delete user");
        showErrorModal(
          "Delete Failed",
          "Unable to delete user. Please try again or contact support."
        );

        if (error.response?.status === 401 || error.response?.status === 403) {
          logout();
          navigate("/login");
        }
      }
    }
  };

  const handleUserProfileClick = (userId) => {
    try {
      const encryptedId = encryptId(userId);
      if (encryptedId) {
        // URL encode the encrypted ID to handle special characters
        const encodedId = encodeURIComponent(encryptedId);
        navigate(`/biologist/user/profile/${encodedId}`);
      } else {
        console.error("Failed to encrypt user ID");
        showErrorModal(
          "Navigation Error",
          "Unable to open user profile. Please try again."
        );
      }
    } catch (error) {
      console.error("Error navigating to user profile:", error);
      showErrorModal(
        "Navigation Error",
        "Unable to open user profile. Please try again."
      );
    }
  };

  return {
    handleUserProfileClick,
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
    // Modal states and functions
    showModal,
    modalConfig,
    setShowModal,
    showSuccessModal,
    showErrorModal,
    showWarningModal,
  };
}
