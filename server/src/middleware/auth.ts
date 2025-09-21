import { Request, Response, NextFunction } from 'express'
import User from '@/models/User'
import Organization from '@/models/Organization'
import { verifyToken } from '@/utils/jwt'
import { ApiResponse } from '@/utils/response'

export interface AuthenticatedRequest extends Request {
  user?: User
  organization?: Organization
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      res.status(401).json(ApiResponse.error('Access token required'))
      return
    }

    const decoded = verifyToken(token)
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['passwordHash'] }
    })

    if (!user || !user.isActive) {
      res.status(401).json(ApiResponse.error('Invalid token'))
      return
    }

    req.user = user
    next()
  } catch (error) {
    res.status(401).json(ApiResponse.error('Invalid token'))
  }
}

export const requireOrganizationAccess = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json(ApiResponse.error('Authentication required'))
      return
    }

    // Check if user is organization owner
    const organization = await Organization.findOne({
      where: { ownerId: req.user.id }
    })

    if (!organization) {
      res.status(403).json(ApiResponse.error('Organization access required'))
      return
    }

    req.organization = organization
    next()
  } catch (error) {
    res.status(500).json(ApiResponse.error('Internal server error'))
  }
}

export const requireIndividualAccess = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json(ApiResponse.error('Authentication required'))
      return
    }

    // For now, we'll just check if user exists
    // In a full implementation, you'd check organization membership
    next()
  } catch (error) {
    res.status(500).json(ApiResponse.error('Internal server error'))
  }
}