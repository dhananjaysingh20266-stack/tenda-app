const { ApiKey, Game } = require('../../models')
const { Common } = require('../../helpers/Common')
const { Messages } = require('../../helpers/Messages')
const { Constants } = require('../../helpers/Constants')
const { verify } = require('../../helpers/Authorization')

const getUserKeys = async (event, context) => {
  try {
    const { userId, organizationId } = event.user || { userId: 1, organizationId: 1 } // Mock for now

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
    const filters = {
      userId,
      ...(organizationId && { organizationId }),
      ...(status !== 'all' && { isActive: status === 'active' }),
      ...(gameId && { gameId: parseInt(gameId) })
    }

    // Query keys from database with associations
    const result = await ApiKey.findAndCountAll({
      where: filters,
      include: [
        {
          model: Game,
          as: 'game',
          attributes: ['name', 'slug', 'iconUrl']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: limitNum,
      offset: offset
    })

    // Format the response
    const keys = result.rows.map(key => ({
      id: key.id,
      keyId: key.keyId,
      name: key.name,
      description: key.description,
      gameId: key.gameId,
      gameName: key.game?.name || 'Unknown Game',
      maxDevices: key.maxDevices,
      durationHours: key.durationHours,
      costPerDevice: parseFloat(key.costPerDevice),
      totalCost: parseFloat(key.totalCost),
      currency: key.currency,
      isActive: key.isActive,
      expiresAt: key.expiresAt,
      lastUsedAt: key.lastUsedAt,
      usageCount: key.usageCount,
      deviceUsageCount: key.deviceUsageCount,
      createdAt: key.createdAt
    }))

    const responseData = {
      keys,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: result.count,
        totalPages: Math.ceil(result.count / limitNum)
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
      keys.length, 
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

module.exports = { handler: verify(getUserKeys) }