import { apiClient } from './client'
import type { ApiResponse, LoginForm, User, Organization } from '@/types'

export interface LoginResponse {
  user: User
  organization: Organization | null
  token: string
  expiresIn: number
  requestId?: number // For pending individual login requests
}

export const authApi = {
  login: (data: LoginForm): Promise<ApiResponse<LoginResponse>> => {
    return apiClient.post('/auth/login', data)
  },

  logout: (): Promise<ApiResponse<void>> => {
    return apiClient.post('/auth/logout')
  },

  refreshToken: (): Promise<ApiResponse<{ token: string; expiresIn: number }>> => {
    return apiClient.post('/auth/refresh')
  },

  register: (data: {
    email: string
    password: string
    firstName: string
    lastName: string
    organizationName: string
  }): Promise<ApiResponse<LoginResponse>> => {
    return apiClient.post('/auth/register', data)
  }
}