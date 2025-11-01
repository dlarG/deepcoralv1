// Format user data for display
export const formatUserData = (user) => {
  return {
    ...user,
    fullName: `${user.firstname} ${user.lastname}`,
    displayRole:
      user.roletype?.charAt(0).toUpperCase() + user.roletype?.slice(1),
    initials: `${user.firstname?.charAt(0) || ""}${
      user.lastname?.charAt(0) || ""
    }`.toUpperCase(),
  };
};

// Format coral data for display
export const formatCoralData = (coral) => {
  return {
    ...coral,
    displayClassification:
      coral.classification?.charAt(0).toUpperCase() +
      coral.classification?.slice(1),
    shortDescription:
      coral.identification?.length > 100
        ? `${coral.identification.substring(0, 100)}...`
        : coral.identification,
  };
};

// Generate statistics from user data
export const generateUserStats = (users) => {
  const total = users.length;
  const admins = users.filter((u) => u.roletype === "admin").length;
  const biologists = users.filter((u) => u.roletype === "biologist").length;
  const guests = users.filter((u) => u.roletype === "guest").length;

  return {
    total,
    admins,
    biologists,
    guests,
  };
};

// Generate statistics from coral data
export const generateCoralStats = (corals) => {
  const total = corals.length;
  const withImages = corals.filter(
    (c) => c.image_path && c.image_path.length > 0
  ).length;
  const hardCorals = corals.filter(
    (c) => c.classification === "hard coral"
  ).length;
  const softCorals = corals.filter(
    (c) => c.classification === "soft coral"
  ).length;
  const uniqueSpecies = [
    ...new Set(corals.map((c) => c.species_name).filter(Boolean)),
  ];

  return {
    total,
    withImages,
    hardCorals,
    softCorals,
    uniqueSpeciesCount: uniqueSpecies.length,
    uniqueSpecies,
  };
};

// Handle image upload errors
export const handleImageError = (e, fallbackSrc = null) => {
  if (fallbackSrc) {
    e.target.src = fallbackSrc;
  } else {
    e.target.style.display = "none";
    if (e.target.nextSibling) {
      e.target.nextSibling.style.display = "flex";
    }
  }
};

// Debounce function for search
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Validate file type and size for images
export const validateImageFile = (file, maxSizeMB = 5) => {
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (!validTypes.includes(file.type)) {
    return {
      isValid: false,
      error: "Please select a valid image file (JPEG, PNG, or GIF)",
    };
  }

  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `Please select an image smaller than ${maxSizeMB}MB`,
    };
  }

  return { isValid: true, error: null };
};

// Sort functions
export const sortUsers = (users, sortBy) => {
  return [...users].sort((a, b) => {
    switch (sortBy) {
      case "name_asc":
        return `${a.firstname} ${a.lastname}`.localeCompare(
          `${b.firstname} ${b.lastname}`
        );
      case "name_desc":
        return `${b.firstname} ${b.lastname}`.localeCompare(
          `${a.firstname} ${a.lastname}`
        );
      case "username_asc":
        return a.username.localeCompare(b.username);
      case "username_desc":
        return b.username.localeCompare(a.username);
      case "role_asc":
        return a.roletype.localeCompare(b.roletype);
      case "role_desc":
        return b.roletype.localeCompare(a.roletype);
      case "created_asc":
        return new Date(a.created_at) - new Date(b.created_at);
      default: // created_desc
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    }
  });
};

export const sortCorals = (corals, sortBy) => {
  return [...corals].sort((a, b) => {
    switch (sortBy) {
      case "species_asc":
        return (a.species_name || "").localeCompare(b.species_name || "");
      case "species_desc":
        return (b.species_name || "").localeCompare(a.species_name || "");
      case "location_asc":
        return (a.location || "").localeCompare(b.location || "");
      case "location_desc":
        return (b.location || "").localeCompare(a.location || "");
      case "health_asc":
        return (a.health_status || "").localeCompare(b.health_status || "");
      case "created_asc":
        return new Date(a.created_at) - new Date(b.created_at);
      default: // created_desc
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    }
  });
};

// Pagination utilities
export const paginate = (items, page, itemsPerPage) => {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return {
    items: items.slice(startIndex, endIndex),
    totalPages: Math.ceil(items.length / itemsPerPage),
    currentPage: page,
    totalItems: items.length,
    startIndex: startIndex + 1,
    endIndex: Math.min(endIndex, items.length),
  };
};

// Error handling
export const handleApiError = (error, logout, navigate) => {
  console.error("API Error:", error);

  if (error.response?.status === 401 || error.response?.status === 403) {
    logout();
    navigate("/login");
    return "Authentication required. Please log in again.";
  }

  return (
    error.response?.data?.error ||
    error.message ||
    "An unexpected error occurred"
  );
};

// Local storage utilities
export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
  }
};

export const getFromLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error("Failed to get from localStorage:", error);
    return defaultValue;
  }
};

export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Failed to remove from localStorage:", error);
  }
};
