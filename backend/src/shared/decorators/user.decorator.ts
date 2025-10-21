import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { UserDto } from '../../user/schemas/user.schema';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserDto => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
