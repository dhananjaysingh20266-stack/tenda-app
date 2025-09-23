require('dotenv').config()
const sequelize = require('./config/database')
const { User, Organization, Game, PricingTier } = require('./models')
const bcrypt = require('bcryptjs')

const seedData = async () => {
  try {
    console.log('Connecting to database...')
    await sequelize.authenticate()
    console.log('Database connected successfully')

    console.log('Creating tables...')
    await sequelize.sync({ force: true }) // This will drop existing tables
    console.log('Tables created successfully')

    console.log('Seeding games...')
    const games = await Game.bulkCreate([
      {
        name: 'PUBG Mobile',
        slug: 'pubg-mobile',
        iconUrl: 'https://example.com/icons/pubg-mobile.png',
        isActive: true,
      },
      {
        name: 'Free Fire',
        slug: 'free-fire',
        iconUrl: 'https://example.com/icons/free-fire.png',
        isActive: true,
      },
      {
        name: 'Call of Duty Mobile',
        slug: 'cod-mobile',
        iconUrl: 'https://example.com/icons/cod-mobile.png',
        isActive: true,
      }
    ])
    console.log('Games seeded successfully')

    console.log('Seeding pricing tiers...')
    const pricingTiers = [
      // PUBG Mobile pricing
      { gameId: 1, durationHours: 1, pricePerDevice: 10, currency: 'INR' },
      { gameId: 1, durationHours: 3, pricePerDevice: 25, currency: 'INR' },
      { gameId: 1, durationHours: 5, pricePerDevice: 50, currency: 'INR' },
      { gameId: 1, durationHours: 12, pricePerDevice: 100, currency: 'INR' },
      { gameId: 1, durationHours: 24, pricePerDevice: 180, currency: 'INR' },
      { gameId: 1, durationHours: 168, pricePerDevice: 1000, currency: 'INR' },
      
      // Free Fire pricing
      { gameId: 2, durationHours: 1, pricePerDevice: 8, currency: 'INR' },
      { gameId: 2, durationHours: 3, pricePerDevice: 20, currency: 'INR' },
      { gameId: 2, durationHours: 5, pricePerDevice: 40, currency: 'INR' },
      { gameId: 2, durationHours: 12, pricePerDevice: 80, currency: 'INR' },
      { gameId: 2, durationHours: 24, pricePerDevice: 150, currency: 'INR' },
      { gameId: 2, durationHours: 168, pricePerDevice: 800, currency: 'INR' },
      
      // Call of Duty Mobile pricing
      { gameId: 3, durationHours: 1, pricePerDevice: 12, currency: 'INR' },
      { gameId: 3, durationHours: 3, pricePerDevice: 30, currency: 'INR' },
      { gameId: 3, durationHours: 5, pricePerDevice: 60, currency: 'INR' },
      { gameId: 3, durationHours: 12, pricePerDevice: 120, currency: 'INR' },
      { gameId: 3, durationHours: 24, pricePerDevice: 200, currency: 'INR' },
      { gameId: 3, durationHours: 168, pricePerDevice: 1200, currency: 'INR' },
    ]
    
    await PricingTier.bulkCreate(pricingTiers)
    console.log('Pricing tiers seeded successfully')
    console.log('Games seeded successfully')

    console.log('Creating demo user and organization...')
    const passwordHash = await bcrypt.hash('password123', 12)
    
    const user = await User.create({
      email: 'demo@example.com',
      passwordHash,
      firstName: 'Demo',
      lastName: 'User',
      isActive: true,
      emailVerified: true,
      loginAttempts: 0,
    })

    const organization = await Organization.create({
      name: 'Demo Gaming Organization',
      slug: 'demo-gaming-org',
      ownerId: user.id,
      subscriptionTier: 'free',
      isActive: true,
    })

    console.log('Demo data created successfully!')
    console.log('Login credentials: demo@example.com / password123')
    
  } catch (error) {
    console.error('Seeding error:', error)
  } finally {
    await sequelize.close()
  }
}

seedData()