import { Controller, Post, Request, UseGuards, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from '../shared/pipes/zod-validation.pipe';
import type { RequestWithUserDto } from '../shared/types/request-with.d';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import type { LoginResponseDto } from './schemas/auth.schema';
import { loginSchema } from './schemas/auth.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(new ZodValidationPipe(loginSchema))
  @UseGuards(LocalAuthGuard)
  async login(@Request() req: RequestWithUserDto): Promise<LoginResponseDto> {
    return this.authService.login(req.user);
  }
}
