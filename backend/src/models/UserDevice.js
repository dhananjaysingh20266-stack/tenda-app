module.exports = (sequelize, DataTypes) => {
  const UserDevice = sequelize.define('UserDevice', {
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
    device_fingerprint_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'DeviceFingerprints',
        key: 'id',
      },
    },
    device_name: {
      type: DataTypes.STRING,
    },
    device_type: {
      type: DataTypes.ENUM('desktop', 'mobile', 'tablet', 'console', 'other'),
    },
    is_trusted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    last_used_at: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'blocked'),
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
  });

  UserDevice.associate = (models) => {
    UserDevice.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
    UserDevice.belongsTo(models.DeviceFingerprint, {
      foreignKey: 'device_fingerprint_id',
      as: 'device_fingerprint',
    });
    UserDevice.hasMany(models.KeyDevice, {
      foreignKey: 'user_device_id',
      as: 'key_devices',
    });
  };

  return UserDevice;
};