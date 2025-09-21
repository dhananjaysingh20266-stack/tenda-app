import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import Game from '@/models/Game'
import { Common } from '@/helpers/Common'
import { Messages } from '@/helpers/Messages'
import { Constants } from '@/helpers/Constants'

const getGames = async (event: APIGatewayProxyEvent, context: Context) => {
  try {
    // Query parameters for filtering (if needed)
    const { isActive = 'true' } = event.queryStringParameters || {}

    const whereClause: any = {}
    if (isActive === 'true') {
      whereClause.isActive = true
    }

    const games = await Game.findAll({
      where: whereClause,
      order: [['name', 'ASC']],
    })

    return Common.response(
      true, 
      Messages.GAMES_RETRIEVED, 
      games.length, 
      games, 
      Constants.STATUS_SUCCESS
    )
  } catch (error) {
    console.error('Get games error:', error)
    return Common.response(
      false, 
      Messages.INTERNAL_ERROR, 
      0, 
      null, 
      Constants.STATUS_INTERNAL_ERROR
    )
  }
}

export const handler = getGames