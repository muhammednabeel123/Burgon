import { Queue } from 'bullmq';
import { getRedisClient } from '@config/redis';
import { QUEUE_EMAIL } from '@config/param';

let emailQueue = new Queue(QUEUE_EMAIL, { connection: getRedisClient() });

export let addEmailJob = async (name: string, data: Record<string, unknown>): Promise<void> => {
  await emailQueue.add(name, data, { attempts: 3, backoff: { type: 'exponential', delay: 1000 } });
};
