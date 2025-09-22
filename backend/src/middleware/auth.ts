import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '@/config/env';
import { logger } from '@/utils/logger';
import prisma from '@/config/database';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    telegramUserId?: string;
  };
}

/**
 * JWT Authentication middleware
 */
export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Access token is required',
      });
      return;
    }

    const decoded = jwt.verify(token, config.jwtSecret) as {
      userId: string;
      email: string;
    };

    // Verify user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        telegramUserId: true,
      },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Invalid token: user not found',
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error('Token verification failed:', error);
    
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        error: 'Token expired',
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        error: 'Invalid token',
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Token verification failed',
      });
    }
  }
};

/**
 * Optional authentication middleware - doesn't fail if no token
 */
export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, config.jwtSecret) as {
        userId: string;
        email: string;
      };

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          telegramUserId: true,
        },
      });

      if (user) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Just log the error but continue without authentication
    logger.warn('Optional auth failed:', error);
    next();
  }
};

/**
 * Telegram authentication middleware
 */
export const authenticateTelegram = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const telegramUserId = req.body.telegram_user_id || req.query.telegram_user_id;

    if (!telegramUserId) {
      res.status(401).json({
        success: false,
        error: 'Telegram user ID is required',
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { telegramUserId: telegramUserId.toString() },
      select: {
        id: true,
        email: true,
        telegramUserId: true,
      },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'User not found for this Telegram account',
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error('Telegram authentication failed:', error);
    res.status(500).json({
      success: false,
      error: 'Authentication failed',
    });
  }
};

/**
 * HH.ru token validation middleware
 */
export const validateHHToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'User authentication required',
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        hhAccessToken: true,
        hhTokenExpiresAt: true,
        hhRefreshToken: true,
      },
    });

    if (!user?.hhAccessToken) {
      res.status(401).json({
        success: false,
        error: 'HH.ru authorization required',
        code: 'HH_AUTH_REQUIRED',
      });
      return;
    }

    // Check if token is expired
    if (user.hhTokenExpiresAt && new Date() > user.hhTokenExpiresAt) {
      res.status(401).json({
        success: false,
        error: 'HH.ru token expired',
        code: 'HH_TOKEN_EXPIRED',
      });
      return;
    }

    next();
  } catch (error) {
    logger.error('HH.ru token validation failed:', error);
    res.status(500).json({
      success: false,
      error: 'Token validation failed',
    });
  }
};

/**
 * Admin authorization middleware
 */
export const requireAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }

    // You can extend the User model to include role field
    // For now, we'll use a simple email check
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
    
    if (!adminEmails.includes(req.user.email)) {
      res.status(403).json({
        success: false,
        error: 'Admin access required',
      });
      return;
    }

    next();
  } catch (error) {
    logger.error('Admin authorization failed:', error);
    res.status(500).json({
      success: false,
      error: 'Authorization failed',
    });
  }
};

/**
 * Rate limiting per user
 */
export const rateLimitByUser = (
  maxRequests: number,
  windowMs: number
) => {
  const requests = new Map<string, { count: number; resetTime: number }>();

  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    
    if (!userId) {
      // If no user, apply global rate limiting
      next();
      return;
    }

    const now = Date.now();
    const userRequests = requests.get(userId);

    if (!userRequests || now > userRequests.resetTime) {
      // Reset counter
      requests.set(userId, {
        count: 1,
        resetTime: now + windowMs,
      });
      next();
      return;
    }

    if (userRequests.count >= maxRequests) {
      res.status(429).json({
        success: false,
        error: 'Too many requests',
        retryAfter: Math.ceil((userRequests.resetTime - now) / 1000),
      });
      return;
    }

    userRequests.count += 1;
    next();
  };
};

export { AuthenticatedRequest };