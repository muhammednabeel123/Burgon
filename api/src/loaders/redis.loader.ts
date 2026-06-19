import { getRedisClient } from '@config/redis';
import { Logger } from '@lib/logger';

export let loadRedis = async (): Promise<void> => {
  getRedisClient();
  Logger.info('Redis loader initialized');
};
