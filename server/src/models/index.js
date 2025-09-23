const User = require('./User')
const Organization = require('./Organization')
const Game = require('./Game')
const ApiKey = require('./ApiKey')
const PricingTier = require('./PricingTier')
const OrganizationMember = require('./OrganizationMember')

// Define associations
Organization.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' })
User.hasOne(Organization, { foreignKey: 'ownerId', as: 'ownedOrganization' })

// User-Organization relationship (for direct organization membership)
User.belongsTo(Organization, { foreignKey: 'organizationId', as: 'organization' })
Organization.hasMany(User, { foreignKey: 'organizationId', as: 'directMembers' })

// API Key associations
ApiKey.belongsTo(User, { foreignKey: 'userId', as: 'user' })
ApiKey.belongsTo(Organization, { foreignKey: 'organizationId', as: 'organization' })
ApiKey.belongsTo(Game, { foreignKey: 'gameId', as: 'game' })

User.hasMany(ApiKey, { foreignKey: 'userId', as: 'apiKeys' })
Organization.hasMany(ApiKey, { foreignKey: 'organizationId', as: 'apiKeys' })
Game.hasMany(ApiKey, { foreignKey: 'gameId', as: 'apiKeys' })

// Pricing Tier associations
PricingTier.belongsTo(Game, { foreignKey: 'gameId', as: 'game' })
Game.hasMany(PricingTier, { foreignKey: 'gameId', as: 'pricingTiers' })

// Organization Member associations
OrganizationMember.belongsTo(User, { foreignKey: 'userId', as: 'user' })
OrganizationMember.belongsTo(Organization, { foreignKey: 'organizationId', as: 'organization' })
OrganizationMember.belongsTo(User, { foreignKey: 'invitedBy', as: 'inviter' })

User.hasMany(OrganizationMember, { foreignKey: 'userId', as: 'memberships' })
Organization.hasMany(OrganizationMember, { foreignKey: 'organizationId', as: 'members' })

module.exports = {
  User,
  Organization,
  Game,
  ApiKey,
  PricingTier,
  OrganizationMember
}