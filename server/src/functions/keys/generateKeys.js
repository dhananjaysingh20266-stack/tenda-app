const { generateKeysSchema } = require('../../validators/keys')
const { Game, PricingTier, ApiKey } = require('../../models')
const { v4: uuidv4 } = require('uuid')
const crypto = require('crypto')
const { Common } = require('../../helpers/Common')
const { Messages } = require('../../helpers/Messages')
const { Constants } = require('../../helpers/Constants')
const { verify } = require('../../helpers/Authorization')

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

    // For now, we'll use a mock user ID - this should come from authentication
    const userId = 1
    const organizationId = 1

    // Validate game exists
    const game = await Game.findByPk(gameId)

    if (!game || !game.isActive) {
      return Common.response(false, Messages.NO_GAME_FOUND, 0, null, Constants.STATUS_NOT_FOUND)
    }

    // Get pricing from database
    const pricingTier = await PricingTier.findOne({
      where: {
        gameId,
        durationHours,
        isActive: true
      }
    })

    if (!pricingTier) {
      return Common.response(false, 'Pricing not available for selected duration', 0, null, Constants.STATUS_NOT_FOUND)
    }

    const pricePerDevice = parseFloat(pricingTier.pricePerDevice)

    // Calculate costs
    const totalCostPerKey = pricePerDevice * maxDevices
    const totalCost = totalCostPerKey * bulkQuantity

    // Generate batch ID for bulk operations
    const batchId = bulkQuantity > 1 ? `batch_${uuidv4().slice(0, 8)}` : null

    const generatedKeys = []
    const expiresAt = new Date(Date.now() + durationHours * 60 * 60 * 1000)

    // Generate and store keys in database
    for (let i = 0; i < bulkQuantity; i++) {
      let keyValue
      if (customKey) {
        keyValue = bulkQuantity > 1 ? `${customKey}_${String(i + 1).padStart(3, '0')}` : customKey
      } else {
        keyValue = `${game.slug.toUpperCase()}_${crypto.randomBytes(8).toString('hex').toUpperCase()}`
      }

      const keyId = uuidv4()
      
      // Store key in database
      const apiKey = await ApiKey.create({
        keyId,
        name: customKey || `${game.name} Key`,
        description: description || `Generated key for ${game.name}`,
        gameId,
        userId,
        organizationId,
        maxDevices,
        durationHours,
        costPerDevice: pricePerDevice,
        totalCost: totalCostPerKey,
        currency: pricingTier.currency,
        expiresAt,
        isActive: true
      })

      generatedKeys.push({
        id: keyId,
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