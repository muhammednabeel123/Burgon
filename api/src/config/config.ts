import 'dotenv/config';

let config = {
  port: parseInt(process.env.PORT || '3000', 10),
  customerPort: parseInt(process.env.CUSTOMER_PORT || '3001', 10),
  kdsPort: parseInt(process.env.KDS_PORT || '3002', 10),
  env: process.env.NODE_ENV || 'development',

  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'burgon',
  },

  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'changeme',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },

  smtp: {
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },

  tap: {
    secretKey: process.env.TAP_SECRET_KEY || '',
    publicKey: process.env.TAP_PUBLIC_KEY || '',
    webhookSecret: process.env.TAP_WEBHOOK_SECRET || '',
  },

  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  },

  whatsapp: {
    token: process.env.WHATSAPP_API_TOKEN || '',
    phoneId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
  },
};

export default config;
