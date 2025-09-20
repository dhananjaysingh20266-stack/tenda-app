module.exports = (sequelize, DataTypes) => {
  const LoginAttempt = sequelize.define('LoginAttempt', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    username_attempted: {
      type: DataTypes.STRING,
    },
    ip_address: {
      type: DataTypes.INET,
      allowNull: false,
    },
    user_agent: {
      type: DataTypes.TEXT,
    },
    device_fingerprint_id: {
      type: DataTypes.UUID,
      references: {
        model: 'DeviceFingerprints',
        key: 'id',
      },
    },
    attempt_type: {
      type: DataTypes.ENUM('password', 'two_factor', 'password_reset'),
      defaultValue: 'password',
    },
    success: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    failure_reason: {
      type: DataTypes.ENUM('invalid_credentials', 'account_locked', 'invalid_2fa', 'account_suspended', 'rate_limited'),
    },
    attempted_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  LoginAttempt.associate = (models) => {
    LoginAttempt.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
    LoginAttempt.belongsTo(models.DeviceFingerprint, {
      foreignKey: 'device_fingerprint_id',
      as: 'device_fingerprint',
    });
  };

  return LoginAttempt;
};