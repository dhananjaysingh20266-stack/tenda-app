import { APIGatewayProxyHandler } from 'aws-lambda'
import serverless from 'serverless-http'
import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import User from '@/models/User'
import Organization from '@/models/Organization'
import { validate } from '@/middleware/validation'
import { registerSchema } from '@/validators/auth'
import { ApiResponse } from '@/utils/response'
import { generateToken } from '@/utils/jwt'

const app = express()

app.use(cors())
app.use(express.json())

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

app.post('/auth/register', validate(registerSchema), async (req, res) => {
  try {
    const { email, password, firstName, lastName, organizationName } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return res.status(400).json(ApiResponse.error('User already exists'))
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

    res.status(201).json(ApiResponse.success({
      user: userResponse,
      organization,
      token,
      expiresIn: 7 * 24 * 60 * 60 // 7 days in seconds
    }, 'Registration successful'))

  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json(ApiResponse.error('Internal server error'))
  }
})

export const handler = serverless(app) as any