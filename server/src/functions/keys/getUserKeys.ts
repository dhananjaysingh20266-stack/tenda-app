import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import { Common } from '@/helpers/Common'
import { Messages } from '@/helpers/Messages'
import { Constants } from '@/helpers/Constants'
import { verify, AuthenticatedEvent } from '@/helpers/Authorization'

const getUserKeys = async (event: AuthenticatedEvent, context: Context) => {
  try {
    const { userId, organizationId } = event.user || {}

    // Query parameters for pagination and filtering
    const { 
      page = '1', 
      limit = '10', 
      status = 'active',
      gameId 
    } = event.queryStringParameters || {}

    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    const offset = (pageNum - 1) * limitNum

    // Build filter conditions
    const filters: any = {
      userId,
      ...(organizationId && { organizationId }),
      ...(status !== 'all' && { isActive: status === 'active' }),
      ...(gameId && { gameId: parseInt(gameId) })
    }

    // Mock data for demo purposes - in production, this would query a Keys table
    const mockKeys = [
      {
        id: 1,
        keyId: 'key_12345678',
        name: 'PUBG Mobile - 24h Key',
        description: 'Demo key for testing',
        gameId: 1,
        gameName: 'PUBG Mobile',
        maxDevices: 2,
        durationHours: 24,
        totalCost: 360,
        currency: 'INR',
        isActive: true,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        usageCount: 0,
        deviceUsageCount: 0,
        createdAt: new Date().toISOString(),
        userId,
        organizationId
      },
      {
        id: 2,
        keyId: 'key_87654321',
        name: 'Free Fire - 12h Key',
        description: 'Another demo key',
        gameId: 2,
        gameName: 'Free Fire',
        maxDevices: 1,
        durationHours: 12,
        totalCost: 80,
        currency: 'INR',
        isActive: true,
        expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
        usageCount: 1,
        deviceUsageCount: 1,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        userId,
        organizationId
      }
    ]

    // Filter mock data based on criteria
    const filteredKeys = mockKeys.filter(key => {
      if (gameId && key.gameId !== parseInt(gameId)) return false
      if (status === 'active' && !key.isActive) return false
      if (status === 'inactive' && key.isActive) return false
      return true
    })

    // Apply pagination
    const paginatedKeys = filteredKeys.slice(offset, offset + limitNum)

    const responseData = {
      keys: paginatedKeys,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: filteredKeys.length,
        totalPages: Math.ceil(filteredKeys.length / limitNum)
      },
      filters: {
        userId,
        organizationId,
        status,
        gameId: gameId ? parseInt(gameId) : null
      }
    }

    return Common.response(
      true, 
      Messages.KEYS_RETRIEVED, 
      paginatedKeys.length, 
      responseData, 
      Constants.STATUS_SUCCESS
    )
  } catch (error) {
    console.error('Get user keys error:', error)
    return Common.response(
      false, 
      Messages.INTERNAL_ERROR, 
      0, 
      null, 
      Constants.STATUS_INTERNAL_ERROR
    )
  }
}

export const handler = verify(getUserKeys)