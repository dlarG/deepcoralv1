import React, { useState, useEffect, useRef } from "react";
import { API_BASE_URL } from "../../../config/api";
import {
  FiMap,
  FiMapPin,
  FiSave,
  FiX,
  FiSearch,
  FiTarget,
  FiInfo,
  FiCheckCircle,
  FiPlus,
  FiLoader,
} from "react-icons/fi";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers in react-leaflet
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom icons for different marker types
const createCustomIcon = (color, isSelected = false) => {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        background-color: ${color};
        width: ${isSelected ? "25px" : "20px"};
        height: ${isSelected ? "25px" : "20px"};
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        position: relative;
      ">
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: ${isSelected ? "12px" : "10px"};
          font-weight: bold;
        ">📍</div>
      </div>
    `,
    iconSize: [isSelected ? 25 : 20, isSelected ? 25 : 20],
    iconAnchor: [isSelected ? 12.5 : 10, isSelected ? 25 : 20],
  });
};

// Component for handling map clicks
const MapClickHandler = ({ onMapClick, mode }) => {
  useMapEvents({
    click: (e) => {
      if (mode === "create") {
        onMapClick(e.latlng);
      }
    },
  });
  return null;
};

const LocationSelector = ({
  isOpen,
  onClose,
  onSave,
  processedImages = [],
  batchResults = null,
}) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [existingLocations, setExistingLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mode, setMode] = useState("select"); // 'select' or 'create'
  const [mapCenter, setMapCenter] = useState([14.5995, 120.9842]); // Philippines default
  const [mapZoom, setMapZoom] = useState(10);
  const mapRef = useRef();

  // Load existing locations on mount
  useEffect(() => {
    if (isOpen) {
      loadExistingLocations();
    }
  }, [isOpen]);

  const loadExistingLocations = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/gis/locations`
      );
      const data = await response.json();

      if (response.ok) {
        setExistingLocations(data.locations);
      } else {
        console.error("Failed to load locations:", data.error);
      }
    } catch (error) {
      console.error("Error loading existing locations:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchLocation = async () => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      // Using OpenStreetMap Nominatim for geocoding (free alternative to Google)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=1`
      );
      const results = await response.json();

      if (results && results.length > 0) {
        const location = results[0];
        const newCenter = [parseFloat(location.lat), parseFloat(location.lon)];
        setMapCenter(newCenter);
        setMapZoom(15);

        // Pan map to location if ref exists
        if (mapRef.current) {
          mapRef.current.setView(newCenter, 15);
        }
      } else {
        alert("Location not found. Please try a different search term.");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      alert("Failed to search location. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCenter = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          setMapCenter(newCenter);
          setMapZoom(15);

          if (mapRef.current) {
            mapRef.current.setView(newCenter, 15);
          }
          setLoading(false);
        },
        (error) => {
          console.error("Error getting current location:", error);
          alert(
            "Unable to get your current location. Please search manually or select a location on the map."
          );
          setLoading(false);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleMapClick = (latlng) => {
    if (mode === "create") {
      setSelectedLocation({
        lat: latlng.lat,
        lng: latlng.lng,
        isNew: true,
      });
    }
  };

  const handleExistingLocationClick = (location) => {
    setSelectedLocation({
      lat: location.latitude,
      lng: location.longitude,
      isNew: false,
      data: location,
    });
    setMode("select");

    // Pan to location
    const newCenter = [location.latitude, location.longitude];
    setMapCenter(newCenter);
    setMapZoom(15);

    if (mapRef.current) {
      mapRef.current.setView(newCenter, 15);
    }
  };

  // Update the handleSaveLocation function
  const handleSaveLocation = async () => {
    if (!selectedLocation) {
      alert("Please select a location first.");
      return;
    }

    try {
      setLoading(true);

      // DEBUG FUNCTION - Enhanced version
      const debugImageIds = () => {
        console.log("=== ENHANCED DEBUG: Image ID Collection ===");
        console.log("batchResults:", batchResults);
        console.log("processedImages:", processedImages);

        if (batchResults?.results) {
          console.log("=== BATCH RESULTS ANALYSIS ===");
          batchResults.results.forEach((result, idx) => {
            console.log(`Batch Result ${idx}:`, result);
            if (result.crops && Array.isArray(result.crops)) {
              result.crops.forEach((crop, cropIdx) => {
                console.log(`  Batch Crop ${cropIdx}:`, crop);
                console.log(
                  `  Has image_id: ${crop.hasOwnProperty("image_id")}`
                );
                if (crop.image_id) {
                  console.log(`  Image ID: ${crop.image_id}`);
                }
              });
            } else {
              console.log(`  No crops array found in result ${idx}`);
            }
          });
        }

        if (processedImages && Array.isArray(processedImages)) {
          console.log("=== PROCESSED IMAGES ANALYSIS ===");
          processedImages.forEach((img, idx) => {
            console.log(`Processed Image ${idx}:`, img);
            if (img.segmentationData?.crops) {
              console.log(`  Segmentation crops:`, img.segmentationData.crops);
              img.segmentationData.crops.forEach((crop, cropIdx) => {
                console.log(`    Seg Crop ${cropIdx}:`, crop);
                console.log(
                  `    Has image_id: ${crop.hasOwnProperty("image_id")}`
                );
                if (crop.image_id) {
                  console.log(`    Image ID: ${crop.image_id}`);
                }
              });
            } else {
              console.log(`  No segmentation crops found in image ${idx}`);
            }
          });
        }
      };

      debugImageIds();

      // ENHANCED IMAGE ID COLLECTION
      let imageIds = [];

      // Method 1: From batch results
      if (
        batchResults &&
        batchResults.results &&
        Array.isArray(batchResults.results)
      ) {
        console.log("Collecting from batch results...");

        batchResults.results.forEach((result, resultIdx) => {
          if (result.crops && Array.isArray(result.crops)) {
            result.crops.forEach((crop, cropIdx) => {
              console.log(
                `Checking batch result ${resultIdx}, crop ${cropIdx}:`,
                crop
              );

              if (crop && typeof crop === "object" && crop.image_id) {
                imageIds.push(crop.image_id);
                console.log(`✅ Found image_id from batch: ${crop.image_id}`);
              } else {
                console.log(`❌ No image_id in batch crop:`, crop);
              }
            });
          }
        });
      }

      // Method 2: From processed images (if batch failed)
      if (
        imageIds.length === 0 &&
        processedImages &&
        Array.isArray(processedImages)
      ) {
        console.log("Batch method failed, trying processed images...");

        processedImages.forEach((img, imgIdx) => {
          if (
            img.segmentationData &&
            img.segmentationData.crops &&
            Array.isArray(img.segmentationData.crops)
          ) {
            img.segmentationData.crops.forEach((crop, cropIdx) => {
              console.log(
                `Checking processed image ${imgIdx}, crop ${cropIdx}:`,
                crop
              );

              if (crop && typeof crop === "object" && crop.image_id) {
                imageIds.push(crop.image_id);
                console.log(
                  `✅ Found image_id from processed: ${crop.image_id}`
                );
              } else {
                console.log(`❌ No image_id in processed crop:`, crop);
              }
            });
          }
        });
      }

      // Remove duplicates and filter out invalid IDs
      imageIds = [...new Set(imageIds)].filter(
        (id) => id != null && id !== undefined
      );

      console.log("=== FINAL RESULT ===");
      console.log("Final imageIds to save:", imageIds);
      console.log("Total valid image IDs found:", imageIds.length);

      if (imageIds.length === 0) {
        console.error("❌ NO IMAGE IDS FOUND!");
        console.error(
          "Batch results structure:",
          JSON.stringify(batchResults, null, 2)
        );
        console.error(
          "Processed images structure:",
          JSON.stringify(processedImages, null, 2)
        );
        alert(
          "No processed images found to save with location. Please check the console for debugging information."
        );
        return;
      }

      console.log(`✅ Proceeding with ${imageIds.length} image IDs:`, imageIds);

      const response = await fetch(
        `${API_BASE_URL}/gis/save_with_location`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image_ids: imageIds,
            location: {
              lat: selectedLocation.lat,
              lng: selectedLocation.lng,
            },
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(
          `Successfully saved ${data.updated_count} images with location data!`
        );
        onSave(selectedLocation, data);
        onClose();
      } else {
        alert(`Error saving location: ${data.error}`);
      }
    } catch (error) {
      console.error("Error saving location:", error);
      alert("Failed to save location. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="location-selector-overlay">
      <div className="location-selector-modal">
        <div className="location-header">
          <div className="header-left">
            <FiMap size={24} />
            <div>
              <h2>Select Location for Coral Data</h2>
              <p>Choose where these coral images were captured</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        <div className="location-content">
          <div className="map-controls">
            <div className="search-section">
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search for a location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && searchLocation()}
                />
                <button
                  onClick={searchLocation}
                  className="search-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <FiLoader size={16} className="spinning" />
                  ) : (
                    <FiSearch size={16} />
                  )}
                </button>
              </div>
              <button
                onClick={getCurrentLocation}
                className="location-btn"
                disabled={loading}
              >
                <FiTarget size={16} />
                Use Current Location
              </button>
            </div>

            <div className="mode-selector">
              <button
                className={`mode-btn ${mode === "select" ? "active" : ""}`}
                onClick={() => {
                  setMode("select");
                  setSelectedLocation(null);
                }}
              >
                <FiMapPin size={16} />
                Select Existing
              </button>
              <button
                className={`mode-btn ${mode === "create" ? "active" : ""}`}
                onClick={() => {
                  setMode("create");
                  setSelectedLocation(null);
                }}
              >
                <FiPlus size={16} />
                Create New
              </button>
            </div>

            {selectedLocation && (
              <div className="selected-location-info">
                <FiCheckCircle size={16} />
                <div>
                  <strong>
                    {selectedLocation.isNew
                      ? "New Location"
                      : "Existing Location"}
                  </strong>
                  <p>
                    Lat: {selectedLocation.lat.toFixed(6)}, Lng:{" "}
                    {selectedLocation.lng.toFixed(6)}
                  </p>
                  {selectedLocation.data && (
                    <p className="location-stats">
                      {selectedLocation.data.image_count} existing images
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="map-container">
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              style={{ width: "100%", height: "400px" }}
              ref={mapRef}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              <MapClickHandler onMapClick={handleMapClick} mode={mode} />

              {/* Existing location markers */}
              {existingLocations.map((location, index) => (
                <Marker
                  key={index}
                  position={[location.latitude, location.longitude]}
                  icon={createCustomIcon(
                    "#2563eb",
                    selectedLocation &&
                      selectedLocation.lat === location.latitude &&
                      selectedLocation.lng === location.longitude
                  )}
                  eventHandlers={{
                    click: () => handleExistingLocationClick(location),
                  }}
                >
                  <Popup>
                    <div className="location-popup">
                      <strong>Existing Location {index + 1}</strong>
                      <p>Images: {location.image_count}</p>
                      <p>Coral Types: {location.coral_types.length}</p>
                      <p>
                        Coordinates: {location.latitude.toFixed(4)},{" "}
                        {location.longitude.toFixed(4)}
                      </p>
                      <button
                        onClick={() => handleExistingLocationClick(location)}
                        className="select-location-btn"
                      >
                        Select This Location
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* New location marker */}
              {selectedLocation && selectedLocation.isNew && (
                <Marker
                  position={[selectedLocation.lat, selectedLocation.lng]}
                  icon={createCustomIcon("#dc2626", true)}
                >
                  <Popup>
                    <div className="location-popup">
                      <strong>New Location</strong>
                      <p>
                        Lat: {selectedLocation.lat.toFixed(6)}
                        <br />
                        Lng: {selectedLocation.lng.toFixed(6)}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              )}
            </MapContainer>

            {loading && (
              <div className="map-loading">
                <div className="loading-spinner"></div>
                <p>Loading locations...</p>
              </div>
            )}
          </div>

          <div className="existing-locations-panel">
            <h3>
              <FiMapPin size={16} />
              Existing Locations ({existingLocations.length})
            </h3>
            <div className="locations-list">
              {existingLocations.length === 0 ? (
                <div className="no-locations">
                  <p>
                    No existing locations found. Create a new one by clicking on
                    the map.
                  </p>
                </div>
              ) : (
                existingLocations.map((location, index) => (
                  <div
                    key={index}
                    className={`location-item ${
                      selectedLocation &&
                      selectedLocation.lat === location.latitude &&
                      selectedLocation.lng === location.longitude
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => handleExistingLocationClick(location)}
                  >
                    <div className="location-info">
                      <strong>Location {index + 1}</strong>
                      <p>
                        Images: {location.image_count} | Types:{" "}
                        {location.coral_types.length}
                      </p>
                      <p className="coordinates">
                        {location.latitude.toFixed(4)},{" "}
                        {location.longitude.toFixed(4)}
                      </p>
                      <p className="last-update">
                        Last updated:{" "}
                        {new Date(location.last_update).toLocaleDateString()}
                      </p>
                    </div>
                    <FiInfo size={16} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="location-footer">
          <div className="footer-info">
            <p>
              {mode === "create"
                ? "Click on the map to create a new location"
                : "Select an existing location or switch to create mode"}
            </p>
          </div>
          <div className="footer-actions">
            <button className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button
              className="save-btn"
              onClick={handleSaveLocation}
              disabled={!selectedLocation || loading}
            >
              <FiSave size={16} />
              {loading ? "Saving..." : "Save Location"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationSelector;
