import axios, { AxiosInstance } from 'axios';
import { config } from '@/config/env';
import { logger } from '@/utils/logger';
import {
  HHVacancy,
  HHVacancyDetails,
  HHSearchParams,
  HHSearchResponse,
  HHApplication,
  HHUser,
} from '@/types';

export class HHruService {
  private api: AxiosInstance;
  private accessToken: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: config.hh.apiUrl,
      headers: {
        'User-Agent': 'Jobora/1.0 (job search assistant)',
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth header
    this.api.interceptors.request.use((config) => {
      if (this.accessToken) {
        config.headers.Authorization = `Bearer ${this.accessToken}`;
      }
      return config;
    });

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        logger.error('HH.ru API Error:', {
          status: error.response?.status,
          data: error.response?.data,
          config: {
            method: error.config?.method,
            url: error.config?.url,
          },
        });
        throw error;
      }
    );
  }

  /**
   * Set access token for authenticated requests
   */
  setAccessToken(token: string) {
    this.accessToken = token;
  }

  /**
   * Get authorization URL for OAuth flow
   */
  getAuthUrl(state?: string): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: config.hh.clientId,
      redirect_uri: config.hh.redirectUri,
      scope: 'read_vacancies',
    });

    if (state) {
      params.append('state', state);
    }

    return `https://hh.ru/oauth/authorize?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async getAccessToken(code: string): Promise<{
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
  }> {
    try {
      const response = await axios.post('https://hh.ru/oauth/token', {
        grant_type: 'authorization_code',
        client_id: config.hh.clientId,
        client_secret: config.hh.clientSecret,
        code,
        redirect_uri: config.hh.redirectUri,
      });

      logger.info('Successfully obtained HH.ru access token');
      return response.data;
    } catch (error) {
      logger.error('Failed to get HH.ru access token:', error);
      throw new Error('Failed to obtain access token from HH.ru');
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken: string): Promise<{
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
  }> {
    try {
      const response = await axios.post('https://hh.ru/oauth/token', {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      });

      logger.info('Successfully refreshed HH.ru access token');
      return response.data;
    } catch (error) {
      logger.error('Failed to refresh HH.ru access token:', error);
      throw new Error('Failed to refresh access token');
    }
  }

  /**
   * Get current user info
   */
  async getCurrentUser(): Promise<HHUser> {
    try {
      const response = await this.api.get('/me');
      return response.data;
    } catch (error) {
      logger.error('Failed to get current user from HH.ru:', error);
      throw new Error('Failed to get user information');
    }
  }

  /**
   * Search for vacancies
   */
  async searchVacancies(params: HHSearchParams): Promise<HHSearchResponse> {
    try {
      const searchParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, v.toString()));
          } else {
            searchParams.append(key, value.toString());
          }
        }
      });

      const response = await this.api.get(`/vacancies?${searchParams.toString()}`);
      
      logger.info('HH.ru vacancy search completed', {
        found: response.data.found,
        page: response.data.page,
        per_page: response.data.per_page,
      });

      return response.data;
    } catch (error) {
      logger.error('Failed to search vacancies on HH.ru:', error);
      throw new Error('Failed to search vacancies');
    }
  }

  /**
   * Get vacancy details by ID
   */
  async getVacancyDetails(vacancyId: string): Promise<HHVacancyDetails> {
    try {
      const response = await this.api.get(`/vacancies/${vacancyId}`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to get vacancy details for ID ${vacancyId}:`, error);
      throw new Error('Failed to get vacancy details');
    }
  }

  /**
   * Apply to a vacancy
   */
  async applyToVacancy(
    vacancyId: string,
    resumeId: string,
    coverLetter?: string
  ): Promise<{ id: string }> {
    try {
      const payload: any = {
        vacancy_id: vacancyId,
        resume_id: resumeId,
      };

      if (coverLetter) {
        payload.message = coverLetter;
      }

      const response = await this.api.post('/negotiations', payload);
      
      logger.info('Successfully applied to vacancy', {
        vacancyId,
        applicationId: response.data.id,
      });

      return response.data;
    } catch (error) {
      logger.error(`Failed to apply to vacancy ${vacancyId}:`, error);
      throw new Error('Failed to apply to vacancy');
    }
  }

  /**
   * Get user's applications
   */
  async getUserApplications(page = 0, perPage = 20): Promise<{
    items: HHApplication[];
    found: number;
    pages: number;
    per_page: number;
    page: number;
  }> {
    try {
      const response = await this.api.get('/negotiations', {
        params: {
          page,
          per_page: perPage,
        },
      });

      return response.data;
    } catch (error) {
      logger.error('Failed to get user applications:', error);
      throw new Error('Failed to get applications');
    }
  }

  /**
   * Get user's resumes
   */
  async getUserResumes(): Promise<Array<{
    id: string;
    title: string;
    url: string;
    created_at: string;
    updated_at: string;
    status: {
      id: string;
      name: string;
    };
  }>> {
    try {
      const response = await this.api.get('/resumes/mine');
      return response.data.items || [];
    } catch (error) {
      logger.error('Failed to get user resumes:', error);
      throw new Error('Failed to get resumes');
    }
  }

  /**
   * Get areas (cities/regions)
   */
  async getAreas(): Promise<Array<{
    id: string;
    parent_id: string | null;
    name: string;
    areas: any[];
  }>> {
    try {
      const response = await this.api.get('/areas');
      return response.data;
    } catch (error) {
      logger.error('Failed to get areas:', error);
      throw new Error('Failed to get areas');
    }
  }

  /**
   * Get specializations
   */
  async getSpecializations(): Promise<Array<{
    id: string;
    name: string;
    specializations: Array<{
      id: string;
      name: string;
      profarea_id: string;
    }>;
  }>> {
    try {
      const response = await this.api.get('/specializations');
      return response.data;
    } catch (error) {
      logger.error('Failed to get specializations:', error);
      throw new Error('Failed to get specializations');
    }
  }

  /**
   * Get dictionaries (experience, employment, schedule, etc.)
   */
  async getDictionaries(): Promise<{
    experience: Array<{ id: string; name: string }>;
    employment: Array<{ id: string; name: string }>;
    schedule: Array<{ id: string; name: string }>;
    currency: Array<{ code: string; name: string }>;
    education_level: Array<{ id: string; name: string }>;
    language_level: Array<{ id: string; name: string }>;
    working_days: Array<{ id: string; name: string }>;
    working_time_intervals: Array<{ id: string; name: string }>;
    working_time_modes: Array<{ id: string; name: string }>;
  }> {
    try {
      const response = await this.api.get('/dictionaries');
      return response.data;
    } catch (error) {
      logger.error('Failed to get dictionaries:', error);
      throw new Error('Failed to get dictionaries');
    }
  }
}