import type { AuthUser } from '../api/types'

// La sesión se guarda en el navegador para no perderla al recargar la página.
// Es el reemplazo de session['id'], session['role']... de Flask.
export interface Session {
  token: string
  user: AuthUser
}

const STORAGE_KEY = 'restaurante.session'

export function loadSession(): Session | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? (JSON.parse(saved) as Session) : null
  } catch {
    return null
  }
}

export function saveSession(session: Session) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEY)
}
