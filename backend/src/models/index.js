const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config.js');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);

// Import all models
const Organization = require('./Organization')(sequelize, DataTypes);
const User = require('./User')(sequelize, DataTypes);
const Role = require('./Role')(sequelize, DataTypes);
const Permission = require('./Permission')(sequelize, DataTypes);
const RolePermission = require('./RolePermission')(sequelize, DataTypes);
const UserRole = require('./UserRole')(sequelize, DataTypes);
const Game = require('./Game')(sequelize, DataTypes);
const Service = require('./Service')(sequelize, DataTypes);
const GamingKey = require('./GamingKey')(sequelize, DataTypes);
const KeyDevice = require('./KeyDevice')(sequelize, DataTypes);
const UserDevice = require('./UserDevice')(sequelize, DataTypes);
const LoginSession = require('./LoginSession')(sequelize, DataTypes);
const LoginApproval = require('./LoginApproval')(sequelize, DataTypes);
const LoginAttempt = require('./LoginAttempt')(sequelize, DataTypes);
const DeviceFingerprint = require('./DeviceFingerprint')(sequelize, DataTypes);
const AuditLog = require('./AuditLog')(sequelize, DataTypes);
const Notification = require('./Notification')(sequelize, DataTypes);
const PricingTier = require('./PricingTier')(sequelize, DataTypes);
const KeyBatch = require('./KeyBatch')(sequelize, DataTypes);
const Analytics = require('./Analytics')(sequelize, DataTypes);
const SystemConfiguration = require('./SystemConfiguration')(sequelize, DataTypes);
const ApiKey = require('./ApiKey')(sequelize, DataTypes);
const RefreshToken = require('./RefreshToken')(sequelize, DataTypes);

// Define associations
const db = {
  sequelize,
  Sequelize,
  Organization,
  User,
  Role,
  Permission,
  RolePermission,
  UserRole,
  Game,
  Service,
  GamingKey,
  KeyDevice,
  UserDevice,
  LoginSession,
  LoginApproval,
  LoginAttempt,
  DeviceFingerprint,
  AuditLog,
  Notification,
  PricingTier,
  KeyBatch,
  Analytics,
  SystemConfiguration,
  ApiKey,
  RefreshToken,
};

// Define model associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;