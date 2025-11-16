import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import {
  FiMapPin,
  FiCalendar,
  FiTrendingUp,
  FiBarChart2,
  FiPieChart,
  FiImage,
  FiFilter,
  FiEye,
  FiTrash2,
  FiAlertTriangle,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiFile,
  FiUser,
  FiMap,
  FiGrid,
  FiSearch,
} from "react-icons/fi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Fix Leaflet's default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom location marker with image count
const createLocationIcon = (imageCount, isSelected = false) => {
  const size = Math.min(30 + imageCount * 3, 50);
  const color = isSelected ? "#dc2626" : "#2563eb";

  return L.divIcon({
    className: "custom-location-marker",
    html: `
      <div style="
        background: linear-gradient(135deg, ${color}, ${color}dd);
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: ${Math.min(size / 3, 16)}px;
        position: relative;
        transform: none !important;
        margin: 0;
        padding: 0;
      ">
        ${imageCount}
        <div style="
          position: absolute;
          top: -2px;
          right: -2px;
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          border: 1px solid white;
        "></div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

function CoralDistribution() {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationImages, setLocationImages] = useState([]);
  const [locationAnalytics, setLocationAnalytics] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
    min: "",
    max: "",
  });
  const [loading, setLoading] = useState(false);
  const [expandedLocation, setExpandedLocation] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [viewMode, setViewMode] = useState("map"); // map, list
  const mapRef = useRef();
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [deletingImage, setDeletingImage] = useState(false);
  const getLocationDisplayName = (location) => {
    if (location.municipality && location.barangay) {
      return `${location.municipality} - ${location.barangay}`;
    } else if (location.municipality) {
      return location.municipality;
    } else if (location.barangay) {
      return location.barangay;
    } else {
      return location.location_id; // Fallback to the generated location_id from backend
    }
  };

  const [activeScope, setActiveScope] = useState("location"); // location, municipality
  const [activeTransect, setActiveTransect] = useState("all"); // all, 1, 2, 3, 4, 5
  const [availableTransects, setAvailableTransects] = useState([]);

  const getScopeDisplayText = () => {
    if (activeScope === "municipality" && selectedLocation?.municipality) {
      return `${selectedLocation.municipality} Municipality`;
    }
    return getLocationDisplayName(selectedLocation);
  };

  const handleScopeChange = async (newScope) => {
    if (newScope === activeScope) return;

    setActiveScope(newScope);
    setActiveTransect("all"); // Reset transect when changing scope

    if (selectedLocation) {
      await loadLocationData(selectedLocation, newScope, "all");
    }
  };

  const handleTransectChange = async (newTransect) => {
    if (newTransect === activeTransect) return;

    setActiveTransect(newTransect);

    if (selectedLocation) {
      await loadLocationData(selectedLocation, activeScope, newTransect);
    }
  };

  const loadLocationData = async (location, scope, transect) => {
    try {
      setLoading(true);

      // Build params with proper filtering
      const params = new URLSearchParams();
      if (dateRange.start && dateRange.start.trim() !== "") {
        params.append("start_date", dateRange.start);
      }
      if (dateRange.end && dateRange.end.trim() !== "") {
        params.append("end_date", dateRange.end);
      }
      params.append("scope", scope);
      if (transect !== "all") {
        params.append("transect", transect);
      }

      const paramString = params.toString();

      // Load images for this location with filtering
      const imagesUrl = `http://${process.env.REACT_APP_API_URL}/distribution/location/${location.latitude}/${location.longitude}/images?${paramString}`;

      console.log("Loading images from:", imagesUrl);

      const imagesResponse = await fetch(imagesUrl);
      const imagesData = await imagesResponse.json();

      if (imagesResponse.ok) {
        console.log("Loaded images:", imagesData.images?.length, "images");
        setLocationImages(imagesData.images || []);

        // Update available transects based on the data
        const transects =
          [
            ...new Set(
              imagesData.images
                ?.map((img) => img.transect)
                .filter((t) => t !== null)
            ),
          ] || [];
        setAvailableTransects(transects.sort());
      }

      // Load analytics for this location with filtering
      const analyticsUrl = `http://${process.env.REACT_APP_API_URL}/distribution/location/${location.latitude}/${location.longitude}/analytics?${paramString}`;

      const analyticsResponse = await fetch(analyticsUrl);
      const analyticsData = await analyticsResponse.json();

      if (analyticsResponse.ok) {
        console.log("Loaded analytics:", analyticsData);
        setLocationAnalytics(analyticsData);
      }

      // Pan map to location
      if (mapRef.current) {
        mapRef.current.setView([location.latitude, location.longitude], 15);
      }
    } catch (error) {
      console.error("Error loading location details:", error);
    } finally {
      setLoading(false);
    }
  };

  const TableView = ({
    locations,
    selectedLocation,
    onLocationSelect,
    loading,
    locationImages,
    locationAnalytics,
    activeTab,
    setActiveTab,
    formatDate,
    openImageViewer,
    handleDeleteImage,
    renderCoralDistributionChart,
    renderTrendChart,
  }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({
      key: "image_count",
      direction: "desc",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Filter and sort locations
    const filteredLocations = locations.filter((location) => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        location.location_id.toLowerCase().includes(searchLower) ||
        location.latitude.toString().includes(searchLower) ||
        location.longitude.toString().includes(searchLower) ||
        location.date_range.toLowerCase().includes(searchLower)
      );
    });

    const sortedLocations = [...filteredLocations].sort((a, b) => {
      if (sortConfig.key) {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (sortConfig.direction === "asc") {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      }
      return 0;
    });

    // Pagination
    const totalPages = Math.ceil(sortedLocations.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentLocations = sortedLocations.slice(startIndex, endIndex);

    const handleSort = (key) => {
      setSortConfig((prev) => ({
        key,
        direction:
          prev.key === key && prev.direction === "desc" ? "asc" : "desc",
      }));
    };

    const getSortIcon = (key) => {
      if (sortConfig.key !== key) return null;
      return sortConfig.direction === "desc" ? "↓" : "↑";
    };

    return (
      <div className="table-view-container">
        <div className="table-view-header">
          <div className="table-controls">
            <div className="distribution-search-container">
              <FiSearch size={18} />
              <input
                type="text"
                placeholder="Search locations..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page when searching
                }}
                className="distribution-search-input"
              />
            </div>
            <div className="table-info">
              <span className="results-count">
                Showing {startIndex + 1}-
                {Math.min(endIndex, sortedLocations.length)} of{" "}
                {sortedLocations.length} locations
              </span>
            </div>
          </div>
        </div>

        <div className="table-content">
          {/* Locations Table */}
          <div className="locations-table-container">
            <table className="locations-table">
              <thead>
                <tr>
                  <th
                    onClick={() => handleSort("location_id")}
                    className="sortable"
                  >
                    Location Name {getSortIcon("location_id")}
                  </th>

                  <th
                    onClick={() => handleSort("image_count")}
                    className="sortable"
                  >
                    Images {getSortIcon("image_count")}
                  </th>
                  <th
                    onClick={() => handleSort("contributor_count")}
                    className="sortable"
                  >
                    Contributors {getSortIcon("contributor_count")}
                  </th>
                  <th
                    onClick={() => handleSort("date_range")}
                    className="sortable"
                  >
                    Date Range {getSortIcon("date_range")}
                  </th>
                  <th>Coral Types</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="loading-cell">
                      <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>Loading locations...</p>
                      </div>
                    </td>
                  </tr>
                ) : currentLocations.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="empty-cell">
                      <div className="empty-state">
                        <FiMapPin size={48} />
                        <h4>No Locations Found</h4>
                        <p>
                          {searchTerm
                            ? `No locations match "${searchTerm}"`
                            : "No locations with images found for the selected date range."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentLocations.map((location) => (
                    <tr
                      key={location.location_id}
                      className={`location-row ${
                        selectedLocation?.location_id === location.location_id
                          ? "selected"
                          : ""
                      }`}
                      onClick={() => onLocationSelect(location)}
                    >
                      <td className="location-id-cell">
                        <div className="location-id-badge">
                          <FiMapPin size={14} />
                          {getLocationDisplayName(location)}
                        </div>
                      </td>
                      <td className="image-count-cell">
                        <div className="count-badge images">
                          <FiImage size={14} />
                          {location.image_count}
                        </div>
                      </td>
                      <td className="contributor-count-cell">
                        <div className="count-badge contributors">
                          <FiUser size={14} />
                          {location.contributor_count}
                        </div>
                      </td>
                      <td className="date-range-cell">
                        <span className="date-range">
                          {location.date_range}
                        </span>
                      </td>
                      <td className="coral-types-cell">
                        <div className="coral-types-list">
                          {location.coral_types &&
                          location.coral_types.length > 0 ? (
                            <div className="coral-types-preview">
                              <span className="coral-count">
                                {location.coral_types.length} type
                                {location.coral_types.length !== 1 ? "s" : ""}
                              </span>
                              <div className="coral-types-tooltip">
                                {location.coral_types.join(", ")}
                              </div>
                            </div>
                          ) : (
                            <span className="no-data">No data</span>
                          )}
                        </div>
                      </td>
                      <td className="actions-cell">
                        <button
                          className="view-details-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            onLocationSelect(location);
                          }}
                        >
                          <FiEye size={14} />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination-container">
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  <FiChevronLeft size={16} />
                  Previous
                </button>

                <div className="page-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((pageNum) => {
                      const isNearCurrent =
                        Math.abs(pageNum - currentPage) <= 2;
                      const isFirst = pageNum === 1;
                      const isLast = pageNum === totalPages;
                      return isNearCurrent || isFirst || isLast;
                    })
                    .map((pageNum, index, array) => {
                      const prevPageNum = array[index - 1];
                      const showEllipsis =
                        prevPageNum && pageNum - prevPageNum > 1;

                      return (
                        <React.Fragment key={pageNum}>
                          {showEllipsis && (
                            <span className="ellipsis">...</span>
                          )}
                          <button
                            className={`page-btn ${
                              currentPage === pageNum ? "active" : ""
                            }`}
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </button>
                        </React.Fragment>
                      );
                    })}
                </div>

                <button
                  className="pagination-btn"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                  <FiChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Location Details Panel - Similar to sidebar but horizontal */}
        {selectedLocation && (
          <div className="location-details-panel">
            <div className="location-details-header">
              <h3>
                <FiMapPin size={20} />
                Location Details - {getScopeDisplayText()}
              </h3>
              <button
                className="close-panel-btn"
                onClick={() => onLocationSelect(null)}
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Add Scope and Transect Filters */}
            <div className="location-filters-section">
              <div className="filter-group">
                <label>Scope:</label>
                <div className="scope-buttons">
                  <button
                    className={`scope-btn ${
                      activeScope === "location" ? "active" : ""
                    }`}
                    onClick={() => handleScopeChange("location")}
                  >
                    <FiMapPin size={14} />
                    This Location
                  </button>
                  <button
                    className={`scope-btn ${
                      activeScope === "municipality" ? "active" : ""
                    }`}
                    onClick={() => handleScopeChange("municipality")}
                    disabled={!selectedLocation.municipality}
                  >
                    <FiMap size={14} />
                    Whole Municipality
                  </button>
                </div>
              </div>

              <div className="filter-group">
                <label>Transect:</label>
                <div className="transect-buttons">
                  <button
                    className={`transect-btn ${
                      activeTransect === "all" ? "active" : ""
                    }`}
                    onClick={() => handleTransectChange("all")}
                  >
                    All Images
                  </button>
                  {[1, 2, 3, 4, 5].map((transect) => (
                    <button
                      key={transect}
                      className={`transect-btn ${
                        activeTransect === transect.toString() ? "active" : ""
                      }`}
                      onClick={() => handleTransectChange(transect.toString())}
                      disabled={!availableTransects.includes(transect)}
                    >
                      T{transect}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="location-info-horizontal">
              <div className="location-info-card">
                <h4>
                  📍{" "}
                  {activeScope === "municipality"
                    ? "Municipality"
                    : "Coordinates"}
                </h4>
                {activeScope === "municipality" ? (
                  <p>{selectedLocation.municipality}</p>
                ) : (
                  <p>
                    {selectedLocation.latitude.toFixed(6)},{" "}
                    {selectedLocation.longitude.toFixed(6)}
                  </p>
                )}
              </div>
              <div className="location-info-card">
                <h4>📊 Statistics</h4>
                <p>
                  <strong>Images:</strong> {locationImages.length}
                </p>
                <p>
                  <strong>Scope:</strong>{" "}
                  {activeScope === "municipality"
                    ? "Municipality-wide"
                    : "Location-specific"}
                </p>
                {activeTransect !== "all" && (
                  <p>
                    <strong>Transect:</strong> {activeTransect}
                  </p>
                )}
              </div>
            </div>

            {/* Tabs with updated counts */}
            <div className="horizontal-tabs">
              <button
                className={`tab-btn ${activeTab === "images" ? "active" : ""}`}
                onClick={() => setActiveTab("images")}
              >
                <FiImage size={16} />
                Images ({locationImages.length})
              </button>
              <button
                className={`tab-btn ${
                  activeTab === "analytics" ? "active" : ""
                }`}
                onClick={() => setActiveTab("analytics")}
              >
                <FiBarChart2 size={16} />
                Analytics
              </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content-horizontal">
              {activeTab === "images" && (
                <div className="images-section">
                  {loading ? (
                    <div className="loading-state">
                      <div className="loading-spinner"></div>
                      <p>Loading images...</p>
                    </div>
                  ) : locationImages.length === 0 ? (
                    <div className="empty-state">
                      <FiImage size={48} />
                      <h4>No Images Found</h4>
                      <p>No images found for the selected filters.</p>
                    </div>
                  ) : (
                    <div className="images-grid">
                      {locationImages.map((image, index) => (
                        <div
                          key={index}
                          className="image-card"
                          onClick={() => openImageViewer(index)}
                        >
                          <div className="image-thumbnail">
                            <img
                              src={`http://${process.env.REACT_APP_API_URL}/crops/${image.filename}`}
                              alt={image.filename}
                              onError={(e) => {
                                e.target.src =
                                  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23f3f4f6"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="%236b7280">No Image</text></svg>';
                              }}
                            />
                            {/* Add transect badge if available */}
                            {image.transect && (
                              <div className="image-transect-badge">
                                T{image.transect}
                              </div>
                            )}
                          </div>
                          <div className="image-card-overlay">
                            <button
                              className="image-overlay-btn view-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                openImageViewer(index);
                              }}
                              title="View Image"
                            >
                              <FiEye size={18} />
                            </button>
                            <button
                              className="image-overlay-btn delete-btn"
                              onClick={(e) => handleDeleteImage(image, e)}
                              title="Delete Image"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "analytics" && (
                <div className="analytics-section">
                  {loading ? (
                    <div className="loading-state">
                      <div className="loading-spinner"></div>
                      <p>Loading analytics...</p>
                    </div>
                  ) : (
                    <div className="charts-container-horizontal">
                      <div className="chart-wrapper full-width">
                        {renderCoralDistributionChart()}
                      </div>

                      <div className="chart-wrapper full-width">
                        {renderTrendChart()}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const openImageViewer = (index) => {
    setCurrentImageIndex(index);
    setImageViewerOpen(true);
  };

  const closeImageViewer = () => {
    setImageViewerOpen(false);
    setCurrentImageIndex(0);
  };
  const navigateImage = (direction) => {
    if (direction === "next" && currentImageIndex < locationImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else if (direction === "prev" && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleDeleteImage = (image, event = null) => {
    if (event) {
      event.stopPropagation();
    }
    setImageToDelete(image);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!imageToDelete) return;

    try {
      setDeletingImage(true);

      // FIXED: Use the correct distribution endpoint
      const response = await fetch(
        `http://${process.env.REACT_APP_API_URL}/distribution/images/${imageToDelete.id}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Remove image from current list
        const updatedImages = locationImages.filter(
          (img) => img.id !== imageToDelete.id
        );
        setLocationImages(updatedImages);

        // Update locations count
        const updatedLocations = locations.map((loc) => {
          if (
            loc.latitude === selectedLocation.latitude &&
            loc.longitude === selectedLocation.longitude
          ) {
            return { ...loc, image_count: loc.image_count - 1 };
          }
          return loc;
        });
        setLocations(updatedLocations);

        // Close viewer if we deleted the current image
        if (
          imageViewerOpen &&
          imageToDelete.id === locationImages[currentImageIndex]?.id
        ) {
          if (updatedImages.length === 0) {
            closeImageViewer();
          } else if (currentImageIndex >= updatedImages.length) {
            setCurrentImageIndex(updatedImages.length - 1);
          }
        }

        console.log("Image deleted successfully");
      } else {
        const errorData = await response.json();
        console.error("Failed to delete image:", errorData.error);
        alert("Failed to delete image: " + errorData.error);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Error deleting image: " + error.message);
    } finally {
      setDeletingImage(false);
      setDeleteConfirmOpen(false);
      setImageToDelete(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);

      // Load  date range
      const dateRangeResponse = await fetch(
        `http://${process.env.REACT_APP_API_URL}/distribution/date-range`
      );
      const dateRangeData = await dateRangeResponse.json();

      if (dateRangeResponse.ok) {
        setDateRange({
          start: dateRangeData.min_date
            ? dateRangeData.min_date.split("T")[0]
            : "",
          end: dateRangeData.max_date
            ? dateRangeData.max_date.split("T")[0]
            : "",
          min: dateRangeData.min_date
            ? dateRangeData.min_date.split("T")[0]
            : "",
          max: dateRangeData.max_date
            ? dateRangeData.max_date.split("T")[0]
            : "",
        });
      }

      // Load locations with date filter
      await loadLocations();
    } catch (error) {
      console.error("Error loading initial data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadLocations = async () => {
    try {
      const params = new URLSearchParams();

      // Only add date filters if they have values
      if (dateRange.start && dateRange.start.trim() !== "") {
        params.append("start_date", dateRange.start);
      }
      if (dateRange.end && dateRange.end.trim() !== "") {
        params.append("end_date", dateRange.end);
      }

      const url = params.toString()
        ? `http://${process.env.REACT_APP_API_URL}/distribution/locations?${params}`
        : `http://${process.env.REACT_APP_API_URL}/distribution/locations`;

      console.log("Loading locations from:", url); // Debug log

      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        console.log("Loaded locations:", data.locations); // Debug log
        setLocations(data.locations || []);
      } else {
        console.error("Failed to load locations:", data.error);
      }
    } catch (error) {
      console.error("Error loading locations:", error);
    }
  };

  const handleLocationClick = async (location) => {
    setSelectedLocation(location);
    setExpandedLocation(location.location_id);
    setActiveTab("images");
    setActiveScope("location");
    setActiveTransect("all");

    await loadLocationData(location, "location", "all");

    try {
      setLoading(true);

      // Build params with proper date filtering
      const params = new URLSearchParams();
      if (dateRange.start && dateRange.start.trim() !== "") {
        params.append("start_date", dateRange.start);
      }
      if (dateRange.end && dateRange.end.trim() !== "") {
        params.append("end_date", dateRange.end);
      }

      const paramString = params.toString();

      // Load images for this location
      const imagesUrl = paramString
        ? `http://${process.env.REACT_APP_API_URL}/distribution/location/${location.latitude}/${location.longitude}/images?${paramString}`
        : `http://${process.env.REACT_APP_API_URL}/distribution/location/${location.latitude}/${location.longitude}/images`;

      console.log("Loading images from:", imagesUrl); // Debug log

      const imagesResponse = await fetch(imagesUrl);
      const imagesData = await imagesResponse.json();

      if (imagesResponse.ok) {
        console.log("Loaded images:", imagesData.images?.length, "images"); // Debug log
        setLocationImages(imagesData.images || []);
      }

      // Load analytics for this location
      const analyticsUrl = paramString
        ? `http://${process.env.REACT_APP_API_URL}/distribution/location/${location.latitude}/${location.longitude}/analytics?${paramString}`
        : `http://${process.env.REACT_APP_API_URL}/distribution/location/${location.latitude}/${location.longitude}/analytics`;

      const analyticsResponse = await fetch(analyticsUrl);
      const analyticsData = await analyticsResponse.json();

      if (analyticsResponse.ok) {
        console.log("Loaded analytics:", analyticsData); // Debug log
        setLocationAnalytics(analyticsData);
      }

      // Pan map to location
      if (mapRef.current) {
        mapRef.current.setView([location.latitude, location.longitude], 15);
      }
    } catch (error) {
      console.error("Error loading location details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = async () => {
    console.log("Applying date filters:", {
      start: dateRange.start,
      end: dateRange.end,
    });

    // Reload locations with new date range
    await loadLocations();

    // If a location is selected, reload its data too
    if (selectedLocation) {
      await loadLocationData(selectedLocation, activeScope, activeTransect);
    }
  };

  const renderCoralDistributionChart = () => {
    if (
      !locationAnalytics?.coral_analytics ||
      locationAnalytics.coral_analytics.length === 0
    ) {
      return (
        <div className="no-data-message">
          <FiBarChart2 size={48} />
          <h3>No Coral Data Available</h3>
          <p>No coral analysis data found for the selected filters.</p>
        </div>
      );
    }

    const data = {
      labels: locationAnalytics.coral_analytics.map(
        (coral) => coral.class_name
      ),
      datasets: [
        {
          label: "Coverage %",
          data: locationAnalytics.coral_analytics.map(
            (coral) => coral.avg_coverage_percent || 0
          ),
          backgroundColor: locationAnalytics.coral_analytics.map(
            (coral) => coral.color_hex || "#3b82f6"
          ),
          borderColor: locationAnalytics.coral_analytics.map(
            (coral) => coral.color_hex || "#3b82f6"
          ),
          borderWidth: 2,
          borderRadius: 4,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: `Coral Distribution - ${getScopeDisplayText()}${
            activeTransect !== "all" ? ` (Transect ${activeTransect})` : ""
          }`,
          font: {
            size: 16,
            weight: "bold",
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.label}: ${context.parsed.y.toFixed(2)}%`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: function (value) {
              return value + "%";
            },
          },
        },
      },
    };

    return <Bar data={data} options={options} />;
  };

  const renderTrendChart = () => {
    if (
      !locationAnalytics?.trend_data ||
      locationAnalytics.trend_data.length === 0
    ) {
      return (
        <div className="no-data-message">
          <FiTrendingUp size={48} />
          <h3>No Trend Data Available</h3>
          <p>No temporal trend data found for the selected filters.</p>
        </div>
      );
    }

    // Group trend data by coral type
    const coralTypes = [
      ...new Set(locationAnalytics.trend_data.map((d) => d.class_name)),
    ];
    const dates = [
      ...new Set(locationAnalytics.trend_data.map((d) => d.date)),
    ].sort();

    const datasets = coralTypes.map((type, index) => {
      const typeData = locationAnalytics.trend_data.filter(
        (d) => d.class_name === type
      );
      const coral = locationAnalytics.coral_analytics.find(
        (c) => c.class_name === type
      );

      return {
        label: type,
        data: dates.map((date) => {
          const dataPoint = typeData.find((d) => d.date === date);
          return dataPoint ? dataPoint.avg_coverage : null;
        }),
        borderColor: coral?.color_hex || `hsl(${index * 137.508}deg, 70%, 50%)`,
        backgroundColor: `${
          coral?.color_hex || `hsl(${index * 137.508}deg, 70%, 50%)`
        }20`,
        fill: false,
        tension: 0.4,
      };
    });

    const data = {
      labels: dates.map((date) => formatDate(date)),
      datasets,
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: `Coral Trends in - ${getScopeDisplayText()}${
            activeTransect !== "all" ? ` (Transect ${activeTransect})` : ""
          }`,
          font: {
            size: 16,
            weight: "bold",
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return value + "%";
            },
          },
        },
      },
    };

    return <Line data={data} options={options} />;
  };

  const MapControls = () => {
    const map = useMap();

    useEffect(() => {
      mapRef.current = map;
    }, [map]);

    return null;
  };

  return (
    <div className="content-section">
      {/* Header */}
      <div className="distribution-management-header">
        <div className="header-content">
          {/* Main Header Row */}
          <div className="header-main-row">
            <div className="header-left">
              <div className="title-section">
                <h1 className="coral-management-title">
                  <FiMapPin className="title-icon" />
                  Coral Distribution Analysis
                </h1>
                <p className="report-subtitle">
                  Geographic distribution and temporal trends of coral coverage
                </p>
              </div>
            </div>

            <div className="header-right">
              <div className="distribution-header-actions">
                {/* View Toggle */}
                <div className="view-toggle-group">
                  <span className="toggle-label">View Mode</span>
                  <div className="view-toggle-container">
                    <button
                      className={`dis-view-toggle ${
                        viewMode === "map" ? "active" : ""
                      }`}
                      onClick={() => setViewMode("map")}
                    >
                      <FiMap size={16} />
                      Map
                    </button>
                    <button
                      className={`dis-view-toggle ${
                        viewMode === "list" ? "active" : ""
                      }`}
                      onClick={() => setViewMode("list")}
                    >
                      <FiGrid size={16} />
                      Table
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters Row */}
          <div className="header-filters-row">
            <div className="filters-wrapper">
              <div className="date-filters">
                <div className="filter-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={dateRange.start}
                    min={dateRange.min}
                    max={dateRange.max}
                    onChange={(e) =>
                      setDateRange((prev) => ({
                        ...prev,
                        start: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="filter-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={dateRange.end}
                    min={dateRange.min}
                    max={dateRange.max}
                    onChange={(e) =>
                      setDateRange((prev) => ({ ...prev, end: e.target.value }))
                    }
                  />
                </div>

                <button
                  className="apply-filters-btn"
                  onClick={handleDateRangeChange}
                  disabled={loading}
                >
                  <FiFilter size={14} />
                  {loading ? "Applying..." : "Apply Filters"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== */}
      {/* STATS SECTION        */}
      {/* ==================== */}
      <div className="stats-summary-section">
        <div className="stats-container">
          <div className="stats-grid">
            <div className="stat-card locations">
              <div className="distribution-stat-icon">
                <FiMapPin size={24} />
              </div>
              <div className="stat-content">
                <div className="distribution-stat-number">
                  {locations.length}
                </div>
                <div className="stat-label">Locations</div>
                <div className="stat-description">Geographic points</div>
              </div>
            </div>

            <div className="stat-card images">
              <div className="distribution-stat-icon">
                <FiImage size={24} />
              </div>
              <div className="stat-content">
                <div className="distribution-stat-number">
                  {locations.reduce(
                    (sum, loc) => sum + (loc.image_count || 0),
                    0
                  )}
                </div>
                <div className="stat-label">Images</div>
                <div className="stat-description">Coral samples</div>
              </div>
            </div>

            <div className="stat-card timespan">
              <div className="distribution-stat-icon">
                <FiCalendar size={24} />
              </div>
              <div className="stat-content">
                <div className="distribution-stat-number">
                  {dateRange.start && dateRange.end
                    ? Math.ceil(
                        (new Date(dateRange.end) - new Date(dateRange.start)) /
                          (1000 * 60 * 60 * 24)
                      )
                    : "All"}
                </div>
                <div className="stat-label">Days</div>
                <div className="stat-description">Analysis period</div>
              </div>
            </div>

            <div className="stat-card coverage">
              <div className="distribution-stat-icon">
                <FiTrendingUp size={24} />
              </div>
              <div className="stat-content">
                <div className="distribution-stat-number">
                  {locations.length > 0
                    ? (
                        locations.reduce(
                          (sum, loc) => sum + (loc.image_count || 0),
                          0
                        ) / locations.length
                      ).toFixed(1)
                    : "0"}
                </div>
                <div className="stat-label">Avg/Location</div>
                <div className="stat-description">Images per site</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="distribution-content">
        {viewMode === "map" ? (
          <div className="map-section">
            {/* Map */}
            <div className="map-container">
              <MapContainer
                center={[14.5995, 120.9842]} // Philippines center
                zoom={6}
                style={{ height: "100%", width: "100%" }}
              >
                <MapControls />
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {locations.map((location, index) => (
                  <Marker
                    key={index}
                    position={[location.latitude, location.longitude]}
                    icon={createLocationIcon(
                      location.image_count || 0,
                      selectedLocation?.location_id === location.location_id
                    )}
                    eventHandlers={{
                      click: () => handleLocationClick(location),
                    }}
                  >
                    <Popup>
                      <div className="location-popup">
                        <h4>📍 {getLocationDisplayName(location)}</h4>
                        {/* Show additional location details if available */}
                        {(location.municipality || location.barangay) && (
                          <div className="location-address-details">
                            {location.municipality && (
                              <p className="address-line">
                                <strong>Municipality:</strong>{" "}
                                {location.municipality}
                              </p>
                            )}
                            {location.barangay && (
                              <p className="address-line">
                                <strong>Barangay:</strong> {location.barangay}
                              </p>
                            )}
                          </div>
                        )}
                        <p>
                          <strong>Coordinates:</strong>{" "}
                          {location.latitude.toFixed(4)},{" "}
                          {location.longitude.toFixed(4)}
                        </p>
                        <p>
                          <strong>Images:</strong> {location.image_count || 0}
                        </p>
                        <p>
                          <strong>Date Range:</strong> {location.date_range}
                        </p>
                        {location.coral_types &&
                          location.coral_types.length > 0 && (
                            <p>
                              <strong>Coral Types:</strong>{" "}
                              {location.coral_types.length}
                            </p>
                          )}
                        <button
                          className="popup-details-btn"
                          onClick={() => handleLocationClick(location)}
                        >
                          View Details
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>

            {/* Location Details Sidebar */}
            {selectedLocation && (
              <div className="location-details-sidebar">
                <div className="location-details-header">
                  <h3>
                    <FiMapPin size={20} />
                    {getScopeDisplayText()}
                  </h3>
                  <button
                    className="close-sidebar-btn"
                    onClick={() => setSelectedLocation(null)}
                  >
                    <FiX size={18} />
                  </button>
                </div>

                {/* Add Scope and Transect Filters to Map Sidebar */}
                <div className="location-filters-section">
                  <div className="filter-group">
                    <label>Scope:</label>
                    <div className="scope-buttons">
                      <button
                        className={`scope-btn ${
                          activeScope === "location" ? "active" : ""
                        }`}
                        onClick={() => handleScopeChange("location")}
                      >
                        <FiMapPin size={14} />
                        This Location
                      </button>
                      <button
                        className={`scope-btn ${
                          activeScope === "municipality" ? "active" : ""
                        }`}
                        onClick={() => handleScopeChange("municipality")}
                        disabled={!selectedLocation.municipality}
                      >
                        <FiMap size={14} />
                        Whole Municipality
                      </button>
                    </div>
                  </div>

                  <div className="filter-group">
                    <label>Transect:</label>
                    <div className="transect-buttons">
                      <button
                        className={`transect-btn ${
                          activeTransect === "all" ? "active" : ""
                        }`}
                        onClick={() => handleTransectChange("all")}
                      >
                        All Images
                      </button>
                      {[1, 2, 3, 4, 5].map((transect) => (
                        <button
                          key={transect}
                          className={`transect-btn ${
                            activeTransect === transect.toString()
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            handleTransectChange(transect.toString())
                          }
                          disabled={!availableTransects.includes(transect)}
                        >
                          T{transect}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="location-info">
                  <div className="location-info-card">
                    <h4>
                      📍{" "}
                      {activeScope === "municipality"
                        ? "Municipality"
                        : "Coordinates"}
                    </h4>
                    {activeScope === "municipality" ? (
                      <p>{selectedLocation.municipality}</p>
                    ) : (
                      <p>
                        {selectedLocation.latitude.toFixed(6)},{" "}
                        {selectedLocation.longitude.toFixed(6)}
                      </p>
                    )}
                  </div>
                  <div className="location-info-card">
                    <h4>📊 Statistics</h4>
                    <p>
                      <strong>Images:</strong> {locationImages.length}
                    </p>
                    <p>
                      <strong>Scope:</strong>{" "}
                      {activeScope === "municipality"
                        ? "Municipality-wide"
                        : "Location-specific"}
                    </p>
                    {activeTransect !== "all" && (
                      <p>
                        <strong>Transect:</strong> {activeTransect}
                      </p>
                    )}
                  </div>
                </div>

                {/* Tabs */}
                <div className="sidebar-tabs">
                  <button
                    className={`tab-btn ${
                      activeTab === "images" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("images")}
                  >
                    <FiImage size={16} />
                    Images ({locationImages.length})
                  </button>
                  <button
                    className={`tab-btn ${
                      activeTab === "analytics" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("analytics")}
                  >
                    <FiBarChart2 size={16} />
                    Analytics
                  </button>
                </div>

                {/* Tab Content */}
                <div className="tab-content">
                  {activeTab === "images" && (
                    <div className="images-section">
                      {loading ? (
                        <div className="loading-state">
                          <div className="loading-spinner"></div>
                          <p>Loading images...</p>
                        </div>
                      ) : locationImages.length === 0 ? (
                        <div className="empty-state">
                          <FiImage size={48} />
                          <h4>No Images Found</h4>
                          <p>No images found for the selected date range.</p>
                        </div>
                      ) : (
                        <div className="images-grid">
                          {locationImages.map((image, index) => (
                            <div
                              key={index}
                              className="image-card"
                              onClick={() => openImageViewer(index)}
                            >
                              <div className="image-thumbnail">
                                <img
                                  src={`http://${process.env.REACT_APP_API_URL}/crops/${image.filename}`}
                                  alt={image.filename}
                                  onError={(e) => {
                                    e.target.src =
                                      'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23f3f4f6"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="%236b7280">No Image</text></svg>';
                                  }}
                                />
                              </div>
                              <div className="image-card-overlay">
                                <button
                                  className="image-overlay-btn view-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openImageViewer(index);
                                  }}
                                  title="View Image"
                                >
                                  <FiEye size={18} />
                                </button>
                                <button
                                  className="image-overlay-btn delete-btn"
                                  onClick={(e) => handleDeleteImage(image, e)}
                                  title="Delete Image"
                                >
                                  <FiTrash2 size={18} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "analytics" && (
                    <div className="analytics-section">
                      {loading ? (
                        <div className="loading-state">
                          <div className="loading-spinner"></div>
                          <p>Loading analytics...</p>
                        </div>
                      ) : (
                        <div className="charts-container">
                          <div className="chart-wrapper">
                            {renderCoralDistributionChart()}
                          </div>

                          <div className="chart-wrapper full-width">
                            {renderTrendChart()}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <TableView
            locations={locations}
            selectedLocation={selectedLocation}
            onLocationSelect={handleLocationClick}
            loading={loading}
            locationImages={locationImages}
            locationAnalytics={locationAnalytics}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            formatDate={formatDate}
            openImageViewer={openImageViewer}
            handleDeleteImage={handleDeleteImage}
            renderCoralDistributionChart={renderCoralDistributionChart}
            renderTrendChart={renderTrendChart}
            getLocationDisplayName={getLocationDisplayName}
          />
        )}
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <p>Loading distribution data...</p>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="delete-confirmation-modal">
          <div className="delete-confirmation-content">
            <div className="delete-confirmation-icon">
              <FiAlertTriangle size={30} />
            </div>
            <h3 className="delete-confirmation-title">Delete Image?</h3>
            <p className="delete-confirmation-message">
              Are you sure you want to delete this image? This action will also
              remove all associated analysis results and cannot be undone.
            </p>
            <div className="delete-confirmation-actions">
              <button
                className="cancel-btn"
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setImageToDelete(null);
                }}
                disabled={deletingImage}
              >
                Cancel
              </button>
              <button
                className="confirm-delete-btn"
                onClick={confirmDelete}
                disabled={deletingImage}
              >
                {deletingImage ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Viewer Modal */}
      {imageViewerOpen && locationImages[currentImageIndex] && (
        <div className="image-viewer-modal-overlay">
          <div className="image-viewer-modal-container">
            <div className="image-viewer-modal-content">
              {/* Modal Header */}
              <div className="image-viewer-modal-header">
                <div className="modal-header-left">
                  <div className="modal-title-section">
                    <FiImage size={24} className="modal-title-icon" />
                    <div>
                      <h3 className="modal-title">Image Viewer</h3>
                      <p className="modal-subtitle">
                        {locationImages[currentImageIndex].filename}
                      </p>
                    </div>
                  </div>
                  <div className="image-counter-badge">
                    <span className="counter-current">
                      {currentImageIndex + 1}
                    </span>
                    <span className="counter-separator">/</span>
                    <span className="counter-total">
                      {locationImages.length}
                    </span>
                  </div>
                </div>
                <button
                  className="close-modal-btn"
                  onClick={closeImageViewer}
                  aria-label="Close image viewer"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="image-viewer-modal-body">
                <div className="image-display-container">
                  <div className="main-image-wrapper">
                    <img
                      src={`http://${process.env.REACT_APP_API_URL}/crops/${locationImages[currentImageIndex].filename}`}
                      alt={locationImages[currentImageIndex].filename}
                      className="main-display-image"
                      onError={(e) => {
                        e.target.src =
                          'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="%23f8f9fa"/><text x="200" y="150" text-anchor="middle" dy=".3em" fill="%23495057" font-size="18" font-family="system-ui">Image Not Found</text></svg>';
                      }}
                    />
                  </div>

                  {/* Navigation Arrows */}
                  <button
                    className="nav-arrow nav-prev"
                    onClick={() => navigateImage("prev")}
                    disabled={currentImageIndex === 0}
                    aria-label="Previous image"
                  >
                    <FiChevronLeft size={28} />
                  </button>

                  <button
                    className="nav-arrow nav-next"
                    onClick={() => navigateImage("next")}
                    disabled={currentImageIndex === locationImages.length - 1}
                    aria-label="Next image"
                  >
                    <FiChevronRight size={28} />
                  </button>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="image-viewer-modal-footer">
                <div className="image-metadata-grid">
                  <div className="metadata-item">
                    <div className="metadata-icon">
                      <FiFile size={16} />
                    </div>
                    <div className="metadata-content">
                      <span className="metadata-label">Filename</span>
                      <span className="metadata-value filename">
                        {locationImages[currentImageIndex].filename}
                      </span>
                    </div>
                  </div>

                  <div className="metadata-item">
                    <div className="metadata-icon">
                      <FiCalendar size={16} />
                    </div>
                    <div className="metadata-content">
                      <span className="metadata-label">Upload Date</span>
                      <span className="metadata-value">
                        {formatDate(
                          locationImages[currentImageIndex].uploaded_at
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="metadata-item">
                    <div className="metadata-icon">
                      <FiUser size={16} />
                    </div>
                    <div className="metadata-content">
                      <span className="metadata-label">Uploader</span>
                      <span className="metadata-value uploader">
                        {locationImages[currentImageIndex].uploader_name}
                      </span>
                    </div>
                  </div>

                  <div className="metadata-item">
                    <div className="metadata-icon">
                      <FiBarChart2 size={16} />
                    </div>
                    <div className="metadata-content">
                      <span className="metadata-label">
                        Analysis Confidence
                      </span>
                      <div className="confidence-display">
                        <div className="confidence-bar">
                          <div
                            className="confidence-fill"
                            style={{
                              width: `${
                                locationImages[currentImageIndex]
                                  .analysis_confidence * 100
                              }%`,
                              backgroundColor: `hsl(${
                                locationImages[currentImageIndex]
                                  .analysis_confidence * 120
                              }, 70%, 45%)`,
                            }}
                          ></div>
                        </div>
                        <span className="confidence-value">
                          {(
                            locationImages[currentImageIndex]
                              .analysis_confidence * 100
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    className="action-btn secondary"
                    onClick={closeImageViewer}
                  >
                    <FiEye size={16} />
                    Close Viewer
                  </button>
                  <button
                    className="action-btn danger"
                    onClick={() =>
                      handleDeleteImage(locationImages[currentImageIndex])
                    }
                    disabled={deletingImage}
                  >
                    {deletingImage ? (
                      <>
                        <div className="button-spinner"></div>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <FiTrash2 size={16} />
                        Delete Image
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CoralDistribution;
