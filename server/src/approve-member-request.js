require('dotenv').config()
const sequelize = require('./config/sequelize')
const { LoginRequest } = require('./models')

const approveMemberRequest = async () => {
  try {
    console.log('Approving member login request to test empty results...')

    await LoginRequest.update(
      { status: 'approved', approvedBy: 1 }, // Approved by the owner user
      { where: { userId: 2, status: 'pending' } } // Member user's request
    )

    console.log('Member login request approved - API should now return empty results')
    
  } catch (error) {
    console.error('Error approving login request:', error)
  } finally {
    await sequelize.close()
  }
}

approveMemberRequest()