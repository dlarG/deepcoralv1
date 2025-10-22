import React, { useState, useEffect } from "react";
import {
  FiX,
  FiSettings,
  FiCpu,
  FiUpload,
  FiDownload,
  FiRefreshCw,
  FiCheck,
  FiAlertTriangle,
  FiFile,
  FiTrash2,
} from "react-icons/fi";
import useSystemSettings from "../hooks/useSystemSettings";
import "../styles/settingModal.css";

const SystemSettingsModal = ({ isOpen, onClose, darkMode }) => {
  const [activeTab, setActiveTab] = useState("system");

  const {
    loading,
    message,
    modelFiles,
    currentModels,
    systemSettings,
    initializeData,
    handleFileChange,
    handleModelUpload,
    handleUploadBothModels,
    handleSystemSettingsUpdate,
    handleDeleteModel,
    updateSystemSettings,
    clearMessage,
  } = useSystemSettings();

  // Initialize data when modal opens
  useEffect(() => {
    if (isOpen) {
      initializeData();
    }
  }, [isOpen]);

  // Clear message when modal closes
  useEffect(() => {
    if (!isOpen) {
      clearMessage();
    }
  }, [isOpen]);

  const handleSystemSettingChange = (key, value) => {
    updateSystemSettings({ [key]: value });
  };

  const handleFileUpload = (modelType, event) => {
    const file = event.target.files[0];
    handleFileChange(modelType, file);
  };

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${darkMode ? "dark" : ""}`}>
      <div className="system-settings-modal">
        <div className="modal-header">
          <h2>
            <FiSettings size={24} />
            System Settings
          </h2>
          <button className="close-btn" onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        <div className="modal-tabs">
          <button
            className={`tab-btn ${activeTab === "system" ? "active" : ""}`}
            onClick={() => setActiveTab("system")}
          >
            <FiSettings size={16} />
            System Settings
          </button>
          <button
            className={`tab-btn ${activeTab === "models" ? "active" : ""}`}
            onClick={() => setActiveTab("models")}
          >
            <FiCpu size={16} />
            Model Settings
          </button>
        </div>

        <div className="modal-content">
          {message.text && (
            <div className={`message ${message.type}`}>
              {message.type === "success" ? <FiCheck /> : <FiAlertTriangle />}
              {message.text}
            </div>
          )}

          {activeTab === "system" && (
            <div className="system-settings-content">
              <h3>General Settings</h3>

              <div className="settings-grid">
                <div className="setting-item">
                  <label>Maximum Image Size (MB)</label>
                  <input
                    type="number"
                    value={systemSettings.maxImageSize}
                    onChange={(e) =>
                      handleSystemSettingChange("maxImageSize", e.target.value)
                    }
                    min="1"
                    max="100"
                  />
                </div>

                <div className="setting-item">
                  <label>Analysis Timeout (seconds)</label>
                  <input
                    type="number"
                    value={systemSettings.analysisTimeout}
                    onChange={(e) =>
                      handleSystemSettingChange(
                        "analysisTimeout",
                        e.target.value
                      )
                    }
                    min="60"
                    max="3600"
                  />
                </div>

                <div className="setting-item">
                  <label>Max Concurrent Analysis</label>
                  <input
                    type="number"
                    value={systemSettings.maxConcurrentAnalysis}
                    onChange={(e) =>
                      handleSystemSettingChange(
                        "maxConcurrentAnalysis",
                        e.target.value
                      )
                    }
                    min="1"
                    max="20"
                  />
                </div>

                <div className="setting-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={systemSettings.autoBackup}
                      onChange={(e) =>
                        handleSystemSettingChange(
                          "autoBackup",
                          e.target.checked
                        )
                      }
                    />
                    Enable Auto Backup
                  </label>
                </div>
              </div>

              <div className="settings-actions">
                <button
                  className="btn btn-primary"
                  onClick={handleSystemSettingsUpdate}
                  disabled={loading}
                >
                  {loading ? <FiRefreshCw className="spin" /> : <FiCheck />}
                  Update Settings
                </button>
              </div>
            </div>
          )}

          {activeTab === "models" && (
            <div className="model-settings-content">
              <h3>AI Model Management</h3>

              {/* Current Models Status */}
              <div className="current-models">
                <h4>Current Models</h4>
                <div className="models-grid">
                  <div className="model-card">
                    <div className="model-header">
                      <FiCpu size={20} />
                      <h5>Auto Crop Model</h5>
                    </div>
                    <div className="model-info">
                      <p>
                        <strong>File:</strong> {currentModels.autocrop.name}
                      </p>
                      <p>
                        <strong>Size:</strong> {currentModels.autocrop.size}
                      </p>
                      <p>
                        <strong>Last Modified:</strong>{" "}
                        {currentModels.autocrop.lastModified}
                      </p>
                    </div>
                    <div className="model-actions">
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteModel("autocrop")}
                        disabled={
                          loading ||
                          currentModels.autocrop.name === "No model selected" ||
                          currentModels.autocrop.name === "No model available"
                        }
                      >
                        <FiTrash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="model-card">
                    <div className="model-header">
                      <FiCpu size={20} />
                      <h5>U-Net Segmentation Model</h5>
                    </div>
                    <div className="model-info">
                      <p>
                        <strong>File:</strong> {currentModels.unet.name}
                      </p>
                      <p>
                        <strong>Size:</strong> {currentModels.unet.size}
                      </p>
                      <p>
                        <strong>Last Modified:</strong>{" "}
                        {currentModels.unet.lastModified}
                      </p>
                    </div>
                    <div className="model-actions">
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteModel("unet")}
                        disabled={
                          loading ||
                          currentModels.unet.name === "No model selected" ||
                          currentModels.unet.name === "No model available"
                        }
                      >
                        <FiTrash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upload New Models */}
              <div className="upload-models">
                <h4>Upload New Models</h4>

                <div className="upload-grid">
                  <div className="upload-section">
                    <label>Auto Crop Model</label>
                    <div className="file-input-wrapper">
                      <input
                        type="file"
                        id="autocrop-upload"
                        accept=".h5,.pkl,.pt,.pth,.onnx"
                        onChange={(e) => handleFileUpload("autocrop", e)}
                      />
                      <label
                        htmlFor="autocrop-upload"
                        className="file-input-label"
                      >
                        <FiUpload />
                        {modelFiles.autocrop
                          ? modelFiles.autocrop.name
                          : "Choose Auto Crop Model"}
                      </label>
                    </div>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleModelUpload("autocrop")}
                      disabled={loading || !modelFiles.autocrop}
                    >
                      {loading ? (
                        <FiRefreshCw className="spin" />
                      ) : (
                        <FiUpload />
                      )}
                      Upload Auto Crop
                    </button>
                  </div>

                  <div className="upload-section">
                    <label>U-Net Segmentation Model</label>
                    <div className="file-input-wrapper">
                      <input
                        type="file"
                        id="unet-upload"
                        accept=".h5,.pkl,.pt,.pth,.onnx"
                        onChange={(e) => handleFileUpload("unet", e)}
                      />
                      <label htmlFor="unet-upload" className="file-input-label">
                        <FiUpload />
                        {modelFiles.unet
                          ? modelFiles.unet.name
                          : "Choose U-Net Model"}
                      </label>
                    </div>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleModelUpload("unet")}
                      disabled={loading || !modelFiles.unet}
                    >
                      {loading ? (
                        <FiRefreshCw className="spin" />
                      ) : (
                        <FiUpload />
                      )}
                      Upload U-Net
                    </button>
                  </div>
                </div>

                <div className="upload-both">
                  <button
                    className="btn btn-primary"
                    onClick={handleUploadBothModels}
                    disabled={
                      loading || !modelFiles.autocrop || !modelFiles.unet
                    }
                  >
                    {loading ? <FiRefreshCw className="spin" /> : <FiUpload />}
                    Upload Both Models
                  </button>
                </div>
              </div>

              <div className="model-info-section">
                <h4>Supported Model Formats</h4>
                <div className="format-list">
                  <span className="format-badge">.h5</span>
                  <span className="format-badge">.pkl</span>
                  <span className="format-badge">.pt</span>
                  <span className="format-badge">.pth</span>
                  <span className="format-badge">.onnx</span>
                </div>
                <p className="format-note">
                  Please ensure your models are compatible with the current
                  system architecture. Models will be validated before
                  replacement.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemSettingsModal;
