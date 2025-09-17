import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { Equal } from 'typeorm';
import { HashService } from '../hash/hash.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './schemas/user.schema';

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

  async findOneById(userId: number): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: {
        id: Equal(userId),
      },
    });

    if (!user) {
      return null;
    }

    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findOne(createUserDto.username);
    if (existingUser) {
      throw new Error('Username already exists');
    }

    const createdUser = this.userRepository.create({
      username: createUserDto.username,
      passwordHash: await this.hashService.hash(createUserDto.password),
      email: createUserDto.email,
    });
    return this.userRepository.save(createdUser);
  }
}
