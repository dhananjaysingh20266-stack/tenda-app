import { APIGatewayProxyEvent } from 'aws-lambda'
import { verifyToken } from '@/utils/jwt'
import User from '@/models/User'
import Organization from '@/models/Organization'

export interface AuthenticatedEvent extends APIGatewayProxyEvent {
  user?: {
    userId: number
    organizationId?: number
    type: string
    email: string
    firstName: string
    lastName: string
  }
  organization?: any
}

export const verify = (handler: Function) => {
  return async (event: APIGatewayProxyEvent, context: any) => {
    try {
      // Get token from Authorization header
      const authHeader = event.headers.Authorization || event.headers.authorization
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Access token required')
      }

      const token = authHeader.replace('Bearer ', '')
      
      // Verify token
      const decoded = verifyToken(token)
      
      // Find user
      const user = await User.findByPk(decoded.userId, {
        attributes: { exclude: ['passwordHash'] }
      })

      if (!user || !user.isActive) {
        throw new Error('Invalid token')
      }

      // Attach user info to event
      const authenticatedEvent: AuthenticatedEvent = {
        ...event,
        user: {
          userId: user.id,
          organizationId: decoded.organizationId,
          type: decoded.type,
          email: user.email,
          firstName: user.firstName || '',
          lastName: user.lastName || ''
        }
      }

      // If user has organization, fetch it
      if (decoded.organizationId) {
        const organization = await Organization.findByPk(decoded.organizationId)
        authenticatedEvent.organization = organization
      }

      return await handler(authenticatedEvent, context)
      
    } catch (error) {
      console.error('Authentication error:', error)
      return {
        statusCode: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          message: 'Unauthorized',
          error: error instanceof Error ? error.message : 'Authentication failed'
        })
      }
    }
  }
}