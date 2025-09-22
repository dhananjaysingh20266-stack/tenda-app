const bcrypt = require('bcryptjs')
const { User, Organization } = require('../../models')
const { loginSchema } = require('../../validators/auth')
const { generateToken } = require('../../utils/jwt')
const { Common } = require('../../helpers/Common')
const { Messages } = require('../../helpers/Messages')
const { Constants } = require('../../helpers/Constants')
const { ApiResponseHandler } = require('../../helpers/api-response-handler')

const login = async (event, context) => {
  try {
    // Parse request body
    const payloadData = Common.parseBody(event.body)
    
    // Validate input
    const { error, value } = loginSchema.validate(payloadData)
    if (error) {
      return ApiResponseHandler.legacyResponse(false, Messages.VLD_ERR(error), 0, null, Constants.STATUS_BAD_REQUEST)
    }

    const { email, password, loginType } = value

    // Find user
    const user = await User.findOne({
      where: { email, isActive: true }
    })

    if (!user) {
      return ApiResponseHandler.legacyResponse(false, Messages.INVALID_CREDENTIALS, 0, null, Constants.STATUS_UNAUTHORIZED)
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash)
    if (!isValidPassword) {
      // Increment login attempts
      await user.increment('loginAttempts')
      if (user.loginAttempts >= 5) {
        await user.update({
          lockedUntil: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
        })
      }
      return ApiResponseHandler.legacyResponse(false, Messages.INVALID_CREDENTIALS, 0, null, Constants.STATUS_UNAUTHORIZED)
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      return ApiResponseHandler.legacyResponse(false, Messages.ACCOUNT_LOCKED, 0, null, Constants.STATUS_LOCKED)
    }

    let organization = null

    if (loginType === 'organization') {
      // Organization login
      organization = await Organization.findOne({
        where: { ownerId: user.id, isActive: true }
      })

      if (!organization) {
        return ApiResponseHandler.legacyResponse(false, Messages.ACCESS_DENIED, 0, null, Constants.STATUS_FORBIDDEN)
      }
    }

    // Reset login attempts on successful login
    await user.update({
      loginAttempts: 0,
      lockedUntil: null,
      lastLogin: new Date()
    })

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      organizationId: organization?.id,
      type: loginType
    })

    // Remove password hash from response
    const userResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      type: loginType,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }

    const responseData = {
      user: userResponse,
      organization,
      token,
      expiresIn: 7 * 24 * 60 * 60 // 7 days in seconds
    }

    return ApiResponseHandler.legacyResponse(true, Messages.LOGIN_SUCCESS, 1, responseData, Constants.STATUS_SUCCESS)

  } catch (error) {
    console.error('Login error:', error)
    // Using the new exception handler for better error management
    const errorResponse = ApiResponseHandler.handleException(error, 'Login')
    return ApiResponseHandler.legacyResponse(false, errorResponse.message, 0, null, Constants.STATUS_INTERNAL_ERROR)
  }
}

module.exports = { handler: login }