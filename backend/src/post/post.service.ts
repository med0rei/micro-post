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
    return await this.microPostsRepository.save(createdPost);
  }

  async getPostList(offset: number, limit: number): Promise<MicroPost[]> {
    return this.microPostsRepository.find({
      relations: ['user'],
      skip: offset,
      take: limit,
    });
  }
}
