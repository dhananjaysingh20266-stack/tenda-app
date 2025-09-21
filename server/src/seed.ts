import dotenv from 'dotenv'
import sequelize from '@/config/database'
import User from '@/models/User'
import Organization from '@/models/Organization'
import Game from '@/models/Game'
import bcrypt from 'bcryptjs'

dotenv.config()

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