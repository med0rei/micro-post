import { Controller, Post, Request, UseGuards, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from '../shared/pipes/zod-validation.pipe';
import type { RequestWith } from '../shared/types/request-with.d';
import { UserDto } from '../user/schemas/user.schema';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { loginSchema } from './schemas/auth.schema';

type RequestWithUserDto = RequestWith<{ user: UserDto }>;

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(new ZodValidationPipe(loginSchema))
  @UseGuards(LocalAuthGuard)
  async login(
    @Request() req: RequestWithUserDto,
  ): Promise<{ token: string; userId: number }> {
    return this.authService.login(req.user);
  }
}
