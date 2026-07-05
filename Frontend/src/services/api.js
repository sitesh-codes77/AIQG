import axios from 'axios'
import { ENV } from '../config/env'

const apiClient = axios.create({
  baseURL: ENV.API_URL,
})

// ── Interceptor: attach JWT token to every request ─────────
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Interceptor: handle 401 responses (expired/invalid token) ──
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      // Only redirect if not already on auth pages
      const path = window.location.pathname
      if (path !== '/login' && path !== '/signup') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// ── Book endpoints ─────────────────────────────────────────
export const getBooks = () => apiClient.get('/api/books')
export const getBookChapters = (bookId) => apiClient.get(`/api/books/${bookId}/chapters`)

// ── Auth endpoints ─────────────────────────────────────────
export const signupUser = (data) => apiClient.post('/api/auth/signup', data)
export const loginUser = (data) => apiClient.post('/api/auth/login', data)
export const getMe = () => apiClient.get('/api/auth/me')
