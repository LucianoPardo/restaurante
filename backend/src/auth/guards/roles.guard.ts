import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../../users/role.enum';
import { getRequest } from '../get-request';
import type { JwtPayload } from '../jwt-payload.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    const user: JwtPayload | undefined = getRequest(context)['user'];
    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('No tienes permiso para esta acción');
    }
    return true;
  }
}
