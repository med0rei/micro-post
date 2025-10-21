import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { Equal } from 'typeorm';
import { Auth } from '../auth/entities/auth.entity';
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
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<UserDto | null> {
    const user: User | null = await this.userService.findOneForAuth(username);

    console.log('User fetched:', user);
    if (!user) {
      console.log('User not found');
      return null;
    }

    try {
      if (await this.hashService.verify(user.passwordHash, password)) {
        return { userId: user.id, username: user.username };
      } else {
        console.log('Invalid password');
        return null;
      }
    } catch (err) {
      // internal failure
      return null;
    }
  }

  async validateToken(token: string): Promise<UserDto | null> {
    const auth: Auth | null = await this.authRepository.findOne({
      where: {
        token: Equal(token),
      },
    });

    if (!auth) {
      return null;
    }

    const now = new Date();
    if (auth.expiresAt < now) {
      return null;
    }

    const user: User | null = await this.userService.findOneById(auth.userId);
    if (!user) {
      return null;
    }

    return { userId: user.id, username: user.username };
  }

  async login(userDto: UserDto): Promise<{ token: string; userId: number }> {
    const result = {
      token: '',
      userId: userDto.userId,
    };

    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 1);

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
        expiresAt: expireDate.toISOString(),
      });
      result.token = token;
    }

    return result;
  }
}
