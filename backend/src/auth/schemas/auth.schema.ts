import { z } from 'zod';
import { AUTH, USER } from '../../shared/constants/entity-validation';

export const loginSchema = z
  .object({
    username: USER.username,
    password: USER.password,
  })
  .strict();

export const signupSchema = z
  .object({
    username: USER.username,
    password: USER.password,
    email: USER.email,
  })
  .strict();

export const loginResponseSchema = z
  .object({
    token: AUTH.token,
    userId: USER.id,
  })
  .strict();

export type LoginDto = z.infer<typeof loginSchema>;
export type SignupDto = z.infer<typeof signupSchema>;
export type LoginResponseDto = z.infer<typeof loginResponseSchema>;
