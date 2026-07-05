import { create } from 'zustand'
import { signupUser, loginUser, getMe } from '../services/api'

const useAuthStore = create((set, get) => ({
  // ── State ────────────────────────────────────────────────
  user: JSON.parse(localStorage.getItem('auth_user') || 'null'),
  token: localStorage.getItem('auth_token') || null,
  isAuthenticated: !!localStorage.getItem('auth_token'),
  isLoading: false,
  error: null,

  // ── Signup ───────────────────────────────────────────────
  signup: async ({ username, email, password }) => {
    set({ isLoading: true, error: null })
    try {
      const res = await signupUser({ username, email, password })
      const { access_token, user } = res.data

      localStorage.setItem('auth_token', access_token)
      localStorage.setItem('auth_user', JSON.stringify(user))

      set({
        token: access_token,
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })

      return { success: true }
    } catch (err) {
      const message =
        err.response?.data?.detail || 'Signup failed. Please try again.'
      set({ isLoading: false, error: message })
      return { success: false, error: message }
    }
  },

  // ── Login ────────────────────────────────────────────────
  login: async ({ email, password }) => {
    set({ isLoading: true, error: null })
    try {
      const res = await loginUser({ email, password })
      const { access_token, user } = res.data

      localStorage.setItem('auth_token', access_token)
      localStorage.setItem('auth_user', JSON.stringify(user))

      set({
        token: access_token,
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })

      return { success: true }
    } catch (err) {
      const message =
        err.response?.data?.detail || 'Login failed. Please try again.'
      set({ isLoading: false, error: message })
      return { success: false, error: message }
    }
  },

  // ── Logout ───────────────────────────────────────────────
  logout: () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    })
  },

  // ── Check Auth (verify token is still valid) ─────────────
  checkAuth: async () => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      set({ isAuthenticated: false, user: null, token: null })
      return false
    }

    try {
      const res = await getMe()
      const user = res.data

      localStorage.setItem('auth_user', JSON.stringify(user))
      set({ user, isAuthenticated: true, token })
      return true
    } catch {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      set({ isAuthenticated: false, user: null, token: null })
      return false
    }
  },

  // ── Clear error ──────────────────────────────────────────
  clearError: () => set({ error: null }),
}))

export default useAuthStore
