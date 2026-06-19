import { v2 as cloudinary } from 'cloudinary';
import config from '@config/config';
import { Logger } from '@lib/logger';

export let loadCloudinary = (): void => {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key:    config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
  });
  Logger.info('Cloudinary configured');
};
