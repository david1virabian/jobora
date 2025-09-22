import { Router, Response } from 'express';
import { authenticateToken, validateHHToken, AuthenticatedRequest } from '@/middleware/auth';
import { validate, validateQuery, applicationSchema, applicationFiltersSchema } from '@/middleware/validation';
import { asyncHandler } from '@/middleware/errorHandler';
import prisma from '@/config/database';
import { HHruService } from '@/integrations/hhru';
import { OpenAIService } from '@/integrations/openai';
import { logger } from '@/utils/logger';

const router = Router();
const hhService = new HHruService();
const openaiService = new OpenAIService();

/**
 * @route GET /api/applications
 * @desc Get user's applications with pagination and filters
 * @access Private
 */
router.get('/', authenticateToken, validateQuery(applicationFiltersSchema), asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { page = 1, limit = 20, status, dateFrom, dateTo, companyName, position } = req.query as any;

  const where: any = { userId };

  if (status) {
    where.status = status;
  }

  if (dateFrom || dateTo) {
    where.appliedAt = {};
    if (dateFrom) where.appliedAt.gte = new Date(dateFrom);
    if (dateTo) where.appliedAt.lte = new Date(dateTo);
  }

  if (companyName) {
    where.companyName = {
      contains: companyName,
      mode: 'insensitive',
    };
  }

  if (position) {
    where.vacancyTitle = {
      contains: position,
      mode: 'insensitive',
    };
  }

  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where,
      orderBy: { appliedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        messages: {
          where: { fromRecruiter: true },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    }),
    prisma.application.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  res.json({
    success: true,
    data: {
      applications,
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
 * @route GET /api/applications/stats
 * @desc Get user's application statistics
 * @access Private
 */
router.get('/stats', authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalApplications,
    todayApplications,
    weekApplications,
    monthApplications,
    statusStats,
    responseRate,
  ] = await Promise.all([
    prisma.application.count({ where: { userId } }),
    prisma.application.count({ where: { userId, appliedAt: { gte: today } } }),
    prisma.application.count({ where: { userId, appliedAt: { gte: weekAgo } } }),
    prisma.application.count({ where: { userId, appliedAt: { gte: monthAgo } } }),
    prisma.application.groupBy({
      by: ['status'],
      where: { userId },
      _count: { status: true },
    }),
    prisma.application.count({
      where: {
        userId,
        status: { in: ['RESPONDED', 'INVITED'] },
      },
    }),
  ]);

  const responseRatePercentage = totalApplications > 0 ? Math.round((responseRate / totalApplications) * 100) : 0;

  res.json({
    success: true,
    data: {
      total: totalApplications,
      today: todayApplications,
      week: weekApplications,
      month: monthApplications,
      statusBreakdown: statusStats.reduce((acc, stat) => {
        acc[stat.status] = stat._count.status;
        return acc;
      }, {} as Record<string, number>),
      responseRate: responseRatePercentage,
    },
  });
}));

/**
 * @route GET /api/applications/:id
 * @desc Get application details
 * @access Private
 */
router.get('/:id', authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const applicationId = req.params.id;

  const application = await prisma.application.findFirst({
    where: { id: applicationId, userId },
    include: {
      messages: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!application) {
    return res.status(404).json({
      success: false,
      error: 'Application not found',
    });
  }

  res.json({
    success: true,
    data: { application },
  });
}));

/**
 * @route POST /api/applications
 * @desc Apply to a vacancy
 * @access Private
 */
router.post('/', authenticateToken, validateHHToken, validate(applicationSchema), asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { vacancyId, resumeId, coverLetter, generateCoverLetter } = req.body;

  // Get user's HH.ru access token
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { hhAccessToken: true },
  });

  if (!user?.hhAccessToken) {
    return res.status(401).json({
      success: false,
      error: 'HH.ru authorization required',
    });
  }

  // Set HH.ru access token
  hhService.setAccessToken(user.hhAccessToken);

  // Get vacancy details
  const vacancy = await hhService.getVacancyDetails(vacancyId);

  // Check if user already applied to this vacancy
  const existingApplication = await prisma.application.findFirst({
    where: { userId, hhVacancyId: vacancyId },
  });

  if (existingApplication) {
    return res.status(409).json({
      success: false,
      error: 'You have already applied to this vacancy',
    });
  }

  let finalCoverLetter = coverLetter;

  // Generate cover letter if requested
  if (generateCoverLetter && !coverLetter) {
    try {
      // Get user preferences for experience and skills
      const userPreferences = await prisma.userPreferences.findUnique({
        where: { userId },
      });

      finalCoverLetter = await openaiService.generateCoverLetter({
        vacancyTitle: vacancy.name,
        companyName: vacancy.employer.name,
        requirements: vacancy.snippet.requirement || undefined,
        responsibilities: vacancy.snippet.responsibility || undefined,
        userExperience: userPreferences?.desiredExperience || 'middle',
        userSkills: [], // You might want to store user skills in preferences
        additionalInfo: userPreferences?.coverLetterTemplate || undefined,
      });
    } catch (error) {
      logger.warn('Failed to generate cover letter, proceeding without it:', error);
    }
  }

  // Apply to the vacancy
  const hhApplication = await hhService.applyToVacancy(vacancyId, resumeId, finalCoverLetter);

  // Save application to database
  const application = await prisma.application.create({
    data: {
      userId,
      hhVacancyId: vacancyId,
      hhApplicationId: hhApplication.id,
      vacancyTitle: vacancy.name,
      companyName: vacancy.employer.name,
      salaryFrom: vacancy.salary?.from || null,
      salaryTo: vacancy.salary?.to || null,
      salaryCurrency: vacancy.salary?.currency || null,
      location: vacancy.area.name,
      experience: vacancy.experience.name,
      schedule: vacancy.schedule.name,
      employment: vacancy.employment.name,
      description: vacancy.description,
      requirements: vacancy.snippet.requirement,
      responsibilities: vacancy.snippet.responsibility,
      coverLetter: finalCoverLetter,
      status: 'SENT',
    },
  });

  logger.info('Application submitted successfully', {
    userId,
    applicationId: application.id,
    vacancyId,
    companyName: vacancy.employer.name,
  });

  res.status(201).json({
    success: true,
    message: 'Application submitted successfully',
    data: { application },
  });
}));

/**
 * @route PATCH /api/applications/:id/status
 * @desc Update application status (for sync with HH.ru)
 * @access Private
 */
router.patch('/:id/status', authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const applicationId = req.params.id;
  const { status, viewedAt, respondedAt, rejectedAt } = req.body;

  const application = await prisma.application.findFirst({
    where: { id: applicationId, userId },
  });

  if (!application) {
    return res.status(404).json({
      success: false,
      error: 'Application not found',
    });
  }

  const updateData: any = {};

  if (status) {
    updateData.status = status;
  }

  if (viewedAt) {
    updateData.viewedAt = new Date(viewedAt);
  }

  if (respondedAt) {
    updateData.respondedAt = new Date(respondedAt);
  }

  if (rejectedAt) {
    updateData.rejectedAt = new Date(rejectedAt);
  }

  const updatedApplication = await prisma.application.update({
    where: { id: applicationId },
    data: updateData,
  });

  res.json({
    success: true,
    message: 'Application status updated',
    data: { application: updatedApplication },
  });
}));

/**
 * @route DELETE /api/applications/:id
 * @desc Delete application (soft delete)
 * @access Private
 */
router.delete('/:id', authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const applicationId = req.params.id;

  const application = await prisma.application.findFirst({
    where: { id: applicationId, userId },
  });

  if (!application) {
    return res.status(404).json({
      success: false,
      error: 'Application not found',
    });
  }

  // For now, we'll just delete it. In a production app, you might want to soft delete
  await prisma.application.delete({
    where: { id: applicationId },
  });

  res.json({
    success: true,
    message: 'Application deleted successfully',
  });
}));

/**
 * @route POST /api/applications/sync
 * @desc Sync applications with HH.ru
 * @access Private
 */
router.post('/sync', authenticateToken, validateHHToken, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;

  // Get user's HH.ru access token
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { hhAccessToken: true },
  });

  if (!user?.hhAccessToken) {
    return res.status(401).json({
      success: false,
      error: 'HH.ru authorization required',
    });
  }

  hhService.setAccessToken(user.hhAccessToken);

  // Get applications from HH.ru
  const hhApplications = await hhService.getUserApplications();

  let syncedCount = 0;
  let updatedCount = 0;

  for (const hhApp of hhApplications.items) {
    const existingApp = await prisma.application.findFirst({
      where: { userId, hhApplicationId: hhApp.id },
    });

    if (existingApp) {
      // Update existing application status
      const statusMap: Record<string, any> = {
        'on_consideration': 'SENT',
        'viewed': 'VIEWED',
        'invitation': 'INVITED',
        'discard': 'REJECTED',
      };

      const newStatus = statusMap[hhApp.state.id] || existingApp.status;

      if (newStatus !== existingApp.status) {
        await prisma.application.update({
          where: { id: existingApp.id },
          data: {
            status: newStatus,
            viewedAt: hhApp.viewed_by_employer ? new Date() : existingApp.viewedAt,
          },
        });
        updatedCount++;
      }
    } else {
      // This shouldn't happen if we're tracking properly, but just in case
      logger.warn('Found HH.ru application not in our database', {
        hhApplicationId: hhApp.id,
        userId,
      });
    }

    syncedCount++;
  }

  res.json({
    success: true,
    message: 'Applications synced successfully',
    data: {
      totalSynced: syncedCount,
      totalUpdated: updatedCount,
    },
  });
}));

export default router;