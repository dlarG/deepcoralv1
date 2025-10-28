import { API_BASE_URL } from '../config/api';

/**
 * Get the full URL for a profile image
 * @param {string} filename - The filename of the profile image
 * @returns {string} The full URL to the profile image
 */
export const getProfileImageUrl = (filename) => {
  if (!filename) return null;
  return `${API_BASE_URL}/profile_uploads/${filename}`;
};

/**
 * Get the full URL for a coral image
 * @param {string} path - The path to the coral image
 * @returns {string} The full URL to the coral image
 */
export const getCoralImageUrl = (path) => {
  if (!path) return null;
  // If path already starts with http, return as is
  if (path.startsWith('http')) return path;
  // Otherwise, construct the full URL
  return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};
