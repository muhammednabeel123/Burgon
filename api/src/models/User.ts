import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 150 })
  email: string;

  @Column({ nullable: true, length: 20 })
  phone: string;

  @Column({ select: false })
  password: string;

  @Column({ length: 50, default: 'admin' })
  role: string;

  @Column({ type: 'char', length: 1, nullable: true })
  gender: string;

  @Column({ default: 1 })
  is_active: number;

  @Column({ default: 0 })
  is_deleted: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
