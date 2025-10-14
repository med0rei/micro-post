import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { TokenAuthGuard } from '../shared/guards/token-auth.guard';
import { ZodValidationPipe } from '../shared/pipes/zod-validation.pipe';
import type {
  CreateUserDto,
  CreateUserResponseDto,
  GetUserDto,
  GetUserResponseDto,
} from './schemas/user.schema';
import {
  createUserResponseSchema,
  createUserSchema,
  getUserResponseSchema,
  getUserSchema,
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

  @Get(':userId')
  @UseGuards(TokenAuthGuard)
  async getUser(
    @Param(new ZodValidationPipe(getUserSchema)) getUserDto: GetUserDto,
  ): Promise<GetUserResponseDto> {
    return getUserResponseSchema.parse(
      await this.userService.findOneById(getUserDto.userId),
    );
  }
}
