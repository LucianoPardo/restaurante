import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getRequest } from '../get-request';
import type { JwtPayload } from '../jwt-payload.interface';

// Funciona igual en controllers (REST) y en resolvers (GraphQL)
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JwtPayload => {
    return getRequest(ctx)['user'];
  },
);
