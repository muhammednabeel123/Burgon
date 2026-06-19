import { Request, Response, NextFunction } from 'express';
import { sendErrorResponse } from '@lib/env';

export let roleMiddleware = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendErrorResponse(res, 401, 'Unauthorized');
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      sendErrorResponse(res, 403, 'Forbidden');
      return;
    }

    next();
  };
};
