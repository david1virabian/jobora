import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '@/config/env';
import { logger } from '@/utils/logger';
import prisma from '@/config/database';
import { HHruService } from '@/integrations/hhru';
import { createError, createAuthError, createConflictError } from '@/middleware/errorHandler';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  telegramUserId?: string;
  hhConnected: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class AuthService {
  private hhService: HHruService;

  constructor() {
    this.hhService = new HHruService();
  }

  /**
   * Register a new user
   */
  async register(userData: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    telegramUserId?: string;
  }): Promise<{ user: UserProfile; tokens: AuthTokens }> {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (existingUser) {
        throw createConflictError('User with this email already exists');
      }

      // Check Telegram user if provided
      if (userData.telegramUserId) {
        const existingTelegramUser = await prisma.user.findUnique({
          where: { telegramUserId: userData.telegramUserId },
        });

        if (existingTelegramUser) {
          throw createConflictError('This Telegram account is already linked to another user');
        }
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      // Create user
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          password: hashedPassword,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          telegramUserId: userData.telegramUserId,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          telegramUserId: true,
          hhAccessToken: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      // Create default preferences
      await prisma.userPreferences.create({
        data: {
          userId: user.id,
          autoApplyEnabled: false,
          maxApplicationsPerDay: 10,
        },
      });

      // Generate tokens
      const tokens = this.generateTokens(user.id, user.email);

      const userProfile: UserProfile = {
        ...user,
        hhConnected: !!user.hhAccessToken,
      };

      logger.info('User registered successfully', {
        userId: user.id,
        email: user.email,
        telegramConnected: !!userData.telegramUserId,
      });

      return { user: userProfile, tokens };
    } catch (error) {
      logger.error('User registration failed:', error);
      throw error;
    }
  }

  /**
   * Login user
   */
  async login(email: string, password: string): Promise<{ user: UserProfile; tokens: AuthTokens }> {
    try {
      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          password: true,
          firstName: true,
          lastName: true,
          phone: true,
          telegramUserId: true,
          hhAccessToken: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw createAuthError('Invalid email or password');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw createAuthError('Invalid email or password');
      }

      // Generate tokens
      const tokens = this.generateTokens(user.id, user.email);

      const userProfile: UserProfile = {
        id: user.id,
        email: user.email,
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
        phone: user.phone || undefined,
        telegramUserId: user.telegramUserId || undefined,
        hhConnected: !!user.hhAccessToken,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      logger.info('User logged in successfully', {
        userId: user.id,
        email: user.email,
      });

      return { user: userProfile, tokens };
    } catch (error) {
      logger.error('User login failed:', error);
      throw error;
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      const decoded = jwt.verify(refreshToken, config.jwtSecret) as {
        userId: string;
        email: string;
        type: string;
      };

      if (decoded.type !== 'refresh') {
        throw createAuthError('Invalid refresh token');
      }

      // Verify user still exists
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true },
      });

      if (!user) {
        throw createAuthError('User not found');
      }

      // Generate new tokens
      const tokens = this.generateTokens(user.id, user.email);

      logger.info('Token refreshed successfully', { userId: user.id });

      return tokens;
    } catch (error) {
      logger.error('Token refresh failed:', error);
      if (error instanceof jwt.JsonWebTokenError) {
        throw createAuthError('Invalid refresh token');
      }
      throw error;
    }
  }

  /**
   * Get user profile
   */
  async getProfile(userId: string): Promise<UserProfile> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          telegramUserId: true,
          hhAccessToken: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw createError('User not found', 404);
      }

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
        phone: user.phone || undefined,
        telegramUserId: user.telegramUserId || undefined,
        hhConnected: !!user.hhAccessToken,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      logger.error('Get profile failed:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    updates: {
      firstName?: string;
      lastName?: string;
      phone?: string;
    }
  ): Promise<UserProfile> {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: updates,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          telegramUserId: true,
          hhAccessToken: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      logger.info('Profile updated successfully', { userId });

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
        phone: user.phone || undefined,
        telegramUserId: user.telegramUserId || undefined,
        hhConnected: !!user.hhAccessToken,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      logger.error('Profile update failed:', error);
      throw error;
    }
  }

  /**
   * Change password
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { password: true },
      });

      if (!user) {
        throw createError('User not found', 404);
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        throw createAuthError('Current password is incorrect');
      }

      // Hash new password
      const saltRounds = 12;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update password
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedNewPassword },
      });

      logger.info('Password changed successfully', { userId });
    } catch (error) {
      logger.error('Password change failed:', error);
      throw error;
    }
  }

  /**
   * Link Telegram account
   */
  async linkTelegram(userId: string, telegramUserId: string): Promise<void> {
    try {
      // Check if Telegram account is already linked to another user
      const existingTelegramUser = await prisma.user.findUnique({
        where: { telegramUserId },
      });

      if (existingTelegramUser && existingTelegramUser.id !== userId) {
        throw createConflictError('This Telegram account is already linked to another user');
      }

      await prisma.user.update({
        where: { id: userId },
        data: { telegramUserId },
      });

      logger.info('Telegram account linked successfully', { userId, telegramUserId });
    } catch (error) {
      logger.error('Telegram linking failed:', error);
      throw error;
    }
  }

  /**
   * Unlink Telegram account
   */
  async unlinkTelegram(userId: string): Promise<void> {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { telegramUserId: null },
      });

      logger.info('Telegram account unlinked successfully', { userId });
    } catch (error) {
      logger.error('Telegram unlinking failed:', error);
      throw error;
    }
  }

  /**
   * Get HH.ru authorization URL
   */
  getHHAuthUrl(userId: string): string {
    return this.hhService.getAuthUrl(userId);
  }

  /**
   * Handle HH.ru OAuth callback
   */
  async handleHHCallback(userId: string, code: string): Promise<void> {
    try {
      // Exchange code for tokens
      const tokenData = await this.hhService.getAccessToken(code);

      // Calculate expiration date
      const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);

      // Save tokens to user
      await prisma.user.update({
        where: { id: userId },
        data: {
          hhAccessToken: tokenData.access_token,
          hhRefreshToken: tokenData.refresh_token,
          hhTokenExpiresAt: expiresAt,
        },
      });

      // Get and save HH user info
      this.hhService.setAccessToken(tokenData.access_token);
      const hhUser = await this.hhService.getCurrentUser();

      await prisma.user.update({
        where: { id: userId },
        data: { hhUserId: hhUser.id },
      });

      logger.info('HH.ru account connected successfully', { userId, hhUserId: hhUser.id });
    } catch (error) {
      logger.error('HH.ru callback handling failed:', error);
      throw error;
    }
  }

  /**
   * Refresh HH.ru token if needed
   */
  async refreshHHToken(userId: string): Promise<void> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          hhRefreshToken: true,
          hhTokenExpiresAt: true,
        },
      });

      if (!user?.hhRefreshToken) {
        throw createError('HH.ru refresh token not found', 404);
      }

      // Check if token needs refresh (refresh 5 minutes before expiry)
      const needsRefresh = user.hhTokenExpiresAt && 
        new Date(Date.now() + 5 * 60 * 1000) > user.hhTokenExpiresAt;

      if (needsRefresh) {
        const tokenData = await this.hhService.refreshAccessToken(user.hhRefreshToken);
        const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);

        await prisma.user.update({
          where: { id: userId },
          data: {
            hhAccessToken: tokenData.access_token,
            hhRefreshToken: tokenData.refresh_token,
            hhTokenExpiresAt: expiresAt,
          },
        });

        logger.info('HH.ru token refreshed successfully', { userId });
      }
    } catch (error) {
      logger.error('HH.ru token refresh failed:', error);
      throw error;
    }
  }

  /**
   * Disconnect HH.ru account
   */
  async disconnectHH(userId: string): Promise<void> {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          hhAccessToken: null,
          hhRefreshToken: null,
          hhTokenExpiresAt: null,
          hhUserId: null,
        },
      });

      logger.info('HH.ru account disconnected successfully', { userId });
    } catch (error) {
      logger.error('HH.ru disconnection failed:', error);
      throw error;
    }
  }

  /**
   * Generate JWT tokens
   */
  private generateTokens(userId: string, email: string): AuthTokens {
    const accessToken = jwt.sign(
      { userId, email, type: 'access' },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    const refreshToken = jwt.sign(
      { userId, email, type: 'refresh' },
      config.jwtSecret,
      { expiresIn: '30d' }
    );

    const decoded = jwt.decode(accessToken) as { exp: number };
    const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);

    return {
      accessToken,
      refreshToken,
      expiresIn,
    };
  }
}