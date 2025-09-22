import axios, { AxiosInstance, AxiosResponse } from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  telegramUserId?: string
  hhConnected: boolean
  createdAt: string
  updatedAt: string
}

interface Application {
  id: string
  hhVacancyId: string
  hhApplicationId?: string
  vacancyTitle: string
  companyName: string
  salaryFrom?: number
  salaryTo?: number
  salaryCurrency?: string
  location?: string
  experience?: string
  schedule?: string
  employment?: string
  description?: string
  requirements?: string
  responsibilities?: string
  coverLetter?: string
  status: 'SENT' | 'VIEWED' | 'RESPONDED' | 'REJECTED' | 'INVITED'
  appliedAt: string
  viewedAt?: string
  respondedAt?: string
  rejectedAt?: string
}

interface Message {
  id: string
  fromRecruiter: boolean
  recruiterName?: string
  recruiterEmail?: string
  subject?: string
  content: string
  isRead: boolean
  createdAt: string
  application?: Application
}

interface JobSearchParams {
  searchText?: string
  area?: string[]
  experience?: string
  employment?: string
  schedule?: string
  salaryFrom?: number
  salaryTo?: number
  autoApply?: boolean
}

interface UserPreferences {
  desiredSalaryFrom?: number
  desiredSalaryTo?: number
  desiredPositions?: string[]
  desiredLocations?: string[]
  desiredExperience?: string
  desiredSchedule?: string[]
  desiredEmployment?: string[]
  autoApplyEnabled?: boolean
  maxApplicationsPerDay?: number
  coverLetterTemplate?: string
  excludeCompanies?: string[]
  excludeKeywords?: string[]
  includeKeywords?: string[]
}

class ApiClient {
  private axios: AxiosInstance
  private accessToken: string | null = null

  constructor() {
    this.axios = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
    this.loadTokenFromStorage()
  }

  private setupInterceptors() {
    // Request interceptor
    this.axios.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor
    this.axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            const refreshToken = this.getRefreshToken()
            if (refreshToken) {
              const response = await this.refreshToken(refreshToken)
              this.setTokens(response.data.tokens)
              return this.axios(originalRequest)
            }
          } catch (refreshError) {
            this.clearTokens()
            window.location.href = '/auth/login'
          }
        }

        return Promise.reject(error)
      }
    )
  }

  private loadTokenFromStorage() {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken')
      if (token) {
        this.accessToken = token
      }
    }
  }

  private setTokens(tokens: AuthTokens) {
    this.accessToken = tokens.accessToken
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', tokens.accessToken)
      localStorage.setItem('refreshToken', tokens.refreshToken)
    }
  }

  private getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refreshToken')
    }
    return null
  }

  private clearTokens() {
    this.accessToken = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    }
  }

  // Authentication endpoints
  async register(userData: {
    email: string
    password: string
    firstName?: string
    lastName?: string
    phone?: string
  }): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> {
    const response = await this.axios.post('/auth/register', userData)
    if (response.data.success) {
      this.setTokens(response.data.data.tokens)
    }
    return response.data
  }

  async login(email: string, password: string): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> {
    const response = await this.axios.post('/auth/login', { email, password })
    if (response.data.success) {
      this.setTokens(response.data.data.tokens)
    }
    return response.data
  }

  async refreshToken(refreshToken: string): Promise<ApiResponse<{ tokens: AuthTokens }>> {
    const response = await this.axios.post('/auth/refresh', { refreshToken })
    return response.data
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.axios.post('/auth/logout')
    this.clearTokens()
    return response.data
  }

  async getProfile(): Promise<ApiResponse<{ user: User }>> {
    const response = await this.axios.get('/auth/me')
    return response.data
  }

  async updateProfile(updates: {
    firstName?: string
    lastName?: string
    phone?: string
  }): Promise<ApiResponse<{ user: User }>> {
    const response = await this.axios.put('/auth/profile', updates)
    return response.data
  }

  // HH.ru integration
  async getHHAuthUrl(): Promise<ApiResponse<{ authUrl: string }>> {
    const response = await this.axios.get('/auth/hh/authorize')
    return response.data
  }

  async disconnectHH(): Promise<ApiResponse> {
    const response = await this.axios.delete('/auth/hh/disconnect')
    return response.data
  }

  // Applications
  async getApplications(params?: {
    page?: number
    limit?: number
    status?: string
    dateFrom?: string
    dateTo?: string
    companyName?: string
    position?: string
  }): Promise<ApiResponse<{
    applications: Application[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }>> {
    const response = await this.axios.get('/applications', { params })
    return response.data
  }

  async getApplicationStats(): Promise<ApiResponse<{
    total: number
    today: number
    week: number
    month: number
    statusBreakdown: Record<string, number>
    responseRate: number
  }>> {
    const response = await this.axios.get('/applications/stats')
    return response.data
  }

  async getApplication(id: string): Promise<ApiResponse<{ application: Application }>> {
    const response = await this.axios.get(`/applications/${id}`)
    return response.data
  }

  async applyToJob(data: {
    vacancyId: string
    resumeId: string
    coverLetter?: string
    generateCoverLetter?: boolean
  }): Promise<ApiResponse<{ application: Application }>> {
    const response = await this.axios.post('/applications', data)
    return response.data
  }

  async syncApplications(): Promise<ApiResponse<{
    totalSynced: number
    totalUpdated: number
  }>> {
    const response = await this.axios.post('/applications/sync')
    return response.data
  }

  // Messages
  async getMessages(params?: {
    page?: number
    limit?: number
    isRead?: boolean
    fromRecruiter?: boolean
    dateFrom?: string
    dateTo?: string
  }): Promise<ApiResponse<{
    messages: Message[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }>> {
    const response = await this.axios.get('/messages', { params })
    return response.data
  }

  async markMessageRead(id: string): Promise<ApiResponse> {
    const response = await this.axios.patch(`/messages/${id}/read`)
    return response.data
  }

  // User preferences
  async getPreferences(): Promise<ApiResponse<{ preferences: UserPreferences }>> {
    const response = await this.axios.get('/user/preferences')
    return response.data
  }

  async updatePreferences(preferences: Partial<UserPreferences>): Promise<ApiResponse<{ preferences: UserPreferences }>> {
    const response = await this.axios.put('/user/preferences', preferences)
    return response.data
  }

  // Job search
  async searchJobs(params: JobSearchParams): Promise<ApiResponse<{
    vacancies: any[]
    found: number
    pages: number
  }>> {
    const response = await this.axios.post('/jobs/search', params)
    return response.data
  }

  async startAutoSearch(params: JobSearchParams): Promise<ApiResponse<{
    searchId: string
    message: string
  }>> {
    const response = await this.axios.post('/jobs/auto-search', params)
    return response.data
  }

  async stopAutoSearch(): Promise<ApiResponse> {
    const response = await this.axios.post('/jobs/stop-auto-search')
    return response.data
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    const response = await this.axios.get('/health')
    return response.data
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.accessToken
  }

  getAccessToken(): string | null {
    return this.accessToken
  }
}

export const apiClient = new ApiClient()

export type {
  ApiResponse,
  User,
  Application,
  Message,
  AuthTokens,
  JobSearchParams,
  UserPreferences,
}