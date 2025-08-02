import React from "react";
import { FiDownload, FiUploadCloud } from "react-icons/fi";

function AddImage() {
  return (
    <div className="section-section">
      <div className="user-management-header">
        <div className="header-left">
          <h2 className="content-title">Upload Coral Image</h2>
          {/* <p className="content-subtitle">
            Upload quadrat coral images and view results.
          </p> */}
        </div>
        <div className="header-actions">
          <button
            className="export-btn"
            onClick={() => alert("Export functionality coming soon!")}
          >
            <FiDownload size={16} />
            Export Data
          </button>
          <button
            className="add-user-btn primary"
            //   onClick={() => openUserModal("create")}
          >
            <FiUploadCloud size={16} />
            Upload Images
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddImage;
