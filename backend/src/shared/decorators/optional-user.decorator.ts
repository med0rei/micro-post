import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { UserDto } from '../../user/schemas/user.schema';

export const OptionalUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserDto | null => {
    const request = ctx.switchToHttp().getRequest();
    return request.user || null;
  },
);
