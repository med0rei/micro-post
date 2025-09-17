import { z } from 'zod';
import { publicUserSchema } from '../../user/schemas/user.schema';

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

export const getPostListResponseSchema = z.array(
  z.object({
    id: z.number(),
    user: publicUserSchema,
    content: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
);

export type CreatePostDto = z.infer<typeof createPostSchema>;
export type GetPostListDto = z.infer<typeof getPostListSchema>;
export type GetPostListResponseDto = z.infer<typeof getPostListResponseSchema>;
