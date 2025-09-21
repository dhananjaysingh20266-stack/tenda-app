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

app.get('/organizations/profile', 
  authenticate,
  requireOrganizationAccess,
  async (req: AuthenticatedRequest, res) => {
    try {
      res.json(ApiResponse.success(req.organization, 'Organization retrieved successfully'))
    } catch (error) {
      console.error('Get organization error:', error)
      res.status(500).json(ApiResponse.error('Internal server error'))
    }
  }
)

export const handler = serverless(app) as any