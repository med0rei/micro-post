import { z } from 'zod';

export const userSchema = z
  .object({
    userId: z.number(),
    username: z.string(),
  })
  .strict();

export const publicUserSchema = z
  .object({
    id: z.number(),
    username: z.string(),
  })
  .required();

export const createUserSchema = z
  .object({
    username: z.string(),
    password: z.string(),
    email: z.string().email(),
  })
  .strict();

export const createUserResponseSchema = z
  .object({
    id: z.number(),
    username: z.string(),
    email: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strip();

export type UserDto = z.infer<typeof userSchema>;
export type PublicUserDto = z.infer<typeof publicUserSchema>;
export type CreateUserDto = z.infer<typeof createUserSchema>;
export type CreateUserResponseDto = z.infer<typeof createUserResponseSchema>;
