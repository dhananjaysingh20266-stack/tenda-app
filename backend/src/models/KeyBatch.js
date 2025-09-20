module.exports = (sequelize, DataTypes) => {
  const KeyBatch = sequelize.define('KeyBatch', {
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
    pricing_tier_id: {
      type: DataTypes.UUID,
      references: {
        model: 'PricingTiers',
        key: 'id',
      },
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
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
    total_keys: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    generated_keys: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    assigned_keys: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    activated_keys: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM('generating', 'completed', 'failed'),
      defaultValue: 'generating',
    },
    generation_started_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    generation_completed_at: {
      type: DataTypes.DATE,
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

  KeyBatch.associate = (models) => {
    KeyBatch.belongsTo(models.Organization, {
      foreignKey: 'organization_id',
      as: 'organization',
    });
    KeyBatch.belongsTo(models.Game, {
      foreignKey: 'game_id',
      as: 'game',
    });
    KeyBatch.belongsTo(models.Service, {
      foreignKey: 'service_id',
      as: 'service',
    });
    KeyBatch.belongsTo(models.PricingTier, {
      foreignKey: 'pricing_tier_id',
      as: 'pricing_tier',
    });
    KeyBatch.belongsTo(models.User, {
      foreignKey: 'created_by',
      as: 'creator',
    });
    KeyBatch.hasMany(models.GamingKey, {
      foreignKey: 'batch_id',
      as: 'gaming_keys',
    });
  };

  return KeyBatch;
};