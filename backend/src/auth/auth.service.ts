import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { Equal } from 'typeorm';
import { Auth } from '../auth/entities/auth.entity';
import type { EnvironmentVariables } from '../config/env.validation';
import { HashService } from '../hash/hash.service';
import { TokenService } from '../token/token.service';
import type { User } from '../user/entities/user.entity';
import { UserDto } from '../user/schemas/user.schema';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,

    private readonly userService: UserService,

    private readonly hashService: HashService,

    private readonly tokenService: TokenService,

    private readonly configService: ConfigService<EnvironmentVariables, true>,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<UserDto | null> {
    const user: User | null = await this.userService.findOneForAuth(username);

    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    try {
      if (await this.hashService.verify(user.passwordHash, password)) {
        return { userId: user.id, username: user.username };
      } else {
        throw new UnauthorizedException('Invalid username or password');
      }
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      // Hash verification internal failure
      throw new UnauthorizedException('Authentication failed');
    }
  }

  async validateToken(token: string): Promise<UserDto | null> {
    const auth: Auth | null = await this.authRepository.findOne({
      where: {
        token: Equal(token),
      },
    });

    if (!auth) {
      throw new UnauthorizedException('Invalid token');
    }

    const now = new Date();
    if (auth.expiresAt < now) {
      throw new UnauthorizedException('Token has expired');
    }

    const user: User | null = await this.userService.findOneById(auth.userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return { userId: user.id, username: user.username };
  }

  async login(userDto: UserDto): Promise<{ token: string; userId: number }> {
    const result = {
      token: '',
      userId: userDto.userId,
    };

    const expiresInDays = this.configService.get('AUTH_TOKEN_EXPIRES_IN_DAYS', {
      infer: true,
    });
    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + expiresInDays);

    const auth = await this.authRepository.findOne({
      where: {
        userId: Equal(userDto.userId),
      },
    });

    if (auth) {
      // 既存のトークンを更新
      await this.authRepository.save({
        ...auth,
        expiresAt: expireDate,
      });
      result.token = auth.token;
    } else {
      // 新しいトークンを作成
      const token = this.tokenService.generateToken();
      await this.authRepository.save({
        userId: userDto.userId,
        token: token,
        expiresAt: expireDate,
      });
      result.token = token;
    }

    return result;
  }

  async logout(token: string): Promise<void> {
    const auth = await this.authRepository.findOne({
      where: {
        token: Equal(token),
      },
    });

    if (!auth) {
      throw new UnauthorizedException('Invalid token');
    }

    await this.authRepository.remove(auth);
  }
}
