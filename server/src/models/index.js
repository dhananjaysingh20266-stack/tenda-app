const User = require('./User')
const Organization = require('./Organization')
const Game = require('./Game')

// Define associations
Organization.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' })
User.hasOne(Organization, { foreignKey: 'ownerId', as: 'ownedOrganization' })

module.exports = {
  User,
  Organization,
  Game
}