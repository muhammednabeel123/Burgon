import { Worker, Job } from 'bullmq';
import { getRedisClient } from '@config/redis';
import { QUEUE_NOTIFICATION } from '@config/param';
import { Logger } from '@lib/logger';

export let notificationWorker = new Worker(
  QUEUE_NOTIFICATION,
  async (job: Job) => {
    Logger.info(`Processing notification job ${job.id}: ${job.name}`);
    // ---- Notification logic goes here ----
  },
  { connection: getRedisClient() },
);
