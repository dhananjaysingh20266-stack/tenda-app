/**
 * Example API endpoint using the new ApiResponseHandler
 * Demonstrates create operation and exception handling
 */

const { ApiResponseHandler } = require('../../helpers/api-response-handler')
const { Common } = require('../../helpers/Common')

const createResource = async (event, context) => {
  try {
    // Parse request body
    const payloadData = Common.parseBody(event.body)
    
    // Validate required fields
    const requiredFields = ['name', 'description']
    const validationError = Common.validateRequired(payloadData, requiredFields)
    
    if (validationError) {
      // Using new validation error handler
      return ApiResponseHandler.httpError(validationError, null, 400)
    }

    // Simulate resource creation
    const newResource = {
      id: Math.floor(Math.random() * 1000) + 1,
      name: payloadData.name,
      description: payloadData.description,
      createdAt: new Date().toISOString(),
      status: 'active'
    }

    // Using the new created response handler
    return ApiResponseHandler.httpSuccess(newResource, 'Resource created successfully', 201)

  } catch (error) {
    // Using comprehensive exception handling
    return ApiResponseHandler.handleHttpException(error, 'Create Resource')
  }
}

const getResources = async (event, context) => {
  try {
    const { page = 1, limit = 10 } = event.queryStringParameters || {}
    
    // Simulate database query
    const mockData = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      name: `Resource ${i + 1}`,
      description: `Description for resource ${i + 1}`,
      status: 'active'
    }))

    const total = 25 // Mock total count

    // Using paginated response handler
    return ApiResponseHandler.createHttpResponse(
      200,
      ApiResponseHandler.paginated(mockData, page, limit, total, 'Resources retrieved successfully')
    )

  } catch (error) {
    return ApiResponseHandler.handleHttpException(error, 'Get Resources')
  }
}

module.exports = { 
  createResource,
  getResources
}