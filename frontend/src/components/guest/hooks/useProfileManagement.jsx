// src/components/guest/hooks/useProfileManagement.js
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import axios from "axios";
import { API_ENDPOINTS, API_BASE_URL } from '../../../config/api';

export default function useProfileManagement(user) {
  const { updateUser, fetchCsrfToken, logout } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileFormData, setProfileFormData] = useState({
    username: "",
    firstname: "",
    lastname: "",
    bio: "",
    profile_image: null,
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileTab, setProfileTab] = useState("info");
  const [profileErrors, setProfileErrors] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Initialize form data when user changes
  useEffect(() => {
    if (user) {
      setProfileFormData((prev) => ({
        ...prev,
        username: user.username || "",
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        bio: user.bio || "",
      }));

      if (user.profile_image) {
        setProfileImagePreview(`/profile_uploads/${user.profile_image}`);
      }
    }
  }, [user]);

  const openDeleteModal = () => {
    setShowDeleteModal(true);
    setDeletePassword("");
    setDeleteError("");
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletePassword("");
    setDeleteError("");
  };

  // Update the handleDeleteProfile function
  const handleDeleteProfile = async () => {
    if (!deletePassword.trim()) {
      setDeleteError("Password is required");
      return;
    }

    setDeleteLoading(true);
    setDeleteError("");

    try {
      const csrfToken = await fetchCsrfToken();

      await axios.delete(`${API_BASE_URL}/profile`, {
        data: { password: deletePassword },
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        withCredentials: true,
      });

      alert("Account deleted successfully");
      await logout();
      window.location.href = "/";
    } catch (error) {
      console.error("Delete profile failed:", error);
      setDeleteError(
        error.response?.data?.error ||
          "Failed to delete account. Please try again."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileFormData((prev) => ({ ...prev, [name]: value }));

    // Clear specific error when user starts typing
    if (profileErrors[name]) {
      setProfileErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
      ];
      if (!allowedTypes.includes(file.type)) {
        setProfileErrors((prev) => ({
          ...prev,
          profile_image: "Only JPG, JPEG, PNG, and GIF files are allowed",
        }));
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setProfileErrors((prev) => ({
          ...prev,
          profile_image: 'File too large. Maximum size is 5MB.',
        }));
        return;
      }

      setProfileErrors((prev) => ({ ...prev, profile_image: null }));
    
      setProfileFormData((prev) => ({ ...prev, profile_image: file }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Clear error
      setProfileErrors((prev) => ({
        ...prev,
        profile_image: "",
      }));
    }
  };

  const openProfileModal = () => {
    setShowProfileModal(true);
    setProfileErrors({});
    setProfileTab("info");
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
    setProfileFormData((prev) => ({
      ...prev,
      current_password: "",
      new_password: "",
      confirm_password: "",
      profile_image: null,
    }));
    setProfileErrors({});

    // Reset image preview to current user image
    if (user?.profile_image) {
      setProfileImagePreview(`/profile_uploads/${user.profile_image}`);
    } else {
      setProfileImagePreview(null);
    }
  };

  const validateForm = () => {
    const errors = {};

    // Basic info validation
    if (!profileFormData.username.trim()) {
      errors.username = "Username is required";
    } else if (profileFormData.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }

    if (!profileFormData.firstname.trim()) {
      errors.firstname = "First name is required";
    }

    if (!profileFormData.lastname.trim()) {
      errors.lastname = "Last name is required";
    }

    // Password validation (only if changing password)
    if (profileFormData.new_password) {
      if (!profileFormData.current_password) {
        errors.current_password = "Current password is required";
      }

      if (profileFormData.new_password.length < 8) {
        errors.new_password = "New password must be at least 8 characters";
      }

      if (profileFormData.new_password !== profileFormData.confirm_password) {
        errors.confirm_password = "Passwords do not match";
      }
    }

    return errors;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors);
      return;
    }

    setProfileLoading(true);
    setProfileErrors({});

    try {
      const csrfToken = await fetchCsrfToken();

      const formData = new FormData();
      formData.append("username", profileFormData.username);
      formData.append("firstname", profileFormData.firstname);
      formData.append("lastname", profileFormData.lastname);
      formData.append("bio", profileFormData.bio);

      if (profileFormData.current_password) {
        formData.append("current_password", profileFormData.current_password);
      }

      if (profileFormData.new_password) {
        formData.append("new_password", profileFormData.new_password);
      }

      if (profileFormData.profile_image) {
        formData.append("profile_image", profileFormData.profile_image);
      }

      const response = await axios.put(
        `${API_BASE_URL}/profile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-CSRF-Token": csrfToken,
          },
          withCredentials: true,
        }
      );

      if (response.data.user) {
        updateUser(response.data.user);
        alert("Profile updated successfully!");
        closeProfileModal();
      }
    } catch (error) {
      console.error("Profile update failed:", error);

      if (error.response?.data?.error) {
        // Handle specific field errors
        const errorMessage = error.response.data.error;

        if (errorMessage.includes("Username already taken")) {
          setProfileErrors({ username: errorMessage });
        } else if (errorMessage.includes("Current password is incorrect")) {
          setProfileErrors({ current_password: errorMessage });
        } else if (errorMessage.includes("password")) {
          setProfileErrors({ new_password: errorMessage });
        } else {
          setProfileErrors({ general: errorMessage });
        }
      } else {
        setProfileErrors({
          general: "Failed to update profile. Please try again.",
        });
      }
    } finally {
      setProfileLoading(false);
    }
  };

  return {
    showProfileModal,
    profileFormData,
    profileImagePreview,
    profileLoading,
    profileTab,
    profileErrors,
    showDeleteModal,
    deletePassword,
    deleteLoading,
    deleteError,
    openDeleteModal,
    closeDeleteModal,
    setDeletePassword,
    setShowProfileModal,
    setProfileFormData,
    handleProfileInputChange,
    handleProfileImageChange,
    openProfileModal,
    closeProfileModal,
    handleProfileSubmit,
    handleDeleteProfile,
    setProfileTab,
  };
}
// This hook manages the profile management logic for the guest dashboard
// It handles form data, validation, submission, and profile image handling
