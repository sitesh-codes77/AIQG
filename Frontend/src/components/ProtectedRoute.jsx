import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'

/**
 * Wrapper component that protects routes behind authentication.
 * If the user is not authenticated, they are redirected to /login.
 */
export default function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}
