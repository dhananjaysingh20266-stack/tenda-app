module.exports = (sequelize, DataTypes) => {
  const ApiKey = sequelize.define('ApiKey', {
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
    user_id: {
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
    key_hash: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    key_prefix: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    permissions: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    rate_limit: {
      type: DataTypes.INTEGER,
      defaultValue: 1000,
    },
    rate_window: {
      type: DataTypes.INTEGER,
      defaultValue: 3600,
    },
    last_used_at: {
      type: DataTypes.DATE,
    },
    usage_count: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    expires_at: {
      type: DataTypes.DATE,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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

  ApiKey.associate = (models) => {
    ApiKey.belongsTo(models.Organization, {
      foreignKey: 'organization_id',
      as: 'organization',
    });
    ApiKey.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  };

  return ApiKey;
};