const { APIGatewayProxyHandler } = require('aws-lambda')
const serverless = require('serverless-http')
const express = require('express')
const cors = require('cors')
const { authenticate, requireOrganizationAccess } = require('../../helpers/auth')
const { ApiKey, User, Organization } = require('../../models')
const { ApiResponse } = require('../../utils/response')

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

      // Get total users/members
      const totalUsers = await User.count({
        where: { organizationId }
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

      // Calculate average session time (mock calculation for now)
      const avgSessionTime = '2.4h'

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

      // For now, return mock data
      // In a real implementation, you would query the database for actual usage data
      const mockUsageData = {
        daily: [
          { date: '2024-01-01', keys: 45, users: 12 },
          { date: '2024-01-02', keys: 52, users: 15 },
          { date: '2024-01-03', keys: 38, users: 11 },
          { date: '2024-01-04', keys: 67, users: 18 },
          { date: '2024-01-05', keys: 71, users: 20 },
          { date: '2024-01-06', keys: 59, users: 16 },
          { date: '2024-01-07', keys: 63, users: 17 },
        ],
        weekly: [
          { week: 'Week 1', keys: 320, users: 89 },
          { week: 'Week 2', keys: 410, users: 102 },
          { week: 'Week 3', keys: 380, users: 95 },
          { week: 'Week 4', keys: 450, users: 118 },
        ],
        monthly: [
          { month: 'Oct', keys: 1200, users: 280 },
          { month: 'Nov', keys: 1450, users: 320 },
          { month: 'Dec', keys: 1560, users: 404 },
        ]
      }

      res.json(ApiResponse.success(mockUsageData, 'Usage trends retrieved successfully'))

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

      // For now, return mock data
      // In a real implementation, you would query the database for actual game usage data
      const mockGamesData = [
        { name: 'PUBG Mobile', usage: 45, change: 12.5 },
        { name: 'Free Fire', usage: 32, change: -2.3 },
        { name: 'Call of Duty', usage: 28, change: 8.7 },
        { name: 'Valorant', usage: 15, change: 15.2 },
      ]

      res.json(ApiResponse.success(mockGamesData, 'Game analytics retrieved successfully'))

    } catch (error) {
      console.error('Analytics games error:', error)
      res.status(500).json(ApiResponse.error('Failed to retrieve game analytics'))
    }
  }
)

// Get recent activity
app.get('/analytics/activity',
  authenticate,
  requireOrganizationAccess,
  async (req, res) => {
    try {
      const { organizationId } = req.user

      // For now, return mock data
      // In a real implementation, you would query activity logs from the database
      const mockActivity = [
        { id: 1, user: 'John Doe', action: 'generated 5 PUBG keys', time: '2 min ago', type: 'success' },
        { id: 2, user: 'Jane Smith', action: 'joined the organization', time: '1 hour ago', type: 'info' },
        { id: 3, user: 'System', action: 'exported API key batch', time: '3 hours ago', type: 'warning' },
        { id: 4, user: 'Mike Johnson', action: 'updated security settings', time: '1 day ago', type: 'success' },
        { id: 5, user: 'Sarah Wilson', action: 'reached usage limit', time: '2 days ago', type: 'warning' },
      ]

      res.json(ApiResponse.success(mockActivity, 'Recent activity retrieved successfully'))

    } catch (error) {
      console.error('Analytics activity error:', error)
      res.status(500).json(ApiResponse.error('Failed to retrieve recent activity'))
    }
  }
)

module.exports.handler = serverless(app)