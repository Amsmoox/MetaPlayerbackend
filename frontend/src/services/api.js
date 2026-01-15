import apiClient from './apiConfig'

/**
 * API Service - Centralized endpoint management
 * 
 * To add a new endpoint:
 * 1. Add the endpoint path in ENDPOINTS object
 * 2. Create a function that uses apiClient with the endpoint
 * 3. Export the function
 */

// ============================================
// ENDPOINT PATHS - Update here when adding new endpoints
// ============================================
const ENDPOINTS = {
  // Device Management
  DEVICES: {
    REGISTER: '/devices/register/',
    PLAYLIST: (macAddress) => `/devices/${macAddress}/playlist.m3u`,
    INFO: (macAddress) => `/devices/${macAddress}/info/`,
    REFRESH: (macAddress) => `/devices/${macAddress}/refresh/`,
    ACTIVITY: (macAddress) => `/devices/${macAddress}/activity/`,
    STATUS: (macAddress) => `/devices/${macAddress}/status/`,
    ACTIVATE: (macAddress) => `/devices/${macAddress}/activate/`,
  },
  // Add more endpoint groups here as needed
  // EXAMPLE: {
  //   LIST: '/example/list/',
  //   DETAIL: (id) => `/example/${id}/`,
  // }
}

// ============================================
// DEVICE API FUNCTIONS
// ============================================

/**
 * Register a device
 * @param {Object} data - { mac_address, device_name, m3u_url? }
 * @returns {Promise}
 */
export const registerDevice = async (data) => {
  return apiClient.post(ENDPOINTS.DEVICES.REGISTER, data)
}

/**
 * Get M3U playlist for device
 * @param {string} macAddress - Device MAC address
 * @param {boolean} refresh - Force refresh cache
 * @returns {Promise}
 */
export const getPlaylist = async (macAddress, refresh = false) => {
  return apiClient.get(ENDPOINTS.DEVICES.PLAYLIST(macAddress), {
    params: { refresh },
    responseType: 'text', // M3U is plain text
  })
}

/**
 * Get device information
 * @param {string} macAddress - Device MAC address
 * @returns {Promise}
 */
export const getDeviceInfo = async (macAddress) => {
  return apiClient.get(ENDPOINTS.DEVICES.INFO(macAddress))
}

/**
 * Refresh playlist cache
 * @param {string} macAddress - Device MAC address
 * @returns {Promise}
 */
export const refreshPlaylist = async (macAddress) => {
  return apiClient.post(ENDPOINTS.DEVICES.REFRESH(macAddress))
}

/**
 * Track device activity (heartbeat)
 * @param {string} macAddress - Device MAC address
 * @returns {Promise}
 */
export const trackActivity = async (macAddress) => {
  return apiClient.post(ENDPOINTS.DEVICES.ACTIVITY(macAddress))
}

/**
 * Get device activation status
 * @param {string} macAddress - Device MAC address
 * @returns {Promise}
 */
export const getDeviceStatus = async (macAddress) => {
  return apiClient.get(ENDPOINTS.DEVICES.STATUS(macAddress))
}

/**
 * Activate device (yearly or lifetime)
 * @param {string} macAddress - Device MAC address
 * @param {string} activationType - 'YEARLY' or 'LIFETIME'
 * @returns {Promise}
 */
export const activateDevice = async (macAddress, activationType) => {
  return apiClient.post(ENDPOINTS.DEVICES.ACTIVATE(macAddress), {
    activation_type: activationType,
  })
}

// ============================================
// EXPORT ENDPOINTS FOR REFERENCE (optional)
// ============================================
export { ENDPOINTS }
