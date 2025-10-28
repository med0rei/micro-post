import { z } from 'zod';
import { POST } from '../../shared/constants/entity-validation';
import { publicUserSchema } from '../../user/schemas/user.schema';

export const microPostBaseSchema = z.object({
  id: POST.id,
  content: POST.content,
  createdAt: POST.createdAt,
  updatedAt: POST.updatedAt,
});

export const microPostSchema = microPostBaseSchema.extend({
  userId: POST.userId,
});

export const publicMicroPostSchema = microPostBaseSchema.extend({
  user: publicUserSchema,
});

export const createPostSchema = z
  .object({
    content: POST.content,
  })
  .strict();

export const getPostListSchema = z
  .object({
    offset: POST.getPostList.offset,
    limit: POST.getPostList.limit,
  })
  .strict();

export const deletePostSchema = z
  .object({
    postId: POST.id,
  })
  .strict();

export const deletePostResponseSchema = z
  .object({
    postId: POST.id,
  })
  .strict();

export const createPostResponseSchema = publicMicroPostSchema;
export const getPostListResponseSchema = z.array(publicMicroPostSchema);

export type MicroPostBase = z.infer<typeof microPostBaseSchema>;
export type MicroPost = z.infer<typeof microPostSchema>;
export type PublicMicroPost = z.infer<typeof publicMicroPostSchema>;
export type CreatePostDto = z.infer<typeof createPostSchema>;
export type CreatePostResponseDto = z.infer<typeof createPostResponseSchema>;
export type DeletePostDto = z.infer<typeof deletePostSchema>;
export type DeletePostResponseDto = z.infer<typeof deletePostResponseSchema>;
export type GetPostListDto = z.infer<typeof getPostListSchema>;
export type GetPostListResponseDto = z.infer<typeof getPostListResponseSchema>;
