const { generateKeysSchema } = require('../../validators/keys')
const { Game } = require('../../models')
const { v4: uuidv4 } = require('uuid')
const crypto = require('crypto')
const { Common } = require('../../helpers/Common')
const { Messages } = require('../../helpers/Messages')
const { Constants } = require('../../helpers/Constants')
const { verify } = require('../../helpers/Authorization')

// Mock pricing data
const pricingData = {
  1: { 1: 10, 3: 25, 5: 50, 12: 100, 24: 180, 168: 1000 }, // PUBG Mobile
  2: { 1: 8, 3: 20, 5: 40, 12: 80, 24: 150, 168: 800 },   // Free Fire
  3: { 1: 12, 3: 30, 5: 60, 12: 120, 24: 200, 168: 1200 }, // COD Mobile
}

const generateKeys = async (event, context) => {
  try {
    // Parse request body
    const payloadData = Common.parseBody(event.body)
    
    // Validate input
    const { error, value } = generateKeysSchema.validate(payloadData)
    if (error) {
      return Common.response(false, Messages.VLD_ERR(error), 0, null, Constants.STATUS_BAD_REQUEST)
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
      return Common.response(false, Messages.NO_GAME_FOUND, 0, null, Constants.STATUS_NOT_FOUND)
    }

    // Get pricing
    const pricePerDevice = pricingData[gameId]?.[durationHours]
    if (!pricePerDevice) {
      return Common.response(false, 'Pricing not available for selected duration', 0, null, Constants.STATUS_NOT_FOUND)
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
      let keyValue
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

    const responseData = {
      batchId,
      totalGenerated: bulkQuantity,
      totalCost,
      currency: 'INR',
      expiresAt: expiresAt.toISOString(),
      keys: generatedKeys,
      userId: event.user?.userId,
      organizationId: event.user?.organizationId,
      ...(bulkQuantity > 1 && {
        downloadUrl: `/api/keys/batch/${batchId}/export`
      })
    }

    return Common.response(
      true, 
      Messages.KEY_GENERATION_SUCCESS, 
      bulkQuantity, 
      responseData, 
      Constants.STATUS_SUCCESS
    )

  } catch (error) {
    console.error('Key generation error:', error)
    return Common.response(false, Messages.KEY_GENERATION_FAILED, 0, null, Constants.STATUS_INTERNAL_ERROR)
  }
}

module.exports = { handler: verify(generateKeys) }