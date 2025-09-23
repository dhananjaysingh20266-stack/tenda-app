const bcrypt = require('bcryptjs')
const { User, OrganizationMember, UserTypeLookup } = require('../../models')
const { ApiResponse } = require('../../utils/response')
const { createResponse } = require('../../utils/lambda')
const { authenticate, requireOrganizationAccess } = require('../../utils/auth')

const inviteUser = async (event, context) => {
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
    const { email, role, password } = payloadData

    // Validate required fields
    if (!email) {
      return createResponse(400, ApiResponse.error('Email is required'))
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

    let passwordHash
    let userStatus = 'pending'
    let emailVerified = false

    // If password is provided, hash it and set user as active
    if (password) {
      const saltRounds = 12
      passwordHash = await bcrypt.hash(password, saltRounds)
      userStatus = 'active'
      emailVerified = false // Still requires email verification
    } else {
      // For invitations without password, create a temporary password hash
      // The user will need to set a real password when they accept the invitation
      const tempPassword = 'temp_' + Math.random().toString(36).substring(2, 15)
      const saltRounds = 12
      passwordHash = await bcrypt.hash(tempPassword, saltRounds)
    }

    // Create user as member
    const newUser = await User.create({
      email,
      passwordHash,
      firstName: '', // Will be updated when user accepts invite
      lastName: '', // Will be updated when user accepts invite
      userTypId: memberType.id,
      organizationId: orgResult.organization.id,
      isActive: password ? true : false, // Only active if password provided
      emailVerified,
      loginAttempts: 0,
    })

    // Create organization membership entry
    const organizationMember = await OrganizationMember.create({
      userId: newUser.id,
      organizationId: orgResult.organization.id,
      role: role || 'member',
      status: password ? 'active' : 'pending',
      invitedBy: authResult.user.userId,
      invitedAt: new Date(),
      joinedAt: password ? new Date() : null, // Only set joinedAt if user is immediately active
      lastActive: password ? new Date() : null,
      permissions: [] // Default empty permissions
    })

    // Prepare response object matching Member interface
    const memberResponse = {
      id: newUser.id,
      firstName: newUser.firstName || '',
      lastName: newUser.lastName || '',
      email: newUser.email,
      role: organizationMember.role,
      status: organizationMember.status,
      lastActive: organizationMember.lastActive ? organizationMember.lastActive.toISOString() : new Date().toISOString(),
      joinedAt: organizationMember.joinedAt ? organizationMember.joinedAt.toISOString() : new Date().toISOString(),
      permissions: organizationMember.permissions || []
    }

    return createResponse(201, ApiResponse.success(memberResponse, 'Member invited successfully'))
  } catch (error) {
    console.error('Invite user error:', error)
    return createResponse(500, ApiResponse.error('Internal server error'))
  }
}

module.exports = { handler: inviteUser }