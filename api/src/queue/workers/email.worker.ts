import { Worker, Job } from 'bullmq';
import { getRedisClient } from '@config/redis';
import { QUEUE_EMAIL } from '@config/param';
import { Logger } from '@lib/logger';

export let emailWorker = new Worker(
  QUEUE_EMAIL,
  async (job: Job) => {
    Logger.info(`Processing email job ${job.id}: ${job.name}`);
    // ---- Email send logic goes here ----
  },
  { connection: getRedisClient() },
);
