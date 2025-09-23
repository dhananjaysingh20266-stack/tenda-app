const bcrypt = require('bcryptjs')
const { User, OrganizationMember, UserTypeLookup } = require('../../models')
const { ApiResponse } = require('../../utils/response')
const { createResponse } = require('../../utils/lambda')
const { authenticate, requireOrganizationAccess } = require('../../utils/auth')

const createUser = async (event, context) => {
  try {
    // Authenticate user
    const authResult = await authenticate(event)
    if (!authResult.success) {
      return createResponse(authResult.statusCode || 401, ApiResponse.error(authResult.error || 'Authentication failed'))
    }

    // Check organization access
    const orgResult = await requireOrganizationAccess(authResult.user)
    if (!orgResult.success) {
      return createResponse(orgResult.statusCode || 403, ApiResponse.error(orgResult.error || 'Access denied'))
    }

    // Parse request body
    const payloadData = event.body ? JSON.parse(event.body) : {}
    const { email, firstName, lastName, role, password } = payloadData

    // Validate required fields
    if (!email || !password) {
      return createResponse(400, ApiResponse.error('Email and password are required'))
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return createResponse(400, ApiResponse.error('User with this email already exists'))
    }

    // Get Member user type
    const memberType = await UserTypeLookup.findOne({ 
      where: { name: 'Member', isActive: true } 
    })
    if (!memberType) {
      return createResponse(500, ApiResponse.error('Member user type not found. Please seed the database.'))
    }

    // Hash password
    const saltRounds = 12
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // Create user as member
    const newUser = await User.create({
      email,
      passwordHash,
      firstName,
      lastName,
      userTypId: memberType.id,
      organizationId: orgResult.organization.id,
      isActive: true,
      emailVerified: false,
      loginAttempts: 0,
    })

    // Create organization membership entry
    await OrganizationMember.create({
      userId: newUser.id,
      organizationId: orgResult.organization.id,
      role: role || 'member',
      status: 'active',
      invitedBy: authResult.user.id,
      invitedAt: new Date(),
      joinedAt: new Date(),
    })

    // Remove password hash from response
    const userResponse = {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: role || 'member',
      status: 'active',
      userType: 'Member',
      organizationId: orgResult.organization.id,
      createdAt: newUser.createdAt
    }

    return createResponse(201, ApiResponse.success(userResponse, 'Member created successfully'))
  } catch (error) {
    console.error('Create user error:', error)
    return createResponse(500, ApiResponse.error('Internal server error'))
  }
}

module.exports = { handler: createUser }