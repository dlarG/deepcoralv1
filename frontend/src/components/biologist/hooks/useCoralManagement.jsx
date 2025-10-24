import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";

export default function useCoralManagement() {
  const { fetchCsrfToken, authAxios } = useAuth();
  const [coralData, setCoralData] = useState([]);
  const [showCoralModal, setShowCoralModal] = useState(false);
  const [coralModalMode, setCoralModalMode] = useState("add");
  const [currentCoral, setCurrentCoral] = useState(null);
  const [coralFormData, setCoralFormData] = useState({
    coral_type: "",
    coral_subtype: "",
    classification: "",
    scientific_name: "",
    common_name: "",
    identification: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [coralLoading, setCoralLoading] = useState(false);

  // Modal state for success/error messages
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
    type: "success",
    autoClose: true,
  });

  // Add state for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [coralToDelete, setCoralToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // Delete confirmation modal
  const showDeleteConfirmation = (coral) => {
    setCoralToDelete(coral);
    setShowDeleteModal(true);
  };

  const hideDeleteConfirmation = () => {
    setShowDeleteModal(false);
    setCoralToDelete(null);
    setIsDeleting(false);
  };

  useEffect(() => {
    const fetchCoralData = async () => {
      try {
        const response = await authAxios.get("/coral_info");
        setCoralData(response.data.data || []);
      } catch (err) {
        console.error("Failed to fetch coral data:", err);
        showErrorModal(
          "Failed to Load Coral Data",
          "Unable to fetch coral information. Please refresh the page or try again later."
        );
      }
    };

    fetchCoralData();
  }, [authAxios]);

  const handleCoralInputChange = (e) => {
    const { name, value } = e.target;
    setCoralFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCoralImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        showErrorModal(
          "Invalid File Type",
          "Please select a valid image file (JPEG, PNG, or WEBP format only)."
        );
        return;
      }

      const maxSize = 10 * 1024 * 1024; // 10MB LIMIT
      if (file.size > maxSize) {
        showErrorModal(
          "File Too Large",
          "Please select an image smaller than 5MB."
        );
        return;
      }

      setCoralFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const openCoralModal = (mode, coral = null) => {
    setCoralModalMode(mode);
    setCurrentCoral(coral);

    if (mode === "add") {
      setCoralFormData({
        coral_type: "",
        coral_subtype: "",
        classification: "",
        scientific_name: "",
        common_name: "",
        identification: "",
        image: null,
      });
      setImagePreview(null);
    } else if (mode === "edit" && coral) {
      setCoralFormData({
        coral_type: coral.coral_type,
        coral_subtype: coral.coral_subtype,
        classification: coral.classification,
        scientific_name: coral.scientific_name,
        common_name: coral.common_name,
        identification: coral.identification,
        image: null,
      });
      setImagePreview(
        coral.image ? `/uploaded_coral_information/${coral.image}` : null
      );
    }

    setShowCoralModal(true);
  };

  const closeCoralModal = () => {
    setShowCoralModal(false);
    setCurrentCoral(null);
    setCoralFormData({
      coral_type: "",
      coral_subtype: "",
      classification: "",
      scientific_name: "",
      common_name: "",
      identification: "",
      image: null,
    });
    setImagePreview(null);
  };

  const validateCoralForm = () => {
    const errors = [];

    if (!coralFormData.coral_type?.trim()) {
      errors.push("Coral Type is required");
    }
    if (!coralFormData.scientific_name?.trim()) {
      errors.push("Scientific Name is required");
    }
    if (!coralFormData.common_name?.trim()) {
      errors.push("Common Name is required");
    }
    if (!coralFormData.classification?.trim()) {
      errors.push("Classification is required");
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

  const handleCoralSubmit = async (e) => {
    e.preventDefault();

    if (!validateCoralForm()) {
      return;
    }

    setCoralLoading(true);

    try {
      const formData = new FormData();
      Object.keys(coralFormData).forEach((key) => {
        if (coralFormData[key] !== null && coralFormData[key] !== "") {
          formData.append(key, coralFormData[key]);
        }
      });

      const csrfToken = await fetchCsrfToken();
      let response;

      if (coralModalMode === "add") {
        response = await axios.post(
          "http://localhost:5000/biologist/corals",
          formData,
          {
            headers: {
              "X-CSRF-Token": csrfToken,
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
        setCoralData((prev) => [...prev, response.data.coral]);

        showSuccessModal(
          "Coral Added Successfully!",
          `${coralFormData.common_name} (${coralFormData.scientific_name}) has been added to the coral database.`,
          true
        );
      } else if (coralModalMode === "edit") {
        response = await axios.put(
          `http://localhost:5000/biologist/corals/${currentCoral.id}`,
          formData,
          {
            headers: {
              "X-CSRF-Token": csrfToken,
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
        setCoralData((prev) =>
          prev.map((c) => (c.id === currentCoral.id ? response.data.coral : c))
        );

        showSuccessModal(
          "Coral Updated Successfully!",
          `${coralFormData.common_name} information has been updated in the database.`,
          true
        );
      }

      closeCoralModal();
    } catch (error) {
      console.error("Coral operation failed:", error);

      if (error.response?.status === 400) {
        showErrorModal(
          "Invalid Data",
          error.response.data?.error ||
            "Please check your input data and try again."
        );
      } else if (error.response?.status === 409) {
        showErrorModal(
          "Duplicate Entry",
          "A coral with this information already exists in the database."
        );
      } else if (error.response?.status === 413) {
        showErrorModal(
          "File Too Large",
          "The uploaded image is too large. Please choose a smaller image file."
        );
      } else if (error.response?.status === 422) {
        showErrorModal(
          "Invalid File Format",
          "Please upload a valid image file (JPEG, PNG, or WEBP format)."
        );
      } else {
        showErrorModal(
          "Operation Failed",
          `Failed to ${coralModalMode} coral information. Please check your connection and try again.`
        );
      }
    } finally {
      setCoralLoading(false);
    }
  };

  // Updated handleDeleteCoral to use modal instead of window.confirm
  const handleDeleteCoral = (coralId) => {
    const coral = coralData.find((c) => c.id === coralId);
    if (coral) {
      showDeleteConfirmation(coral);
    }
  };

  // Actual delete function that gets called after confirmation
  const confirmDeleteCoral = async () => {
    if (!coralToDelete) return;

    setIsDeleting(true);

    try {
      const csrfToken = await fetchCsrfToken();
      await axios.delete(
        `http://localhost:5000/biologist/corals/${coralToDelete.id}`,
        {
          headers: { "X-CSRF-Token": csrfToken },
          withCredentials: true,
        }
      );

      setCoralData((prev) => prev.filter((c) => c.id !== coralToDelete.id));

      // Close delete modal first
      hideDeleteConfirmation();

      // Then show success message
      showSuccessModal(
        "Coral Deleted Successfully!",
        `${coralToDelete.common_name} has been permanently removed from the coral database.`,
        true
      );
    } catch (error) {
      console.error("Delete failed:", error);

      // Close delete modal first
      hideDeleteConfirmation();

      // Then show error message
      if (error.response?.status === 404) {
        showErrorModal(
          "Coral Not Found",
          "The coral information you're trying to delete no longer exists."
        );
      } else if (error.response?.status === 409) {
        showErrorModal(
          "Cannot Delete",
          "This coral information is being used and cannot be deleted."
        );
      } else {
        showErrorModal(
          "Delete Failed",
          "Unable to delete coral information. Please try again or contact support."
        );
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    coralData,
    showCoralModal,
    coralModalMode,
    currentCoral,
    coralFormData,
    imagePreview,
    coralLoading,
    handleCoralInputChange,
    handleCoralImageChange,
    openCoralModal,
    closeCoralModal,
    handleCoralSubmit,
    handleDeleteCoral,

    // Modal states and functions
    showModal,
    modalConfig,
    setShowModal,
    showSuccessModal,
    showErrorModal,
    showWarningModal,

    // Delete confirmation modal
    showDeleteModal,
    coralToDelete,
    isDeleting,
    hideDeleteConfirmation,
    confirmDeleteCoral,
  };
}
