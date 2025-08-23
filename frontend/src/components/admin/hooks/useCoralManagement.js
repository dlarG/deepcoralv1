// src/components/admin/hooks/useCoralManagement.js
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import { API_ENDPOINTS, API_BASE_URL } from '../../../config/api';

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

  useEffect(() => {
    const fetchCoralData = async () => {
      try {
        // REPLACE: "/coral_info" with API endpoint
        const response = await authAxios.get(`${API_BASE_URL}/coral_info`);
        setCoralData(response.data.data || []);
      } catch (err) {
        console.error("Failed to fetch coral data:", err);
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

  const handleCoralSubmit = async (e) => {
    e.preventDefault();
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
          `${API_BASE_URL}/admin/corals`,
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
        alert("Coral information added successfully!");
      } else if (coralModalMode === "edit") {
        response = await axios.put(
          `${API_BASE_URL}/admin/corals/${currentCoral.id}`,
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
      }

      closeCoralModal();
      alert("Coral information saved successfully!");
    } catch (error) {
      console.error("Coral operation failed:", error);
    } finally {
      setCoralLoading(false);
    }
  };

  const handleDeleteCoral = async (coralId) => {
    if (
      !window.confirm("Are you sure you want to delete this coral information?")
    )
      return;

    try {
      const csrfToken = await fetchCsrfToken();
      await axios.delete(`${API_BASE_URL}/admin/corals/${coralId}`, {
        headers: { "X-CSRF-Token": csrfToken },
        withCredentials: true,
      });
      setCoralData((prev) => prev.filter((c) => c.id !== coralId));
      alert("Coral information deleted successfully!");
    } catch (error) {
      console.error("Delete failed:", error);
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
  };
}
