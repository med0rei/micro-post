import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { FindOperator } from 'typeorm/browser';
import { MicroPost } from './entities/micro-post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(MicroPost)
    private microPostsRepository: Repository<MicroPost>,
  ) {}

  async createPost(userId: number, content: string): Promise<MicroPost> {
    const createdPost = this.microPostsRepository.create({
      user: { id: userId },
      content,
    });
    const savedPost = await this.microPostsRepository.save(createdPost);

    return this.microPostsRepository.findOneOrFail({
      where: { id: savedPost.id },
      relations: ['user'],
    });
  }

  async getPostList(
    offset: number,
    limit: number,
    query?: string,
    userId?: number,
  ): Promise<MicroPost[]> {
    const trimmedQuery = query?.trim();

    const whereConditions: Array<{
      content?: FindOperator<string>;
      user?: { id: number };
    }> = [];

    if (trimmedQuery && userId) {
      whereConditions.push({
        content: ILike(`%${trimmedQuery}%`),
        user: { id: userId },
      });
    } else if (trimmedQuery) {
      whereConditions.push({ content: ILike(`%${trimmedQuery}%`) });
    } else if (userId) {
      whereConditions.push({ user: { id: userId } });
    }

    return this.microPostsRepository.find({
      where: whereConditions.length > 0 ? whereConditions[0] : undefined,
      relations: ['user'],
      skip: offset,
      take: limit,
      order: { createdAt: 'DESC' },
    });
  }

  async updatePost(
    userId: number,
    postId: number,
    content: string,
  ): Promise<MicroPost> {
    const updateTargetPost: MicroPost | null =
      await this.microPostsRepository.findOne({
        where: { id: postId },
        relations: ['user'],
      });

    if (!updateTargetPost) {
      throw new NotFoundException('Post not found');
    }

    // 更新対象のポストが、リクエストを送信したユーザーのものであることを保証
    if (updateTargetPost.user.id !== userId) {
      throw new ForbiddenException('Unauthorized to update this post');
    }

    await this.microPostsRepository.save({ ...updateTargetPost, content });

    const updatedPost: MicroPost | null =
      await this.microPostsRepository.findOneOrFail({
        where: { id: postId },
        relations: ['user'],
      });

    if (!updatedPost) {
      throw new NotFoundException('Updated post not found');
    }
    return updatedPost;
  }

  async deletePost(
    userId: number,
    postId: number,
  ): Promise<{ postId: number }> {
    const deletionTargetPost: MicroPost | null =
      await this.microPostsRepository.findOne({
        where: { id: postId },
        relations: ['user'],
      });

    if (!deletionTargetPost) {
      throw new NotFoundException('Post not found');
    }

    // 削除対象のポストが、リクエストを送信したユーザーのものであることを保証
    if (deletionTargetPost.user.id !== userId) {
      throw new ForbiddenException('Unauthorized to delete this post');
    }

    await this.microPostsRepository.delete({ id: postId });

    return { postId: postId };
  }
}
