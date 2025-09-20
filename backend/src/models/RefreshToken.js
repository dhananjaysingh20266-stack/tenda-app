module.exports = (sequelize, DataTypes) => {
  const RefreshToken = sequelize.define('RefreshToken', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    token_hash: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    device_fingerprint_id: {
      type: DataTypes.UUID,
      references: {
        model: 'DeviceFingerprints',
        key: 'id',
      },
    },
    ip_address: {
      type: DataTypes.INET,
    },
    user_agent: {
      type: DataTypes.TEXT,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    last_used_at: {
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

  RefreshToken.associate = (models) => {
    RefreshToken.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
    RefreshToken.belongsTo(models.DeviceFingerprint, {
      foreignKey: 'device_fingerprint_id',
      as: 'device_fingerprint',
    });
  };

  return RefreshToken;
};