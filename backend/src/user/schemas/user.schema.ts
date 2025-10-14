import { z } from 'zod';
import { USER } from '../../shared/constants/entity-validation';

export const userSchema = z
  .object({
    userId: USER.id,
    username: USER.username,
  })
  .strict();

export const publicUserSchema = z
  .object({
    id: USER.id,
    username: USER.username,
  })
  .required();

export const createUserSchema = z
  .object({
    username: USER.username,
    password: USER.password,
    email: USER.email,
  })
  .strict();

export const createUserResponseSchema = z
  .object({
    id: USER.id,
    username: USER.username,
    email: USER.email,
    createdAt: USER.createdAt,
    updatedAt: USER.updatedAt,
  })
  .strip();

export const getUserSchema = z
  .object({
    userId: USER.id,
  })
  .strict();

export const getUserResponseSchema = z
  .object({
    id: USER.id,
    username: USER.username,
    createdAt: USER.createdAt,
    updatedAt: USER.updatedAt,
  })
  .strip();

export type UserDto = z.infer<typeof userSchema>;
export type PublicUserDto = z.infer<typeof publicUserSchema>;
export type CreateUserDto = z.infer<typeof createUserSchema>;
export type CreateUserResponseDto = z.infer<typeof createUserResponseSchema>;
export type GetUserDto = z.infer<typeof getUserSchema>;
export type GetUserResponseDto = z.infer<typeof getUserResponseSchema>;
