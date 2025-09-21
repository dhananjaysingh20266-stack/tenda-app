import { APIGatewayProxyHandler } from 'aws-lambda'
import serverless from 'serverless-http'
import express from 'express'
import cors from 'cors'
import { authenticate, requireIndividualAccess } from '@/middleware/auth'
import { ApiResponse } from '@/utils/response'

const app = express()

app.use(cors())
app.use(express.json())

interface AuthenticatedRequest extends express.Request {
  user?: any
  organization?: any
  member?: any
}

app.get('/my-keys', 
  authenticate,
  requireIndividualAccess,
  async (req: AuthenticatedRequest, res) => {
    try {
      // Mock data for demo purposes
      const mockKeys = [
        {
          id: 1,
          keyId: 'key_12345678',
          name: 'PUBG Mobile - 24h Key',
          description: 'Demo key for testing',
          gameId: 1,
          maxDevices: 2,
          durationHours: 24,
          totalCost: 360,
          currency: 'INR',
          isActive: true,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          usageCount: 0,
          deviceUsageCount: 0,
          createdAt: new Date().toISOString()
        }
      ]

      res.json(ApiResponse.success(mockKeys, 'Keys retrieved successfully'))
    } catch (error) {
      console.error('Get user keys error:', error)
      res.status(500).json(ApiResponse.error('Internal server error'))
    }
  }
)

export const handler = serverless(app) as any