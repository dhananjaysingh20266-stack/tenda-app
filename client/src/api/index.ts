import { apiClient } from './client'
import type { ApiResponse, Game, LoginRequest } from '@/types'

// Games API
export const gamesApi = {
  getGames: () => 
    apiClient.get<ApiResponse<Game[]>>('/games'),
  
  getGamePricing: (gameId: number) => 
    apiClient.get<ApiResponse<{ gameId: number; gameName: string; currency: string; tiers: Array<{ durationHours: number; pricePerDevice: number }> }>>(`/games/${gameId}/pricing`),
}

// Key Generation API
export interface KeyGenerationRequest {
  gameId: number
  maxDevices: number
  durationHours: number
  bulkQuantity: number
  customKey?: string
  description?: string
}

export interface GeneratedKey {
  id: string
  key: string
  maxDevices: number
  expiresAt: string
  cost: number
}

export const keyGenerationApi = {
  generateKeys: (data: KeyGenerationRequest) => 
    apiClient.post<ApiResponse<{ batchId?: string; totalGenerated: number; keys: GeneratedKey[]; totalCost: number }>>('/key-generation/generate', data),
  
  getUserKeys: (params?: { page?: number; limit?: number; status?: string; gameId?: number }) => {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.status) queryParams.append('status', params.status)
    if (params?.gameId) queryParams.append('gameId', params.gameId.toString())
    
    const queryString = queryParams.toString()
    return apiClient.get<ApiResponse<{ keys: any[]; pagination: any }>>(`/my-keys${queryString ? `?${queryString}` : ''}`)
  },
}

// Analytics API
export interface AnalyticsOverview {
  totalUsers: number
  activeKeys: number
  totalUsage: number
  avgSessionTime: string
}

export interface UsageData {
  daily: Array<{ date: string; keys: number; users: number }>
  weekly: Array<{ week: string; keys: number; users: number }>
  monthly: Array<{ month: string; keys: number; users: number }>
}

export interface GameAnalytics {
  name: string
  usage: number
  change: number
}

export interface ActivityItem {
  id: number
  user: string
  action: string
  time: string
  type: 'success' | 'warning' | 'info'
}

export const analyticsApi = {
  getOverview: () => 
    apiClient.get<ApiResponse<AnalyticsOverview>>('/analytics/overview'),
  
  getUsageData: (timeRange?: string) => 
    apiClient.get<ApiResponse<UsageData>>(`/analytics/usage${timeRange ? `?timeRange=${timeRange}` : ''}`),
  
  getTopGames: () => 
    apiClient.get<ApiResponse<GameAnalytics[]>>('/analytics/games'),
  
  getRecentActivity: () => 
    apiClient.get<ApiResponse<ActivityItem[]>>('/analytics/activity'),
}

// Settings API
export interface UserProfile {
  id: number
  email: string
  firstName: string
  lastName: string
  isActive: boolean
  emailVerified: boolean
}

export interface OrganizationSettings {
  id: number
  name: string
  description?: string
  website?: string
  industry?: string
  companySize?: string
  billingEmail?: string
}

export interface NotificationPreferences {
  keyGenerationAlerts: boolean
  securityAlerts: boolean
  usageReports: boolean
  teamUpdates: boolean
}

export const settingsApi = {
  // Profile
  getProfile: () => 
    apiClient.get<ApiResponse<UserProfile>>('/settings/profile'),
  
  updateProfile: (data: Partial<UserProfile>) => 
    apiClient.put<ApiResponse<UserProfile>>('/settings/profile', data),
  
  updatePassword: (data: { currentPassword: string; newPassword: string }) => 
    apiClient.put<ApiResponse<null>>('/settings/password', data),
  
  // Organization
  getOrganizationSettings: () => 
    apiClient.get<ApiResponse<OrganizationSettings>>('/settings/organization'),
  
  updateOrganizationSettings: (data: Partial<OrganizationSettings>) => 
    apiClient.put<ApiResponse<OrganizationSettings>>('/settings/organization', data),
  
  // Notifications
  getNotificationPreferences: () => 
    apiClient.get<ApiResponse<NotificationPreferences>>('/settings/notifications'),
  
  updateNotificationPreferences: (data: Partial<NotificationPreferences>) => 
    apiClient.put<ApiResponse<NotificationPreferences>>('/settings/notifications', data),
}

// Members API
export interface Member {
  id: number
  firstName: string
  lastName: string
  email: string
  role: 'admin' | 'member' | 'viewer'
  status: 'active' | 'pending' | 'inactive'
  lastActive: string
  joinedAt: string
  permissions: string[]
}

export const membersApi = {
  getMembers: (params?: { status?: string; role?: string; search?: string }) => {
    const queryParams = new URLSearchParams()
    if (params?.status) queryParams.append('status', params.status)
    if (params?.role) queryParams.append('role', params.role)
    if (params?.search) queryParams.append('search', params.search)
    
    const queryString = queryParams.toString()
    return apiClient.get<ApiResponse<Member[]>>(`/users${queryString ? `?${queryString}` : ''}`)
  },
  
  inviteMember: (data: { email: string; role?: string; password?: string }) => 
    apiClient.post<ApiResponse<Member>>('/users/invite', data),
  
  updateMember: (userId: number, data: Partial<Member>) => 
    apiClient.put<ApiResponse<Member>>(`/users/${userId}`, data),
  
  removeMember: (userId: number) => 
    apiClient.delete<ApiResponse<null>>(`/users/${userId}`),
}

// Login Requests API
export const loginRequestsApi = {
  getPendingRequests: () => 
    apiClient.get<ApiResponse<LoginRequest[]>>('/dev/auth/login-requests/pending'),
  
  approveLoginRequest: (requestId: number) => 
    apiClient.put<ApiResponse<null>>(`/auth/login-requests/${requestId}/approve`),
  
  rejectLoginRequest: (requestId: number, reason?: string) => 
    apiClient.put<ApiResponse<null>>(`/auth/login-requests/${requestId}/reject`, { reason }),
  
  checkLoginStatus: (requestId: number) => 
    apiClient.get<ApiResponse<{ status: 'pending' | 'approved' | 'rejected' | 'expired' }>>(`/auth/login-requests/${requestId}/status`),
}