import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { Equal } from 'typeorm';
import { Auth } from '../auth/entities/auth.entity';
import type { HashService } from '../hash/hash.service';
import type { TokenService } from '../token/token.service';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,

    private readonly hashService: HashService,

    private readonly tokenService: TokenService,
  ) {}

  async getAuth(
    name: string,
    password: string,
  ): Promise<{ token: string; user_id: number }> {
    {
      // パスワードが空の場合は401エラー
      if (!password) {
        throw new UnauthorizedException();
      }

      const passwordHash = await this.hashService.hash(password);
      const user = await this.userRepository.findOne({
        where: {
          username: Equal(name),
          passwordHash: Equal(passwordHash),
        },
      });

      // ユーザーが存在しない場合は401エラー
      if (!user) {
        throw new UnauthorizedException();
      }

      // ユーザーが存在する場合はトークンを発行
      const result = {
        token: '',
        user_id: user.id,
      };

      const expireDate = new Date();
      expireDate.setDate(expireDate.getDate() + 1);

      const auth = await this.authRepository.findOne({
        where: {
          userId: Equal(user.id),
        },
      });

      if (auth) {
        // 既存のトークンを更新
        await this.authRepository.save({
          ...auth,
          expireAt: expireDate,
        });
        result.token = auth.token;
      } else {
        // 新しいトークンを作成
        const token = this.tokenService.generateToken();
        await this.authRepository.save({
          userId: user.id,
          token: token,
          expireAt: expireDate.toISOString(),
        });
        result.token = token;
      }

      return result;
    }
  }
}
