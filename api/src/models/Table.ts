import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

@Entity('tables')
export class Table {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  table_number: string;

  @Column({ default: 4 })
  capacity: number;

  @Column({ length: 50, default: 'available' })
  status: string;

  @Column({ nullable: true, length: 100 })
  qr_code: string;

  @Column({ default: 0 })
  is_deleted: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
