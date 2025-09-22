import { Router, Request, Response } from 'express';
import { validate, telegramWebhookSchema } from '@/middleware/validation';
import { asyncHandler } from '@/middleware/errorHandler';
import { TelegramService } from '@/integrations/telegram';
import { logger } from '@/utils/logger';

const router = Router();
const telegramService = new TelegramService();

/**
 * @route POST /api/telegram/webhook
 * @desc Handle Telegram webhook updates
 * @access Public (but verified by Telegram)
 */
router.post('/webhook', validate(telegramWebhookSchema), asyncHandler(async (req: Request, res: Response) => {
  try {
    await telegramService.processWebhookUpdate(req.body);
    res.status(200).json({ success: true });
  } catch (error) {
    logger.error('Telegram webhook processing failed:', error);
    res.status(500).json({ success: false, error: 'Webhook processing failed' });
  }
}));

/**
 * @route POST /api/telegram/set-webhook
 * @desc Set Telegram webhook URL
 * @access Private (admin only)
 */
router.post('/set-webhook', asyncHandler(async (req: Request, res: Response) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({
      success: false,
      error: 'Webhook URL is required',
    });
  }

  try {
    const success = await telegramService.setWebhook(url);
    
    if (success) {
      res.json({
        success: true,
        message: 'Webhook set successfully',
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to set webhook',
      });
    }
  } catch (error) {
    logger.error('Failed to set Telegram webhook:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to set webhook',
    });
  }
}));

/**
 * @route POST /api/telegram/send-notification
 * @desc Send notification to user via Telegram
 * @access Private
 */
router.post('/send-notification', asyncHandler(async (req: Request, res: Response) => {
  const { telegramUserId, title, message, buttons } = req.body;

  if (!telegramUserId || !title || !message) {
    return res.status(400).json({
      success: false,
      error: 'telegramUserId, title, and message are required',
    });
  }

  try {
    const success = await telegramService.sendNotification(
      telegramUserId,
      title,
      message,
      buttons
    );

    if (success) {
      res.json({
        success: true,
        message: 'Notification sent successfully',
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to send notification',
      });
    }
  } catch (error) {
    logger.error('Failed to send Telegram notification:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send notification',
    });
  }
}));

/**
 * @route GET /api/telegram/health
 * @desc Check Telegram bot health
 * @access Public
 */
router.get('/health', asyncHandler(async (req: Request, res: Response) => {
  try {
    const isHealthy = await telegramService.healthCheck();
    
    res.json({
      success: isHealthy,
      status: isHealthy ? 'healthy' : 'unhealthy',
      message: isHealthy ? 'Telegram bot is working' : 'Telegram bot is not responding',
    });
  } catch (error) {
    logger.error('Telegram health check failed:', error);
    res.status(500).json({
      success: false,
      status: 'unhealthy',
      error: 'Health check failed',
    });
  }
}));

export default router;