/**
 * Comprehensive API Response Handler
 * Provides consistent response formatting for all API endpoints
 * Consolidates functionality from response.js and Common.js
 */

const { Constants } = require('./Constants')
const { Messages } = require('./Messages')

class ApiResponseHandler {
  /**
   * Get CORS headers for cross-origin requests
   * @returns {Object} CORS headers
   */
  static getCORSHeaders() {
    return {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE'
    }
  }

  /**
   * Create a successful response
   * @param {*} data - Response data
   * @param {string} message - Success message
   * @param {number} statusCode - HTTP status code (default: 200)
   * @returns {Object} Success response object
   */
  static success(data = null, message = 'Success', statusCode = Constants.STATUS_SUCCESS) {
    return {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString()
    }
  }

  /**
   * Create a successful response for resource creation
   * @param {*} data - Created resource data
   * @param {string} message - Creation success message
   * @returns {Object} Creation success response object
   */
  static created(data = null, message = 'Resource created successfully') {
    return {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString()
    }
  }

  /**
   * Create an error response
   * @param {string} message - Error message
   * @param {Array|string} errors - Detailed error information
   * @param {number} statusCode - HTTP status code (default: 400)
   * @returns {Object} Error response object
   */
  static error(message = 'An error occurred', errors = null, statusCode = Constants.STATUS_BAD_REQUEST) {
    const response = {
      success: false,
      message,
      timestamp: new Date().toISOString()
    }

    if (errors) {
      response.errors = Array.isArray(errors) ? errors : [errors]
    }

    return response
  }

  /**
   * Create a validation error response
   * @param {Object|string} validationError - Joi validation error or custom message
   * @returns {Object} Validation error response object
   */
  static validationError(validationError) {
    let message = 'Validation Error'
    let errors = []

    if (typeof validationError === 'string') {
      message = validationError
    } else if (validationError && validationError.details) {
      // Joi validation error
      message = Messages.VLD_ERR(validationError)
      errors = validationError.details.map(detail => detail.message)
    } else if (validationError && validationError.message) {
      message = validationError.message
    }

    return this.error(message, errors, Constants.STATUS_BAD_REQUEST)
  }

  /**
   * Create an unauthorized error response
   * @param {string} message - Unauthorized message
   * @returns {Object} Unauthorized error response object
   */
  static unauthorized(message = Messages.INVALID_CREDENTIALS) {
    return this.error(message, null, Constants.STATUS_UNAUTHORIZED)
  }

  /**
   * Create a forbidden error response
   * @param {string} message - Forbidden message
   * @returns {Object} Forbidden error response object
   */
  static forbidden(message = Messages.ACCESS_DENIED) {
    return this.error(message, null, Constants.STATUS_FORBIDDEN)
  }

  /**
   * Create a not found error response
   * @param {string} message - Not found message
   * @returns {Object} Not found error response object
   */
  static notFound(message = 'Resource not found') {
    return this.error(message, null, Constants.STATUS_NOT_FOUND)
  }

  /**
   * Create an internal server error response
   * @param {string} message - Internal error message
   * @returns {Object} Internal server error response object
   */
  static internalError(message = Messages.INTERNAL_ERROR) {
    return this.error(message, null, Constants.STATUS_INTERNAL_ERROR)
  }

  /**
   * Create a paginated response
   * @param {Array} data - Array of data items
   * @param {number} page - Current page number
   * @param {number} limit - Items per page
   * @param {number} total - Total number of items
   * @param {string} message - Success message
   * @returns {Object} Paginated response object
   */
  static paginated(data = [], page = 1, limit = 10, total = 0, message = 'Data retrieved successfully') {
    return {
      success: true,
      data,
      message,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(total),
        totalPages: Math.ceil(total / limit)
      },
      timestamp: new Date().toISOString()
    }
  }

  /**
   * Create a Lambda-compatible HTTP response
   * @param {number} statusCode - HTTP status code
   * @param {Object} body - Response body
   * @returns {Object} Lambda HTTP response object
   */
  static createHttpResponse(statusCode, body) {
    return {
      statusCode,
      headers: this.getCORSHeaders(),
      body: JSON.stringify(body)
    }
  }

  /**
   * Create a Lambda success response
   * @param {*} data - Response data
   * @param {string} message - Success message
   * @param {number} statusCode - HTTP status code
   * @returns {Object} Lambda success response
   */
  static httpSuccess(data = null, message = 'Success', statusCode = Constants.STATUS_SUCCESS) {
    const responseBody = this.success(data, message, statusCode)
    return this.createHttpResponse(statusCode, responseBody)
  }

  /**
   * Create a Lambda error response
   * @param {string} message - Error message
   * @param {Array|string} errors - Detailed error information
   * @param {number} statusCode - HTTP status code
   * @returns {Object} Lambda error response
   */
  static httpError(message = 'An error occurred', errors = null, statusCode = Constants.STATUS_BAD_REQUEST) {
    const responseBody = this.error(message, errors, statusCode)
    return this.createHttpResponse(statusCode, responseBody)
  }

  /**
   * Handle exceptions and create appropriate error responses
   * @param {Error} exception - Exception object
   * @param {string} context - Context where the exception occurred
   * @returns {Object} Exception error response
   */
  static handleException(exception, context = 'API') {
    console.error(`${context} Exception:`, exception)
    
    // Handle specific exception types
    if (exception.name === 'ValidationError') {
      return this.validationError(exception)
    }
    
    if (exception.name === 'UnauthorizedError') {
      return this.unauthorized(exception.message)
    }
    
    if (exception.name === 'ForbiddenError') {
      return this.forbidden(exception.message)
    }
    
    if (exception.name === 'NotFoundError') {
      return this.notFound(exception.message)
    }

    // Generic exception handling
    const message = process.env.NODE_ENV === 'development' 
      ? exception.message || Messages.INTERNAL_ERROR
      : Messages.INTERNAL_ERROR

    return this.internalError(message)
  }

  /**
   * Handle exceptions and create Lambda HTTP error response
   * @param {Error} exception - Exception object
   * @param {string} context - Context where the exception occurred
   * @returns {Object} Lambda exception error response
   */
  static handleHttpException(exception, context = 'API') {
    const errorResponse = this.handleException(exception, context)
    const statusCode = this.getStatusCodeFromError(exception)
    return this.createHttpResponse(statusCode, errorResponse)
  }

  /**
   * Extract HTTP status code from exception
   * @param {Error} exception - Exception object
   * @returns {number} HTTP status code
   */
  static getStatusCodeFromError(exception) {
    if (exception.statusCode) return exception.statusCode
    if (exception.status) return exception.status
    
    switch (exception.name) {
      case 'ValidationError':
        return Constants.STATUS_BAD_REQUEST
      case 'UnauthorizedError':
        return Constants.STATUS_UNAUTHORIZED
      case 'ForbiddenError':
        return Constants.STATUS_FORBIDDEN
      case 'NotFoundError':
        return Constants.STATUS_NOT_FOUND
      default:
        return Constants.STATUS_INTERNAL_ERROR
    }
  }

  /**
   * Legacy support: Common.response format
   * @param {boolean} success - Success status
   * @param {string} message - Response message
   * @param {number} count - Item count (for backward compatibility)
   * @param {*} data - Response data
   * @param {number} statusCode - HTTP status code
   * @returns {Object} Legacy format response
   */
  static legacyResponse(success, message, count = 0, data = null, statusCode = Constants.STATUS_SUCCESS) {
    return {
      statusCode: statusCode,
      headers: this.getCORSHeaders(),
      body: JSON.stringify({
        success,
        message,
        count,
        data,
        timestamp: new Date().toISOString()
      })
    }
  }
}

module.exports = { ApiResponseHandler }