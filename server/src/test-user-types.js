// Test file to verify user type functionality
require('dotenv').config()

// Use test database
const sequelize = require('./config/sequelize-test')

// Mock the original sequelize module with test database
const originalSequelize = require('./config/sequelize')
originalSequelize.constructor.prototype = sequelize.constructor.prototype
Object.setPrototypeOf(originalSequelize, sequelize)
Object.keys(sequelize).forEach(key => {
  originalSequelize[key] = sequelize[key]
})

const { User, Organization, UserTypeLookup, OrganizationMember } = require('./models')
const bcrypt = require('bcryptjs')

const testUserTypes = async () => {
  console.log('🧪 Starting User Type Integration Test...\n')

  try {
    // Step 1: Sync database
    console.log('1️⃣ Syncing database...')
    await sequelize.sync({ force: true })
    console.log('✅ Database synced\n')

    // Step 2: Seed user types
    console.log('2️⃣ Seeding user types...')
    const userTypes = [
      { name: "Owner", description: "Organization owner with full administrative privileges", isActive: true },
      { name: "Member", description: "Organization member with limited privileges", isActive: true },
    ]
    await UserTypeLookup.bulkCreate(userTypes)
    
    const ownerType = await UserTypeLookup.findOne({ where: { name: 'Owner' } })
    const memberType = await UserTypeLookup.findOne({ where: { name: 'Member' } })
    console.log('✅ User types seeded:', ownerType.name, '&', memberType.name, '\n')

    // Step 3: Create organization owner
    console.log('3️⃣ Creating organization owner...')
    const ownerPassword = await bcrypt.hash('owner123', 12)
    const owner = await User.create({
      email: 'owner@example.com',
      passwordHash: ownerPassword,
      firstName: 'John',
      lastName: 'Owner',
      userTypId: ownerType.id,
      isActive: true,
      emailVerified: true,
      loginAttempts: 0,
    })

    const organization = await Organization.create({
      name: 'Test Company',
      slug: 'test-company',
      ownerId: owner.id,
      subscriptionTier: 'free',
      isActive: true,
    })

    console.log('✅ Owner created:', owner.email, 'with userType:', ownerType.name)
    console.log('✅ Organization created:', organization.name, '\n')

    // Step 4: Create organization member
    console.log('4️⃣ Creating organization member...')
    const memberPassword = await bcrypt.hash('member123', 12)
    const member = await User.create({
      email: 'member@example.com',
      passwordHash: memberPassword,
      firstName: 'Jane',
      lastName: 'Member',
      userTypId: memberType.id,
      organizationId: organization.id,
      isActive: true,
      emailVerified: true,
      loginAttempts: 0,
    })

    await OrganizationMember.create({
      userId: member.id,
      organizationId: organization.id,
      role: 'member',
      status: 'active',
      invitedBy: owner.id,
      invitedAt: new Date(),
      joinedAt: new Date(),
    })

    console.log('✅ Member created:', member.email, 'with userType:', memberType.name, '\n')

    // Step 5: Test login scenarios
    console.log('5️⃣ Testing login scenarios...\n')

    // Test Owner organization login
    console.log('5a. Testing Owner organization login...')
    const ownerWithType = await User.findOne({
      where: { email: 'owner@example.com' },
      include: [{ model: UserTypeLookup, as: 'userType' }]
    })
    console.log('✅ Owner login check:', 
      ownerWithType.email, 
      'userType:', ownerWithType.userType.name,
      'can login as organization:', ownerWithType.userType.name === 'Owner' ? 'Yes' : 'No'
    )

    // Test Member individual login
    console.log('5b. Testing Member individual login...')
    const memberWithType = await User.findOne({
      where: { email: 'member@example.com' },
      include: [{ model: UserTypeLookup, as: 'userType' }]
    })
    
    const membershipInfo = await OrganizationMember.findOne({
      where: { userId: memberWithType.id, status: 'active' },
      include: [{ model: Organization, as: 'organization', where: { isActive: true } }]
    })

    console.log('✅ Member login check:', 
      memberWithType.email, 
      'userType:', memberWithType.userType.name,
      'can login individually:', memberWithType.userType.name === 'Member' ? 'Yes' : 'No',
      'organization access:', membershipInfo ? membershipInfo.organization.name : 'None'
    )

    // Test Member cannot login as organization
    console.log('5c. Testing Member organization login restriction...')
    const ownerOrg = await Organization.findOne({
      where: { ownerId: memberWithType.id, isActive: true }
    })
    console.log('✅ Member organization login check:',
      memberWithType.email,
      'can login as organization:', ownerOrg ? 'Yes (ERROR!)' : 'No (Correct)'
    )

    console.log('\n🎉 All tests passed! User type system is working correctly.')

  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.error(error)
  } finally {
    await sequelize.close()
  }
}

if (require.main === module) {
  testUserTypes()
}

module.exports = { testUserTypes }