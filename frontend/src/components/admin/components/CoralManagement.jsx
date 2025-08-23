// src/components/admin/components/CoralManagement.js
import React from "react";
import {
  FiPlus,
  FiEdit,
  FiTrash,
  FiEye,
  FiDatabase,
  FiX,
  FiUpload,
} from "react-icons/fi";
import useCoralManagement from "../hooks/useCoralManagement";
import SuccessModal from "../../SuccessMessage";

function CoralManagement() {
  const {
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
    showModal,
    modalConfig,
    setShowModal,
  } = useCoralManagement();

  return (
    <div className="content-section">
      <div className="coral-management-header">
        <h2 className="content-title">Coral Information Management</h2>
        <button className="add-coral-btn" onClick={() => openCoralModal("add")}>
          <FiPlus size={20} />
          Add New Coral
        </button>
      </div>

      <div className="coral-grid-container">
        {coralData.length === 0 ? (
          <div className="empty-state">
            <FiDatabase size={48} />
            <h3>No Coral Information</h3>
            <p>Start by adding your first coral information entry.</p>
            <button
              className="add-coral-btn"
              onClick={() => openCoralModal("add")}
            >
              <FiPlus size={20} />
              Add Coral
            </button>
          </div>
        ) : (
          <div className="coral-grid">
            {coralData.map((coral) => (
              <div key={coral.id} className="coral-management-card">
                <div className="coral-card-image">
                  <img
                    src={
                      coral.image
                        ? `/uploaded_coral_information/${coral.image}`
                        : "/default-coral.jpg"
                    }
                    alt={coral.common_name}
                    onError={(e) => {
                      e.target.src = "/default-coral.jpg";
                    }}
                  />
                  <div className="coral-card-overlay">
                    <button
                      className="overlay-btn view"
                      onClick={() => openCoralModal("view", coral)}
                      title="View Details"
                    >
                      <FiEye size={18} />
                    </button>
                    <button
                      className="overlay-btn edit"
                      onClick={() => openCoralModal("edit", coral)}
                      title="Edit"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      className="overlay-btn delete"
                      onClick={() => handleDeleteCoral(coral.id)}
                      title="Delete"
                    >
                      <FiTrash size={18} />
                    </button>
                  </div>
                </div>

                <div className="coral-card-content">
                  <div className="coral-card-header">
                    <h3 className="coral-card-title">{coral.common_name}</h3>
                    <span
                      className={`classification-badge ${coral.classification.replace(
                        " ",
                        "-"
                      )}`}
                    >
                      {coral.classification}
                    </span>
                  </div>

                  <p className="coral-card-scientific">
                    {coral.scientific_name}
                  </p>

                  <div className="coral-card-info">
                    <span className="info-item">
                      <strong>Type:</strong> {coral.coral_type}
                    </span>
                    <span className="info-item">
                      <strong>Subtype:</strong> {coral.coral_subtype}
                    </span>
                  </div>

                  <p className="coral-card-description">
                    {coral.identification.length > 100
                      ? `${coral.identification.substring(0, 100)}...`
                      : coral.identification}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCoralModal && (
        <div className="modal-overlay">
          <div className="coral-modal">
            <div className="coral-modal-header">
              <h3>
                {coralModalMode === "add"
                  ? "Add New Coral"
                  : coralModalMode === "edit"
                  ? "Edit Coral"
                  : "View Coral"}
              </h3>
              <button className="close-btn" onClick={closeCoralModal}>
                <FiX size={24} />
              </button>
            </div>

            <div className="coral-modal-body">
              {coralModalMode === "view" ? (
                <div className="coral-view">
                  <div className="coral-view-image">
                    <img
                      src={
                        currentCoral?.image
                          ? `/uploaded_coral_information/${currentCoral.image}`
                          : "/default-coral.jpg"
                      }
                      alt={currentCoral?.common_name}
                    />
                  </div>
                  <div className="coral-view-info">
                    <h2>{currentCoral?.common_name}</h2>
                    <p className="scientific-name">
                      {currentCoral?.scientific_name}
                    </p>
                    <div className="coral-details">
                      <div className="detail-item">
                        <span className="label">Type:</span>
                        <span className="value">
                          {currentCoral?.coral_type}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Subtype:</span>
                        <span className="value">
                          {currentCoral?.coral_subtype}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Classification:</span>
                        <span className="value">
                          {currentCoral.classification}
                        </span>
                      </div>
                    </div>
                    <div className="identification">
                      <h4>Identification:</h4>
                      <p>{currentCoral?.identification}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleCoralSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Coral Type *</label>
                      <input
                        type="text"
                        name="coral_type"
                        value={coralFormData.coral_type}
                        onChange={handleCoralInputChange}
                        required
                        placeholder="e.g., Hard Coral, Soft Coral"
                      />
                    </div>
                    <div className="form-group">
                      <label>Coral Subtype *</label>
                      <input
                        type="text"
                        name="coral_subtype"
                        value={coralFormData.coral_subtype}
                        onChange={handleCoralInputChange}
                        required
                        placeholder="e.g., Branching, Massive"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Classification *</label>
                      <select
                        name="classification"
                        value={coralFormData.classification}
                        onChange={handleCoralInputChange}
                        required
                      >
                        <option value="">Select Classification</option>
                        <option value="hard coral">Hard Coral</option>
                        <option value="soft coral">Soft Coral</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Common Name *</label>
                      <input
                        type="text"
                        name="common_name"
                        value={coralFormData.common_name}
                        onChange={handleCoralInputChange}
                        required
                        placeholder="e.g., Staghorn Coral"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Scientific Name *</label>
                    <input
                      type="text"
                      name="scientific_name"
                      value={coralFormData.scientific_name}
                      onChange={handleCoralInputChange}
                      required
                      placeholder="e.g., Acropora cervicornis"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Coral Image{" "}
                      {coralModalMode === "add" ? "*" : "(optional)"}
                    </label>
                    <div className="image-upload-container">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoralImageChange}
                        className="file-input"
                        id="coral-image"
                        required={coralModalMode === "add"}
                      />
                      <label htmlFor="coral-image" className="file-label">
                        <FiUpload size={20} />
                        Choose Image
                      </label>
                      {imagePreview && (
                        <div className="image-preview">
                          <img src={imagePreview} alt="Preview" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label for="identification">
                      Identification & Description *
                    </label>
                    <textarea
                      name="identification"
                      id="identification"
                      value={coralFormData.identification}
                      onChange={handleCoralInputChange}
                      required
                      rows="4"
                      placeholder="Describe the coral's appearance, habitat, and identifying features..."
                    />
                  </div>

                  <div className="coral-modal-actions">
                    <button
                      type="button"
                      onClick={closeCoralModal}
                      className="cancel-btn"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="submit-btn"
                      disabled={coralLoading}
                    >
                      {coralLoading
                        ? "Saving..."
                        : coralModalMode === "add"
                        ? "Add Coral"
                        : "Update Coral"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
      <SuccessModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        autoClose={modalConfig.autoClose}
        autoCloseDelay={3000}
      />
    </div>
  );
}

export default CoralManagement;
