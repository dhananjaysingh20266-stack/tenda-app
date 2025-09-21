import { APIGatewayProxyHandler, APIGatewayProxyEvent, Context } from 'aws-lambda'
import bcrypt from 'bcryptjs'
import User from '@/models/User'
import Organization from '@/models/Organization'
import { loginSchema } from '@/validators/auth'
import { ApiResponse } from '@/utils/response'
import { generateToken } from '@/utils/jwt'
import { createResponse } from '@/utils/lambda'

const login = async (event: APIGatewayProxyEvent, context: Context) => {
  try {
    // Parse request body
    const payloadData = event.body ? JSON.parse(event.body) : {}
    
    // Validate input
    const { error, value } = loginSchema.validate(payloadData)
    if (error) {
      const errors = error.details.map(detail => detail.message)
      return createResponse(400, ApiResponse.error('Validation failed', errors))
    }

    const { email, password, loginType } = value

    // Find user
    const user = await User.findOne({
      where: { email, isActive: true }
    })

    if (!user) {
      return createResponse(401, ApiResponse.error('Invalid credentials'))
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
      return createResponse(401, ApiResponse.error('Invalid credentials'))
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      return createResponse(423, ApiResponse.error('Account temporarily locked'))
    }

    let organization: Organization | null = null

    if (loginType === 'organization') {
      // Organization login
      organization = await Organization.findOne({
        where: { ownerId: user.id, isActive: true }
      })

      if (!organization) {
        return createResponse(403, ApiResponse.error('Organization access denied'))
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

    return createResponse(200, ApiResponse.success({
      user: userResponse,
      organization,
      token,
      expiresIn: 7 * 24 * 60 * 60 // 7 days in seconds
    }, 'Login successful'))

  } catch (error) {
    console.error('Login error:', error)
    return createResponse(500, ApiResponse.error('Internal server error'))
  }
}

export const handler: APIGatewayProxyHandler = login