const { Game, PricingTier } = require('../../models')
const { ApiResponse } = require('../../utils/response')
const { createResponse } = require('../../utils/lambda')

const getPricing = async (event, context) => {
  try {
    const { gameId } = event.pathParameters || {}

    if (!gameId) {
      return createResponse(400, ApiResponse.error('Game ID is required'))
    }

    // Validate game exists and is active
    const game = await Game.findByPk(gameId, {
      where: { isActive: true }
    })

    if (!game) {
      return createResponse(404, ApiResponse.error('Game not found or inactive'))
    }

    // Get pricing tiers for the game
    const pricingTiers = await PricingTier.findAll({
      where: { 
        gameId: gameId,
        isActive: true 
      },
      order: [['durationHours', 'ASC']]
    })

    if (pricingTiers.length === 0) {
      return createResponse(404, ApiResponse.error('Pricing not available for this game'))
    }

    // Format the response to match the expected structure
    const pricing = {
      gameId: parseInt(gameId),
      gameName: game.name,
      currency: pricingTiers[0].currency,
      tiers: pricingTiers.map(tier => ({
        durationHours: tier.durationHours,
        pricePerDevice: parseFloat(tier.pricePerDevice)
      }))
    }

    return createResponse(200, ApiResponse.success(pricing, 'Pricing retrieved successfully'))
  } catch (error) {
    console.error('Get pricing error:', error)
    return createResponse(500, ApiResponse.error('Internal server error'))
  }
}

module.exports = { handler: getPricing }
        currency: 'INR',
        tiers: [
          { durationHours: 1, pricePerDevice: 8 },
          { durationHours: 3, pricePerDevice: 20 },
          { durationHours: 5, pricePerDevice: 40 },
          { durationHours: 12, pricePerDevice: 80 },
          { durationHours: 24, pricePerDevice: 150 },
          { durationHours: 168, pricePerDevice: 800 }
        ]
      },
      '3': {
        gameId: 3,
        gameName: 'Call of Duty Mobile',
        currency: 'INR',
        tiers: [
          { durationHours: 1, pricePerDevice: 12 },
          { durationHours: 3, pricePerDevice: 30 },
          { durationHours: 5, pricePerDevice: 60 },
          { durationHours: 12, pricePerDevice: 120 },
          { durationHours: 24, pricePerDevice: 200 },
          { durationHours: 168, pricePerDevice: 1200 }
        ]
      }
    }

    const pricing = pricingData[gameId]
    if (!pricing) {
      return createResponse(404, ApiResponse.error('Pricing not found for this game'))
    }

    return createResponse(200, ApiResponse.success(pricing, 'Pricing retrieved successfully'))
  } catch (error) {
    console.error('Get pricing error:', error)
    return createResponse(500, ApiResponse.error('Internal server error'))
  }
}

module.exports = { handler: getPricing }