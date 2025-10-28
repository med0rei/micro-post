import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
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
  UpdatePostBodyDto,
  UpdatePostParamDto,
  UpdatePostResponseDto,
} from './schemas/post.schema';
import {
  createPostResponseSchema,
  createPostSchema,
  deletePostResponseSchema,
  deletePostSchema,
  getPostListResponseSchema,
  getPostListSchema,
  updatePostBodySchema,
  updatePostParamSchema,
  updatePostResponseSchema,
} from './schemas/post.schema';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
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

  @Patch(':postId')
  @UseGuards(TokenAuthGuard)
  async updatePost(
    @User() user: UserDto,
    @Param(new ZodValidationPipe(updatePostParamSchema))
    updatePostParamDto: UpdatePostParamDto,
    @Body(new ZodValidationPipe(updatePostBodySchema))
    updatePostBodyDto: UpdatePostBodyDto,
  ): Promise<UpdatePostResponseDto> {
    return updatePostResponseSchema.parse(
      await this.postService.updatePost(
        user.id,
        updatePostParamDto.postId,
        updatePostBodyDto.content,
      ),
    );
  }

  @Delete(':postId')
  @UseGuards(TokenAuthGuard)
  async deletePost(
    @User() user: UserDto,
    @Param(new ZodValidationPipe(deletePostSchema))
    deletePostDto: DeletePostDto,
  ): Promise<DeletePostResponseDto> {
    return deletePostResponseSchema.parse(
      await this.postService.deletePost(user.id, deletePostDto.postId),
    );
  }
}
