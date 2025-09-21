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

app.put('/users/:id', 
  authenticate,
  requireOrganizationAccess,
  async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params
      const { firstName, lastName, role, status } = req.body

      // Mock user update
      const updatedUser = {
        id: parseInt(id),
        email: 'user@example.com', // Mock data
        firstName,
        lastName,
        role,
        status,
        organizationId: req.organization.id,
        updatedAt: new Date().toISOString()
      }

      res.json(ApiResponse.success(updatedUser, 'User updated successfully'))
    } catch (error) {
      console.error('Update user error:', error)
      res.status(500).json(ApiResponse.error('Internal server error'))
    }
  }
)

export const handler = serverless(app) as any