import { z } from 'zod';

export const userSchema = z
  .object({
    userId: z.number(),
    username: z.string(),
  })
  .strict();

export const createUserSchema = z
  .object({
    username: z.string(),
    password: z.string(),
    email: z.string().email(),
  })
  .strict();

export type UserDto = z.infer<typeof userSchema>;
export type CreateUserDto = z.infer<typeof createUserSchema>;
