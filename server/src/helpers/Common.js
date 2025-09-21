const Common = {
  response: (
    success, 
    message, 
    count = 0, 
    data = null, 
    statusCode = 200
  ) => {
    return {
      statusCode: statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE'
      },
      body: JSON.stringify({
        success,
        message,
        count,
        data,
        timestamp: new Date().toISOString()
      })
    }
  },

  parseBody: (body) => {
    try {
      return body ? JSON.parse(body) : {}
    } catch (error) {
      return {}
    }
  },

  validateRequired: (data, fields) => {
    const missing = fields.filter(field => !data[field])
    return missing.length > 0 ? `Missing required fields: ${missing.join(', ')}` : null
  }
}

module.exports = { Common }