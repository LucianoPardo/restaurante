import { ExecutionContext } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import type { Request } from 'express';

// En REST la petición se obtiene con switchToHttp().
// En GraphQL viaja dentro del "context" de Apollo, por eso hay que sacarla de otra forma.
export function getRequest(context: ExecutionContext): Request {
  if (context.getType<GqlContextType>() === 'graphql') {
    return GqlExecutionContext.create(context).getContext<{ req: Request }>()
      .req;
  }
  return context.switchToHttp().getRequest<Request>();
}
