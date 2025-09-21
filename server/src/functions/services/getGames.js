const { Game } = require('../../models')
const { Common } = require('../../helpers/Common')
const { Messages } = require('../../helpers/Messages')
const { Constants } = require('../../helpers/Constants')

const getGames = async (event, context) => {
  try {
    // Query parameters for filtering (if needed)
    const { isActive = 'true' } = event.queryStringParameters || {}

    const whereClause = {}
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

module.exports = { handler: getGames }