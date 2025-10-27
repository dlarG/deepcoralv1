import React from "react";
import useCoralManagement from "../hooks/useCoralManagement"; // Use biologist hook
import SuccessModal from "../../SuccessMessage";
import CoralManagement from "../../admin/components/CoralManagement";
import "../styles/coraldb.css";

function CoralDatabase() {
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
      {/* Use the CoralManagement component but pass biologist props */}
      <CoralManagement
        // Pass all the biologist hook data as props
        coralData={coralData}
        showCoralModal={showCoralModal}
        coralModalMode={coralModalMode}
        currentCoral={currentCoral}
        coralFormData={coralFormData}
        imagePreview={imagePreview}
        coralLoading={coralLoading}
        handleCoralInputChange={handleCoralInputChange}
        handleCoralImageChange={handleCoralImageChange}
        openCoralModal={openCoralModal}
        closeCoralModal={closeCoralModal}
        handleCoralSubmit={handleCoralSubmit}
        handleDeleteCoral={handleDeleteCoral}
        showModal={showModal}
        modalConfig={modalConfig}
        setShowModal={setShowModal}
      />

      {/* Success/Error/Info Modal */}
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

export default CoralDatabase;
