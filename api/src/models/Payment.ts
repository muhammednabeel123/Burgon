import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bill_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ length: 20, default: 'CASH' })
  provider: string;

  @Column({ length: 50, default: 'PENDING' })
  status: string;

  @Column({ nullable: true, length: 255 })
  transaction_id: string;

  @Column({ nullable: true, length: 255 })
  payment_url: string;

  @Column({ default: 0 })
  is_deleted: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
