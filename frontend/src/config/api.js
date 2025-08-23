// src/config/api.js
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api'
  : 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/login`,
  REGISTER: `${API_BASE_URL}/register`,
  LOGOUT: `${API_BASE_URL}/logout`,
  CHECK_AUTH: `${API_BASE_URL}/check-auth`,
  CSRF_TOKEN: `${API_BASE_URL}/csrf-token`,
  
  // Admin endpoints
  ADMIN_USERS: `${API_BASE_URL}/admin/users`,
  ADMIN_CORALS: `${API_BASE_URL}/admin/corals`,
  ADMIN_DASHBOARD: `${API_BASE_URL}/admin/dashboard`,
  
  // Coral endpoints
  CORAL_INFO: `${API_BASE_URL}/coral_info`,
  CORAL_DETECT: `${API_BASE_URL}/image/detect`,
  CORAL_UPLOAD: `${API_BASE_URL}/image/upload`,
  
  // Profile endpoints
  USER_PROFILE: (id) => `${API_BASE_URL}/profile/${id}`,
};

export { API_BASE_URL };

// Configure axios defaults
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

export { API_BASE_URL };