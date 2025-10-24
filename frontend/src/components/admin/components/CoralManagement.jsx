// src/components/admin/components/CoralManagement.js
import { React, useEffect } from "react";
import {
  FiPlus,
  FiEdit,
  FiTrash,
  FiEye,
  FiDatabase,
  FiX,
  FiUpload,
  FiFileText,
  FiChevronDown,
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

  useEffect(() => {
    if (coralModalMode === "view") {
      const descriptionContent = document.querySelector(".description-content");
      const progressBar = document.getElementById("reading-progress");

      if (descriptionContent && progressBar) {
        const handleScroll = () => {
          const scrollTop = descriptionContent.scrollTop;
          const scrollHeight =
            descriptionContent.scrollHeight - descriptionContent.clientHeight;
          const scrollProgress = (scrollTop / scrollHeight) * 100;
          progressBar.style.width = `${Math.min(scrollProgress, 100)}%`;
        };

        descriptionContent.addEventListener("scroll", handleScroll);

        return () => {
          descriptionContent.removeEventListener("scroll", handleScroll);
        };
      }
    }
  }, [coralModalMode]);

  return (
    <div className="content-section">
      {/* Header Section */}
      <div className="coral-management-header">
        <div className="header-content">
          <div className="header-text">
            <h2 className="coral-management-title">
              <FiDatabase size={28} />
              Coral Information Management
            </h2>
            <p className="coral-management-subtitle">
              Manage and organize coral species information with detailed
              classifications
            </p>
          </div>
          <div className="header-actions">
            <button
              className="add-coral-btn primary"
              onClick={() => openCoralModal("add")}
            >
              <FiPlus size={18} />
              <span className="btn-text">Add New Coral</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="coral-grid-container">
        {coralData.length === 0 ? (
          <div className="coral-empty-state">
            <div className="empty-icon">
              <FiDatabase size={64} />
            </div>
            <h3>No Coral Information</h3>
            <p>
              Start building your coral database by adding your first species
              entry.
            </p>
            <button
              className="add-coral-btn primary large"
              onClick={() => openCoralModal("add")}
            >
              <FiPlus size={20} />
              <span>Add Your First Coral</span>
            </button>
          </div>
        ) : (
          <div className="coral-grid">
            {coralData.map((coral) => (
              <div key={coral.id} className="coral-card">
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
                    <div className="overlay-actions">
                      <button
                        className="overlay-btn view"
                        onClick={() => openCoralModal("view", coral)}
                        title="View Details"
                      >
                        <FiEye size={16} />
                      </button>
                      <button
                        className="overlay-btn edit"
                        onClick={() => openCoralModal("edit", coral)}
                        title="Edit Coral"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        className="overlay-btn delete"
                        onClick={() => handleDeleteCoral(coral.id)}
                        title="Delete Coral"
                      >
                        <FiTrash size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="coral-card-content">
                  <div className="coral-card-header">
                    <h3 className="coral-card-title">
                      {coral.common_name}
                      <span className="coral-card-scientific">
                        ({coral.scientific_name})
                      </span>
                    </h3>
                  </div>

                  <div
                    className="coral-card-info-row"
                    style={{
                      display: "flex",
                      gap: "0.8rem",
                      alignItems: "center",
                    }}
                  >
                    <p className="coral-card-type" style={{ margin: 0 }}>
                      {coral.coral_type} - {coral.coral_subtype}
                    </p>
                    <p
                      className={`class-badge ${coral.classification.replace(
                        " ",
                        "-"
                      )}`}
                    >
                      {coral.classification}
                    </p>
                  </div>

                  <div className="coral-card-description">
                    <p>
                      {coral.identification.length > 120
                        ? `${coral.identification.substring(0, 120)}...`
                        : coral.identification}
                    </p>
                  </div>

                  <div className="coral-card-actions">
                    <button
                      className="card-action-btn secondary"
                      onClick={() => openCoralModal("view", coral)}
                    >
                      <FiEye size={14} />
                      <span>View</span>
                    </button>
                    <button
                      className="card-action-btn primary"
                      onClick={() => openCoralModal("edit", coral)}
                    >
                      <FiEdit size={14} />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showCoralModal && (
        <div className="coral-modal-overlay">
          <div className="coral-modal">
            <div className="coral-modal-header">
              <div className="modal-title-section">
                <h3 className="modal-title">
                  {coralModalMode === "add" && (
                    <>
                      <FiPlus size={20} />
                      Add New Coral Species
                    </>
                  )}
                  {coralModalMode === "edit" && (
                    <>
                      <FiEdit size={20} />
                      Edit Coral Information
                    </>
                  )}
                  {coralModalMode === "view" && (
                    <>
                      <FiEye size={20} />
                      Coral Species Details
                    </>
                  )}
                </h3>
                <p className="modal-subtitle">
                  {coralModalMode === "add" &&
                    "Add a new coral species to your database"}
                  {coralModalMode === "edit" &&
                    "Update coral species information"}
                  {coralModalMode === "view" &&
                    "Detailed information about this coral species"}
                </p>
              </div>
              <button className="modal-close-btn" onClick={closeCoralModal}>
                <FiX size={20} />
              </button>
            </div>

            <div className="coral-modal-body">
              {coralModalMode === "view" ? (
                <div className="coral-view-immersive">
                  <div className="coral-fullscreen-image">
                    <img
                      src={
                        currentCoral?.image
                          ? `/uploaded_coral_information/${currentCoral.image}`
                          : "/default-coral.jpg"
                      }
                      alt={currentCoral?.common_name}
                      onError={(e) => {
                        e.target.src = "/default-coral.jpg";
                      }}
                    />

                    {/* Coral Title Overlay - Top */}
                    <div className="coral-title-overlay">
                      <div className="coral-title-content">
                        <h1 className="coral-display-name">
                          {currentCoral?.common_name}
                        </h1>
                        <p className="coral-scientific-name">
                          ({currentCoral?.scientific_name})
                        </p>
                        <div className="coral-classification-display">
                          <span
                            className={`classification-badge immersive ${currentCoral?.classification.replace(
                              " ",
                              "-"
                            )}`}
                          >
                            {currentCoral?.classification}
                          </span>
                          <span className="coral-type-display">
                            {currentCoral?.coral_type} •{" "}
                            {currentCoral?.coral_subtype}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Description Overlay - Bottom */}
                    <div className="coral-description-overlay">
                      <div className="description-header">
                        <h3 className="description-title">
                          <FiFileText size={20} />
                          Identification & Description
                        </h3>
                        <div className="scroll-indicator">
                          <FiChevronDown size={16} />
                          <span>Scroll to read more</span>
                        </div>
                      </div>

                      <div className="description-content">
                        <div className="description-text">
                          <p>{currentCoral?.identification}</p>
                        </div>
                      </div>

                      {/* Reading Progress Bar */}
                      <div className="reading-progress-container">
                        <div
                          className="reading-progress-bar"
                          id="reading-progress"
                        ></div>
                      </div>
                    </div>

                    {/* Gradient Overlays for Better Text Readability */}
                    <div className="image-gradient-top"></div>
                    <div className="image-gradient-bottom"></div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleCoralSubmit} className="coral-form">
                  <div className="form-sections">
                    <div className="form-section">
                      <h4 className="section-title">Basic Information</h4>
                      <div className="form-grid">
                        <div className="form-group">
                          <label htmlFor="coral_type">
                            Coral Type <span className="required">*</span>
                          </label>
                          <input
                            type="text"
                            id="coral_type"
                            name="coral_type"
                            value={coralFormData.coral_type}
                            onChange={handleCoralInputChange}
                            required
                            placeholder="e.g., Hard Coral, Soft Coral"
                            className="form-input"
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="coral_subtype">
                            Coral Subtype <span className="required">*</span>
                          </label>
                          <input
                            type="text"
                            id="coral_subtype"
                            name="coral_subtype"
                            value={coralFormData.coral_subtype}
                            onChange={handleCoralInputChange}
                            required
                            placeholder="e.g., Branching, Massive"
                            className="form-input"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-section">
                      <h4 className="section-title">Classification & Names</h4>
                      <div className="form-grid">
                        <div className="form-group">
                          <label htmlFor="classification">
                            Classification <span className="required">*</span>
                          </label>
                          <select
                            id="classification"
                            name="classification"
                            value={coralFormData.classification}
                            onChange={handleCoralInputChange}
                            required
                            className="form-select"
                          >
                            <option value="">Select Classification</option>
                            <option value="hard coral">Hard Coral</option>
                            <option value="soft coral">Soft Coral</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label htmlFor="common_name">
                            Common Name <span className="required">*</span>
                          </label>
                          <input
                            type="text"
                            id="common_name"
                            name="common_name"
                            value={coralFormData.common_name}
                            onChange={handleCoralInputChange}
                            required
                            placeholder="e.g., Staghorn Coral"
                            className="form-input"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="scientific_name">
                          Scientific Name <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          id="scientific_name"
                          name="scientific_name"
                          value={coralFormData.scientific_name}
                          onChange={handleCoralInputChange}
                          required
                          placeholder="e.g., Acropora cervicornis"
                          className="form-input scientific"
                        />
                      </div>
                    </div>

                    <div className="form-section">
                      <h4 className="section-title">Visual & Description</h4>
                      <div className="form-group">
                        <label htmlFor="coral-image">
                          Coral Image{" "}
                          {coralModalMode === "add" ? (
                            <span className="required">*</span>
                          ) : (
                            <span className="optional">(optional)</span>
                          )}
                        </label>
                        <div className="image-upload-area">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleCoralImageChange}
                            className="file-input"
                            id="coral-image"
                            required={coralModalMode === "add"}
                          />
                          <label
                            htmlFor="coral-image"
                            className="file-upload-label"
                          >
                            <div className="upload-content">
                              <FiUpload size={24} />
                              <span className="upload-text">
                                {imagePreview
                                  ? "Change Image"
                                  : "Choose Coral Image"}
                              </span>
                              <span className="upload-hint">
                                PNG, JPG up to 5MB
                              </span>
                            </div>
                          </label>
                          {imagePreview && (
                            <div className="image-preview">
                              <img src={imagePreview} alt="Coral Preview" />
                              <div className="preview-overlay">
                                <span>Preview</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="identification">
                          Identification & Description{" "}
                          <span className="required">*</span>
                        </label>
                        <textarea
                          id="identification"
                          name="identification"
                          value={coralFormData.identification}
                          onChange={handleCoralInputChange}
                          required
                          rows="5"
                          placeholder="Describe the coral's appearance, habitat, identifying features, and any other relevant information..."
                          className="form-textarea"
                        />
                        <div className="character-count">
                          {coralFormData.identification.length}/1000
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="coral-modal-actions">
                    <button
                      type="button" // Change from default to explicit button type
                      onClick={closeCoralModal}
                      className="modal-action-btn cancel"
                    >
                      <FiX size={16} />
                      <span>Cancel</span>
                    </button>
                    <button
                      type="submit"
                      className="modal-action-btn submit"
                      disabled={coralLoading}
                      onClick={(e) => {
                        // Add explicit prevention and call handler
                        e.preventDefault();
                        handleCoralSubmit(e);
                      }}
                    >
                      {coralLoading ? (
                        <div className="btn-loading">
                          <div className="spinner"></div>
                          <span>Saving...</span>
                        </div>
                      ) : (
                        <>
                          {coralModalMode === "add" ? (
                            <>
                              <FiPlus size={16} />
                              <span>Add Coral</span>
                            </>
                          ) : (
                            <>
                              <FiEdit size={16} />
                              <span>Update Coral</span>
                            </>
                          )}
                        </>
                      )}
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
