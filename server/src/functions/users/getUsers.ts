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

app.get('/users', 
  authenticate,
  requireOrganizationAccess,
  async (req: AuthenticatedRequest, res) => {
    try {
      // Mock data for organization users
      const mockUsers = [
        {
          id: req.user.id,
          email: req.user.email,
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          role: 'owner',
          status: 'active',
          lastLogin: req.user.lastLogin,
          createdAt: req.user.createdAt
        }
      ]

      res.json(ApiResponse.success(mockUsers, 'Users retrieved successfully'))
    } catch (error) {
      console.error('Get users error:', error)
      res.status(500).json(ApiResponse.error('Internal server error'))
    }
  }
)

export const handler = serverless(app) as any