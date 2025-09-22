import { Router, Response } from 'express';
import { authenticateToken, AuthenticatedRequest } from '@/middleware/auth';
import { validateQuery, messageFiltersSchema } from '@/middleware/validation';
import { asyncHandler } from '@/middleware/errorHandler';
import prisma from '@/config/database';

const router = Router();

/**
 * @route GET /api/messages
 * @desc Get user's messages with pagination and filters
 * @access Private
 */
router.get('/', authenticateToken, validateQuery(messageFiltersSchema), asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { page = 1, limit = 20, isRead, fromRecruiter, dateFrom, dateTo } = req.query as any;

  const where: any = { userId };

  if (typeof isRead === 'boolean') {
    where.isRead = isRead;
  }

  if (typeof fromRecruiter === 'boolean') {
    where.fromRecruiter = fromRecruiter;
  }

  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom) where.createdAt.gte = new Date(dateFrom);
    if (dateTo) where.createdAt.lte = new Date(dateTo);
  }

  const [messages, total] = await Promise.all([
    prisma.message.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        application: {
          select: {
            id: true,
            vacancyTitle: true,
            companyName: true,
          },
        },
      },
    }),
    prisma.message.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  res.json({
    success: true,
    data: {
      messages,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    },
  });
}));

/**
 * @route GET /api/messages/:id
 * @desc Get message details
 * @access Private
 */
router.get('/:id', authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const messageId = req.params.id;

  const message = await prisma.message.findFirst({
    where: { id: messageId, userId },
    include: {
      application: true,
    },
  });

  if (!message) {
    return res.status(404).json({
      success: false,
      error: 'Message not found',
    });
  }

  res.json({
    success: true,
    data: { message },
  });
}));

/**
 * @route PATCH /api/messages/:id/read
 * @desc Mark message as read
 * @access Private
 */
router.patch('/:id/read', authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const messageId = req.params.id;

  const message = await prisma.message.findFirst({
    where: { id: messageId, userId },
  });

  if (!message) {
    return res.status(404).json({
      success: false,
      error: 'Message not found',
    });
  }

  await prisma.message.update({
    where: { id: messageId },
    data: { isRead: true },
  });

  res.json({
    success: true,
    message: 'Message marked as read',
  });
}));

/**
 * @route POST /api/messages/mark-all-read
 * @desc Mark all messages as read
 * @access Private
 */
router.post('/mark-all-read', authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;

  const result = await prisma.message.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });

  res.json({
    success: true,
    message: `${result.count} messages marked as read`,
    data: { count: result.count },
  });
}));

/**
 * @route GET /api/messages/unread/count
 * @desc Get unread messages count
 * @access Private
 */
router.get('/unread/count', authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;

  const count = await prisma.message.count({
    where: { userId, isRead: false },
  });

  res.json({
    success: true,
    data: { count },
  });
}));

export default router;