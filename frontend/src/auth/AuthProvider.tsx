import { useState, type ReactNode } from 'react'
import { gql } from '../api/client'
import type { AuthUser, LoginResponse } from '../api/types'
import { AuthContext } from './auth-context'
import { clearSession, loadSession, saveSession } from './session'

const LOGIN = /* GraphQL */ `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      access_token
      user {
        id
        name
        role
      }
    }
  }
`

export function AuthProvider({ children }: { children: ReactNode }) {
  // Al recargar la página se recupera la sesión guardada en el navegador
  const [user, setUser] = useState<AuthUser | null>(() => loadSession()?.user ?? null)

  async function login(email: string, password: string) {
    const data = await gql<{ login: LoginResponse }>(LOGIN, { input: { email, password } })
    saveSession({ token: data.login.access_token, user: data.login.user })
    setUser(data.login.user)
    return data.login.user
  }

  function logout() {
    clearSession()
    setUser(null)
  }

  // Para cuando el usuario cambia su nombre en "Editar perfil"
  function updateUser(changes: Partial<AuthUser>) {
    const session = loadSession()
    if (!session) {
      return
    }
    const updated = { ...session.user, ...changes }
    saveSession({ ...session, user: updated })
    setUser(updated)
  }

  return <AuthContext value={{ user, login, logout, updateUser }}>{children}</AuthContext>
}
