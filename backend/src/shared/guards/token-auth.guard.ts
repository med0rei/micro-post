import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { STRATEGY_NAMES } from '../constants/strategy-names';

@Injectable()
export class TokenAuthGuard extends AuthGuard(STRATEGY_NAMES.token) {}
