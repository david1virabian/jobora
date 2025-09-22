import { Router, Request, Response } from 'express';
import { AuthService } from '@/services/authService';
import { authenticateToken, AuthenticatedRequest } from '@/middleware/auth';
import { validate, registerSchema, loginSchema } from '@/middleware/validation';
import { asyncHandler } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';

const router = Router();
const authService = new AuthService();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', validate(registerSchema), asyncHandler(async (req: Request, res: Response) => {
  const { user, tokens } = await authService.register(req.body);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user,
      tokens,
    },
  });
}));

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 */
router.post('/login', validate(loginSchema), asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { user, tokens } = await authService.login(email, password);

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user,
      tokens,
    },
  });
}));

/**
 * @route POST /api/auth/refresh
 * @desc Refresh access token
 * @access Public
 */
router.post('/refresh', asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      error: 'Refresh token is required',
    });
  }

  const tokens = await authService.refreshToken(refreshToken);

  res.json({
    success: true,
    message: 'Token refreshed successfully',
    data: { tokens },
  });
}));

/**
 * @route POST /api/auth/logout
 * @desc Logout user (currently just client-side)
 * @access Private
 */
router.post('/logout', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  // In a more sophisticated implementation, you might:
  // 1. Blacklist the token
  // 2. Clear server-side sessions
  // 3. Invalidate refresh tokens

  res.json({
    success: true,
    message: 'Logout successful',
  });
});

/**
 * @route GET /api/auth/me
 * @desc Get current user profile
 * @access Private
 */
router.get('/me', authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = await authService.getProfile(req.user!.id);

  res.json({
    success: true,
    data: { user },
  });
}));

/**
 * @route PUT /api/auth/profile
 * @desc Update user profile
 * @access Private
 */
router.put('/profile', authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { firstName, lastName, phone } = req.body;
  
  const user = await authService.updateProfile(req.user!.id, {
    firstName,
    lastName,
    phone,
  });

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: { user },
  });
}));

/**
 * @route POST /api/auth/change-password
 * @desc Change user password
 * @access Private
 */
router.post('/change-password', authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      error: 'Current password and new password are required',
    });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({
      success: false,
      error: 'New password must be at least 8 characters long',
    });
  }

  await authService.changePassword(req.user!.id, currentPassword, newPassword);

  res.json({
    success: true,
    message: 'Password changed successfully',
  });
}));

/**
 * @route POST /api/auth/link-telegram
 * @desc Link Telegram account
 * @access Private
 */
router.post('/link-telegram', authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { telegramUserId } = req.body;

  if (!telegramUserId) {
    return res.status(400).json({
      success: false,
      error: 'Telegram user ID is required',
    });
  }

  await authService.linkTelegram(req.user!.id, telegramUserId.toString());

  res.json({
    success: true,
    message: 'Telegram account linked successfully',
  });
}));

/**
 * @route DELETE /api/auth/unlink-telegram
 * @desc Unlink Telegram account
 * @access Private
 */
router.delete('/unlink-telegram', authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  await authService.unlinkTelegram(req.user!.id);

  res.json({
    success: true,
    message: 'Telegram account unlinked successfully',
  });
}));

/**
 * @route GET /api/auth/hh/authorize
 * @desc Get HH.ru authorization URL
 * @access Private
 */
router.get('/hh/authorize', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const authUrl = authService.getHHAuthUrl(req.user!.id);

  res.json({
    success: true,
    data: { authUrl },
  });
});

/**
 * @route GET /api/auth/hh/callback
 * @desc Handle HH.ru OAuth callback
 * @access Public (but requires state parameter)
 */
router.get('/hh/callback', asyncHandler(async (req: Request, res: Response) => {
  const { code, state } = req.query;

  if (!code || !state) {
    return res.status(400).json({
      success: false,
      error: 'Authorization code and state are required',
    });
  }

  try {
    await authService.handleHHCallback(state as string, code as string);
    
    // Redirect to frontend with success
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/hh/success`);
  } catch (error) {
    logger.error('HH.ru callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/hh/error`);
  }
}));

/**
 * @route DELETE /api/auth/hh/disconnect
 * @desc Disconnect HH.ru account
 * @access Private
 */
router.delete('/hh/disconnect', authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  await authService.disconnectHH(req.user!.id);

  res.json({
    success: true,
    message: 'HH.ru account disconnected successfully',
  });
}));

/**
 * @route POST /api/auth/hh/refresh-token
 * @desc Refresh HH.ru access token
 * @access Private
 */
router.post('/hh/refresh-token', authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  await authService.refreshHHToken(req.user!.id);

  res.json({
    success: true,
    message: 'HH.ru token refreshed successfully',
  });
}));

export default router;