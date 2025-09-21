import { APIGatewayProxyHandler } from 'aws-lambda'
import serverless from 'serverless-http'
import express from 'express'
import cors from 'cors'
import { authenticate, requireOrganizationAccess } from '@/middleware/auth'
import { ApiResponse } from '@/utils/response'

const app = express()

app.use(cors())
app.use(express.json())

interface AuthenticatedRequest extends express.Request {
  user?: any
  organization?: any
}

app.post('/users', 
  authenticate,
  requireOrganizationAccess,
  async (req: AuthenticatedRequest, res) => {
    try {
      const { email, firstName, lastName, role } = req.body

      // Mock user creation
      const newUser = {
        id: Date.now(),
        email,
        firstName,
        lastName,
        role: role || 'member',
        status: 'pending',
        organizationId: req.organization.id,
        createdAt: new Date().toISOString()
      }

      res.status(201).json(ApiResponse.success(newUser, 'User created successfully'))
    } catch (error) {
      console.error('Create user error:', error)
      res.status(500).json(ApiResponse.error('Internal server error'))
    }
  }
)

export const handler = serverless(app) as any