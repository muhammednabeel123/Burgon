import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  table_id: number;

  @Column({ length: 100 })
  customer_name: string;

  @Column({ length: 20 })
  customer_phone: string;

  @Column({ type: 'timestamp' })
  reservation_time: Date;

  @Column({ default: 2 })
  guest_count: number;

  @Column({ length: 50, default: 'PENDING' })
  status: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ default: 0 })
  is_deleted: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
