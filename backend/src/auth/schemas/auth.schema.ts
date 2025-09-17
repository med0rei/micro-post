import { z } from 'zod';

export const loginSchema = z
  .object({
    username: z.string(),
    password: z.string(),
  })
  .strict();

export const signupSchema = z
  .object({
    username: z.string(),
    password: z.string(),
    email: z.string().email(),
  })
  .strict();

export const loginResponseSchema = z
  .object({
    token: z.string(),
    userId: z.number(),
  })
  .strict();

export type LoginDto = z.infer<typeof loginSchema>;
export type SignupDto = z.infer<typeof signupSchema>;
export type LoginResponseDto = z.infer<typeof loginResponseSchema>;
