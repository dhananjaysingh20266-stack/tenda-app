const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/sequelize");

class ApiKey extends Model {}

ApiKey.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    keyId: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    gameId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'games',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    organizationId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'organizations',
        key: 'id'
      }
    },
    maxDevices: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    durationHours: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 24,
    },
    costPerDevice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    totalCost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'INR',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    lastUsedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    usageCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    deviceUsageCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "api_keys",
    indexes: [
      {
        unique: true,
        fields: ["keyId"],
      },
      {
        fields: ["userId"],
      },
      {
        fields: ["organizationId"],
      },
      {
        fields: ["gameId"],
      },
      {
        fields: ["isActive"],
      },
    ],
  }
);

module.exports = ApiKey;