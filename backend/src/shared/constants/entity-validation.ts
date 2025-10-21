import { z } from 'zod';

export const AUTH = {
  token: z.string().min(1),
};

export const USER_CONSTRAINTS = {
  usernameMinLength: 3,
  usernameMaxLength: 30,
  passwordMinLength: 8,
  passwordMaxLength: 256,
} as const;

export const USER = {
  id: z.coerce.number().int().positive(),
  username: z
    .string()
    .min(USER_CONSTRAINTS.usernameMinLength)
    .max(USER_CONSTRAINTS.usernameMaxLength),
  password: z
    .string()
    .min(USER_CONSTRAINTS.passwordMinLength)
    .max(USER_CONSTRAINTS.passwordMaxLength),
  email: z.string().email(),
  createdAt: z.date(),
  updatedAt: z.date(),
} as const;

export const POST_CONSTRAINTS = {
  contentMinLength: 1,
  contentMaxLength: 1000,
  offsetMin: 0,
  limitMin: 1,
} as const;

export const POST = {
  id: z.number().int().positive(),
  content: z
    .string()
    .min(POST_CONSTRAINTS.contentMinLength)
    .max(POST_CONSTRAINTS.contentMaxLength),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: USER.id,
  getPostList: {
    offset: z.coerce.number().min(0),
    limit: z.coerce.number().min(1),
  } as const,
} as const;
