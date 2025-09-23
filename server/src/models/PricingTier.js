const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/sequelize");

class PricingTier extends Model {}

PricingTier.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    gameId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'games',
        key: 'id'
      }
    },
    durationHours: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pricePerDevice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
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
    tableName: "pricing_tiers",
    indexes: [
      {
        unique: true,
        fields: ["gameId", "durationHours"],
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

module.exports = PricingTier;