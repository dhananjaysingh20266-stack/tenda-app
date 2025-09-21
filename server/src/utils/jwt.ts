import jwt, { SignOptions } from 'jsonwebtoken'
import { JWT_CONFIG } from '@/config/jwt'

export interface JwtPayload {
  userId: number
  organizationId?: number
  type: 'organization' | 'individual'
  iat?: number
  exp?: number
}

export const generateToken = (payload: Omit<JwtPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload as object, JWT_CONFIG.secret, {
    expiresIn: '7d',
  })
}

export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, JWT_CONFIG.secret) as JwtPayload
  } catch (error) {
    throw new Error('Invalid token')
  }
}

export const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwt.decode(token) as JwtPayload
  } catch (error) {
    return null
  }
}