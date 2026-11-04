import { createContext, useContext } from 'react'
import type { AuthUser, Role } from '../api/types'

export interface AuthContextValue {
  user: AuthUser | null
  login: (email: string, password: string) => Promise<AuthUser>
  logout: () => void
  updateUser: (changes: Partial<AuthUser>) => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

// Cualquier componente puede saber quién inició sesión con useAuth()
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  }
  return context
}

// Página de inicio de cada rol después del login
export function homePathFor(role: Role) {
  return role === 'cliente' ? '/' : '/admin'
}
