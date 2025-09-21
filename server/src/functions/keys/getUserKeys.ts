import { APIGatewayProxyHandler, APIGatewayProxyEvent, Context } from 'aws-lambda'
import { ApiResponse } from '@/utils/response'
import { createResponse } from '@/utils/lambda'
import { authenticate } from '@/utils/auth'

const getUserKeys = async (event: APIGatewayProxyEvent, context: Context) => {
  try {
    // Authenticate user
    const authResult = await authenticate(event)
    if (!authResult.success) {
      return createResponse(authResult.statusCode || 401, ApiResponse.error(authResult.error || 'Authentication failed'))
    }

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

    return createResponse(200, ApiResponse.success(mockKeys, 'Keys retrieved successfully'))
  } catch (error) {
    console.error('Get user keys error:', error)
    return createResponse(500, ApiResponse.error('Internal server error'))
  }
}

export const handler: APIGatewayProxyHandler = getUserKeys