module.exports = (sequelize, DataTypes) => {
  const GamingKey = sequelize.define('GamingKey', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    organization_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Organizations',
        key: 'id',
      },
    },
    game_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Games',
        key: 'id',
      },
    },
    service_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Services',
        key: 'id',
      },
    },
    batch_id: {
      type: DataTypes.UUID,
      references: {
        model: 'KeyBatches',
        key: 'id',
      },
    },
    assigned_user_id: {
      type: DataTypes.UUID,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    key_code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    key_type: {
      type: DataTypes.ENUM('single_use', 'multi_use', 'subscription'),
      allowNull: false,
    },
    pricing_tier_id: {
      type: DataTypes.UUID,
      references: {
        model: 'PricingTiers',
        key: 'id',
      },
    },
    purchase_price: {
      type: DataTypes.DECIMAL(10, 2),
    },
    max_devices: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    max_concurrent_sessions: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    expires_at: {
      type: DataTypes.DATE,
    },
    activated_at: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.ENUM('generated', 'assigned', 'activated', 'expired', 'revoked'),
      defaultValue: 'generated',
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
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

  GamingKey.associate = (models) => {
    GamingKey.belongsTo(models.Organization, {
      foreignKey: 'organization_id',
      as: 'organization',
    });
    GamingKey.belongsTo(models.Game, {
      foreignKey: 'game_id',
      as: 'game',
    });
    GamingKey.belongsTo(models.Service, {
      foreignKey: 'service_id',
      as: 'service',
    });
    GamingKey.belongsTo(models.KeyBatch, {
      foreignKey: 'batch_id',
      as: 'batch',
    });
    GamingKey.belongsTo(models.User, {
      foreignKey: 'assigned_user_id',
      as: 'assigned_user',
    });
    GamingKey.belongsTo(models.PricingTier, {
      foreignKey: 'pricing_tier_id',
      as: 'pricing_tier',
    });
    GamingKey.hasMany(models.KeyDevice, {
      foreignKey: 'gaming_key_id',
      as: 'devices',
    });
  };

  return GamingKey;
};