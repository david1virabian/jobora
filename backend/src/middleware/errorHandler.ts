import { Request, Response, NextFunction } from 'express';
import { logger } from '@/utils/logger';
import { config } from '@/config/env';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  code?: string;
}

/**
 * Global error handling middleware
 */
export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal Server Error';
  let code = error.code;

  // Log the error
  logger.error('Error caught by error handler:', {
    error: error.message,
    stack: error.stack,
    statusCode,
    code,
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
  });

  // Handle specific error types
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
  } else if (error.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized';
  } else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
    code = 'INVALID_TOKEN';
  } else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
    code = 'TOKEN_EXPIRED';
  } else if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  } else if (error.name === 'MongoServerError' && (error as any).code === 11000) {
    statusCode = 409;
    message = 'Duplicate entry';
  }

  // Prisma errors
  if (error.name === 'PrismaClientKnownRequestError') {
    const prismaError = error as any;
    switch (prismaError.code) {
      case 'P2002':
        statusCode = 409;
        message = 'Unique constraint violation';
        break;
      case 'P2025':
        statusCode = 404;
        message = 'Record not found';
        break;
      case 'P2003':
        statusCode = 400;
        message = 'Foreign key constraint violation';
        break;
      default:
        statusCode = 500;
        message = 'Database error';
    }
  }

  // Redis errors
  if (error.message.includes('Redis') || error.message.includes('ECONNREFUSED')) {
    statusCode = 503;
    message = 'Service temporarily unavailable';
    code = 'SERVICE_UNAVAILABLE';
  }

  // HH.ru API errors
  if (error.message.includes('HH.ru') || code === 'HH_API_ERROR') {
    statusCode = 502;
    message = 'External service error';
    code = 'EXTERNAL_SERVICE_ERROR';
  }

  // OpenAI API errors
  if (error.message.includes('OpenAI') || code === 'OPENAI_ERROR') {
    statusCode = 502;
    message = 'AI service error';
    code = 'AI_SERVICE_ERROR';
  }

  // Telegram API errors
  if (error.message.includes('Telegram') || code === 'TELEGRAM_ERROR') {
    statusCode = 502;
    message = 'Telegram service error';
    code = 'TELEGRAM_SERVICE_ERROR';
  }

  // Rate limiting errors
  if (statusCode === 429) {
    message = 'Too many requests';
    code = 'RATE_LIMIT_EXCEEDED';
  }

  // Prepare error response
  const errorResponse: any = {
    success: false,
    error: message,
  };

  if (code) {
    errorResponse.code = code;
  }

  // Include stack trace in development
  if (config.nodeEnv === 'development') {
    errorResponse.stack = error.stack;
    errorResponse.details = {
      name: error.name,
      originalMessage: error.message,
    };
  }

  // Send error response
  res.status(statusCode).json(errorResponse);
};

/**
 * Not found handler
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.originalUrl,
  });
};

/**
 * Async error wrapper
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Create an operational error
 */
export const createError = (
  message: string,
  statusCode = 500,
  code?: string
): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.isOperational = true;
  error.code = code;
  return error;
};

/**
 * Validation error creator
 */
export const createValidationError = (message: string): AppError => {
  return createError(message, 400, 'VALIDATION_ERROR');
};

/**
 * Authorization error creator
 */
export const createAuthError = (message = 'Unauthorized'): AppError => {
  return createError(message, 401, 'UNAUTHORIZED');
};

/**
 * Forbidden error creator
 */
export const createForbiddenError = (message = 'Forbidden'): AppError => {
  return createError(message, 403, 'FORBIDDEN');
};

/**
 * Not found error creator
 */
export const createNotFoundError = (message = 'Not found'): AppError => {
  return createError(message, 404, 'NOT_FOUND');
};

/**
 * Conflict error creator
 */
export const createConflictError = (message = 'Conflict'): AppError => {
  return createError(message, 409, 'CONFLICT');
};

/**
 * Service unavailable error creator
 */
export const createServiceUnavailableError = (message = 'Service unavailable'): AppError => {
  return createError(message, 503, 'SERVICE_UNAVAILABLE');
};