import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenService {
  generateToken(): string {
    return crypto.randomUUID();
  }
}
