import { Navigate, Outlet } from 'react-router-dom'
import { hasActiveSession } from './authService'

export function ProtectedRoute() {
  if (!hasActiveSession()) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
