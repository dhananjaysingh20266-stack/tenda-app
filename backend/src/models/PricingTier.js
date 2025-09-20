module.exports = (sequelize, DataTypes) => {
  const PricingTier = sequelize.define('PricingTier', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    game_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Games',
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'USD',
    },
    max_devices: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    max_concurrent_sessions: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    duration_days: {
      type: DataTypes.INTEGER,
    },
    features: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    sort_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  PricingTier.associate = (models) => {
    PricingTier.belongsTo(models.Game, {
      foreignKey: 'game_id',
      as: 'game',
    });
    PricingTier.hasMany(models.GamingKey, {
      foreignKey: 'pricing_tier_id',
      as: 'gaming_keys',
    });
  };

  return PricingTier;
};