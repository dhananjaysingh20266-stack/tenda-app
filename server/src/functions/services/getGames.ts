import { APIGatewayProxyHandler, APIGatewayProxyEvent, Context } from 'aws-lambda'
import Game from '@/models/Game'
import { ApiResponse } from '@/utils/response'
import { createResponse } from '@/utils/lambda'

const getGames = async (event: APIGatewayProxyEvent, context: Context) => {
  try {
    const games = await Game.findAll({
      where: { isActive: true },
      order: [['name', 'ASC']],
    })

    return createResponse(200, ApiResponse.success(games, 'Games retrieved successfully'))
  } catch (error) {
    console.error('Get games error:', error)
    return createResponse(500, ApiResponse.error('Internal server error'))
  }
}

export const handler: APIGatewayProxyHandler = getGames