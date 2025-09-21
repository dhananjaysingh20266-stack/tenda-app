import { APIGatewayProxyHandler } from 'aws-lambda'
import serverless from 'serverless-http'
import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import User from '@/models/User'
import Organization from '@/models/Organization'
import { validate } from '@/middleware/validation'
import { loginSchema } from '@/validators/auth'
import { ApiResponse } from '@/utils/response'
import { generateToken } from '@/utils/jwt'

const app = express()

app.use(cors())
app.use(express.json())

app.post('/auth/login', validate(loginSchema), async (req, res) => {
  try {
    const { email, password, loginType } = req.body

    // Find user
    const user = await User.findOne({
      where: { email, isActive: true }
    })

    if (!user) {
      return res.status(401).json(ApiResponse.error('Invalid credentials'))
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
      return res.status(401).json(ApiResponse.error('Invalid credentials'))
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      return res.status(423).json(ApiResponse.error('Account temporarily locked'))
    }

    let organization: Organization | null = null

    if (loginType === 'organization') {
      // Organization login
      organization = await Organization.findOne({
        where: { ownerId: user.id, isActive: true }
      })

      if (!organization) {
        return res.status(403).json(ApiResponse.error('Organization access denied'))
      }
    } else {
      // Individual login - for demo purposes, we'll allow any active user
      // In production, you'd check organization membership
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

    res.json(ApiResponse.success({
      user: userResponse,
      organization,
      token,
      expiresIn: 7 * 24 * 60 * 60 // 7 days in seconds
    }, 'Login successful'))

  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json(ApiResponse.error('Internal server error'))
  }
})

export const handler = serverless(app) as any