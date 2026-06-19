import { AppDataSource } from '../data-source';
import { Logger } from '@lib/logger';

export let loadDatabase = async (): Promise<void> => {
  // ---- Initialize TypeORM connection ----
  await AppDataSource.initialize();
  Logger.info('Database connected');
};
