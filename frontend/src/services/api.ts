import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store/authStore'

const API_BASE_URL = '/api/v1'

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const { tokens } = useAuthStore.getState()
    if (tokens?.accessToken) {
      config.headers.Authorization = `Bearer ${tokens.accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const { tokens, logout } = useAuthStore.getState()

      if (tokens?.refreshToken) {
        try {
          const response = await api.post('/auth/refresh', {
            refreshToken: tokens.refreshToken,
          })

          const newTokens = response.data.tokens
          useAuthStore.getState().setTokens(newTokens)

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`
          return api(originalRequest)
        } catch (refreshError) {
          logout()
          toast.error('Session expired. Please login again.')
          window.location.href = '/login'
        }
      } else {
        logout()
        window.location.href = '/login'
      }
    }

    // Handle other errors
    if (error.response?.data?.error) {
      toast.error(error.response.data.error)
    } else {
      toast.error('An unexpected error occurred')
    }

    return Promise.reject(error)
  }
)

export default api