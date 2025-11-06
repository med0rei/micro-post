import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { UserDto } from '../../user/schemas/user.schema';
import { STRATEGY_NAMES } from '../constants/strategy-names';

@Injectable()
export class OptionalTokenAuthGuard extends AuthGuard(STRATEGY_NAMES.token) {
  handleRequest<TUser = UserDto | null>(err: unknown, user: TUser): TUser {
    if (err && !(err instanceof UnauthorizedException)) {
      throw err;
    }

    return (user ?? null) as TUser;
  }
}
