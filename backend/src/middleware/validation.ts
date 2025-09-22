import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { logger } from '@/utils/logger';

/**
 * Generic validation middleware factory
 */
export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessages = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      logger.warn('Validation error:', { errorMessages, body: req.body });

      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errorMessages,
      });
      return;
    }

    req.body = value;
    next();
  };
};

/**
 * Validation schemas
 */

// User registration schema
export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters long',
    'any.required': 'Password is required',
  }),
  firstName: Joi.string().min(2).max(50).optional().messages({
    'string.min': 'First name must be at least 2 characters long',
    'string.max': 'First name must not exceed 50 characters',
  }),
  lastName: Joi.string().min(2).max(50).optional().messages({
    'string.min': 'Last name must be at least 2 characters long',
    'string.max': 'Last name must not exceed 50 characters',
  }),
  phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).optional().messages({
    'string.pattern.base': 'Please provide a valid phone number',
  }),
});

// User login schema
export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});

// User preferences schema
export const userPreferencesSchema = Joi.object({
  desiredSalaryFrom: Joi.number().min(0).optional(),
  desiredSalaryTo: Joi.number().min(0).optional(),
  desiredPositions: Joi.array().items(Joi.string().trim()).optional(),
  desiredLocations: Joi.array().items(Joi.string().trim()).optional(),
  desiredExperience: Joi.string().valid(
    'noExperience',
    'between1And3',
    'between3And6',
    'moreThan6'
  ).optional(),
  desiredSchedule: Joi.array().items(
    Joi.string().valid('fullDay', 'shift', 'flexible', 'remote', 'flyInFlyOut')
  ).optional(),
  desiredEmployment: Joi.array().items(
    Joi.string().valid('full', 'part', 'project', 'volunteer', 'probation')
  ).optional(),
  autoApplyEnabled: Joi.boolean().optional(),
  maxApplicationsPerDay: Joi.number().min(1).max(100).optional(),
  coverLetterTemplate: Joi.string().max(2000).optional(),
  excludeCompanies: Joi.array().items(Joi.string().trim()).optional(),
  excludeKeywords: Joi.array().items(Joi.string().trim()).optional(),
  includeKeywords: Joi.array().items(Joi.string().trim()).optional(),
}).custom((value, helpers) => {
  // Validate salary range
  if (value.desiredSalaryFrom && value.desiredSalaryTo) {
    if (value.desiredSalaryFrom >= value.desiredSalaryTo) {
      return helpers.error('any.custom', {
        message: 'Minimum salary must be less than maximum salary',
      });
    }
  }
  return value;
});

// Job search schema
export const jobSearchSchema = Joi.object({
  searchText: Joi.string().trim().max(500).optional(),
  area: Joi.array().items(Joi.string()).optional(),
  experience: Joi.string().valid(
    'noExperience',
    'between1And3',
    'between3And6',
    'moreThan6'
  ).optional(),
  employment: Joi.string().valid('full', 'part', 'project', 'volunteer', 'probation').optional(),
  schedule: Joi.string().valid('fullDay', 'shift', 'flexible', 'remote', 'flyInFlyOut').optional(),
  salaryFrom: Joi.number().min(0).optional(),
  salaryTo: Joi.number().min(0).optional(),
  autoApply: Joi.boolean().optional().default(false),
}).custom((value, helpers) => {
  // Validate salary range
  if (value.salaryFrom && value.salaryTo) {
    if (value.salaryFrom >= value.salaryTo) {
      return helpers.error('any.custom', {
        message: 'Minimum salary must be less than maximum salary',
      });
    }
  }
  return value;
});

// Cover letter generation schema
export const coverLetterSchema = Joi.object({
  vacancyId: Joi.string().required().messages({
    'any.required': 'Vacancy ID is required',
  }),
  customMessage: Joi.string().max(1000).optional(),
  useTemplate: Joi.boolean().optional().default(true),
  improvements: Joi.array().items(Joi.string().trim()).optional(),
});

// Application schema
export const applicationSchema = Joi.object({
  vacancyId: Joi.string().required().messages({
    'any.required': 'Vacancy ID is required',
  }),
  resumeId: Joi.string().required().messages({
    'any.required': 'Resume ID is required',
  }),
  coverLetter: Joi.string().max(2000).optional(),
  generateCoverLetter: Joi.boolean().optional().default(true),
});

// Telegram webhook schema
export const telegramWebhookSchema = Joi.object({
  update_id: Joi.number().required(),
  message: Joi.object().optional(),
  edited_message: Joi.object().optional(),
  channel_post: Joi.object().optional(),
  edited_channel_post: Joi.object().optional(),
  inline_query: Joi.object().optional(),
  chosen_inline_result: Joi.object().optional(),
  callback_query: Joi.object().optional(),
  shipping_query: Joi.object().optional(),
  pre_checkout_query: Joi.object().optional(),
  poll: Joi.object().optional(),
  poll_answer: Joi.object().optional(),
  my_chat_member: Joi.object().optional(),
  chat_member: Joi.object().optional(),
  chat_join_request: Joi.object().optional(),
});

// Query parameters validation schemas
export const paginationSchema = Joi.object({
  page: Joi.number().min(1).optional().default(1),
  limit: Joi.number().min(1).max(100).optional().default(20),
});

export const applicationFiltersSchema = Joi.object({
  status: Joi.string().valid('SENT', 'VIEWED', 'RESPONDED', 'REJECTED', 'INVITED').optional(),
  dateFrom: Joi.date().optional(),
  dateTo: Joi.date().optional(),
  companyName: Joi.string().trim().optional(),
  position: Joi.string().trim().optional(),
}).extend(paginationSchema.describe().keys);

export const messageFiltersSchema = Joi.object({
  isRead: Joi.boolean().optional(),
  fromRecruiter: Joi.boolean().optional(),
  dateFrom: Joi.date().optional(),
  dateTo: Joi.date().optional(),
}).extend(paginationSchema.describe().keys);

/**
 * Query validation middleware
 */
export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      const errorMessages = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      logger.warn('Query validation error:', { errorMessages, query: req.query });

      res.status(400).json({
        success: false,
        error: 'Query validation failed',
        details: errorMessages,
      });
      return;
    }

    req.query = value;
    next();
  };
};

/**
 * Sanitization middleware
 */
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  // Basic sanitization for string inputs
  const sanitizeObject = (obj: any): any => {
    if (typeof obj === 'string') {
      return obj.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    }
    
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }
    
    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      Object.keys(obj).forEach(key => {
        sanitized[key] = sanitizeObject(obj[key]);
      });
      return sanitized;
    }
    
    return obj;
  };

  req.body = sanitizeObject(req.body);
  req.query = sanitizeObject(req.query);
  
  next();
};