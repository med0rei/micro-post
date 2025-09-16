import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from '../shared/pipes/zod-validation.pipe';
import { User } from './entities/user.entity';
import type { CreateUserDto } from './schemas/user.schema';
import { createUserSchema } from './schemas/user.schema';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createUserSchema))
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.createUser(createUserDto);
  }
}
