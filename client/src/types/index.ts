export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  type: 'organization' | 'individual'
  isActive: boolean
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface Organization {
  id: number
  name: string
  slug: string
  description?: string
  ownerId: number
  logoUrl?: string
  website?: string
  industry?: string
  companySize?: string
  subscriptionTier: 'free' | 'basic' | 'premium' | 'enterprise'
  billingEmail?: string
  createdAt: string
  updatedAt: string
}

export interface ApiKey {
  id: number
  keyId: string
  name: string
  description?: string
  serviceId: number
  gameId?: number
  maxDevices: number
  durationHours: number
  costPerDevice: number
  totalCost: number
  currency: string
  isActive: boolean
  expiresAt: string
  lastUsedAt?: string
  usageCount: number
  deviceUsageCount: number
  createdAt: string
}

export interface Game {
  id: number
  name: string
  slug: string
  iconUrl?: string
  isActive: boolean
}

export interface PricingTier {
  id: number
  serviceId: number
  gameId?: number
  durationHours: number
  pricePerDevice: number
  currency: string
}

export interface LoginRequest {
  id: number
  userId: number
  organizationId: number
  deviceFingerprint: string
  ipAddress: string
  userAgent: string
  status: 'pending' | 'approved' | 'rejected' | 'expired'
  approvedBy?: number
  rejectionReason?: string
  expiresAt: string
  createdAt: string
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errors?: string[]
  showToast?: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Form Types
export interface LoginForm {
  email: string
  password: string
  loginType: 'organization' | 'individual'
}

export interface SignupForm {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  organizationName: string
}

export interface KeyGenerationForm {
  gameId: number
  maxDevices: number
  durationHours: number
  bulkQuantity: number
  customKey?: string
  description?: string
}