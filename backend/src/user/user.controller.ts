import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  UnauthorizedException,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { OptionalUser } from '../shared/decorators/optional-user.decorator';
import { OptionalTokenAuthGuard } from '../shared/guards/optional-token-auth.guard';
import { ZodValidationPipe } from '../shared/pipes/zod-validation.pipe';
import type {
  CreateUserDto,
  CreateUserResponseDto,
  GetUserDto,
  GetUserResponseDto,
  UserDto,
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
  @UseGuards(OptionalTokenAuthGuard)
  async getUser(
    @Param(new ZodValidationPipe(getUserSchema)) getUserDto: GetUserDto,
    @OptionalUser() user: UserDto | null,
    @Headers('authorization') authorization?: string,
  ): Promise<GetUserResponseDto> {
    if (authorization && !user) {
      throw new UnauthorizedException('Invalid token');
    }

    const requestUserId = user?.id;
    return getUserResponseSchema.parse(
      await this.userService.findOneById(getUserDto.userId, requestUserId),
    );
  }
}
