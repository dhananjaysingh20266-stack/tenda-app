import { APIGatewayProxyEvent } from 'aws-lambda'
import { verifyToken } from '@/utils/jwt'
import User from '@/models/User'
import Organization from '@/models/Organization'

interface AuthResult {
  success: boolean
  user?: User
  organization?: Organization
  error?: string
  statusCode?: number
}

export const authenticate = async (event: APIGatewayProxyEvent): Promise<AuthResult> => {
  try {
    // Get token from Authorization header
    const authHeader = event.headers.Authorization || event.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        success: false,
        error: 'Access token required',
        statusCode: 401
      }
    }

    const token = authHeader.replace('Bearer ', '')

    // Verify token
    const decoded = verifyToken(token)
    
    // Find user
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['passwordHash'] }
    })

    if (!user || !user.isActive) {
      return {
        success: false,
        error: 'Invalid token',
        statusCode: 401
      }
    }

    let organization: Organization | null = null

    // If user has organization, fetch it
    if (decoded.organizationId) {
      organization = await Organization.findByPk(decoded.organizationId)
    }

    return {
      success: true,
      user,
      organization: organization || undefined
    }

  } catch (error) {
    console.error('Authentication error:', error)
    return {
      success: false,
      error: 'Invalid token',
      statusCode: 401
    }
  }
}

export const requireOrganizationAccess = async (user: User): Promise<AuthResult> => {
  try {
    // Check if user is organization owner
    const organization = await Organization.findOne({
      where: { ownerId: user.id, isActive: true }
    })

    if (!organization) {
      return {
        success: false,
        error: 'Organization access required',
        statusCode: 403
      }
    }

    return {
      success: true,
      user,
      organization
    }
  } catch (error) {
    return {
      success: false,
      error: 'Internal server error',
      statusCode: 500
    }
  }
}