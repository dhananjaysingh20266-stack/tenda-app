module.exports = (sequelize, DataTypes) => {
  const KeyDevice = sequelize.define('KeyDevice', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    gaming_key_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'GamingKeys',
        key: 'id',
      },
    },
    user_device_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'UserDevices',
        key: 'id',
      },
    },
    activated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    last_used_at: {
      type: DataTypes.DATE,
    },
    usage_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'revoked'),
      defaultValue: 'active',
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    indexes: [
      {
        unique: true,
        fields: ['gaming_key_id', 'user_device_id']
      }
    ]
  });

  KeyDevice.associate = (models) => {
    KeyDevice.belongsTo(models.GamingKey, {
      foreignKey: 'gaming_key_id',
      as: 'gaming_key',
    });
    KeyDevice.belongsTo(models.UserDevice, {
      foreignKey: 'user_device_id',
      as: 'user_device',
    });
  };

  return KeyDevice;
};