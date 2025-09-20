module.exports = (sequelize, DataTypes) => {
  const LoginSession = sequelize.define('LoginSession', {
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
    user_device_id: {
      type: DataTypes.UUID,
      references: {
        model: 'UserDevices',
        key: 'id',
      },
    },
    session_token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    ip_address: {
      type: DataTypes.INET,
    },
    user_agent: {
      type: DataTypes.TEXT,
    },
    location: {
      type: DataTypes.STRING,
    },
    login_method: {
      type: DataTypes.ENUM('password', 'two_factor', 'sso', 'api_key'),
      defaultValue: 'password',
    },
    started_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    last_activity_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    expires_at: {
      type: DataTypes.DATE,
    },
    ended_at: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.ENUM('active', 'expired', 'terminated'),
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

  LoginSession.associate = (models) => {
    LoginSession.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
    LoginSession.belongsTo(models.UserDevice, {
      foreignKey: 'user_device_id',
      as: 'user_device',
    });
  };

  return LoginSession;
};