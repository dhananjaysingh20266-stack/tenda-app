const jwt = require('jsonwebtoken')
const { User, Organization } = require('../models')

/**
 * Express middleware for authentication
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers?.authorization || req.headers?.Authorization
    
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'Authorization header missing' })
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader

    if (!token) {
      return res.status(401).json({ success: false, message: 'Token missing' })
    }

    // Verify JWT token
    const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key'
    let decoded
    
    try {
      decoded = jwt.verify(token, jwtSecret)
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Invalid token' })
    }

    // Fetch user data
    const user = await User.findByPk(decoded.userId, {
      attributes: ['id', 'email', 'firstName', 'lastName', 'isActive', 'organizationId']
    })

    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'User not found or inactive' })
    }

    // Add user info to request
    req.user = {
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      organizationId: user.organizationId || decoded.organizationId,
      type: decoded.type
    }

    next()
  } catch (error) {
    console.error('Authentication error:', error)
    return res.status(500).json({ success: false, message: 'Authentication failed' })
  }
}

/**
 * Express middleware to require organization access
 */
const requireOrganizationAccess = async (req, res, next) => {
  try {
    if (!req.user?.organizationId) {
      return res.status(403).json({ success: false, message: 'No organization access' })
    }

    const organization = await Organization.findByPk(req.user.organizationId)

    if (!organization) {
      return res.status(403).json({ success: false, message: 'Organization not found or inactive' })
    }

    // Add organization to request
    req.organization = organization

    next()
  } catch (error) {
    console.error('Organization access check error:', error)
    return res.status(500).json({ success: false, message: 'Organization access check failed' })
  }
}

/**
 * Express middleware to require individual user access
 */
const requireIndividualAccess = async (req, res, next) => {
  try {
    if (req.user?.type !== 'individual') {
      return res.status(403).json({ success: false, message: 'Individual access required' })
    }

    next()
  } catch (error) {
    console.error('Individual access check error:', error)
    return res.status(500).json({ success: false, message: 'Individual access check failed' })
  }
}

module.exports = { 
  authenticate, 
  requireOrganizationAccess, 
  requireIndividualAccess 
}