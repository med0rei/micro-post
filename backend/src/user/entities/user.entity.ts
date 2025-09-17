import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MicroPost } from '../../post/entities/micro-post.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column('varchar', { unique: true, nullable: false })
  username: string;

  @Column('varchar', { select: false })
  passwordHash: string;

  @Column('varchar', { unique: true, nullable: false, select: false })
  email: string;

  @OneToMany(
    () => MicroPost,
    (post) => post.user,
  )
  posts: MicroPost[];

  @CreateDateColumn()
  readonly createdAt?: Date;

  @UpdateDateColumn()
  readonly updatedAt?: Date;
}
