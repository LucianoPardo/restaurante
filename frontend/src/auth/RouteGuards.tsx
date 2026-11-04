import { Navigate, Outlet } from 'react-router'
import type { Role } from '../api/types'
import { homePathFor, useAuth } from './auth-context'

// Equivale a @login_required + @admin_required / @user_required de Flask.
// Solo decide qué pantallas se muestran: la seguridad real la ponen los guards del backend.
export function RequireRole({ roles }: { roles: Role[] }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }
  if (!roles.includes(user.role)) {
    return <Navigate to={homePathFor(user.role)} replace />
  }
  return <Outlet />
}

// Login y registro: si ya hay sesión, se va directo a su inicio
export function GuestOnly() {
  const { user } = useAuth()
  return user ? <Navigate to={homePathFor(user.role)} replace /> : <Outlet />
}
