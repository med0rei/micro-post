import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import type { UserDto } from '../../user/schemas/user.schema';
import { AuthService } from '../auth.service';

@Injectable()
export class TokenStrategy extends PassportStrategy(Strategy, 'token') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(req: Request): Promise<UserDto> {
    const token: string | null = req.headers['authorization']?.replace(
      'Bearer ',
      '',
    );

    if (!token) {
      throw new UnauthorizedException();
    }

    const user = await this.authService.validateToken(token);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
