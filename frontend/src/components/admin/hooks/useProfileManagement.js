// src/components/admin/hooks/useProfileManagement.js
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";

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

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
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

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
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
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update failed:", error);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (
      !window.confirm("⚠️ Warning: This action cannot be undone. Are you sure?")
    )
      return;

    try {
      const csrfToken = await fetchCsrfToken();
      await axios.delete(`http://localhost:5000/admin/users/${user.id}`, {
        headers: { "X-CSRF-Token": csrfToken },
        withCredentials: true,
      });
      logout();
    } catch (error) {
      console.error("Profile deletion failed:", error);
    }
  };

  return {
    showProfileModal,
    profileFormData,
    profileImagePreview,
    profileLoading,
    profileTab,
    handleProfileInputChange,
    handleProfileImageChange,
    openProfileModal,
    closeProfileModal,
    handleProfileSubmit,
    handleDeleteProfile,
    setProfileTab,
  };
}
