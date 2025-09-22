const { ApiResponse } = require('../../utils/response')
const { createResponse } = require('../../utils/lambda')
const { authenticate, requireOrganizationAccess } = require('../../utils/auth')

const createUser = async (event, context) => {
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

    // Parse request body
    const payloadData = event.body ? JSON.parse(event.body) : {}
    const { email, firstName, lastName, role } = payloadData

    // Mock user creation
    const newUser = {
      id: Date.now(),
      email,
      firstName,
      lastName,
      role: role || 'member',
      status: 'pending',
      organizationId: orgResult.organization.id,
      createdAt: new Date().toISOString()
    }

    return createResponse(201, ApiResponse.success(newUser, 'User created successfully'))
  } catch (error) {
    console.error('Create user error:', error)
    return createResponse(500, ApiResponse.error('Internal server error'))
  }
}

module.exports = { handler: createUser }