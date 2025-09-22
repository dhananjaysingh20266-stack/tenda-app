const jwt = require('jsonwebtoken')
const { User, Organization } = require('../models')

/**
 * Authenticate user from event headers
 */
const authenticate = async (event) => {
  try {
    const authHeader = event.headers?.Authorization || event.headers?.authorization
    
    if (!authHeader) {
      return { success: false, error: 'Authorization header missing', statusCode: 401 }
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader

    if (!token) {
      return { success: false, error: 'Token missing', statusCode: 401 }
    }

    // Verify JWT token
    const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key'
    let decoded
    
    try {
      decoded = jwt.verify(token, jwtSecret)
    } catch (error) {
      return { success: false, error: 'Invalid token', statusCode: 401 }
    }

    // Fetch user data
    const user = await User.findByPk(decoded.userId, {
      attributes: ['id', 'email', 'firstName', 'lastName', 'isActive']
    })

    if (!user || !user.isActive) {
      return { success: false, error: 'User not found or inactive', statusCode: 401 }
    }

    return {
      success: true,
      user: {
        userId: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        organizationId: decoded.organizationId,
        type: decoded.type
      }
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return { success: false, error: 'Authentication failed', statusCode: 500 }
  }
}

/**
 * Require organization access for the authenticated user
 */
const requireOrganizationAccess = async (user) => {
  try {
    if (!user.organizationId) {
      return { success: false, error: 'No organization access', statusCode: 403 }
    }

    const organization = await Organization.findByPk(user.organizationId, {
      where: { isActive: true }
    })

    if (!organization) {
      return { success: false, error: 'Organization not found or inactive', statusCode: 403 }
    }

    // Check if user has access to this organization
    if (organization.ownerId !== user.userId) {
      return { success: false, error: 'Access denied to organization', statusCode: 403 }
    }

    return { success: true, organization }
  } catch (error) {
    console.error('Organization access check error:', error)
    return { success: false, error: 'Organization access check failed', statusCode: 500 }
  }
}

module.exports = { authenticate, requireOrganizationAccess }