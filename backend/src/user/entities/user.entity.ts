import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column('varchar', { unique: true, nullable: false })
  username: string;

  @Column('varchar')
  passwordHash: string;

  @Column('varchar', { unique: true, nullable: false })
  email: string;

  @CreateDateColumn()
  readonly createdAt?: Date;

  @UpdateDateColumn()
  readonly updatedAt?: Date;
}
