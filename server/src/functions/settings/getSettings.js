const { APIGatewayProxyHandler } = require('aws-lambda')
const serverless = require('serverless-http')
const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const { authenticate, requireOrganizationAccess } = require('../../helpers/auth')
const { User, Organization } = require('../../models')
const { ApiResponse } = require('../../utils/response')

const app = express()

app.use(cors())
app.use(express.json())

// Get user profile settings
app.get('/settings/profile',
  authenticate,
  async (req, res) => {
    try {
      const { userId } = req.user

      const user = await User.findByPk(userId, {
        attributes: ['id', 'email', 'firstName', 'lastName', 'isActive', 'emailVerified']
      })

      if (!user) {
        return res.status(404).json(ApiResponse.error('User not found'))
      }

      res.json(ApiResponse.success(user, 'Profile retrieved successfully'))

    } catch (error) {
      console.error('Get profile error:', error)
      res.status(500).json(ApiResponse.error('Failed to retrieve profile'))
    }
  }
)

// Update user profile
app.put('/settings/profile',
  authenticate,
  async (req, res) => {
    try {
      const { userId } = req.user
      const { firstName, lastName, email } = req.body

      // Validate required fields
      if (!firstName || !lastName || !email) {
        return res.status(400).json(ApiResponse.error('First name, last name, and email are required'))
      }

      // Check if email is already taken by another user
      const existingUser = await User.findOne({
        where: {
          email,
          id: { [require('sequelize').Op.ne]: userId }
        }
      })

      if (existingUser) {
        return res.status(400).json(ApiResponse.error('Email is already taken'))
      }

      // Update user
      await User.update(
        { firstName, lastName, email },
        { where: { id: userId } }
      )

      const updatedUser = await User.findByPk(userId, {
        attributes: ['id', 'email', 'firstName', 'lastName', 'isActive', 'emailVerified']
      })

      res.json(ApiResponse.success(updatedUser, 'Profile updated successfully'))

    } catch (error) {
      console.error('Update profile error:', error)
      res.status(500).json(ApiResponse.error('Failed to update profile'))
    }
  }
)

// Update password
app.put('/settings/password',
  authenticate,
  async (req, res) => {
    try {
      const { userId } = req.user
      const { currentPassword, newPassword } = req.body

      // Validate required fields
      if (!currentPassword || !newPassword) {
        return res.status(400).json(ApiResponse.error('Current password and new password are required'))
      }

      // Validate new password length
      if (newPassword.length < 6) {
        return res.status(400).json(ApiResponse.error('New password must be at least 6 characters long'))
      }

      // Get user with password
      const user = await User.findByPk(userId)
      if (!user) {
        return res.status(404).json(ApiResponse.error('User not found'))
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)
      if (!isCurrentPasswordValid) {
        return res.status(400).json(ApiResponse.error('Current password is incorrect'))
      }

      // Hash new password
      const saltRounds = 12
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds)

      // Update password
      await User.update(
        { password: hashedNewPassword },
        { where: { id: userId } }
      )

      res.json(ApiResponse.success(null, 'Password updated successfully'))

    } catch (error) {
      console.error('Update password error:', error)
      res.status(500).json(ApiResponse.error('Failed to update password'))
    }
  }
)

// Get organization settings
app.get('/settings/organization',
  authenticate,
  requireOrganizationAccess,
  async (req, res) => {
    try {
      const { organizationId } = req.user

      const organization = await Organization.findByPk(organizationId, {
        attributes: ['id', 'name', 'description', 'website', 'industry', 'companySize', 'billingEmail']
      })

      if (!organization) {
        return res.status(404).json(ApiResponse.error('Organization not found'))
      }

      res.json(ApiResponse.success(organization, 'Organization settings retrieved successfully'))

    } catch (error) {
      console.error('Get organization settings error:', error)
      res.status(500).json(ApiResponse.error('Failed to retrieve organization settings'))
    }
  }
)

// Update organization settings
app.put('/settings/organization',
  authenticate,
  requireOrganizationAccess,
  async (req, res) => {
    try {
      const { organizationId } = req.user
      const { name, description, website, industry, companySize, billingEmail } = req.body

      // Validate required fields
      if (!name) {
        return res.status(400).json(ApiResponse.error('Organization name is required'))
      }

      // Validate email format if provided
      if (billingEmail && !billingEmail.includes('@')) {
        return res.status(400).json(ApiResponse.error('Invalid billing email format'))
      }

      // Update organization
      await Organization.update(
        { name, description, website, industry, companySize, billingEmail },
        { where: { id: organizationId } }
      )

      const updatedOrganization = await Organization.findByPk(organizationId, {
        attributes: ['id', 'name', 'description', 'website', 'industry', 'companySize', 'billingEmail']
      })

      res.json(ApiResponse.success(updatedOrganization, 'Organization settings updated successfully'))

    } catch (error) {
      console.error('Update organization settings error:', error)
      res.status(500).json(ApiResponse.error('Failed to update organization settings'))
    }
  }
)

// Get notification preferences (mock for now)
app.get('/settings/notifications',
  authenticate,
  async (req, res) => {
    try {
      // For now, return mock notification preferences
      // In a real implementation, you would store these in the database
      const mockPreferences = {
        keyGenerationAlerts: true,
        securityAlerts: true,
        usageReports: true,
        teamUpdates: false
      }

      res.json(ApiResponse.success(mockPreferences, 'Notification preferences retrieved successfully'))

    } catch (error) {
      console.error('Get notification preferences error:', error)
      res.status(500).json(ApiResponse.error('Failed to retrieve notification preferences'))
    }
  }
)

// Update notification preferences (mock for now)
app.put('/settings/notifications',
  authenticate,
  async (req, res) => {
    try {
      const { keyGenerationAlerts, securityAlerts, usageReports, teamUpdates } = req.body

      // For now, just return success
      // In a real implementation, you would save these to the database
      const updatedPreferences = {
        keyGenerationAlerts: keyGenerationAlerts !== undefined ? keyGenerationAlerts : true,
        securityAlerts: securityAlerts !== undefined ? securityAlerts : true,
        usageReports: usageReports !== undefined ? usageReports : true,
        teamUpdates: teamUpdates !== undefined ? teamUpdates : false
      }

      res.json(ApiResponse.success(updatedPreferences, 'Notification preferences updated successfully'))

    } catch (error) {
      console.error('Update notification preferences error:', error)
      res.status(500).json(ApiResponse.error('Failed to update notification preferences'))
    }
  }
)

module.exports.handler = serverless(app)