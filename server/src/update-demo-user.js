require('dotenv').config()
const sequelize = require('./config/sequelize')
const { User, UserTypeLookup } = require('./models')

const updateDemoUser = async () => {
  try {
    console.log('Updating demo user to be Owner...')
    
    const ownerType = await UserTypeLookup.findOne({ where: { name: 'Owner' } })
    if (!ownerType) {
      throw new Error('Owner user type not found')
    }

    const user = await User.findOne({ where: { email: 'demo@example.com' } })
    if (!user) {
      throw new Error('Demo user not found')
    }

    await user.update({ userTypId: ownerType.id })
    
    console.log('Demo user updated to Owner type')
    
  } catch (error) {
    console.error('Error updating demo user:', error)
  } finally {
    await sequelize.close()
  }
}

updateDemoUser()