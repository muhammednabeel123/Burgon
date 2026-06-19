import { Request, Response } from 'express';
import { Service } from 'typedi';
import { ReservationService } from '@services/reservation.service';
import { sendSuccessResponse, sendErrorResponse, paginationResponse } from '@lib/env';
import { DEFAULT_PAGE, DEFAULT_LIMIT } from '@config/param';

@Service()
export class ReservationController {
  constructor(private reservationService: ReservationService) {}

  // ---- GET /api/v1/reservations ----
  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      let page  = parseInt((req.query.page  as string) || String(DEFAULT_PAGE),  10);
      let limit = parseInt((req.query.limit as string) || String(DEFAULT_LIMIT), 10);

      let { data, total } = await this.reservationService.getAllReservations({ page, limit });
      paginationResponse(res, 'Reservations fetched', data, total, page, limit);
    } catch (err) {
      let error = err as Error;
      sendErrorResponse(res, 500, error.message);
    }
  };

  // ---- POST /api/v1/reservations ----
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      let body = req.body as {
        table_id: number;
        customer_name: string;
        customer_phone: string;
        reservation_time: string;
        guest_count: number;
        notes: string;
      };

      let newReservation = await this.reservationService.createReservation({
        ...body,
        reservation_time: new Date(body.reservation_time),
      });

      sendSuccessResponse(res, 201, 'Reservation created', newReservation);
    } catch (err) {
      let error = err as Error;
      sendErrorResponse(res, 400, error.message);
    }
  };

  // ---- PATCH /api/v1/reservations/:id/status ----
  updateStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      let reservationId = parseInt(req.params.id, 10);
      let { status } = req.body as { status: string };

      let updatedReservation = await this.reservationService.updateStatus(reservationId, status);
      sendSuccessResponse(res, 200, 'Reservation status updated', updatedReservation);
    } catch (err) {
      let error = err as Error;
      sendErrorResponse(res, 400, error.message);
    }
  };

  // ---- DELETE /api/v1/reservations/:id ----
  cancel = async (req: Request, res: Response): Promise<void> => {
    try {
      let reservationId = parseInt(req.params.id, 10);
      await this.reservationService.cancelReservation(reservationId);
      sendSuccessResponse(res, 200, 'Reservation cancelled', null);
    } catch (err) {
      let error = err as Error;
      sendErrorResponse(res, 400, error.message);
    }
  };
}
