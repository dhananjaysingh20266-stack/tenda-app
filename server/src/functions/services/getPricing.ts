import { APIGatewayProxyHandler } from 'aws-lambda'
import serverless from 'serverless-http'
import express from 'express'
import cors from 'cors'
import { ApiResponse } from '@/utils/response'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/games/:gameId/pricing', async (req, res) => {
  try {
    const { gameId } = req.params

    // Mock pricing data
    const pricingData: { [key: string]: any } = {
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
      return res.status(404).json(ApiResponse.error('Pricing not found for this game'))
    }

    res.json(ApiResponse.success(pricing, 'Pricing retrieved successfully'))
  } catch (error) {
    console.error('Get pricing error:', error)
    res.status(500).json(ApiResponse.error('Internal server error'))
  }
})

export const handler = serverless(app) as any