import api from './api'
import type { LoginRequest, RegisterRequest, User, AuthTokens, ApiResponse } from '@/types'

export const authService = {
  async login(credentials: LoginRequest): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await api.post<ApiResponse<{ user: User; tokens: AuthTokens }>>('/auth/login', credentials)
    return response.data
  },

  async register(userData: RegisterRequest): Promise<{ user: User }> {
    const response = await api.post<ApiResponse<{ user: User }>>('/auth/register', userData)
    return response.data
  },

  async logout(refreshToken: string): Promise<void> {
    await api.post('/auth/logout', { refreshToken })
  },

  async me(): Promise<{ user: User }> {
    const response = await api.get<ApiResponse<{ user: User }>>('/auth/me')
    return response.data
  },

  async refresh(refreshToken: string): Promise<{ tokens: AuthTokens }> {
    const response = await api.post<ApiResponse<{ tokens: AuthTokens }>>('/auth/refresh', { refreshToken })
    return response.data
  },
}