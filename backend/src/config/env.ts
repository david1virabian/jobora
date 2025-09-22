import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',

  // Database
  databaseUrl: process.env.DATABASE_URL!,

  // Redis
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',

  // JWT
  jwtSecret: process.env.JWT_SECRET!,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

  // HH.ru API
  hh: {
    clientId: process.env.HH_CLIENT_ID!,
    clientSecret: process.env.HH_CLIENT_SECRET!,
    redirectUri: process.env.HH_REDIRECT_URI!,
    apiUrl: 'https://api.hh.ru',
  },

  // OpenAI
  openai: {
    apiKey: process.env.OPENAI_API_KEY!,
    model: process.env.OPENAI_MODEL || 'gpt-4',
  },

  // Telegram
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN!,
    webhookUrl: process.env.TELEGRAM_WEBHOOK_URL,
  },

  // Session
  sessionSecret: process.env.SESSION_SECRET!,

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/jobora.log',
  },

  // Application Settings
  app: {
    maxApplicationsPerDay: parseInt(process.env.MAX_APPLICATIONS_PER_DAY || '50', 10),
    coverLetterMaxLength: parseInt(process.env.COVER_LETTER_MAX_LENGTH || '2000', 10),
    autoApplyEnabled: process.env.AUTO_APPLY_ENABLED === 'true',
    autoApplyIntervalMinutes: parseInt(process.env.AUTO_APPLY_INTERVAL_MINUTES || '30', 10),
  },
};

// Validate required environment variables
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'HH_CLIENT_ID',
  'HH_CLIENT_SECRET',
  'OPENAI_API_KEY',
  'TELEGRAM_BOT_TOKEN',
  'SESSION_SECRET',
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}