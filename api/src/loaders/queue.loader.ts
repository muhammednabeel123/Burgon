import { emailWorker }        from '@queue/workers/email.worker';
import { notificationWorker } from '@queue/workers/notification.worker';
import { Logger }             from '@lib/logger';

export let loadQueues = (): void => {
  // ---- Start queue workers ----
  emailWorker.on('completed', (job) => {
    Logger.info(`Email job ${job.id} completed`);
  });

  notificationWorker.on('completed', (job) => {
    Logger.info(`Notification job ${job.id} completed`);
  });

  Logger.info('Queue workers loaded');
};
