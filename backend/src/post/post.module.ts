import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MicroPost } from './entities/micro-post.entity';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [TypeOrmModule.forFeature([MicroPost])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
