import { APIGatewayProxyHandler, APIGatewayProxyEvent, Context } from 'aws-lambda'
import { ApiResponse } from '@/utils/response'
import { createResponse } from '@/utils/lambda'
import { authenticate, requireOrganizationAccess } from '@/utils/auth'

const getOrganization = async (event: APIGatewayProxyEvent, context: Context) => {
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

    return createResponse(200, ApiResponse.success(orgResult.organization, 'Organization retrieved successfully'))
  } catch (error) {
    console.error('Get organization error:', error)
    return createResponse(500, ApiResponse.error('Internal server error'))
  }
}

export const handler: APIGatewayProxyHandler = getOrganization