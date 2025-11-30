import React, { useState, useEffect, useRef } from "react";
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
  FiAlertTriangle,
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
import "../styles/locationSelector.css";

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
  const [mode, setMode] = useState("select");
  const [mapCenter, setMapCenter] = useState([14.5995, 120.9842]);
  const [mapZoom, setMapZoom] = useState(10);
  const mapRef = useRef();
  const [municipality, setMunicipality] = useState("");
  const [barangay, setBarangay] = useState("");
  const [transect, setTransect] = useState("");

  // NEW: State for transect validation
  const [transectCounts, setTransectCounts] = useState({});
  const [loadingTransectCounts, setLoadingTransectCounts] = useState(false);
  const [imagesToSaveCount, setImagesToSaveCount] = useState(0);

  // Constants
  const MAX_IMAGES_PER_TRANSECT = 50;

  const getLocationDisplayName = (location, index) => {
    if (location.municipality && location.barangay) {
      return `${location.municipality} - ${location.barangay}`;
    } else if (location.municipality) {
      return location.municipality;
    } else if (location.barangay) {
      return location.barangay;
    } else {
      return `Location ${index + 1}`;
    }
  };

  // NEW: Function to count images to be saved
  const countImagesToSave = () => {
    let imageCount = 0;

    // Count from batch results
    if (batchResults?.results && Array.isArray(batchResults.results)) {
      batchResults.results.forEach((result) => {
        if (result.crops && Array.isArray(result.crops)) {
          result.crops.forEach((crop) => {
            if (crop && typeof crop === "object" && crop.image_id) {
              imageCount++;
            }
          });
        }
      });
    }

    // Count from processed images if batch failed
    if (imageCount === 0 && processedImages && Array.isArray(processedImages)) {
      processedImages.forEach((img) => {
        if (
          img.segmentationData &&
          img.segmentationData.crops &&
          Array.isArray(img.segmentationData.crops)
        ) {
          img.segmentationData.crops.forEach((crop) => {
            if (crop && typeof crop === "object" && crop.image_id) {
              imageCount++;
            }
          });
        }
      });
    }

    // Remove duplicates (if any)
    return imageCount;
  };

  // NEW: Function to load transect counts for a specific location
  const loadTransectCounts = async (location) => {
    if (!location) return;

    try {
      setLoadingTransectCounts(true);
      console.log("🔢 Loading transect counts for location:", location);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/distribution/location/${location.latitude}/${location.longitude}/images?scope=location`
      );
      const data = await response.json();

      if (response.ok && data.images) {
        // Count images per transect
        const counts = {};
        for (let i = 1; i <= 5; i++) {
          counts[i] = 0;
        }

        data.images.forEach((image) => {
          if (image.transect && image.transect >= 1 && image.transect <= 5) {
            counts[image.transect] = (counts[image.transect] || 0) + 1;
          }
        });

        console.log("📊 Transect counts:", counts);
        setTransectCounts(counts);
      } else {
        console.error("Failed to load transect counts:", data.error);
        // Initialize with zeros if failed
        const counts = {};
        for (let i = 1; i <= 5; i++) {
          counts[i] = 0;
        }
        setTransectCounts(counts);
      }
    } catch (error) {
      console.error("Error loading transect counts:", error);
      // Initialize with zeros if error
      const counts = {};
      for (let i = 1; i <= 5; i++) {
        counts[i] = 0;
      }
      setTransectCounts(counts);
    } finally {
      setLoadingTransectCounts(false);
    }
  };

  // NEW: Function to check if a transect is available
  const isTransectAvailable = (transectNumber) => {
    const currentCount = transectCounts[transectNumber] || 0;
    const wouldExceed =
      currentCount + imagesToSaveCount > MAX_IMAGES_PER_TRANSECT;
    return !wouldExceed;
  };

  // NEW: Function to get transect status message
  const getTransectStatusMessage = (transectNumber) => {
    const currentCount = transectCounts[transectNumber] || 0;
    const remainingSlots = MAX_IMAGES_PER_TRANSECT - currentCount;

    if (remainingSlots <= 0) {
      return `Full (${currentCount}/${MAX_IMAGES_PER_TRANSECT})`;
    } else if (imagesToSaveCount > remainingSlots) {
      return `Not enough space (${currentCount}/${MAX_IMAGES_PER_TRANSECT}, need ${imagesToSaveCount}, only ${remainingSlots} available)`;
    } else {
      return `Available (${currentCount}/${MAX_IMAGES_PER_TRANSECT}, ${remainingSlots} slots remaining)`;
    }
  };

  // Load existing locations on mount
  useEffect(() => {
    if (isOpen) {
      loadExistingLocations();
      // Count images to save
      const count = countImagesToSave();
      setImagesToSaveCount(count);
      console.log(`📸 Images to save: ${count}`);
    }
  }, [isOpen, batchResults, processedImages]);

  // Load transect counts when location changes
  useEffect(() => {
    if (selectedLocation && !selectedLocation.isNew) {
      loadTransectCounts(selectedLocation.data || selectedLocation);
    } else {
      // Reset transect counts for new locations
      const counts = {};
      for (let i = 1; i <= 5; i++) {
        counts[i] = 0;
      }
      setTransectCounts(counts);
    }
  }, [selectedLocation]);

  const handleExistingLocationClick = (location) => {
    console.log("Selected existing location:", location);

    setSelectedLocation({
      lat: location.latitude,
      lng: location.longitude,
      isNew: false,
      data: location,
    });
    setMode("select");

    // Load municipality and barangay from existing location
    setMunicipality(location.municipality || "");
    setBarangay(location.barangay || "");
    // Reset transect selection
    setTransect("");

    // Pan to location
    const newCenter = [location.latitude, location.longitude];
    setMapCenter(newCenter);
    setMapZoom(15);

    if (mapRef.current) {
      mapRef.current.setView(newCenter, 15);
    }
  };

  const loadExistingLocations = async () => {
    try {
      setLoading(true);
      console.log("🔍 Loading existing locations...");

      // FIXED: Use the distribution endpoint which has consistent data structure
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/distribution/locations`
      );
      const data = await response.json();

      console.log("📍 Raw locations response:", data);

      if (response.ok && data.locations) {
        console.log(`✅ Found ${data.locations.length} existing locations`);

        // Process the locations to ensure consistent structure
        const processedLocations = data.locations.map((loc, index) => {
          console.log(`Processing location ${index}:`, loc);

          return {
            latitude: loc.latitude,
            longitude: loc.longitude,
            municipality: loc.municipality || "",
            barangay: loc.barangay || "",
            image_count: loc.image_count || 0,
            coral_types: loc.coral_types || [],
            last_update: loc.date_range || new Date().toISOString(),
            contributor_count: loc.contributor_count || 0,
            transects: [], // Will be populated if available
            location_id: loc.location_id || getLocationDisplayName(loc, index),
          };
        });

        setExistingLocations(processedLocations);
        console.log("✅ Processed locations:", processedLocations);

        // If we have locations, adjust map view to show them
        if (processedLocations.length > 0) {
          const avgLat =
            processedLocations.reduce((sum, loc) => sum + loc.latitude, 0) /
            processedLocations.length;
          const avgLng =
            processedLocations.reduce((sum, loc) => sum + loc.longitude, 0) /
            processedLocations.length;
          setMapCenter([avgLat, avgLng]);
          setMapZoom(8);
        }
      } else {
        console.error(
          "❌ Failed to load locations:",
          data.error || "Unknown error"
        );
        setExistingLocations([]);
      }
    } catch (error) {
      console.error("❌ Error loading existing locations:", error);
      setExistingLocations([]);
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
      // Clear municipality and barangay for new location
      setMunicipality("");
      setBarangay("");
      // Reset transect selection
      setTransect("");
    }
  };

  // Updated handleSaveLocation function with transect validation
  const handleSaveLocation = async () => {
    if (!selectedLocation) {
      alert("Please select a location first.");
      return;
    }

    // Validate transect selection
    if (!transect || transect < 1 || transect > 5) {
      alert("Please select a valid transect number (1-5).");
      return;
    }

    // NEW: Validate transect capacity
    if (!selectedLocation.isNew && !isTransectAvailable(transect)) {
      const currentCount = transectCounts[transect] || 0;
      const remainingSlots = MAX_IMAGES_PER_TRANSECT - currentCount;
      alert(
        `Cannot save to Transect ${transect}. ` +
          `Current images: ${currentCount}/${MAX_IMAGES_PER_TRANSECT}. ` +
          `Available slots: ${remainingSlots}. ` +
          `Images to save: ${imagesToSaveCount}. ` +
          `Please choose a different transect.`
      );
      return;
    }

    // Validate additional fields for new locations
    if (selectedLocation.isNew) {
      if (!municipality.trim()) {
        alert("Please enter a municipality name for the new location.");
        return;
      }
      if (!barangay.trim()) {
        alert("Please enter a barangay name for the new location.");
        return;
      }
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
                console.log(` Found image_id from batch: ${crop.image_id}`);
              } else {
                console.log(` No image_id in batch crop:`, crop);
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
                console.log(` Found image_id from processed: ${crop.image_id}`);
              } else {
                console.log(` No image_id in processed crop:`, crop);
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
      console.log("Selected transect:", transect);

      if (imageIds.length === 0) {
        console.error(" NO IMAGE IDS FOUND!");
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

      // NEW: Final validation before saving
      if (!selectedLocation.isNew) {
        const currentCount = transectCounts[transect] || 0;
        if (currentCount + imageIds.length > MAX_IMAGES_PER_TRANSECT) {
          alert(
            `Final validation failed: Transect ${transect} would have ${
              currentCount + imageIds.length
            } images, ` +
              `exceeding the limit of ${MAX_IMAGES_PER_TRANSECT}. Please choose a different transect.`
          );
          return;
        }
      }

      console.log(` Proceeding with ${imageIds.length} image IDs:`, imageIds);

      const requestBody = {
        image_ids: imageIds,
        location: {
          lat: selectedLocation.lat,
          lng: selectedLocation.lng,
        },
        transect: transect,
      };

      // Only include municipality and barangay for new locations
      if (selectedLocation.isNew) {
        requestBody.municipality = municipality.trim();
        requestBody.barangay = barangay.trim();
      }

      console.log("Request body:", requestBody);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/gis/save_with_location`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(
          `Successfully saved ${data.updated_count} images with location data and transect ${transect}!`
        );

        // Reload existing locations to show the new data
        await loadExistingLocations();

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
        <div className="save-location-header">
          <div className="header-left">
            <FiMap size={24} />
            <div>
              <h2>Select Location for Coral Data</h2>
              <p>Choose where these coral images were captured</p>
              {/* NEW: Show images to save count */}
              <p className="images-count-info">
                📸 Images to save: <strong>{imagesToSaveCount}</strong>
              </p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        <div className="location-content">
          <div className="save-map-controls">
            <div className="search-section">
              <div className="save-search-bar">
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
              <div className="save-selected-location-info">
                <FiCheckCircle size={16} />
                <div>
                  <strong>
                    {selectedLocation.isNew
                      ? municipality && barangay
                        ? `${municipality} - ${barangay}`
                        : "New Location"
                      : getLocationDisplayName(
                          selectedLocation.data || selectedLocation,
                          0
                        )}
                  </strong>
                  <p>
                    Lat: {selectedLocation.lat.toFixed(6)}, Lng:{" "}
                    {selectedLocation.lng.toFixed(6)}
                  </p>
                  {selectedLocation.data && (
                    <p className="location-stats">
                      {selectedLocation.data.image_count} existing images
                      {selectedLocation.data.municipality && (
                        <span> • {selectedLocation.data.municipality}</span>
                      )}
                      {selectedLocation.data.barangay && (
                        <span> • {selectedLocation.data.barangay}</span>
                      )}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* NEW: Enhanced Transect Selection with Validation */}
            {selectedLocation && (
              <div className="transect-selection">
                <h4>Transect Information</h4>
                {loadingTransectCounts ? (
                  <div className="loading-transects">
                    <FiLoader className="spinning" />
                    <p>Loading transect information...</p>
                  </div>
                ) : (
                  <>
                    <div className="form-group">
                      <label htmlFor="transect">Transect Number:</label>
                      <select
                        id="transect"
                        value={transect}
                        onChange={(e) =>
                          setTransect(parseInt(e.target.value) || "")
                        }
                        className="transect-select"
                        required
                      >
                        <option value="">Select Transect</option>
                        {[1, 2, 3, 4, 5].map((num) => {
                          const available =
                            selectedLocation.isNew || isTransectAvailable(num);
                          return (
                            <option key={num} value={num} disabled={!available}>
                              Transect {num} {!available ? "(Full)" : ""}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    {/* NEW: Transect Status Display */}
                    {!selectedLocation.isNew && (
                      <div className="transect-status">
                        <h5>Transect Capacity Status:</h5>
                        <div className="transect-grid">
                          {[1, 2, 3, 4, 5].map((num) => {
                            const available = isTransectAvailable(num);
                            const currentCount = transectCounts[num] || 0;
                            const remainingSlots =
                              MAX_IMAGES_PER_TRANSECT - currentCount;

                            return (
                              <div
                                key={num}
                                className={`transect-item ${
                                  !available ? "unavailable" : ""
                                } ${transect === num ? "selected" : ""}`}
                              >
                                <div className="transect-header">
                                  <strong>Transect {num}</strong>
                                  {!available && (
                                    <FiAlertTriangle className="warning-icon" />
                                  )}
                                </div>
                                <div className="transect-counts">
                                  <span className="current-count">
                                    {currentCount}/{MAX_IMAGES_PER_TRANSECT}
                                  </span>
                                  <div className="progress-bar">
                                    <div
                                      className="progress-fill"
                                      style={{
                                        width: `${
                                          (currentCount /
                                            MAX_IMAGES_PER_TRANSECT) *
                                          100
                                        }%`,
                                        backgroundColor:
                                          currentCount >=
                                          MAX_IMAGES_PER_TRANSECT
                                            ? "#dc2626"
                                            : currentCount + imagesToSaveCount >
                                              MAX_IMAGES_PER_TRANSECT
                                            ? "#f59e0b"
                                            : "#10b981",
                                      }}
                                    />
                                  </div>
                                  <span className="remaining-slots">
                                    {available
                                      ? `${remainingSlots} slots`
                                      : "Full"}
                                  </span>
                                </div>
                                {transect === num && (
                                  <div className="selected-transect-info">
                                    <p>
                                      After saving:{" "}
                                      {currentCount + imagesToSaveCount}/
                                      {MAX_IMAGES_PER_TRANSECT}
                                    </p>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <p className="transect-help">
                      Select the transect number (1-5) for this coral data
                      collection.
                      <br />
                      <strong>
                        Maximum {MAX_IMAGES_PER_TRANSECT} images per transect.
                      </strong>
                      {!selectedLocation.isNew && (
                        <>
                          <br />
                          You are about to save {imagesToSaveCount} images.
                        </>
                      )}
                    </p>
                  </>
                )}
              </div>
            )}

            {/* Additional Location Information - Only show for new locations */}
            {selectedLocation && selectedLocation.isNew && (
              <div className="location-details-form">
                <h4>Additional Location Information</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="municipality">
                      Municipality: <span className="required">*</span>
                    </label>
                    <input
                      id="municipality"
                      type="text"
                      value={municipality}
                      onChange={(e) => setMunicipality(e.target.value)}
                      placeholder="Enter municipality name"
                      className="location-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="barangay">
                      Barangay: <span className="required">*</span>
                    </label>
                    <input
                      id="barangay"
                      type="text"
                      value={barangay}
                      onChange={(e) => setBarangay(e.target.value)}
                      placeholder="Enter barangay name"
                      className="location-input"
                      required
                    />
                  </div>
                </div>
                <p className="form-help">
                  <span className="required">*</span> Required fields for new
                  locations
                </p>
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

              {/* Debug: Show loading state on map */}
              {loading && (
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    background: "rgba(0,0,0,0.7)",
                    color: "white",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    zIndex: 1000,
                  }}
                >
                  Loading locations...
                </div>
              )}

              {/* Debug: Show location count */}
              {!loading && (
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    background: "rgba(0,0,0,0.7)",
                    color: "white",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    zIndex: 1000,
                  }}
                >
                  {existingLocations.length} locations found
                </div>
              )}

              {/* Existing location markers */}
              {existingLocations.map((location, index) => {
                console.log(`Rendering marker ${index}:`, location);
                return (
                  <Marker
                    key={`existing-${index}`}
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
                        <strong>
                          {getLocationDisplayName(location, index)}
                        </strong>
                        {/* Show additional details if municipality/barangay exist */}
                        {(location.municipality || location.barangay) && (
                          <div className="location-address">
                            {location.municipality && (
                              <p className="address-line">
                                📍 {location.municipality}
                              </p>
                            )}
                            {location.barangay && (
                              <p className="address-line">
                                🏘️ {location.barangay}
                              </p>
                            )}
                          </div>
                        )}
                        <div className="popup-stats">
                          <p>📷 Images: {location.image_count}</p>
                          <p>
                            🪸 Coral Types: {location.coral_types?.length || 0}
                          </p>
                          <p className="coordinates">
                            📍 {location.latitude.toFixed(4)},{" "}
                            {location.longitude.toFixed(4)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleExistingLocationClick(location)}
                          className="select-location-btn"
                        >
                          Select This Location
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

              {/* New location marker */}
              {selectedLocation && selectedLocation.isNew && (
                <Marker
                  key="new-location"
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

          <div className="select-existing-locations-panel">
            <h3>
              <FiMapPin size={16} />
              Existing Locations ({existingLocations.length})
            </h3>
            <div className="locations-list">
              {loading ? (
                <div className="loading-locations">
                  <FiLoader className="spinning" />
                  <p>Loading locations...</p>
                </div>
              ) : existingLocations.length === 0 ? (
                <div className="no-locations">
                  <p>
                    No existing locations found. Create a new one by clicking on
                    the map.
                  </p>
                </div>
              ) : (
                existingLocations.map((location, index) => (
                  <div
                    key={`location-item-${index}`}
                    className={`select-location-item ${
                      selectedLocation &&
                      selectedLocation.lat === location.latitude &&
                      selectedLocation.lng === location.longitude
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => handleExistingLocationClick(location)}
                  >
                    <div className="location-info">
                      <strong>{getLocationDisplayName(location, index)}</strong>
                      {/* Show additional address info if available */}
                      {(location.municipality || location.barangay) && (
                        <p className="location-address-info">
                          {location.municipality &&
                            `📍 ${location.municipality}`}
                          {location.municipality && location.barangay && " • "}
                          {location.barangay && `🏘️ ${location.barangay}`}
                        </p>
                      )}
                      <p>
                        Images: {location.image_count} | Types:{" "}
                        {location.coral_types?.length || 0}
                      </p>
                      <p className="coordinates">
                        {location.latitude.toFixed(4)},{" "}
                        {location.longitude.toFixed(4)}
                      </p>
                      {location.last_update && (
                        <p className="last-update">
                          Last updated:{" "}
                          {new Date(location.last_update).toLocaleDateString()}
                        </p>
                      )}
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
            {selectedLocation && (
              <p className="validation-info">
                Please select a transect number
                {selectedLocation.isNew && " and fill in location details"}{" "}
                before saving.
                {!selectedLocation.isNew &&
                  transect &&
                  !isTransectAvailable(transect) && (
                    <span className="error-text">
                      <br />
                      ⚠️ Selected transect is full. Please choose another.
                    </span>
                  )}
              </p>
            )}
          </div>
          <div className="footer-actions">
            <button className="uploads-cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button
              className="uploads-save-btn"
              onClick={handleSaveLocation}
              disabled={
                !selectedLocation ||
                !transect ||
                loading ||
                (!selectedLocation.isNew && !isTransectAvailable(transect))
              }
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
