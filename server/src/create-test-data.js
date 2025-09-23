require('dotenv').config()
const sequelize = require('./config/sequelize')
const { User, Organization, LoginRequest, UserTypeLookup } = require('./models')
const bcrypt = require('bcryptjs')

const createTestData = async () => {
  try {
    console.log('Creating test data for login requests...')

    // First seed user types (they were dropped during seed.js)
    await UserTypeLookup.bulkCreate([
      {
        name: "Owner",
        description: "Organization owner with full administrative privileges",
        isActive: true,
      },
      {
        name: "Member", 
        description: "Organization member with limited privileges",
        isActive: true,
      },
    ]);
    console.log('User types recreated')

    // Get the existing organization
    const org = await Organization.findOne({ where: { slug: 'demo-gaming-org' } })
    if (!org) {
      throw new Error('Demo organization not found')
    }

    // Get Member user type
    const memberType = await UserTypeLookup.findOne({ where: { name: 'Member' } })
    if (!memberType) {
      throw new Error('Member user type not found')
    }

    // Create a member user
    const memberPassword = await bcrypt.hash('member123', 12)
    const memberUser = await User.create({
      email: 'member@example.com',
      passwordHash: memberPassword,
      firstName: 'Test',
      lastName: 'Member',
      isActive: true,
      emailVerified: true,
      loginAttempts: 0,
      userTypId: memberType.id
    })

    // Create a login request for the member
    const loginRequest = await LoginRequest.create({
      userId: memberUser.id,
      organizationId: org.id,
      deviceFingerprint: 'test-device-fingerprint-123',
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 (Test Browser)',
      browserInfo: { name: 'Test', version: '1.0' },
      status: 'pending',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    })

    console.log('Created test member user:', memberUser.email)
    console.log('Created login request with ID:', loginRequest.id)
    console.log('Test data creation completed!')
    
  } catch (error) {
    console.error('Error creating test data:', error)
  } finally {
    await sequelize.close()
  }
}

if (require.main === module) {
  createTestData()
}

module.exports = { createTestData }