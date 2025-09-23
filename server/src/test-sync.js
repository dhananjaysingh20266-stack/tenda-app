require('dotenv').config()
const sequelize = require('./config/sequelize')
const { User, Organization, Game, UserTypeLookup } = require('./models')

const testSync = async () => {
  try {
    console.log('Testing database connection and model sync...')
    await sequelize.authenticate()
    console.log('✅ Database connection successful')

    // Test sync without force (development mode)
    await sequelize.sync()
    console.log('✅ Model sync successful - tables created/updated')
    
    console.log('✅ JavaScript backend is ready!')
    console.log('✅ Using model sync() for database setup')
    
  } catch (error) {
    console.error('❌ Database test error:', error.message)
  } finally {
    await sequelize.close()
  }
}

testSync()