import { Router, Response } from 'express';
import { authenticateToken, AuthenticatedRequest } from '@/middleware/auth';
import { asyncHandler } from '@/middleware/errorHandler';
import prisma from '@/config/database';

const router = Router();

/**
 * @route GET /api/user/preferences
 * @desc Get user preferences
 * @access Private
 */
router.get('/preferences', authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;

  let preferences = await prisma.userPreferences.findUnique({
    where: { userId },
  });

  if (!preferences) {
    // Create default preferences
    preferences = await prisma.userPreferences.create({
      data: {
        userId,
        autoApplyEnabled: false,
        maxApplicationsPerDay: 10,
      },
    });
  }

  // Convert JSON strings back to arrays for SQLite
  const responsePreferences = {
    ...preferences,
    desiredPositions: preferences.desiredPositions ? JSON.parse(preferences.desiredPositions) : [],
    desiredLocations: preferences.desiredLocations ? JSON.parse(preferences.desiredLocations) : [],
    desiredSchedule: preferences.desiredSchedule ? JSON.parse(preferences.desiredSchedule) : [],
    desiredEmployment: preferences.desiredEmployment ? JSON.parse(preferences.desiredEmployment) : [],
    excludeCompanies: preferences.excludeCompanies ? JSON.parse(preferences.excludeCompanies) : [],
    excludeKeywords: preferences.excludeKeywords ? JSON.parse(preferences.excludeKeywords) : [],
    includeKeywords: preferences.includeKeywords ? JSON.parse(preferences.includeKeywords) : [],
  };

  res.json({
    success: true,
    data: { preferences: responsePreferences },
  });
}));

/**
 * @route PUT /api/user/preferences
 * @desc Update user preferences
 * @access Private
 */
router.put('/preferences', authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const updates = req.body;

  // Convert arrays to JSON strings for SQLite
  const processedUpdates = {
    ...updates,
    desiredPositions: updates.desiredPositions ? JSON.stringify(updates.desiredPositions) : undefined,
    desiredLocations: updates.desiredLocations ? JSON.stringify(updates.desiredLocations) : undefined,
    desiredSchedule: updates.desiredSchedule ? JSON.stringify(updates.desiredSchedule) : undefined,
    desiredEmployment: updates.desiredEmployment ? JSON.stringify(updates.desiredEmployment) : undefined,
    excludeCompanies: updates.excludeCompanies ? JSON.stringify(updates.excludeCompanies) : undefined,
    excludeKeywords: updates.excludeKeywords ? JSON.stringify(updates.excludeKeywords) : undefined,
    includeKeywords: updates.includeKeywords ? JSON.stringify(updates.includeKeywords) : undefined,
  };

  const preferences = await prisma.userPreferences.upsert({
    where: { userId },
    update: processedUpdates,
    create: {
      userId,
      ...processedUpdates,
      autoApplyEnabled: false,
      maxApplicationsPerDay: 10,
    },
  });

  res.json({
    success: true,
    message: 'Preferences updated successfully',
    data: { preferences },
  });
}));

export default router;