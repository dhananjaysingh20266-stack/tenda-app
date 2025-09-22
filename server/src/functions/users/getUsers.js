const { ApiResponse } = require('../../utils/response')
const { createResponse } = require('../../utils/lambda')
const { authenticate, requireOrganizationAccess } = require('../../utils/auth')

const getUsers = async (event, context) => {
  try {
    // Authenticate user
    const authResult = await authenticate(event)
    if (!authResult.success) {
      return createResponse(authResult.statusCode || 401, ApiResponse.error(authResult.error || 'Authentication failed'))
    }

    // Check organization access
    const orgResult = await requireOrganizationAccess(authResult.user)
    if (!orgResult.success) {
      return createResponse(orgResult.statusCode || 403, ApiResponse.error(orgResult.error || 'Access denied'))
    }

    // Mock data for organization users
    const mockUsers = [
      {
        id: authResult.user.userId,
        email: authResult.user.email,
        firstName: authResult.user.firstName,
        lastName: authResult.user.lastName,
        role: 'owner',
        status: 'active',
        lastLogin: authResult.user.lastLogin,
        createdAt: authResult.user.createdAt
      }
    ]

    return createResponse(200, ApiResponse.success(mockUsers, 'Users retrieved successfully'))
  } catch (error) {
    console.error('Get users error:', error)
    return createResponse(500, ApiResponse.error('Internal server error'))
  }
}

module.exports = { handler: getUsers }