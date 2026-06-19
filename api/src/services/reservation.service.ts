import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Reservation } from '@models/Reservation';
import { PaginationOptions } from '@interfaces/PaginationOptions.interface';

@Service()
export class ReservationService {
  @InjectRepository(Reservation)
  private reservationRepository: Repository<Reservation>;

  // ---- Get all reservations ----
  async getAllReservations(options: PaginationOptions): Promise<{ data: Reservation[]; total: number }> {
    let { page, limit } = options;
    let offset = (page - 1) * limit;

    let [reservationList, total] = await this.reservationRepository
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.table_id', 't')
      .where('r.is_deleted = 0')
      .orderBy('r.reservation_time', 'ASC')
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return { data: reservationList, total };
  }

  // ---- Create reservation ----
  async createReservation(data: {
    table_id: number;
    customer_name: string;
    customer_phone: string;
    reservation_time: Date;
    guest_count: number;
    notes: string;
  }): Promise<Reservation> {
    let newReservation = this.reservationRepository.create(data);
    return await this.reservationRepository.save(newReservation);
  }

  // ---- Update reservation status ----
  async updateStatus(reservationId: number, status: string): Promise<Reservation> {
    let reservationRecord = await this.reservationRepository.findOne({
      where: { id: reservationId, is_deleted: 0 },
    });

    if (!reservationRecord) {
      throw new Error('Reservation not found');
    }

    reservationRecord.status = status;
    return await this.reservationRepository.save(reservationRecord);
  }

  // ---- Cancel reservation ----
  async cancelReservation(reservationId: number): Promise<void> {
    let reservationRecord = await this.reservationRepository.findOne({
      where: { id: reservationId, is_deleted: 0 },
    });

    if (!reservationRecord) {
      throw new Error('Reservation not found');
    }

    reservationRecord.status = 'CANCELLED';
    reservationRecord.is_deleted = 1;
    await this.reservationRepository.save(reservationRecord);
  }
}
