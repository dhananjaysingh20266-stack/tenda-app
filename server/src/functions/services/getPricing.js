const { ApiResponse } = require('../../utils/response')
const { createResponse } = require('../../utils/lambda')
const { ApiResponseHandler } = require('../../helpers/api-response-handler')

const getPricing = async (event, context) => {
  try {
    const { gameId } = event.pathParameters || {}

    if (!gameId) {
      return ApiResponseHandler.httpError('Game ID is required', null, 400)
    }

    // Mock pricing data
    const pricingData = {
      '1': {
        gameId: 1,
        gameName: 'PUBG Mobile',
        currency: 'INR',
        tiers: [
          { durationHours: 1, pricePerDevice: 10 },
          { durationHours: 3, pricePerDevice: 25 },
          { durationHours: 5, pricePerDevice: 50 },
          { durationHours: 12, pricePerDevice: 100 },
          { durationHours: 24, pricePerDevice: 180 },
          { durationHours: 168, pricePerDevice: 1000 }
        ]
      },
      '2': {
        gameId: 2,
        gameName: 'Free Fire',
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
      return ApiResponseHandler.httpError('Pricing not found for this game', null, 404)
    }

    return ApiResponseHandler.httpSuccess(pricing, 'Pricing retrieved successfully')
  } catch (error) {
    console.error('Get pricing error:', error)
    return ApiResponseHandler.handleHttpException(error, 'Get Pricing')
  }
}

module.exports = { handler: getPricing }