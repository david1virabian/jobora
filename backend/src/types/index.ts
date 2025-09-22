export interface HHVacancy {
  id: string;
  name: string;
  area: {
    id: string;
    name: string;
  };
  salary: {
    from: number | null;
    to: number | null;
    currency: string;
  } | null;
  employer: {
    id: string;
    name: string;
    url: string | null;
    logo_urls: {
      90: string;
      240: string;
      original: string;
    } | null;
  };
  snippet: {
    requirement: string | null;
    responsibility: string | null;
  };
  schedule: {
    id: string;
    name: string;
  };
  experience: {
    id: string;
    name: string;
  };
  employment: {
    id: string;
    name: string;
  };
  published_at: string;
  created_at: string;
  archived: boolean;
  apply_alternate_url: string;
  url: string;
  has_test: boolean;
  response_letter_required: boolean;
  address: {
    city: string;
    street: string;
    building: string;
    description: string;
  } | null;
  alternate_url: string;
}

export interface HHVacancyDetails extends HHVacancy {
  description: string;
  key_skills: Array<{
    name: string;
  }>;
  professional_roles: Array<{
    id: string;
    name: string;
  }>;
  contacts: {
    name: string;
    email: string;
    phones: Array<{
      country: string;
      city: string;
      number: string;
      formatted: string;
    }>;
  } | null;
  billing_type: {
    id: string;
    name: string;
  };
  allow_messages: boolean;
  premium: boolean;
  driver_license_types: Array<{
    id: string;
  }>;
  accept_handicapped: boolean;
  accept_kids: boolean;
  negotiations_url: string | null;
  suitable_resumes_url: string | null;
}

export interface HHSearchParams {
  text?: string;
  area?: string | string[];
  experience?: string;
  employment?: string;
  schedule?: string;
  salary_from?: number;
  salary_to?: number;
  currency?: string;
  page?: number;
  per_page?: number;
  order_by?: 'publication_time' | 'salary_desc' | 'salary_asc' | 'relevance';
  search_field?: 'name' | 'company_name' | 'description';
  exclude_text?: string;
}

export interface HHSearchResponse {
  items: HHVacancy[];
  found: number;
  pages: number;
  per_page: number;
  page: number;
  clusters: any[];
  arguments: any;
  fixes: any;
  suggests: any;
}

export interface HHApplication {
  id: string;
  created_at: string;
  response_letter_required: boolean;
  response_url: string;
  vacancy: {
    id: string;
    name: string;
    url: string;
  };
  state: {
    id: string;
    name: string;
  };
  viewed_by_employer: boolean;
  employer_state: {
    id: string;
    name: string;
  } | null;
}

export interface HHUser {
  id: string;
  last_name: string;
  first_name: string;
  middle_name: string | null;
  is_admin: boolean;
  is_applicant: boolean;
  is_employer: boolean;
  is_anonymous: boolean;
  phone: string | null;
  email: string;
  counters: {
    new_resume_views: number;
    unread_negotiations: number;
  };
  is_in_search: boolean | null;
  resumes_url: string;
  negotiations_url: string;
  personal_manager: any;
}

export interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export interface TelegramMessage {
  message_id: number;
  from?: TelegramUser;
  date: number;
  chat: {
    id: number;
    type: string;
    title?: string;
    username?: string;
    first_name?: string;
    last_name?: string;
  };
  text?: string;
  entities?: Array<{
    type: string;
    offset: number;
    length: number;
    url?: string;
    user?: TelegramUser;
  }>;
}

export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface CoverLetterRequest {
  vacancyTitle: string;
  companyName: string;
  requirements?: string;
  responsibilities?: string;
  userExperience: string;
  userSkills: string[];
  additionalInfo?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}