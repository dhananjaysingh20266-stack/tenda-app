require('dotenv').config()
const sequelize = require('./config/sequelize')
const { User, Organization, LoginRequest, UserTypeLookup } = require('./models')

const createOwnerLoginRequest = async () => {
  try {
    console.log('Creating owner login request to test filtering...')

    const org = await Organization.findOne({ where: { slug: 'demo-gaming-org' } })
    const ownerUser = await User.findOne({ where: { email: 'demo@example.com' } })

    // Create a login request for the owner user (should be filtered out)
    await LoginRequest.create({
      userId: ownerUser.id,
      organizationId: org.id,
      deviceFingerprint: 'owner-device-fingerprint-456',
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 (Owner Browser)',
      browserInfo: { name: 'Owner Browser', version: '2.0' },
      status: 'pending',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    })

    console.log('Created owner login request - this should be filtered out when testing the API')
    
  } catch (error) {
    console.error('Error creating owner login request:', error)
  } finally {
    await sequelize.close()
  }
}

createOwnerLoginRequest()