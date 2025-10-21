import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { User } from '../shared/decorators/user.decorator';
import { ZodValidationPipe } from '../shared/pipes/zod-validation.pipe';
import type { UserDto } from '../user/schemas/user.schema';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import type { LoginDto, LoginResponseDto } from './schemas/auth.schema';
import { loginSchema } from './schemas/auth.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @User() user: UserDto,
    @Body(new ZodValidationPipe(loginSchema)) _: LoginDto,
  ): Promise<LoginResponseDto> {
    return this.authService.login(user);
  }
}
