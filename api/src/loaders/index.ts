import { Application }   from 'express';
import { loadDatabase }  from './database.loader';
import { loadRedis }     from './redis.loader';
import { loadCloudinary }from './cloudinary.loader';
import { loadRoutes }    from './routes.loader';
import { Logger }        from '@lib/logger';

export let initLoaders = async (app: Application): Promise<void> => {
  await loadDatabase();
  await loadRedis();
  loadCloudinary();
  loadRoutes(app);
  Logger.info('All loaders initialized');
};
