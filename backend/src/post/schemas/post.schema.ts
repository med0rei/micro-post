import { z } from 'zod';
import { publicUserSchema } from '../../user/schemas/user.schema';

export const microPostBaseSchema = z.object({
  id: z.number(),
  content: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const microPostSchema = microPostBaseSchema.extend({
  userId: z.number(),
});

export const publicMicroPostSchema = microPostBaseSchema.extend({
  user: publicUserSchema,
});

export const createPostSchema = z
  .object({
    content: z.string(),
  })
  .strict();

export const getPostListSchema = z
  .object({
    offset: z.coerce.number(),
    limit: z.coerce.number(),
  })
  .strict();

export const createPostResponseSchema = publicMicroPostSchema;
export const getPostListResponseSchema = z.array(publicMicroPostSchema);

export type MicroPostBase = z.infer<typeof microPostBaseSchema>;
export type MicroPost = z.infer<typeof microPostSchema>;
export type PublicMicroPost = z.infer<typeof publicMicroPostSchema>;
export type CreatePostDto = z.infer<typeof createPostSchema>;
export type CreatePostResponseDto = z.infer<typeof createPostResponseSchema>;
export type GetPostListDto = z.infer<typeof getPostListSchema>;
export type GetPostListResponseDto = z.infer<typeof getPostListResponseSchema>;
