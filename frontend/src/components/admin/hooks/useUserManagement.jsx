import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { validateUserForm } from "../utils/validationUtils";
import { encryptId } from "../../../utils/encryption";

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

  // Modal state for success/error messages
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
    type: "success",
    autoClose: true,
  });
  const [pendingDeleteUserId, setPendingDeleteUserId] = useState(null);

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
        const response = await axios.get("http://localhost:5000/admin/users", {
          withCredentials: true,
        });
        setUsers(response.data.users);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch users");
        showErrorModal(
          "Failed to Load Users",
          "Unable to fetch user data. Please refresh the page or check your connection."
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

    const errors = validateUserForm(formData, userModalMode);
    if (Object.keys(errors).length > 0) {
      setUserFormErrors(errors);
      setIsSubmitting(false);
      showWarningModal(
        "Form Validation Failed",
        "Please check the highlighted fields and correct any errors before submitting."
      );
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

        showSuccessModal(
          "User Created Successfully!",
          `${formData.firstname} ${formData.lastname} has been successfully created as a ${formData.roletype}.\n\nUsername: ${formData.username}`,
          true
        );
      } else {
        const updateData = { ...formData };
        if (!updateData.password?.trim()) {
          delete updateData.password; // Remove empty password from request
        }

        response = await axios.put(
          `http://localhost:5000/admin/users/${selectedUser.id}`,
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
          `${updateData.firstname} ${updateData.lastname}'s profile has been updated with the latest information.`,
          true
        );
      }

      closeUserModal();
    } catch (error) {
      console.error("User operation failed:", error);

      if (error.response?.data?.error) {
        if (error.response.data.error.includes("Username already")) {
          setUserFormErrors({ username: "Username already exists" });
          showErrorModal(
            "Username Already Exists",
            "This username is already taken. Please choose a different username."
          );
        } else if (error.response.data.error.includes("Invalid email")) {
          setUserFormErrors({ email: "Invalid email format" });
          showErrorModal(
            "Invalid Email",
            "Please enter a valid email address."
          );
        } else if (error.response.status === 400) {
          showErrorModal(
            "Invalid Data",
            "Please check your input data and ensure all required fields are filled correctly."
          );
        } else if (error.response.status === 403) {
          showErrorModal(
            "Permission Denied",
            "You don't have permission to perform this action."
          );
        } else if (error.response.status === 409) {
          showErrorModal(
            "Conflict",
            "A user with similar information already exists in the system."
          );
        } else {
          showErrorModal("Operation Failed", error.response.data.error);
        }
      } else if (error.code === "NETWORK_ERROR") {
        showErrorModal(
          "Connection Error",
          "Unable to connect to the server. Please check your internet connection and try again."
        );
      } else {
        showErrorModal(
          "Unexpected Error",
          `Failed to ${userModalMode} user. Please try again or contact support if the problem persists.`
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (userId) => {
    const userToDelete = users.find((u) => u.id === userId);
    const userName = userToDelete
      ? `${userToDelete.firstname} ${userToDelete.lastname}`
      : "this user";
    const userRole = userToDelete ? userToDelete.roletype : "user";

    setPendingDeleteUserId(userId);
    setModalConfig({
      title: "Confirm User Deletion",
      message: `Are you sure you want to permanently delete ${userName} (${userRole})?\n\nThis action cannot be undone and will:\n• Remove all user data\n• Revoke all access permissions\n• Delete associated records`,
      type: "warning",
      autoClose: false,
      customActions: true,
    });
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteUserId) return;

    const userId = pendingDeleteUserId;
    const userToDelete = users.find((u) => u.id === userId);
    const userName = userToDelete
      ? `${userToDelete.firstname} ${userToDelete.lastname}`
      : "this user";

    try {
      const csrfResponse = await axios.get("http://localhost:5000/csrf-token", {
        withCredentials: true,
      });
      const csrfToken = csrfResponse.data.csrf_token;

      await axios.delete(`http://localhost:5000/admin/users/${userId}`, {
        withCredentials: true,
        headers: {
          "X-CSRF-Token": csrfToken,
        },
      });

      setUsers(users.filter((user) => user.id !== userId));

      setPendingDeleteUserId(null);
      setShowModal(false);

      showSuccessModal(
        "User Deleted Successfully!",
        `${userName} has been permanently removed from the system.\n\nAll associated data and permissions have been revoked.`,
        true
      );
    } catch (error) {
      console.error("Delete failed:", error);
      setError("Failed to delete user");

      setPendingDeleteUserId(null);
      setShowModal(false);

      if (error.response?.status === 401) {
        showErrorModal(
          "Authentication Required",
          "Your session has expired. Please log in again to continue."
        );
        logout();
        navigate("/login");
      } else if (error.response?.status === 403) {
        showErrorModal(
          "Permission Denied",
          "You don't have permission to delete this user. Contact your administrator if you believe this is an error."
        );
      } else if (error.response?.status === 404) {
        showErrorModal(
          "User Not Found",
          "The user you're trying to delete no longer exists or may have already been removed."
        );
        // Refresh the users list
        setUsers(users.filter((user) => user.id !== userId));
      } else if (error.response?.status === 409) {
        showErrorModal(
          "Cannot Delete User",
          "This user cannot be deleted because they have associated records or dependencies in the system."
        );
      } else if (error.code === "NETWORK_ERROR") {
        showErrorModal(
          "Connection Error",
          "Unable to connect to the server. Please check your internet connection and try again."
        );
      } else {
        showErrorModal(
          "Delete Failed",
          "Unable to delete the user. Please try again or contact support if the problem persists."
        );
      }
    }
  };

  const cancelDelete = () => {
    setPendingDeleteUserId(null);
    setShowModal(false);
  };

  const handleUserProfileClick = (userId) => {
    try {
      const encryptedId = encryptId(userId);
      if (encryptedId) {
        // URL encode the encrypted ID to handle special characters
        const encodedId = encodeURIComponent(encryptedId);
        navigate(`/admin/users/${encodedId}`);
      } else {
        console.error("Failed to encrypt user ID");
        showErrorModal(
          "Navigation Error",
          "Unable to encrypt user ID for secure navigation. Please try again."
        );
      }
    } catch (error) {
      console.error("Error navigating to user profile:", error);
      showErrorModal(
        "Navigation Error",
        "An error occurred while trying to open the user profile. Please try again."
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

    showModal,
    modalConfig,
    setShowModal,
    showSuccessModal,
    showErrorModal,
    showWarningModal,
    confirmDelete,
    cancelDelete,
    pendingDeleteUserId,
  };
}
