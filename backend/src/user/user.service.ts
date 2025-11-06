import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { Equal } from 'typeorm';
import { HashService } from '../hash/hash.service';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserBodyDto } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly hashService: HashService,
  ) {}

  async findOne(username: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: {
        username: Equal(username),
      },
    });

    if (!user) {
      return null;
    }

    return user;
  }

  async findOneForAuth(username: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: {
        username: Equal(username),
      },
      select: ['id', 'passwordHash'],
    });
  }

  async findOneByIdWithEmail(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id: Equal(userId),
      },
      select: ['id', 'username', 'email', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findOneById(
    userId: number,
    requestUserId?: number,
  ): Promise<User | Omit<User, 'email'>> {
    const user = await this.findOneByIdWithEmail(userId);

    // 本人以外にはemailを返さない
    if (requestUserId !== userId) {
      const { email: _, ...userWithoutEmail } = user;
      return userWithoutEmail;
    }

    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findOne(createUserDto.username);
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const createdUser = this.userRepository.create({
      username: createUserDto.username,
      passwordHash: await this.hashService.hash(createUserDto.password),
      email: createUserDto.email,
    });
    return this.userRepository.save(createdUser);
  }

  async updateUser(
    requestUserId: number,
    targetUserId: number,
    updateData: UpdateUserBodyDto,
  ): Promise<User> {
    if (requestUserId !== targetUserId) {
      throw new ForbiddenException(
        "Another user's information cannnot be updated",
      );
    }

    const user = await this.findOneByIdWithEmail(targetUserId);

    // usernameの更新処理
    if (updateData.username !== undefined) {
      if (updateData.username !== user.username) {
        const existingUser = await this.findOne(updateData.username);
        if (existingUser) {
          throw new ConflictException('Username already exists');
        }
        user.username = updateData.username;
      }
    }

    // メールアドレスの更新処理
    if (updateData.email !== undefined) {
      if (updateData.email !== user.email) {
        const existingUserWithEmail = await this.userRepository.findOne({
          where: {
            email: Equal(updateData.email),
          },
        });
        if (existingUserWithEmail) {
          throw new ConflictException('Email is already in use');
        }
        user.email = updateData.email;
      }
    }

    return this.userRepository.save(user);
  }
}
