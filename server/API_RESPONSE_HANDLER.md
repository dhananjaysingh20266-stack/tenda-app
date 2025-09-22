# API Response Handler Documentation

## Overview

The `ApiResponseHandler` is a comprehensive utility class that provides consistent response formatting for all API endpoints in the Tenda Gaming Key Platform. It consolidates and improves upon the existing response handling in `response.js` and `Common.js`.

## Features

- ✅ **Consistent Response Format**: Standardized response structure across all endpoints
- ✅ **HTTP Status Code Management**: Proper status codes for different response types
- ✅ **Exception Handling**: Comprehensive error handling and formatting
- ✅ **Pagination Support**: Built-in pagination response formatting
- ✅ **CORS Headers**: Automatic CORS header management
- ✅ **Lambda Compatible**: Supports both Lambda and Express response formats
- ✅ **Legacy Support**: Backward compatibility with existing Common.response format
- ✅ **TypeScript Ready**: Designed to be easily convertible to TypeScript

## Usage Examples

### Basic Success Response

```javascript
const { ApiResponseHandler } = require('./helpers/api-response-handler')

// Simple success response
const response = ApiResponseHandler.success(
  { id: 1, name: 'John Doe' },
  'User retrieved successfully'
)
```

### Resource Creation Response

```javascript
// For POST endpoints creating new resources
const response = ApiResponseHandler.created(
  { id: 2, name: 'New User' },
  'User created successfully'
)
```

### Error Responses

```javascript
// Basic error response
const response = ApiResponseHandler.error(
  'Something went wrong',
  ['Field validation failed', 'Email is required']
)

// Validation error
const response = ApiResponseHandler.validationError('Email is required')

// Specific error types
const response = ApiResponseHandler.unauthorized('Invalid credentials')
const response = ApiResponseHandler.forbidden('Access denied')
const response = ApiResponseHandler.notFound('User not found')
```

### Paginated Responses

```javascript
// For endpoints returning lists with pagination
const response = ApiResponseHandler.paginated(
  userData,          // Array of data
  1,                // Current page
  10,               // Items per page
  100,              // Total items
  'Users retrieved successfully'
)
```

### HTTP Responses for Lambda

```javascript
// For AWS Lambda functions
const httpResponse = ApiResponseHandler.httpSuccess(
  userData,
  'Success message',
  200
)

const httpError = ApiResponseHandler.httpError(
  'Error message',
  ['validation errors'],
  400
)
```

### Exception Handling

```javascript
const handler = async (event, context) => {
  try {
    // Your endpoint logic here
    return ApiResponseHandler.httpSuccess(data, 'Success')
  } catch (error) {
    // Automatic exception handling with proper status codes
    return ApiResponseHandler.handleHttpException(error, 'Endpoint Name')
  }
}
```

### Legacy Format Support

```javascript
// For backward compatibility with Common.response format
const response = ApiResponseHandler.legacyResponse(
  true,              // success
  'Success message', // message
  1,                // count
  userData,         // data
  200               // statusCode
)
```

## Response Structure

### Standard Response Format

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2025-09-22T16:25:33.612Z"
}
```

### Error Response Format

```json
{
  "success": false,
  "message": "Error message",
  "errors": ["Detailed error 1", "Detailed error 2"],
  "timestamp": "2025-09-22T16:25:33.612Z"
}
```

### Paginated Response Format

```json
{
  "success": true,
  "data": [...],
  "message": "Data retrieved successfully",
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  },
  "timestamp": "2025-09-22T16:25:33.612Z"
}
```

### Lambda HTTP Response Format

```json
{
  "statusCode": 200,
  "headers": {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE"
  },
  "body": "{...}"
}
```

## Migration Guide

### From response.js

**Before:**
```javascript
const { ApiResponse } = require('./utils/response')
return createResponse(200, ApiResponse.success(data, 'Success'))
```

**After:**
```javascript
const { ApiResponseHandler } = require('./helpers/api-response-handler')
return ApiResponseHandler.httpSuccess(data, 'Success')
```

### From Common.js

**Before:**
```javascript
const { Common } = require('./helpers/Common')
return Common.response(true, 'Success', 1, data, 200)
```

**After:**
```javascript
const { ApiResponseHandler } = require('./helpers/api-response-handler')
return ApiResponseHandler.legacyResponse(true, 'Success', 1, data, 200)
```

## Error Types and Status Codes

| Error Type | Method | Default Status Code |
|------------|--------|-------------------|
| Validation Error | `validationError()` | 400 |
| Unauthorized | `unauthorized()` | 401 |
| Forbidden | `forbidden()` | 403 |
| Not Found | `notFound()` | 404 |
| Internal Error | `internalError()` | 500 |

## Exception Handling

The `handleException()` and `handleHttpException()` methods automatically:

1. Log errors with context
2. Handle specific exception types (ValidationError, UnauthorizedError, etc.)
3. Extract appropriate HTTP status codes
4. Format error responses consistently
5. Hide sensitive error details in production

## Best Practices

1. **Use specific response methods**: Use `created()` for POST endpoints, `success()` for GET endpoints
2. **Consistent error handling**: Always use `handleHttpException()` in catch blocks
3. **Meaningful messages**: Provide clear, user-friendly messages
4. **Status codes**: Let the handler manage status codes automatically
5. **Validation**: Use `validationError()` for input validation failures

## Files Modified

- **Created**: `server/src/helpers/api-response-handler.js` - Main response handler
- **Updated**: `server/src/functions/services/getPricing.js` - Example of new handler usage
- **Updated**: `server/src/functions/auth/login.js` - Example of legacy format support
- **Created**: `server/src/functions/examples/resource-management.js` - Example endpoints

## Testing

The response handler has been tested with:
- Success responses
- Error responses  
- Validation errors
- Paginated responses
- HTTP response formatting
- Exception handling

All tests passed successfully, confirming the handler works as expected.