const getCORSHeaders = () => ({
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE'
})

const createResponse = (statusCode, body) => ({
  statusCode,
  headers: getCORSHeaders(),
  body: JSON.stringify(body)
})

module.exports = {
  getCORSHeaders,
  createResponse
}