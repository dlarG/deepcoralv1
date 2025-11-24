import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";

export default function useSystemSettings() {
  const { logout } = useAuth();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [modelFiles, setModelFiles] = useState({
    autocrop: null,
    unet: null,
  });
  const [currentModels, setCurrentModels] = useState({
    autocrop: { name: "No model selected", size: "0 MB", lastModified: "" },
    unet: { name: "No model selected", size: "0 MB", lastModified: "" },
  });
  const [systemSettings, setSystemSettings] = useState({
    maxImageSize: "10",
    allowedFormats: ["jpg", "jpeg", "png"],
    autoBackup: true,
    analysisTimeout: "300",
    maxConcurrentAnalysis: "5",
  });

  // Clear message after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message.text]);

  // Fetch current models
  const fetchCurrentModels = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/admin/models/current`,
        {
          withCredentials: true,
        }
      );
      setCurrentModels(response.data.models);
      return response.data.models;
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
        return;
      }

      // Set default values if API fails
      const defaultModels = {
        autocrop: {
          name: "No model available",
          size: "0 MB",
          lastModified: "Never",
        },
        unet: {
          name: "No model available",
          size: "0 MB",
          lastModified: "Never",
        },
      };
      setCurrentModels(defaultModels);

      setMessage({
        type: "error",
        text: "Failed to fetch current models. Using default values.",
      });

      return defaultModels;
    }
  };

  // Fetch system settings
  const fetchSystemSettings = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/admin/system/settings`,
        {
          withCredentials: true,
        }
      );
      console.log("✅ Settings fetched:", response.data);
      setSystemSettings(response.data.settings);
      return response.data.settings;
    } catch (error) {
      console.error("Error fetching system settings:", error);

      if (error.response?.status === 401) {
        logout();
        return;
      }

      // Keep default settings if API fails
      setMessage({
        type: "error",
        text: "Failed to fetch system settings. Using default values.",
      });

      return systemSettings;
    }
  };

  // Initialize data when modal opens
  const initializeData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchCurrentModels(), fetchSystemSettings()]);
    } catch (error) {
      console.error(" Error initializing data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle file change
  const handleFileChange = (modelType, file) => {
    if (file) {
      // Validate file type
      const allowedExtensions = [".h5", ".pkl", ".pt", ".pth", ".onnx"];
      const fileExtension = file.name
        .toLowerCase()
        .substring(file.name.lastIndexOf("."));

      if (!allowedExtensions.includes(fileExtension)) {
        setMessage({
          type: "error",
          text: "Invalid file type. Please select a valid model file (.h5, .pkl, .pt, .pth, .onnx)",
        });
        return false;
      }

      setModelFiles((prev) => ({
        ...prev,
        [modelType]: file,
      }));
      setMessage({ type: "", text: "" });
      return true;
    }
    return false;
  };

  // Upload single model
  const handleModelUpload = async (modelType) => {
    const file = modelFiles[modelType];
    if (!file) {
      setMessage({
        type: "error",
        text: `Please select a ${
          modelType === "autocrop" ? "Auto Crop" : "U-Net Segmentation"
        } model file first.`,
      });
      return false;
    }

    setLoading(true);
    try {
      console.log(`📤 Uploading ${modelType} model...`);
      const formData = new FormData();
      formData.append("model", file);
      formData.append("model_type", modelType);

      await axios.post(
        `${process.env.REACT_APP_API_URL}/admin/models/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      setMessage({
        type: "success",
        text: `${
          modelType === "autocrop" ? "Auto Crop" : "U-Net Segmentation"
        } model uploaded successfully!`,
      });

      // Reset file input
      setModelFiles((prev) => ({
        ...prev,
        [modelType]: null,
      }));

      // Refresh current models
      await fetchCurrentModels();
      return true;
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
        return false;
      }

      setMessage({
        type: "error",
        text: error.response?.data?.error || "Error uploading model",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Upload both models
  const handleUploadBothModels = async () => {
    if (!modelFiles.autocrop || !modelFiles.unet) {
      setMessage({
        type: "error",
        text: "Please select both Auto Crop and U-Net Segmentation model files.",
      });
      return false;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("autocrop_model", modelFiles.autocrop);
      formData.append("unet_model", modelFiles.unet);

      await axios.post(
        `${process.env.REACT_APP_API_URL}/admin/models/upload-both`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      setMessage({
        type: "success",
        text: "Both models uploaded successfully!",
      });

      // Reset file inputs
      setModelFiles({
        autocrop: null,
        unet: null,
      });

      // Refresh current models
      await fetchCurrentModels();
      return true;
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
        return false;
      }

      setMessage({
        type: "error",
        text: error.response?.data?.error || "Error uploading models",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update system settings
  const handleSystemSettingsUpdate = async () => {
    setLoading(true);
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/admin/system/settings`,
        systemSettings,
        {
          withCredentials: true,
        }
      );

      setMessage({
        type: "success",
        text: "System settings updated successfully!",
      });
      return true;
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
        return false;
      }

      setMessage({
        type: "error",
        text: error.response?.data?.error || "Error updating system settings",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete model
  const handleDeleteModel = async (modelType) => {
    const modelName =
      modelType === "autocrop" ? "Auto Crop" : "U-Net Segmentation";

    if (
      !window.confirm(`Are you sure you want to delete the ${modelName} model?`)
    ) {
      return false;
    }

    setLoading(true);
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/admin/models/${modelType}`,
        {
          withCredentials: true,
        }
      );

      setMessage({
        type: "success",
        text: `${modelName} model deleted successfully!`,
      });

      await fetchCurrentModels();
      return true;
    } catch (error) {
      console.error("❌ Error deleting model:", error);

      if (error.response?.status === 401) {
        logout();
        return false;
      }

      setMessage({
        type: "error",
        text: error.response?.data?.error || "Error deleting model",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update system settings state
  const updateSystemSettings = (updates) => {
    setSystemSettings((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  // Clear file selection
  const clearFileSelection = (modelType) => {
    setModelFiles((prev) => ({
      ...prev,
      [modelType]: null,
    }));
  };

  // Clear all messages
  const clearMessage = () => {
    setMessage({ type: "", text: "" });
  };

  // Refresh all data
  const refreshData = async () => {
    await initializeData();
  };

  return {
    // State
    loading,
    message,
    modelFiles,
    currentModels,
    systemSettings,

    // Actions
    initializeData,
    handleFileChange,
    handleModelUpload,
    handleUploadBothModels,
    handleSystemSettingsUpdate,
    handleDeleteModel,
    updateSystemSettings,
    clearFileSelection,
    clearMessage,
    refreshData,

    // Individual fetch functions
    fetchCurrentModels,
    fetchSystemSettings,
  };
}
