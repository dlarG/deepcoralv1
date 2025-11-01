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
import "../styles/LocationSelector.css";

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
  const [loading, setLoading] = useState(false);
  const [existingLocations, setExistingLocations] = useState([]);
  const [mapCenter, setMapCenter] = useState([14.5995, 120.9842]); // Philippines center
  const [searchQuery, setSearchQuery] = useState("");
  const [mode, setMode] = useState("select"); // 'select' or 'create'
  const [mapZoom, setMapZoom] = useState(10);
  const mapRef = useRef();

  // New state for administrative divisions
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [barangays, setBarangays] = useState([]);

  // Selected administrative divisions
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedMunicipality, setSelectedMunicipality] = useState("");
  const [selectedBarangay, setSelectedBarangay] = useState("");

  // Additional location data
  const [transect, setTransect] = useState("");
  const [siteName, setSiteName] = useState("");

  // Loading states for dropdowns
  const [loadingRegions, setLoadingRegions] = useState(false);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingMunicipalities, setLoadingMunicipalities] = useState(false);
  const [loadingBarangays, setLoadingBarangays] = useState(false);

  // Load existing locations on mount
  useEffect(() => {
    if (isOpen) {
      loadExistingLocations();
      loadRegions(); // Load regions when modal opens
    }
  }, [isOpen]);

  const loadExistingLocations = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://${process.env.REACT_APP_API_URL}/gis/locations`
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

  // Functions for cascading dropdowns
  const loadRegions = async () => {
    try {
      setLoadingRegions(true);
      const response = await fetch(
        `http://${process.env.REACT_APP_API_URL}/locations/regions`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (response.ok && data.success) {
        setRegions(data.regions);
      } else {
        console.error("Failed to load regions:", data.error);
      }
    } catch (error) {
      console.error("Error loading regions:", error);
    } finally {
      setLoadingRegions(false);
    }
  };

  const loadProvinces = async (regionCode) => {
    try {
      setLoadingProvinces(true);
      setProvinces([]);
      setMunicipalities([]);
      setBarangays([]);
      setSelectedProvince("");
      setSelectedMunicipality("");
      setSelectedBarangay("");

      const response = await fetch(
        `http://${process.env.REACT_APP_API_URL}/locations/provinces/${regionCode}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (response.ok && data.success) {
        setProvinces(data.provinces);
      } else {
        console.error("Failed to load provinces:", data.error);
      }
    } catch (error) {
      console.error("Error loading provinces:", error);
    } finally {
      setLoadingProvinces(false);
    }
  };

  const loadMunicipalities = async (provinceCode) => {
    try {
      setLoadingMunicipalities(true);
      setMunicipalities([]);
      setBarangays([]);
      setSelectedMunicipality("");
      setSelectedBarangay("");

      const response = await fetch(
        `http://${process.env.REACT_APP_API_URL}/locations/municipalities/${provinceCode}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (response.ok && data.success) {
        setMunicipalities(data.municipalities);
      } else {
        console.error("Failed to load municipalities:", data.error);
      }
    } catch (error) {
      console.error("Error loading municipalities:", error);
    } finally {
      setLoadingMunicipalities(false);
    }
  };

  const loadBarangays = async (municipalityCode) => {
    try {
      setLoadingBarangays(true);
      setBarangays([]);
      setSelectedBarangay("");

      const response = await fetch(
        `http://${process.env.REACT_APP_API_URL}/locations/barangays/${municipalityCode}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (response.ok && data.success) {
        setBarangays(data.barangays);
      } else {
        console.error("Failed to load barangays:", data.error);
      }
    } catch (error) {
      console.error("Error loading barangays:", error);
    } finally {
      setLoadingBarangays(false);
    }
  };

  // Handlers for dropdown changes
  const handleRegionChange = (e) => {
    const regionCode = e.target.value;
    setSelectedRegion(regionCode);
    if (regionCode) {
      loadProvinces(regionCode);
    } else {
      setProvinces([]);
      setMunicipalities([]);
      setBarangays([]);
      setSelectedProvince("");
      setSelectedMunicipality("");
      setSelectedBarangay("");
    }
  };

  const handleProvinceChange = (e) => {
    const provinceCode = e.target.value;
    setSelectedProvince(provinceCode);
    if (provinceCode) {
      loadMunicipalities(provinceCode);
    } else {
      setMunicipalities([]);
      setBarangays([]);
      setSelectedMunicipality("");
      setSelectedBarangay("");
    }
  };

  const handleMunicipalityChange = (e) => {
    const municipalityCode = e.target.value;
    setSelectedMunicipality(municipalityCode);
    if (municipalityCode) {
      loadBarangays(municipalityCode);
    } else {
      setBarangays([]);
      setSelectedBarangay("");
    }
  };

  const handleBarangayChange = (e) => {
    setSelectedBarangay(e.target.value);
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
        `http://${process.env.REACT_APP_API_URL}/gis/save_with_location`,
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
              administrative: {
                region: selectedRegion
                  ? regions.find((r) => r.region_code === selectedRegion)
                      ?.region_name
                  : "",
                province: selectedProvince
                  ? provinces.find((p) => p.province_code === selectedProvince)
                      ?.province_name
                  : "",
                municipality: selectedMunicipality
                  ? municipalities.find(
                      (m) => m.municipality_code === selectedMunicipality
                    )?.municipality_name
                  : "",
                barangay: selectedBarangay
                  ? barangays.find((b) => b.barangay_code === selectedBarangay)
                      ?.barangay_name
                  : "",
              },
              transect: transect,
              site_name: siteName,
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
          </div>{" "}
        </div>

        {/* Administrative Details Form */}
        {selectedLocation && (
          <div className="administrative-form">
            <h3>
              <FiMapPin size={16} />
              Location Details
            </h3>

            <div className="form-grid">
              {/* Region Dropdown */}
              <div className="form-group">
                <label htmlFor="region">
                  Region <span className="required">*</span>
                </label>
                <select
                  id="region"
                  value={selectedRegion}
                  onChange={handleRegionChange}
                  disabled={loadingRegions}
                  className="form-select"
                >
                  <option value="">
                    {loadingRegions ? "Loading regions..." : "Select Region"}
                  </option>
                  {regions.map((region) => (
                    <option key={region.region_code} value={region.region_code}>
                      {region.region_name}
                    </option>
                  ))}
                </select>
                {loadingRegions && (
                  <FiLoader className="loading-icon spinning" />
                )}
              </div>

              {/* Province Dropdown */}
              <div className="form-group">
                <label htmlFor="province">
                  Province <span className="required">*</span>
                </label>
                <select
                  id="province"
                  value={selectedProvince}
                  onChange={handleProvinceChange}
                  disabled={!selectedRegion || loadingProvinces}
                  className="form-select"
                >
                  <option value="">
                    {loadingProvinces
                      ? "Loading provinces..."
                      : "Select Province"}
                  </option>
                  {provinces.map((province) => (
                    <option
                      key={province.province_code}
                      value={province.province_code}
                    >
                      {province.province_name}
                    </option>
                  ))}
                </select>
                {loadingProvinces && (
                  <FiLoader className="loading-icon spinning" />
                )}
              </div>

              {/* Municipality Dropdown */}
              <div className="form-group">
                <label htmlFor="municipality">
                  Municipality/City <span className="required">*</span>
                </label>
                <select
                  id="municipality"
                  value={selectedMunicipality}
                  onChange={handleMunicipalityChange}
                  disabled={!selectedProvince || loadingMunicipalities}
                  className="form-select"
                >
                  <option value="">
                    {loadingMunicipalities
                      ? "Loading municipalities..."
                      : "Select Municipality/City"}
                  </option>
                  {municipalities.map((municipality) => (
                    <option
                      key={municipality.municipality_code}
                      value={municipality.municipality_code}
                    >
                      {municipality.municipality_name}
                    </option>
                  ))}
                </select>
                {loadingMunicipalities && (
                  <FiLoader className="loading-icon spinning" />
                )}
              </div>

              {/* Barangay Dropdown */}
              <div className="form-group">
                <label htmlFor="barangay">
                  Barangay <span className="required">*</span>
                </label>
                <select
                  id="barangay"
                  value={selectedBarangay}
                  onChange={handleBarangayChange}
                  disabled={!selectedMunicipality || loadingBarangays}
                  className="form-select"
                >
                  <option value="">
                    {loadingBarangays
                      ? "Loading barangays..."
                      : "Select Barangay"}
                  </option>
                  {barangays.map((barangay) => (
                    <option
                      key={barangay.barangay_code}
                      value={barangay.barangay_code}
                    >
                      {barangay.barangay_name}
                    </option>
                  ))}
                </select>
                {loadingBarangays && (
                  <FiLoader className="loading-icon spinning" />
                )}
              </div>

              {/* Additional Fields */}
              <div className="form-group">
                <label htmlFor="transect">Transect (Optional)</label>
                <input
                  type="text"
                  id="transect"
                  value={transect}
                  onChange={(e) => setTransect(e.target.value)}
                  placeholder="e.g., T1, T2, Transect A"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="siteName">Site Name (Optional)</label>
                <input
                  type="text"
                  id="siteName"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="e.g., Coral Garden, Marine Sanctuary"
                  className="form-input"
                />
              </div>
            </div>

            {/* Coordinates Display */}
            <div className="coordinates-display">
              <h4>Selected Coordinates</h4>
              <div className="coordinates-grid">
                <div className="coordinate-item">
                  <label>Latitude:</label>
                  <span>{selectedLocation.lat.toFixed(6)}</span>
                </div>
                <div className="coordinate-item">
                  <label>Longitude:</label>
                  <span>{selectedLocation.lng.toFixed(6)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

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
