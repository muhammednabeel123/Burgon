import 'reflect-metadata';
import 'dotenv/config';
import express, { Application, Request, Response, NextFunction } from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { getRedisClient } from '@config/redis';
import { initSocket } from '@config/socket';
import { initLoaders } from './loaders';
import { sendErrorResponse } from '@lib/env';
import { Logger } from '@lib/logger';
import config from '@config/config';

let createApp = (): Application => {
  let app = express();

  // ---- Security middlewares ----
  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('combined'));

  // ---- Health check ----
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', service: 'burgon-api' });
  });

  return app;
};

let startServer = async (): Promise<void> => {
  let app = createApp();
  let httpServer = http.createServer(app);

  // ---- Initialize Socket.IO ----
  initSocket(httpServer);

  // ---- Initialize all loaders (DB, Redis, routes, etc.) ----
  await initLoaders(app);

  // ---- Global error handler ----
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    Logger.error(`Unhandled error: ${err.message}`);
    sendErrorResponse(res, 500, 'Internal server error');
  });

  httpServer.listen(config.port, () => {
    Logger.info(`Burgon API running on port ${config.port}`);
  });
};

startServer().catch((err: Error) => {
  Logger.error(`Server failed to start: ${err.message}`);
  process.exit(1);
});

export default createApp;
