import { Role } from '../users/role.enum'

export interface JwtPayload {
  sub: number;
  role: Role;
}