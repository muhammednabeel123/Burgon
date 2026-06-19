import { Queue } from 'bullmq';
import { getRedisClient } from '@config/redis';
import { QUEUE_NOTIFICATION } from '@config/param';

let notificationQueue = new Queue(QUEUE_NOTIFICATION, { connection: getRedisClient() });

export let addNotificationJob = async (name: string, data: Record<string, unknown>): Promise<void> => {
  await notificationQueue.add(name, data, { attempts: 3, backoff: { type: 'exponential', delay: 1000 } });
};
