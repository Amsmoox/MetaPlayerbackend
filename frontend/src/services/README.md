# API Service Documentation

## Structure

- `apiConfig.js` - Axios instance configuration
- `api.js` - All API endpoint functions

## How to Add New Endpoints

### Step 1: Add Endpoint Path

In `api.js`, add your endpoint to the `ENDPOINTS` object:

```javascript
const ENDPOINTS = {
  DEVICES: { ... },
  // Add new group
  USERS: {
    LIST: '/users/list/',
    DETAIL: (id) => `/users/${id}/`,
    CREATE: '/users/create/',
  }
}
```

### Step 2: Create API Function

Add a function that uses the endpoint:

```javascript
/**
 * Get users list
 * @returns {Promise}
 */
export const getUsers = async () => {
  return apiClient.get(ENDPOINTS.USERS.LIST)
}

/**
 * Get user by ID
 * @param {number} id - User ID
 * @returns {Promise}
 */
export const getUserById = async (id) => {
  return apiClient.get(ENDPOINTS.USERS.DETAIL(id))
}

/**
 * Create new user
 * @param {Object} data - User data
 * @returns {Promise}
 */
export const createUser = async (data) => {
  return apiClient.post(ENDPOINTS.USERS.CREATE, data)
}
```

### Step 3: Use in Components

```javascript
import { getUsers, createUser } from '../services/api'

// In your component
const fetchUsers = async () => {
  try {
    const response = await getUsers()
    console.log(response.data)
  } catch (error) {
    console.error(error)
  }
}
```

## Current Endpoints

### Device Management
- `registerDevice(data)` - Register device
- `getPlaylist(macAddress, refresh)` - Get M3U playlist
- `getDeviceInfo(macAddress)` - Get device info
- `refreshPlaylist(macAddress)` - Refresh playlist cache
- `trackActivity(macAddress)` - Track device activity
- `getDeviceStatus(macAddress)` - Get activation status
- `activateDevice(macAddress, activationType)` - Activate device

## Configuration

Update `API_BASE_URL` in `apiConfig.js` or set environment variable:
```
VITE_API_BASE_URL=http://your-backend-url/api
```
