const jwt = require('jsonwebtoken')
const { JWT_CONFIG } = require('../config/jwt')

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_CONFIG.secret, {
    expiresIn: '7d',
  })
}

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_CONFIG.secret)
  } catch (error) {
    throw new Error('Invalid token')
  }
}

const decodeToken = (token) => {
  try {
    return jwt.decode(token)
  } catch (error) {
    return null
  }
}

module.exports = {
  generateToken,
  verifyToken,
  decodeToken
}