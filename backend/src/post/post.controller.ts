import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TokenAuthGuard } from '../shared/guards/token-auth.guard';
import { ZodValidationPipe } from '../shared/pipes/zod-validation.pipe';
import type { RequestWithUserDto } from '../shared/types/request-with';
import { MicroPost } from './entities/micro-post.entity';
import { PostService } from './post.service';
import type {
  CreatePostDto,
  GetPostListDto,
  GetPostListResponseDto,
} from './schemas/post.schema';
import {
  createPostSchema,
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
      ),
    );
  }

  @Post()
  @UseGuards(TokenAuthGuard)
  async createPost(
    @Request() req: RequestWithUserDto,
    @Body(new ZodValidationPipe(createPostSchema))
    createPostDto: CreatePostDto,
  ): Promise<MicroPost | null> {
    return this.postService.createPost(req.user.userId, createPostDto.content);
  }
}
