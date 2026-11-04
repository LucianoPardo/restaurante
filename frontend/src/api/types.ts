// Forma de los datos que devuelve la API (ver backend/src/schema.gql).
// Con GraphQL cada página pide solo algunos de estos campos.

export type Role = 'cliente' | 'empleado' | 'admin'

export const ROLE_LABELS: Record<Role, string> = {
  cliente: 'Cliente',
  empleado: 'Empleado',
  admin: 'Administrador',
}

// Lo que devuelve la mutation login
export interface AuthUser {
  id: number
  name: string
  role: Role
}

export interface LoginResponse {
  access_token: string
  user: AuthUser
}

export interface User {
  id: number
  name: string
  lastName: string
  direccion: string | null
  telefono: string | null
  email: string
  role: Role
}

export interface Supply {
  id: number
  name: string
  category: string
  quantity: number
  price: number
}

export interface Reservation {
  id: number
  fecha: string
  numeroPersonas: number
  comentario: string | null
  user?: Pick<User, 'name' | 'lastName' | 'email'> | null // solo en la consulta del personal
}

export interface Sale {
  id: number
  fecha: string
  monto: number
}

// Datos listos para el gráfico
export interface MonthlySales {
  labels: string[]
  data: number[]
}
