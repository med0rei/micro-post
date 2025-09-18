import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('micro_posts')
export class MicroPost {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @ManyToOne(
    () => User,
    (user) => user.posts,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'userId' })
  user: User;

  userId: number;

  @Column('varchar', { nullable: false, length: 1000 })
  content: string;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;
}
