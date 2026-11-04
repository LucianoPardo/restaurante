import { clearSession, loadSession } from '../auth/session'

const API_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

// Error para mostrar al usuario (uno o varios mensajes)
export class ApiError extends Error {
  readonly messages: string[]

  constructor(messages: string[]) {
    super(messages.join('\n'))
    this.messages = messages
  }
}

interface GraphQLError {
  message: string
  extensions?: {
    code?: string
    originalError?: { message?: string | string[] }
  }
}

// Nest guarda su mensaje original (o la lista de errores de validación)
// en extensions.originalError; si no está, se usa el mensaje de GraphQL
function messagesFrom(errors: GraphQLError[]): string[] {
  return errors.flatMap((error) => {
    const original = error.extensions?.originalError?.message
    if (Array.isArray(original)) {
      return original
    }
    return [original ?? error.message]
  })
}

// Envía una consulta (query) o un cambio (mutation) a POST /graphql.
// Todas las páginas hablan con el backend a través de esta función.
export async function gql<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const token = loadSession()?.token
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  let response: Response
  try {
    response = await fetch(`${API_URL}/graphql`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
    })
  } catch {
    throw new ApiError(['No se pudo conectar con el servidor. ¿Está encendido el backend?'])
  }

  // GraphQL responde { data, errors }: aunque algo falle, el código HTTP suele ser 200
  const body = await response.json().catch(() => null)
  const errors: GraphQLError[] = body?.errors ?? []

  if (errors.length > 0) {
    // Token vencido o alterado: cerramos la sesión y volvemos al login
    if (token && errors.some((error) => error.extensions?.code === 'UNAUTHENTICATED')) {
      clearSession()
      window.location.assign('/login')
    }
    throw new ApiError(messagesFrom(errors))
  }
  if (!response.ok || !body?.data) {
    throw new ApiError(['Ocurrió un error inesperado'])
  }

  return body.data as T
}

// Convierte cualquier error en una lista de mensajes para mostrar
export function errorMessages(error: unknown): string[] {
  if (typeof error === 'string') {
    return [error]
  }
  if (error instanceof ApiError) {
    return error.messages
  }
  return ['Ocurrió un error inesperado']
}
