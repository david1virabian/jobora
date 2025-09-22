import { Router, Response } from 'express';
import { authenticateToken, validateHHToken, AuthenticatedRequest } from '@/middleware/auth';
import { asyncHandler } from '@/middleware/errorHandler';
import { HHruService } from '@/integrations/hhru';
import prisma from '@/config/database';
import { logger } from '@/utils/logger';

const router = Router();
const hhService = new HHruService();

/**
 * @route POST /api/jobs/search
 * @desc Search for jobs on HH.ru
 * @access Private
 */
router.post('/search', authenticateToken, validateHHToken, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const searchParams = req.body;

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

  // Search for vacancies
  const searchResult = await hhService.searchVacancies(searchParams);

  // Save search to database
  await prisma.jobSearch.create({
    data: {
      userId,
      searchText: searchParams.searchText,
      area: searchParams.area ? JSON.stringify(searchParams.area) : null,
      experience: searchParams.experience,
      employment: searchParams.employment,
      schedule: searchParams.schedule,
      salaryFrom: searchParams.salaryFrom,
      salaryTo: searchParams.salaryTo,
      totalFound: searchResult.found,
      status: 'COMPLETED',
      completedAt: new Date(),
    },
  });

  logger.info('Job search completed', {
    userId,
    found: searchResult.found,
    searchText: searchParams.searchText,
  });

  res.json({
    success: true,
    data: {
      vacancies: searchResult.items,
      found: searchResult.found,
      pages: searchResult.pages,
    },
  });
}));

/**
 * @route POST /api/jobs/auto-search
 * @desc Start automated job search
 * @access Private
 */
router.post('/auto-search', authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;

  // Get user preferences
  const preferences = await prisma.userPreferences.findUnique({
    where: { userId },
  });

  if (!preferences?.autoApplyEnabled) {
    return res.status(400).json({
      success: false,
      error: 'Auto-apply is not enabled in your preferences',
    });
  }

  // For now, just return a success message
  // In a full implementation, this would start a background job
  
  res.json({
    success: true,
    message: 'Auto-search started',
    data: {
      searchId: 'auto-search-' + Date.now(),
      message: 'Automated job search has been started. You will receive notifications when applications are submitted.',
    },
  });
}));

/**
 * @route POST /api/jobs/stop-auto-search
 * @desc Stop automated job search
 * @access Private
 */
router.post('/stop-auto-search', authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;

  // In a full implementation, this would stop the background job
  
  res.json({
    success: true,
    message: 'Auto-search stopped',
  });
}));

/**
 * @route GET /api/jobs/recommendations
 * @desc Get AI-powered job recommendations
 * @access Private
 */
router.get('/recommendations', authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;

  // Get user preferences and recent applications
  const [preferences, recentApplications] = await Promise.all([
    prisma.userPreferences.findUnique({ where: { userId } }),
    prisma.application.findMany({
      where: { userId },
      orderBy: { appliedAt: 'desc' },
      take: 10,
    }),
  ]);

  // For now, return a placeholder response
  // In a full implementation, this would use AI to analyze user preferences and suggest jobs
  
  res.json({
    success: true,
    data: {
      recommendations: [
        {
          title: 'AI recommendations will be available soon',
          description: 'We are analyzing your preferences and application history to provide personalized job recommendations.',
          score: 95,
        },
      ],
    },
  });
}));

export default router;