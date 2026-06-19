import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sendErrorResponse } from '@lib/env';
import { JwtPayload } from '@interfaces/JwtPayload.interface';
import config from '@config/config';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export let authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  let authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendErrorResponse(res, 401, 'Unauthorized');
    return;
  }

  let token = authHeader.split(' ')[1];

  try {
    let decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
    req.user = decoded;
    next();
  } catch (err) {
    sendErrorResponse(res, 401, 'Invalid or expired token');
  }
};
