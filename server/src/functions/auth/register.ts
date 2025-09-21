import { APIGatewayProxyHandler, APIGatewayProxyEvent, Context } from 'aws-lambda'
import bcrypt from 'bcryptjs'
import User from '@/models/User'
import Organization from '@/models/Organization'
import { registerSchema } from '@/validators/auth'
import { ApiResponse } from '@/utils/response'
import { generateToken } from '@/utils/jwt'
import { createResponse } from '@/utils/lambda'

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const register = async (event: APIGatewayProxyEvent, context: Context) => {
  try {
    // Parse request body
    const payloadData = event.body ? JSON.parse(event.body) : {}
    
    // Validate input
    const { error, value } = registerSchema.validate(payloadData)
    if (error) {
      const errors = error.details.map(detail => detail.message)
      return createResponse(400, ApiResponse.error('Validation failed', errors))
    }

    const { email, password, firstName, lastName, organizationName } = value

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return createResponse(400, ApiResponse.error('User already exists'))
    }

    // Generate slug and check if organization already exists
    let slug = generateSlug(organizationName)
    const existingOrg = await Organization.findOne({ where: { slug } })
    if (existingOrg) {
      // Append timestamp to make unique
      slug = `${slug}-${Date.now()}`
    }

    // Hash password
    const saltRounds = 12
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // Create user and organization in a transaction
    const user = await User.create({
      email,
      passwordHash,
      firstName,
      lastName,
      isActive: true,
      emailVerified: false,
      loginAttempts: 0,
    })

    const organization = await Organization.create({
      name: organizationName,
      slug,
      ownerId: user.id,
      subscriptionTier: 'free',
      isActive: true,
    })

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      organizationId: organization.id,
      type: 'organization'
    })

    // Remove password hash from response
    const userResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      type: 'organization' as const,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }

    return createResponse(201, ApiResponse.success({
      user: userResponse,
      organization,
      token,
      expiresIn: 7 * 24 * 60 * 60 // 7 days in seconds
    }, 'Registration successful'))

  } catch (error) {
    console.error('Registration error:', error)
    return createResponse(500, ApiResponse.error('Internal server error'))
  }
}

export const handler: APIGatewayProxyHandler = register