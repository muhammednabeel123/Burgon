import { Application } from 'express';
import authRoutes        from '@controllers/auth/auth.routes';
import tableRoutes       from '@controllers/table/table.routes';
import reservationRoutes from '@controllers/reservation/reservation.routes';

export let loadRoutes = (app: Application): void => {
  // ---- API v1 routes ----
  app.use('/api/v1/auth',         authRoutes);
  app.use('/api/v1/tables',       tableRoutes);
  app.use('/api/v1/reservations', reservationRoutes);
};
