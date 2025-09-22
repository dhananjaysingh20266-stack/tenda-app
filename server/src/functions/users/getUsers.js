const { APIGatewayProxyHandler } = require('aws-lambda')
const serverless = require('serverless-http')
const express = require('express')
const cors = require('cors')
const { authenticate, requireOrganizationAccess } = require('../../helpers/auth')
const { User, Organization } = require('../../models')
const { ApiResponse } = require('../../utils/response')

const app = express()

app.use(cors())
app.use(express.json())

// Get organization members
app.get('/users',
  authenticate,
  requireOrganizationAccess,
  async (req, res) => {
    try {
      const { organizationId } = req.user
      const { status, role, search } = req.query

      let whereClause = { organizationId }

      // Add filters
      if (status && status !== 'all') {
        whereClause.isActive = status === 'active'
      }

      // For search, we'll search in firstName, lastName, or email
      if (search) {
        const { Op } = require('sequelize')
        whereClause[Op.or] = [
          { firstName: { [Op.iLike]: `%${search}%` } },
          { lastName: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } }
        ]
      }

      const users = await User.findAll({
        where: whereClause,
        attributes: ['id', 'email', 'firstName', 'lastName', 'isActive', 'emailVerified', 'createdAt', 'updatedAt'],
        order: [['createdAt', 'DESC']]
      })

      // Transform users to match frontend expectations
      const transformedUsers = users.map(user => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.id === req.user.userId ? 'admin' : 'member', // Simple role assignment for now
        status: user.isActive ? 'active' : 'inactive',
        lastActive: '2 hours ago', // Mock data for now
        joinedAt: user.createdAt,
        permissions: user.id === req.user.userId 
          ? ['manage_users', 'manage_keys', 'view_analytics'] 
          : ['manage_keys', 'view_analytics']
      }))

      res.json(ApiResponse.success(transformedUsers, 'Members retrieved successfully'))

    } catch (error) {
      console.error('Get users error:', error)
      res.status(500).json(ApiResponse.error('Failed to retrieve members'))
    }
  }
)

// Invite new member (creates a user with pending status)
app.post('/users/invite',
  authenticate,
  requireOrganizationAccess,
  async (req, res) => {
    try {
      const { organizationId } = req.user
      const { email, role = 'member' } = req.body

      // Validate email
      if (!email || !email.includes('@')) {
        return res.status(400).json(ApiResponse.error('Valid email address is required'))
      }

      // Check if user already exists in this organization
      const existingUser = await User.findOne({
        where: { email, organizationId }
      })

      if (existingUser) {
        return res.status(400).json(ApiResponse.error('User is already a member of this organization'))
      }

      // For now, we'll create a placeholder user record
      // In a real implementation, you'd send an invitation email instead
      const newUser = await User.create({
        email,
        firstName: 'Pending',
        lastName: 'User',
        password: 'temporary_password', // This would be replaced when user accepts invitation
        organizationId,
        isActive: false, // Pending invitation
        emailVerified: false
      })

      const responseUser = {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: role,
        status: 'pending',
        lastActive: 'Never',
        joinedAt: newUser.createdAt,
        permissions: role === 'admin' 
          ? ['manage_users', 'manage_keys', 'view_analytics'] 
          : ['manage_keys', 'view_analytics']
      }

      res.json(ApiResponse.success(responseUser, 'Invitation sent successfully'))

    } catch (error) {
      console.error('Invite user error:', error)
      res.status(500).json(ApiResponse.error('Failed to send invitation'))
    }
  }
)

// Update member
app.put('/users/:userId',
  authenticate,
  requireOrganizationAccess,
  async (req, res) => {
    try {
      const { organizationId } = req.user
      const { userId } = req.params
      const { firstName, lastName, email, role, isActive } = req.body

      // Find user in the same organization
      const user = await User.findOne({
        where: { id: userId, organizationId }
      })

      if (!user) {
        return res.status(404).json(ApiResponse.error('User not found'))
      }

      // Update user fields
      const updateData = {}
      if (firstName !== undefined) updateData.firstName = firstName
      if (lastName !== undefined) updateData.lastName = lastName
      if (email !== undefined) updateData.email = email
      if (isActive !== undefined) updateData.isActive = isActive

      await user.update(updateData)

      const responseUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: role || 'member',
        status: user.isActive ? 'active' : 'inactive',
        lastActive: '2 hours ago',
        joinedAt: user.createdAt,
        permissions: role === 'admin' 
          ? ['manage_users', 'manage_keys', 'view_analytics'] 
          : ['manage_keys', 'view_analytics']
      }

      res.json(ApiResponse.success(responseUser, 'Member updated successfully'))

    } catch (error) {
      console.error('Update user error:', error)
      res.status(500).json(ApiResponse.error('Failed to update member'))
    }
  }
)

// Remove member
app.delete('/users/:userId',
  authenticate,
  requireOrganizationAccess,
  async (req, res) => {
    try {
      const { organizationId, userId: currentUserId } = req.user
      const { userId } = req.params

      // Prevent self-deletion
      if (userId == currentUserId) {
        return res.status(400).json(ApiResponse.error('You cannot remove yourself'))
      }

      // Find user in the same organization
      const user = await User.findOne({
        where: { id: userId, organizationId }
      })

      if (!user) {
        return res.status(404).json(ApiResponse.error('User not found'))
      }

      // Soft delete by setting isActive to false
      await user.update({ isActive: false })

      res.json(ApiResponse.success(null, 'Member removed successfully'))

    } catch (error) {
      console.error('Remove user error:', error)
      res.status(500).json(ApiResponse.error('Failed to remove member'))
    }
  }
)

module.exports.handler = serverless(app)