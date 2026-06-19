import { Router } from 'express';
import { Container } from 'typedi';
import { ReservationController } from './reservation.controller';
import { authMiddleware } from '@middlewares/auth.middleware';
import { roleMiddleware } from '@middlewares/role.middleware';

let router = Router();
let reservationController = Container.get(ReservationController);

router.get('/',            authMiddleware, reservationController.getAll);
router.post('/',           authMiddleware, reservationController.create);
router.patch('/:id/status', authMiddleware, roleMiddleware('admin', 'waiter'), reservationController.updateStatus);
router.delete('/:id',      authMiddleware, roleMiddleware('admin'), reservationController.cancel);

export default router;
