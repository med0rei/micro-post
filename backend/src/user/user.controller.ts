import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from '../shared/pipes/zod-validation.pipe';
import type {
  CreateUserDto,
  CreateUserResponseDto,
} from './schemas/user.schema';
import {
  createUserResponseSchema,
  createUserSchema,
} from './schemas/user.schema';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createUserSchema))
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreateUserResponseDto> {
    return createUserResponseSchema.parse(
      await this.userService.createUser(createUserDto),
    );
  }
}
