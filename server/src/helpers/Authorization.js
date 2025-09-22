const jwt = require('jsonwebtoken')
const { User, Organization } = require('../models')
const { Common } = require('./Common')
const { Messages } = require('./Messages')
const { Constants } = require('./Constants')

/**
 * JWT Authentication middleware for serverless functions
 * Validates JWT token and attaches user information to the event
 */
const verify = (handler) => {
  return async (event, context) => {
    try {
      // Extract token from Authorization header
      const authHeader = event.headers?.Authorization || event.headers?.authorization
      
      if (!authHeader) {
        return Common.response(false, Messages.ACCESS_DENIED, 0, null, Constants.STATUS_UNAUTHORIZED)
      }

      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader

      if (!token) {
        return Common.response(false, Messages.ACCESS_DENIED, 0, null, Constants.STATUS_UNAUTHORIZED)
      }

      // Verify JWT token
      const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key'
      let decoded
      
      try {
        decoded = jwt.verify(token, jwtSecret)
      } catch (error) {
        return Common.response(false, Messages.INVALID_TOKEN, 0, null, Constants.STATUS_UNAUTHORIZED)
      }

      // Fetch user data
      const user = await User.findByPk(decoded.userId, {
        attributes: ['id', 'email', 'firstName', 'lastName', 'isActive']
      })

      if (!user || !user.isActive) {
        return Common.response(false, Messages.USER_NOT_FOUND, 0, null, Constants.STATUS_UNAUTHORIZED)
      }

      // Attach user information to event
      event.user = {
        userId: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        organizationId: decoded.organizationId,
        type: decoded.type
      }

      // Call the original handler with authenticated event
      return await handler(event, context)
    } catch (error) {
      console.error('Authentication error:', error)
      return Common.response(false, Messages.INTERNAL_ERROR, 0, null, Constants.STATUS_INTERNAL_ERROR)
    }
  }
}

module.exports = { verify }