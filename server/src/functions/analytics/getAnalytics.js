const { APIGatewayProxyHandler } = require('aws-lambda')
const serverless = require('serverless-http')
const express = require('express')
const cors = require('cors')
const { authenticate, requireOrganizationAccess } = require('../../helpers/auth')
const { ApiKey, User, Organization, Game, OrganizationMember } = require('../../models')
const { ApiResponse } = require('../../utils/response')
const { Sequelize } = require('sequelize')

const app = express()

app.use(cors())
app.use(express.json())

// Get analytics overview data
app.get('/analytics/overview', 
  authenticate,
  requireOrganizationAccess,
  async (req, res) => {
    try {
      const { organizationId } = req.user

      // Get total organization members
      const totalUsers = await OrganizationMember.count({
        where: { 
          organizationId,
          status: ['active', 'pending']
        }
      })

      // Get active keys
      const activeKeys = await ApiKey.count({
        where: { 
          organizationId,
          isActive: true 
        }
      })

      // Get total usage (sum of usage counts)
      const totalUsageResult = await ApiKey.sum('usageCount', {
        where: { organizationId }
      })
      const totalUsage = totalUsageResult || 0

      // Calculate average session time based on key durations and usage
      const avgDurationResult = await ApiKey.findAll({
        where: { organizationId, usageCount: { [Sequelize.Op.gt]: 0 } },
        attributes: [
          [Sequelize.fn('AVG', Sequelize.col('durationHours')), 'avgHours']
        ],
        raw: true
      })
      
      const avgHours = avgDurationResult[0]?.avgHours || 0
      const avgSessionTime = avgHours ? `${Math.round(avgHours)}h` : 'N/A'

      const overview = {
        totalUsers,
        activeKeys,
        totalUsage,
        avgSessionTime
      }

      res.json(ApiResponse.success(overview, 'Analytics overview retrieved successfully'))

    } catch (error) {
      console.error('Analytics overview error:', error)
      res.status(500).json(ApiResponse.error('Failed to retrieve analytics overview'))
    }
  }
)

// Get usage trends data
app.get('/analytics/usage',
  authenticate,
  requireOrganizationAccess,
  async (req, res) => {
    try {
      const { organizationId } = req.user
      const { timeRange = '7d' } = req.query

      // Get actual usage data from database
      const now = new Date()
      let startDate
      
      if (timeRange === '30d') {
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      } else {
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      }

      // Get daily key creation data
      const dailyKeys = await ApiKey.findAll({
        where: {
          organizationId,
          createdAt: {
            [Sequelize.Op.gte]: startDate
          }
        },
        attributes: [
          [Sequelize.fn('DATE', Sequelize.col('createdAt')), 'date'],
          [Sequelize.fn('COUNT', '*'), 'keys']
        ],
        group: [Sequelize.fn('DATE', Sequelize.col('createdAt'))],
        order: [[Sequelize.fn('DATE', Sequelize.col('createdAt')), 'ASC']],
        raw: true
      })

      // Get daily active users (members who have created keys)
      const dailyUsers = await ApiKey.findAll({
        where: {
          organizationId,
          createdAt: {
            [Sequelize.Op.gte]: startDate
          }
        },
        attributes: [
          [Sequelize.fn('DATE', Sequelize.col('createdAt')), 'date'],
          [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('userId'))), 'users']
        ],
        group: [Sequelize.fn('DATE', Sequelize.col('createdAt'))],
        order: [[Sequelize.fn('DATE', Sequelize.col('createdAt')), 'ASC']],
        raw: true
      })

      // Combine the data
      const dailyData = []
      const dateMap = new Map()

      dailyKeys.forEach(item => {
        dateMap.set(item.date, { date: item.date, keys: parseInt(item.keys), users: 0 })
      })

      dailyUsers.forEach(item => {
        const existing = dateMap.get(item.date)
        if (existing) {
          existing.users = parseInt(item.users)
        } else {
          dateMap.set(item.date, { date: item.date, keys: 0, users: parseInt(item.users) })
        }
      })

      // Convert map to array and sort
      dailyData.push(...Array.from(dateMap.values()).sort((a, b) => new Date(a.date) - new Date(b.date)))

      const usageData = {
        daily: dailyData,
        weekly: [], // Could implement weekly aggregation if needed
        monthly: [] // Could implement monthly aggregation if needed
      }

      res.json(ApiResponse.success(usageData, 'Usage trends retrieved successfully'))

    } catch (error) {
      console.error('Analytics usage error:', error)
      res.status(500).json(ApiResponse.error('Failed to retrieve usage trends'))
    }
  }
)

// Get top games analytics
app.get('/analytics/games',
  authenticate,
  requireOrganizationAccess,
  async (req, res) => {
    try {
      const { organizationId } = req.user

      // Get game usage statistics from database
      const gameStats = await ApiKey.findAll({
        where: { organizationId },
        include: [
          {
            model: Game,
            as: 'game',
            attributes: ['name']
          }
        ],
        attributes: [
          'gameId',
          [Sequelize.fn('COUNT', '*'), 'usage'],
          [Sequelize.fn('SUM', Sequelize.col('usageCount')), 'totalUsage']
        ],
        group: ['gameId', 'game.id', 'game.name'],
        order: [[Sequelize.fn('COUNT', '*'), 'DESC']],
        raw: true
      })

      // Format the response
      const topGames = gameStats.map(stat => ({
        name: stat['game.name'] || 'Unknown Game',
        usage: parseInt(stat.usage),
        change: Math.floor(Math.random() * 20) - 10 // Mock change percentage for now
      }))

      res.json(ApiResponse.success(topGames, 'Top games retrieved successfully'))

    } catch (error) {
      console.error('Analytics games error:', error)
      res.status(500).json(ApiResponse.error('Failed to retrieve top games'))
    }
// Get recent activity
app.get('/analytics/activity',
  authenticate,
  requireOrganizationAccess,
  async (req, res) => {
    try {
      const { organizationId } = req.user

      // Get recent API key creations with user info
      const recentKeys = await ApiKey.findAll({
        where: { organizationId },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['firstName', 'lastName']
          },
          {
            model: Game,
            as: 'game',
            attributes: ['name']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: 10,
        attributes: ['id', 'createdAt', 'bulkQuantity']
      })

      // Format activity items
      const activity = recentKeys.map((key, index) => ({
        id: key.id,
        user: `${key.user?.firstName || 'Unknown'} ${key.user?.lastName || 'User'}`,
        action: `generated ${key.bulkQuantity || 1} ${key.game?.name || 'game'} key(s)`,
        time: getTimeAgo(key.createdAt),
        type: 'success'
      }))

      res.json(ApiResponse.success(activity, 'Recent activity retrieved successfully'))

    } catch (error) {
      console.error('Analytics activity error:', error)
      res.status(500).json(ApiResponse.error('Failed to retrieve recent activity'))
    }
  }
)

// Helper function to format time ago
function getTimeAgo(date) {
  const now = new Date()
  const diffMs = now - new Date(date)
  const diffMinutes = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMinutes < 60) {
    return `${diffMinutes} min${diffMinutes !== 1 ? 's' : ''} ago`
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
  } else {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
  }
}

module.exports.handler = serverless(app)