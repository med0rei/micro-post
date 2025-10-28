import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
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
  ): Promise<MicroPost[]> {
    const trimmedQuery = query?.trim();

    return this.microPostsRepository.find({
      where: trimmedQuery ? { content: ILike(`%${trimmedQuery}%`) } : undefined,
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
