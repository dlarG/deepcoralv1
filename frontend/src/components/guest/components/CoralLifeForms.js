// src/components/guest/components/CoralLifeForms.js
import React from "react";
import { FiX } from "react-icons/fi";
import useCoralLifeForms from "../hooks/useCoralLifeForms";

function CoralLifeForms() {
  const {
    coralData,
    filteredCorals,
    groupedCorals,
    selectedClassification,
    searchTerm,
    selectedCoral,
    setSelectedClassification,
    setSearchTerm,
    setSelectedCoral,
  } = useCoralLifeForms();

  const renderCoralDetails = (coral) => (
    <div className="coral-detail-modal">
      <div className="coral-detail-content">
        <div className="coral-detail-header">
          <button
            className="close-detail-btn"
            onClick={() => setSelectedCoral(null)}
          >
            <FiX size={24} />
          </button>
        </div>
        <div className="coral-detail-body">
          <div className="coral-detail-image">
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
            <span className="coral-detail-badge">{coral.coral_type}</span>
          </div>
          <div className="coral-detail-info">
            <h2 className="coral-detail-name">{coral.common_name}</h2>
            <p className="coral-detail-scientific">{coral.scientific_name}</p>

            <div className="coral-detail-grid">
              <div className="detail-item">
                <span className="detail-label">Classification:</span>
                <span className="detail-value">{coral.classification}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Subtype:</span>
                <span className="detail-value">{coral.coral_subtype}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Type:</span>
                <span className="detail-value">{coral.coral_type}</span>
              </div>
            </div>

            <div className="coral-description">
              <h3>Identification & Information</h3>
              <p>{coral.identification}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  const renderCoralLifeForms = () => (
    <div className="content-section">
      <div className="coral-header">
        {/* Filter Controls */}
        <div className="coral-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search corals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-buttons">
            <button
              className={`filter-btn ${
                selectedClassification === "all" ? "active" : ""
              }`}
              onClick={() => setSelectedClassification("all")}
            >
              All Corals
            </button>
            <button
              className={`filter-btn ${
                selectedClassification === "hard coral" ? "active" : ""
              }`}
              onClick={() => setSelectedClassification("hard coral")}
            >
              Hard Corals
            </button>
            <button
              className={`filter-btn ${
                selectedClassification === "soft coral" ? "active" : ""
              }`}
              onClick={() => setSelectedClassification("soft coral")}
            >
              Soft Corals
            </button>
          </div>
        </div>
      </div>

      {coralData.length === 0 ? (
        <div className="loading-placeholder">
          <p>Loading coral data...</p>
        </div>
      ) : (
        <div className="coral-sections">
          {Object.entries(groupedCorals).map(([classification, corals]) => (
            <div key={classification} className="classification-section">
              <h3 className="classification-title">
                {classification.charAt(0).toUpperCase() +
                  classification.slice(1)}
                <span className="coral-count">({corals.length})</span>
              </h3>

              <div className="coral-list">
                {corals.map((coral) => (
                  <div
                    key={coral.id}
                    className="coral-item"
                    onClick={() => setSelectedCoral(coral)}
                  >
                    <div className="coral-item-image">
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
                    </div>
                    <div className="coral-item-info">
                      <h4 className="coral-item-name">{coral.common_name}</h4>
                      <p className="coral-item-scientific">
                        {coral.scientific_name}
                      </p>
                      <span className="coral-item-subtype">
                        {coral.coral_subtype}
                      </span>
                    </div>
                    <div className="coral-item-arrow">
                      <span>→</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {filteredCorals.length === 0 && (
            <div className="no-results">
              <p>No corals found matching your criteria.</p>
            </div>
          )}
        </div>
      )}
      {selectedCoral && renderCoralDetails(selectedCoral)}
    </div>
  );

  return (
    <>
      <h2 className="content-title">Coral LifeForms Database</h2>
      {coralData.length > 0 ? renderCoralLifeForms() : <p>Loading...</p>}
    </>
  );
}

export default CoralLifeForms;
