const Messages = {
  VLD_ERR: (error) => 'Validation Error: ' + (error.details ? error.details.map((d) => d.message).join(', ') : error.message),
  NO_USER_FOUND: 'User not found',
  NO_ORGANIZATION_FOUND: 'Organization not found',
  NO_GAME_FOUND: 'Game not found',
  INVALID_CREDENTIALS: 'Invalid credentials',
  ACCESS_DENIED: 'Access denied',
  ACCOUNT_LOCKED: 'Account temporarily locked',
  USER_EXISTS: 'User already exists',
  INTERNAL_ERROR: 'Internal server error',
  LOGIN_SUCCESS: 'Login successful',
  REGISTER_SUCCESS: 'Registration successful',
  KEYS_RETRIEVED: 'Keys retrieved successfully',
  KEY_GENERATION_SUCCESS: 'Key generation successful',
  KEY_GENERATION_FAILED: 'Key generation failed',
  ORGANIZATION_RETRIEVED: 'Organization retrieved successfully',
  ORGANIZATION_UPDATED: 'Organization updated successfully',
  USERS_RETRIEVED: 'Users retrieved successfully',
  USER_CREATED: 'User created successfully',
  USER_UPDATED: 'User updated successfully',
  GAMES_RETRIEVED: 'Games retrieved successfully',
  PRICING_RETRIEVED: 'Pricing retrieved successfully'
}

module.exports = { Messages }