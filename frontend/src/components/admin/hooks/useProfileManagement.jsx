// src/components/admin/hooks/useProfileManagement.js
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";

export default function useProfileManagement(user) {
  const { updateUser, fetchCsrfToken, logout } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
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

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileFormData((prev) => ({ ...prev, [name]: value }));
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
        alert("Only JPG, JPEG, PNG, and GIF files are allowed");
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      setProfileFormData((prev) => ({ ...prev, profile_image: file }));
      const reader = new FileReader();
      reader.onload = (e) => setProfileImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const openProfileModal = () => {
    setProfileFormData({
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      bio: user.bio || "",
      profile_image: null,
      current_password: "",
      new_password: "",
      confirm_password: "",
    });
    setProfileImagePreview(
      user.profile_image ? `/profile_uploads/${user.profile_image}` : null
    );
    setShowProfileModal(true);
    setProfileTab("info");
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
    setProfileFormData({
      username: "",
      firstname: "",
      lastname: "",
      bio: "",
      profile_image: null,
      current_password: "",
      new_password: "",
      confirm_password: "",
    });
    setProfileImagePreview(null);
    setProfileTab("info");
  };

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

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);

    try {
      // Validate passwords if changing
      if (profileFormData.new_password) {
        if (!profileFormData.current_password) {
          alert("Current password is required to change password");
          setProfileLoading(false);
          return;
        }
        if (profileFormData.new_password.length < 8) {
          alert("New password must be at least 8 characters long");
          setProfileLoading(false);
          return;
        }
        if (profileFormData.new_password !== profileFormData.confirm_password) {
          alert("New passwords do not match");
          setProfileLoading(false);
          return;
        }
      }

      const formData = new FormData();
      formData.append("username", profileFormData.username);
      formData.append("firstname", profileFormData.firstname);
      formData.append("lastname", profileFormData.lastname);
      formData.append("bio", profileFormData.bio);

      if (profileFormData.new_password) {
        formData.append("current_password", profileFormData.current_password);
        formData.append("new_password", profileFormData.new_password);
      }

      if (profileFormData.profile_image) {
        formData.append("profile_image", profileFormData.profile_image);
      }

      const csrfToken = await fetchCsrfToken();
      const response = await axios.put(
        "http://localhost:5000/profile",
        formData,
        {
          headers: {
            "X-CSRF-Token": csrfToken,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      updateUser(response.data.user);
      closeProfileModal();
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update failed:", error);
      alert(error.response?.data?.error || "Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (!deletePassword.trim()) {
      setDeleteError("Password is required");
      return;
    }

    setDeleteLoading(true);
    setDeleteError("");

    try {
      const csrfToken = await fetchCsrfToken();
      await axios.delete("http://localhost:5000/profile", {
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
      console.error("Profile deletion failed:", error);
      setDeleteError(
        error.response?.data?.error ||
          "Failed to delete account. Please try again."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  return {
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
  };
}

// This hook manages the profile management logic for the admin dashboard
// It handles form data, validation, submission, and profile image handling
// It also includes functionality for deleting the user profile
