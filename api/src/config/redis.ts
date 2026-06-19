import { Redis } from 'ioredis';
import config from './config';
import { Logger } from '@lib/logger';

let redisClient: Redis | null = null;

export let getRedisClient = (): Redis => {
  if (!redisClient) {
    redisClient = new Redis({
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password,
    });

    redisClient.on('connect', () => {
      Logger.info('Redis connected');
    });

    redisClient.on('error', (err: Error) => {
      Logger.error(`Redis error: ${err.message}`);
    });
  }

  return redisClient;
};

export default getRedisClient;
