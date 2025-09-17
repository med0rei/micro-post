import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserDto } from '../../user/schemas/user.schema';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<UserDto> {
    const userDto: UserDto | null = await this.authService.validateUser(
      username,
      password,
    );
    if (!userDto) {
      throw new UnauthorizedException();
    }

    return userDto;
  }
}
