import { Router, Request, Response } from 'express';
import { asyncHandler } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';
import prisma from '@/config/database';
import redis from '@/config/redis';
import { HHruService } from '@/integrations/hhru';
import { OpenAIService } from '@/integrations/openai';
import { TelegramService } from '@/integrations/telegram';

const router = Router();
const hhService = new HHruService();
const openaiService = new OpenAIService();
const telegramService = new TelegramService();

/**
 * @route GET /health
 * @desc Basic health check
 * @access Public
 */
router.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Jobora Backend is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/**
 * @route GET /health/detailed
 * @desc Detailed health check with service status
 * @access Public
 */
router.get('/detailed', asyncHandler(async (req: Request, res: Response) => {
  const checks = await Promise.allSettled([
    // Database check
    prisma.$queryRaw`SELECT 1`,
    
    // Redis check
    redis.ping(),
    
    // OpenAI check
    openaiService.healthCheck(),
    
    // Telegram check
    telegramService.healthCheck(),
  ]);

  const services = {
    database: {
      status: checks[0].status === 'fulfilled' ? 'healthy' : 'unhealthy',
      error: checks[0].status === 'rejected' ? (checks[0].reason as Error).message : null,
    },
    redis: {
      status: checks[1].status === 'fulfilled' ? 'healthy' : 'unhealthy',
      error: checks[1].status === 'rejected' ? (checks[1].reason as Error).message : null,
    },
    openai: {
      status: checks[2].status === 'fulfilled' && checks[2].value ? 'healthy' : 'unhealthy',
      error: checks[2].status === 'rejected' ? (checks[2].reason as Error).message : null,
    },
    telegram: {
      status: checks[3].status === 'fulfilled' && checks[3].value ? 'healthy' : 'unhealthy',
      error: checks[3].status === 'rejected' ? (checks[3].reason as Error).message : null,
    },
  };

  const allHealthy = Object.values(services).every(service => service.status === 'healthy');
  const statusCode = allHealthy ? 200 : 503;

  res.status(statusCode).json({
    success: allHealthy,
    message: allHealthy ? 'All services are healthy' : 'Some services are unhealthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services,
  });
}));

/**
 * @route GET /health/metrics
 * @desc System metrics and statistics
 * @access Public
 */
router.get('/metrics', asyncHandler(async (req: Request, res: Response) => {
  const memoryUsage = process.memoryUsage();
  
  const [
    totalUsers,
    totalApplications,
    applicationsToday,
  ] = await Promise.allSettled([
    prisma.user.count(),
    prisma.application.count(),
    prisma.application.count({
      where: {
        appliedAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
  ]);

  res.json({
    success: true,
    timestamp: new Date().toISOString(),
    system: {
      uptime: process.uptime(),
      memory: {
        rss: Math.round(memoryUsage.rss / 1024 / 1024), // MB
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
        external: Math.round(memoryUsage.external / 1024 / 1024), // MB
      },
      cpu: process.cpuUsage(),
      version: process.version,
      platform: process.platform,
    },
    application: {
      totalUsers: totalUsers.status === 'fulfilled' ? totalUsers.value : 0,
      totalApplications: totalApplications.status === 'fulfilled' ? totalApplications.value : 0,
      applicationsToday: applicationsToday.status === 'fulfilled' ? applicationsToday.value : 0,
    },
  });
}));

export default router;