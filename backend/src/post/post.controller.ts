import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { User } from '../shared/decorators/user.decorator';
import { TokenAuthGuard } from '../shared/guards/token-auth.guard';
import { ZodValidationPipe } from '../shared/pipes/zod-validation.pipe';
import type { UserDto } from '../user/schemas/user.schema';
import { PostService } from './post.service';
import type {
  CreatePostDto,
  CreatePostResponseDto,
  DeletePostDto,
  DeletePostResponseDto,
  GetPostListDto,
  GetPostListResponseDto,
} from './schemas/post.schema';
import {
  createPostResponseSchema,
  createPostSchema,
  deletePostResponseSchema,
  deletePostSchema,
  getPostListResponseSchema,
  getPostListSchema,
} from './schemas/post.schema';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @UseGuards(TokenAuthGuard)
  async getPostList(
    @Query(new ZodValidationPipe(getPostListSchema))
    getPostListDto: GetPostListDto,
  ): Promise<GetPostListResponseDto> {
    return getPostListResponseSchema.parse(
      await this.postService.getPostList(
        getPostListDto.offset,
        getPostListDto.limit,
        getPostListDto.query,
      ),
    );
  }

  @Post()
  @UseGuards(TokenAuthGuard)
  async createPost(
    @User() user: UserDto,
    @Body(new ZodValidationPipe(createPostSchema))
    createPostDto: CreatePostDto,
  ): Promise<CreatePostResponseDto> {
    return createPostResponseSchema.parse(
      await this.postService.createPost(user.id, createPostDto.content),
    );
  }

  @Delete()
  @UseGuards(TokenAuthGuard)
  async deletePost(
    @User() user: UserDto,
    @Body(new ZodValidationPipe(deletePostSchema))
    deletePostDto: DeletePostDto,
  ): Promise<DeletePostResponseDto> {
    return deletePostResponseSchema.parse(
      await this.postService.deletePost(user.id, deletePostDto.postId),
    );
  }
}
