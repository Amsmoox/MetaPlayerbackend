import axios from 'axios'

// API Base URL - Update this to match your backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor (optional - for adding auth tokens, etc.)
apiClient.interceptors.request.use(
  (config) => {
    // Add any auth tokens or headers here if needed
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor (optional - for error handling)
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle common errors here
    if (error.response?.status === 403) {
      console.error('Access forbidden:', error.response.data)
    } else if (error.response?.status === 404) {
      console.error('Resource not found:', error.response.data)
    }
    return Promise.reject(error)
  }
)

export default apiClient
export { API_BASE_URL }
