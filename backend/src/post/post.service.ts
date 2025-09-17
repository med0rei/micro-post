import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async getPostList(offset: number, limit: number): Promise<MicroPost[]> {
    return this.microPostsRepository.find({
      relations: ['user'],
      skip: offset,
      take: limit,
    });
  }
}
