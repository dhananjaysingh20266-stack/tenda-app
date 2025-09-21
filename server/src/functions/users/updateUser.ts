import { APIGatewayProxyHandler, APIGatewayProxyEvent, Context } from 'aws-lambda'
import { ApiResponse } from '@/utils/response'
import { createResponse } from '@/utils/lambda'
import { authenticate, requireOrganizationAccess } from '@/utils/auth'

const updateUser = async (event: APIGatewayProxyEvent, context: Context) => {
  try {
    // Authenticate user
    const authResult = await authenticate(event)
    if (!authResult.success) {
      return createResponse(authResult.statusCode || 401, ApiResponse.error(authResult.error || 'Authentication failed'))
    }

    // Check organization access
    const orgResult = await requireOrganizationAccess(authResult.user!)
    if (!orgResult.success) {
      return createResponse(orgResult.statusCode || 403, ApiResponse.error(orgResult.error || 'Access denied'))
    }

    // Get user ID from path parameters
    const { id } = event.pathParameters || {}
    if (!id) {
      return createResponse(400, ApiResponse.error('User ID is required'))
    }

    // Parse request body
    const payloadData = event.body ? JSON.parse(event.body) : {}
    const { firstName, lastName, role, status } = payloadData

    // Mock user update
    const updatedUser = {
      id: parseInt(id),
      email: 'user@example.com', // Mock data
      firstName,
      lastName,
      role,
      status,
      organizationId: orgResult.organization!.id,
      updatedAt: new Date().toISOString()
    }

    return createResponse(200, ApiResponse.success(updatedUser, 'User updated successfully'))
  } catch (error) {
    console.error('Update user error:', error)
    return createResponse(500, ApiResponse.error('Internal server error'))
  }
}

export const handler: APIGatewayProxyHandler = updateUser