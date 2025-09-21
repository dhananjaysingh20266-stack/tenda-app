import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import bcrypt from 'bcryptjs'
import User from '@/models/User'
import Organization from '@/models/Organization'
import { loginSchema } from '@/validators/auth'
import { generateToken } from '@/utils/jwt'
import { Common } from '@/helpers/Common'
import { Messages } from '@/helpers/Messages'
import { Constants } from '@/helpers/Constants'

const login = async (event: APIGatewayProxyEvent, context: Context) => {
  try {
    // Parse request body
    const payloadData = Common.parseBody(event.body)
    
    // Validate input
    const { error, value } = loginSchema.validate(payloadData)
    if (error) {
      return Common.response(false, Messages.VLD_ERR(error), 0, null, Constants.STATUS_BAD_REQUEST)
    }

    const { email, password, loginType } = value

    // Find user
    const user = await User.findOne({
      where: { email, isActive: true }
    })

    if (!user) {
      return Common.response(false, Messages.INVALID_CREDENTIALS, 0, null, Constants.STATUS_UNAUTHORIZED)
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
      return Common.response(false, Messages.INVALID_CREDENTIALS, 0, null, Constants.STATUS_UNAUTHORIZED)
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      return Common.response(false, Messages.ACCOUNT_LOCKED, 0, null, Constants.STATUS_LOCKED)
    }

    let organization: Organization | null = null

    if (loginType === 'organization') {
      // Organization login
      organization = await Organization.findOne({
        where: { ownerId: user.id, isActive: true }
      })

      if (!organization) {
        return Common.response(false, Messages.ACCESS_DENIED, 0, null, Constants.STATUS_FORBIDDEN)
      }
    }

    // Reset login attempts on successful login
    await user.update({
      loginAttempts: 0,
      lockedUntil: undefined,
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

    return Common.response(true, Messages.LOGIN_SUCCESS, 1, responseData, Constants.STATUS_SUCCESS)

  } catch (error) {
    console.error('Login error:', error)
    return Common.response(false, Messages.INTERNAL_ERROR, 0, null, Constants.STATUS_INTERNAL_ERROR)
  }
}

export const handler = login