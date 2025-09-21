import express from 'express'
import cors from 'cors'
import Game from '@/models/Game'
import { ApiResponse } from '@/utils/response'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/games', async (req, res) => {
  try {
    const games = await Game.findAll({
      where: { isActive: true },
      order: [['name', 'ASC']],
    })

    res.json(ApiResponse.success(games, 'Games retrieved successfully'))
  } catch (error) {
    console.error('Get games error:', error)
    res.status(500).json(ApiResponse.error('Internal server error'))
  }
})

export default app