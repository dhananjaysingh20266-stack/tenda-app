import { APIGatewayProxyHandler, APIGatewayProxyEvent, Context } from 'aws-lambda'
import { generateKeysSchema } from '@/validators/keys'
import { ApiResponse } from '@/utils/response'
import { createResponse } from '@/utils/lambda'
import { authenticate } from '@/utils/auth'
import Game from '@/models/Game'
import { v4 as uuidv4 } from 'uuid'
import crypto from 'crypto'

// Mock pricing data
const pricingData: { [key: number]: { [key: number]: number } } = {
  1: { 1: 10, 3: 25, 5: 50, 12: 100, 24: 180, 168: 1000 }, // PUBG Mobile
  2: { 1: 8, 3: 20, 5: 40, 12: 80, 24: 150, 168: 800 },   // Free Fire
  3: { 1: 12, 3: 30, 5: 60, 12: 120, 24: 200, 168: 1200 }, // COD Mobile
}

const generateKeys = async (event: APIGatewayProxyEvent, context: Context) => {
  try {
    // Authenticate user
    const authResult = await authenticate(event)
    if (!authResult.success) {
      return createResponse(authResult.statusCode || 401, ApiResponse.error(authResult.error || 'Authentication failed'))
    }

    // Parse request body
    const payloadData = event.body ? JSON.parse(event.body) : {}
    
    // Validate input
    const { error, value } = generateKeysSchema.validate(payloadData)
    if (error) {
      const errors = error.details.map(detail => detail.message)
      return createResponse(400, ApiResponse.error('Validation failed', errors))
    }

    const {
      gameId,
      maxDevices,
      durationHours,
      bulkQuantity = 1,
      customKey,
      description
    } = value

    // Validate game exists
    const game = await Game.findByPk(gameId)

    if (!game || !game.isActive) {
      return createResponse(404, ApiResponse.error('Game not found'))
    }

    // Get pricing
    const pricePerDevice = pricingData[gameId]?.[durationHours]
    if (!pricePerDevice) {
      return createResponse(404, ApiResponse.error('Pricing not available'))
    }

    // Calculate costs
    const totalCostPerKey = pricePerDevice * maxDevices
    const totalCost = totalCostPerKey * bulkQuantity

    // Generate batch ID for bulk operations
    const batchId = bulkQuantity > 1 ? `batch_${uuidv4().slice(0, 8)}` : null

    const generatedKeys = []
    const expiresAt = new Date(Date.now() + durationHours * 60 * 60 * 1000)

    // Generate keys
    for (let i = 0; i < bulkQuantity; i++) {
      let keyValue: string
      if (customKey) {
        keyValue = bulkQuantity > 1 ? `${customKey}_${String(i + 1).padStart(3, '0')}` : customKey
      } else {
        keyValue = `${game.slug.toUpperCase()}_${crypto.randomBytes(8).toString('hex').toUpperCase()}`
      }

      generatedKeys.push({
        id: `key_${uuidv4().slice(0, 8)}`,
        key: keyValue,
        maxDevices,
        expiresAt: expiresAt.toISOString(),
        cost: totalCostPerKey
      })
    }

    const response = {
      batchId,
      totalGenerated: bulkQuantity,
      totalCost,
      currency: 'INR',
      expiresAt: expiresAt.toISOString(),
      keys: generatedKeys,
      ...(bulkQuantity > 1 && {
        downloadUrl: `/api/keys/batch/${batchId}/export`
      })
    }

    return createResponse(200, ApiResponse.success(response, `Successfully generated ${bulkQuantity} key(s)`))

  } catch (error) {
    console.error('Key generation error:', error)
    return createResponse(500, ApiResponse.error('Failed to generate keys'))
  }
}

export const handler: APIGatewayProxyHandler = generateKeys