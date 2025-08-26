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
  const [pendingDeleteProfile, setPendingDeleteProfile] = useState(false);

  // Modal state for success/error messages
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
    type: "success",
    autoClose: true,
  });

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

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
      ];
      if (!allowedTypes.includes(file.type)) {
        showErrorModal(
          "Invalid File Type",
          "Only JPG, JPEG, PNG, and GIF files are allowed for profile images."
        );
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        showErrorModal(
          "File Too Large",
          "Profile image must be less than 5MB. Please choose a smaller image or compress your file."
        );
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
    setPendingDeleteProfile(false);
  };

  const validateProfileForm = () => {
    const errors = [];

    if (!profileFormData.username?.trim()) {
      errors.push("Username is required");
    }
    if (!profileFormData.firstname?.trim()) {
      errors.push("First name is required");
    }
    if (!profileFormData.lastname?.trim()) {
      errors.push("Last name is required");
    }

    if (profileFormData.new_password) {
      if (!profileFormData.current_password) {
        errors.push("Current password is required to change password");
      }
      if (profileFormData.new_password.length < 8) {
        errors.push("New password must be at least 8 characters long");
      }
      if (profileFormData.new_password !== profileFormData.confirm_password) {
        errors.push("New passwords do not match");
      }
    }

    if (errors.length > 0) {
      showErrorModal(
        "Form Validation Failed",
        `Please fix the following errors:\n• ${errors.join("\n• ")}`
      );
      return false;
    }
    return true;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (!validateProfileForm()) {
      return;
    }

    setProfileLoading(true);

    try {
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

      showSuccessModal(
        "Profile Updated Successfully!",
        `Your profile has been updated with the latest information.`,
        true
      );
    } catch (error) {
      console.error("Profile update failed:", error);

      if (error.response?.status === 400) {
        showErrorModal(
          "Invalid Data",
          error.response.data?.error ||
            "Please check your input data and try again."
        );
      } else if (error.response?.status === 401) {
        showErrorModal(
          "Authentication Failed",
          "Current password is incorrect. Please check and try again."
        );
      } else if (error.response?.status === 409) {
        showErrorModal(
          "Username Already Exists",
          "This username is already taken. Please choose a different username."
        );
      } else if (error.response?.status === 413) {
        showErrorModal(
          "File Too Large",
          "The uploaded image is too large. Please choose a smaller image file."
        );
      } else if (error.response?.status === 422) {
        showErrorModal(
          "Invalid File Format",
          "Please upload a valid image file (JPEG, PNG, or GIF format)."
        );
      } else if (error.code === "NETWORK_ERROR") {
        showErrorModal(
          "Connection Error",
          "Unable to connect to the server. Please check your internet connection and try again."
        );
      } else {
        showErrorModal(
          "Update Failed",
          error.response?.data?.error ||
            "Failed to update profile. Please try again or contact support."
        );
      }
    } finally {
      setProfileLoading(false);
    }
  };

  const handleDeleteProfile = () => {
    if (!deletePassword.trim()) {
      setDeleteError("Password is required to delete your account");
      showWarningModal(
        "Password Required",
        "Please enter your current password to confirm account deletion."
      );
      return;
    }

    setPendingDeleteProfile(true);
    setModalConfig({
      title: "⚠️ Permanently Delete Account",
      message: `Are you absolutely sure you want to delete your account?\n\nThis action will:\n• Permanently remove all your data\n• Delete all your uploaded content\n• Revoke all access permissions\n• Cannot be undone\n\nYour account: ${user.firstname} ${user.lastname} (${user.username})`,
      type: "warning",
      autoClose: false,
      customActions: true,
    });
    setShowModal(true);
  };

  const confirmDeleteProfile = async () => {
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

      setShowModal(false);
      closeDeleteModal();
      setPendingDeleteProfile(false);

      showSuccessModal(
        "Account Deleted Successfully",
        "Your account has been permanently deleted. You will be redirected to the homepage shortly.",
        false
      );

      setTimeout(async () => {
        await logout();
        window.location.href = "/";
      }, 2000);
    } catch (error) {
      console.error("Profile deletion failed:", error);

      setShowModal(false);
      setPendingDeleteProfile(false);

      if (error.response?.status === 401) {
        setDeleteError("Incorrect password. Please try again.");
        showErrorModal(
          "Authentication Failed",
          "The password you entered is incorrect. Please check and try again."
        );
      } else if (error.response?.status === 403) {
        showErrorModal(
          "Deletion Not Allowed",
          "Your account cannot be deleted at this time. Please contact support for assistance."
        );
      } else if (error.response?.status === 409) {
        showErrorModal(
          "Account Has Dependencies",
          "Your account cannot be deleted because it has associated data that must be handled first."
        );
      } else if (error.code === "NETWORK_ERROR") {
        showErrorModal(
          "Connection Error",
          "Unable to connect to the server. Please check your internet connection and try again."
        );
      } else {
        setDeleteError(
          error.response?.data?.error ||
            "Failed to delete account. Please try again."
        );
        showErrorModal(
          "Deletion Failed",
          error.response?.data?.error ||
            "Failed to delete account. Please try again or contact support."
        );
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const cancelDeleteProfile = () => {
    setPendingDeleteProfile(false);
    setShowModal(false);
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

    showModal,
    modalConfig,
    setShowModal,
    showSuccessModal,
    showErrorModal,
    showWarningModal,
    confirmDeleteProfile,
    cancelDeleteProfile,
    pendingDeleteProfile,
  };
}
