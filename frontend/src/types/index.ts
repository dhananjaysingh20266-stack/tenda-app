export interface User {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  status: string
  organization: {
    id: string
    name: string
  }
  roles: string[]
  permissions?: string[]
}

export interface LoginRequest {
  username: string
  password: string
  deviceFingerprint?: any
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
  organizationName?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface GamingKey {
  id: string
  key_code: string
  key_type: string
  status: string
  game: {
    id: string
    name: string
  }
  service: {
    id: string
    name: string
  }
  created_at: string
  expires_at?: string
}