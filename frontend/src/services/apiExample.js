/**
 * Example usage of API service
 * This file demonstrates how to use the API functions
 */

import {
  registerDevice,
  getDeviceInfo,
  getDeviceStatus,
  trackActivity,
  activateDevice,
  refreshPlaylist,
} from './api'

// ============================================
// EXAMPLE USAGE
// ============================================

// Example 1: Register a device
export const exampleRegisterDevice = async () => {
  try {
    const response = await registerDevice({
      mac_address: 'AA:BB:CC:DD:EE:FF',
      device_name: 'My Device',
      m3u_url: 'http://example.com/playlist.m3u', // Optional
    })
    console.log('Device registered:', response.data)
    return response.data
  } catch (error) {
    console.error('Registration failed:', error.response?.data || error.message)
    throw error
  }
}

// Example 2: Get device info
export const exampleGetDeviceInfo = async (macAddress) => {
  try {
    const response = await getDeviceInfo(macAddress)
    console.log('Device info:', response.data)
    return response.data
  } catch (error) {
    console.error('Failed to get device info:', error.response?.data || error.message)
    throw error
  }
}

// Example 3: Get activation status
export const exampleGetStatus = async (macAddress) => {
  try {
    const response = await getDeviceStatus(macAddress)
    console.log('Activation status:', response.data)
    return response.data
  } catch (error) {
    console.error('Failed to get status:', error.response?.data || error.message)
    throw error
  }
}

// Example 4: Track activity
export const exampleTrackActivity = async (macAddress) => {
  try {
    const response = await trackActivity(macAddress)
    console.log('Activity tracked:', response.data)
    return response.data
  } catch (error) {
    console.error('Failed to track activity:', error.response?.data || error.message)
    throw error
  }
}

// Example 5: Activate device
export const exampleActivateDevice = async (macAddress, activationType = 'YEARLY') => {
  try {
    const response = await activateDevice(macAddress, activationType)
    console.log('Device activated:', response.data)
    return response.data
  } catch (error) {
    console.error('Activation failed:', error.response?.data || error.message)
    throw error
  }
}

// Example 6: Refresh playlist
export const exampleRefreshPlaylist = async (macAddress) => {
  try {
    const response = await refreshPlaylist(macAddress)
    console.log('Playlist refreshed:', response.data)
    return response.data
  } catch (error) {
    console.error('Refresh failed:', error.response?.data || error.message)
    throw error
  }
}
