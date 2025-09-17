import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-custom';
import type { UserDto } from '../../user/schemas/user.schema';
import { AuthService } from '../auth.service';

@Injectable()
export class TokenStrategy extends PassportStrategy(Strategy, 'token') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(req: Request): Promise<UserDto> {
    const token = req.headers['authorization']?.replace('Bearer ', '');

    console.log('TokenStrategy validate called with token:', token);

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
