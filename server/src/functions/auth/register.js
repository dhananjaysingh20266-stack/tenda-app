const bcrypt = require('bcryptjs')
const { User, Organization, UserTypeLookup } = require('../../models')
const { registerSchema } = require('../../validators/auth')
const { ApiResponse } = require('../../utils/response')
const { generateToken } = require('../../utils/jwt')
const { createResponse } = require('../../utils/lambda')

const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const register = async (event, context) => {
  try {
    // Parse request body
    const payloadData = event.body ? JSON.parse(event.body) : {}
    
    // Validate input
    const { error, value } = registerSchema.validate(payloadData)
    if (error) {
      const errors = error.details.map(detail => detail.message)
      return createResponse(400, ApiResponse.error('Validation failed', errors))
    }

    const { email, password, firstName, lastName, organizationName } = value

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return createResponse(400, ApiResponse.error('User already exists'))
    }

    // Generate slug and check if organization already exists
    let slug = generateSlug(organizationName)
    const existingOrg = await Organization.findOne({ where: { slug } })
    if (existingOrg) {
      // Append timestamp to make unique
      slug = `${slug}-${Date.now()}`
    }

    // Hash password
    const saltRounds = 12
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // Get Owner user type
    const ownerType = await UserTypeLookup.findOne({ 
      where: { name: 'Owner', isActive: true } 
    })
    if (!ownerType) {
      return createResponse(500, ApiResponse.error('Owner user type not found. Please seed the database.'))
    }

    // Create user and organization in a transaction
    const user = await User.create({
      email,
      passwordHash,
      firstName,
      lastName,
      userTypId: ownerType.id,
      isActive: true,
      emailVerified: false,
      loginAttempts: 0,
    })

    const organization = await Organization.create({
      name: organizationName,
      slug,
      ownerId: user.id,
      subscriptionTier: 'free',
      isActive: true,
    })

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      organizationId: organization.id,
      type: 'organization',
      userType: 'Owner'
    })

    // Remove password hash from response
    const userResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      type: 'organization',
      userType: 'Owner',
      isActive: user.isActive,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }

    return createResponse(201, ApiResponse.success({
      user: userResponse,
      organization,
      token,
      expiresIn: 7 * 24 * 60 * 60 // 7 days in seconds
    }, 'Registration successful'))

  } catch (error) {
    console.error('Registration error:', error)
    return createResponse(500, ApiResponse.error('Internal server error'))
  }
}

module.exports = { handler: register }