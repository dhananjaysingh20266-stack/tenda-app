module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
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
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar_url: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended', 'pending'),
      defaultValue: 'pending',
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    email_verification_token: {
      type: DataTypes.STRING,
    },
    password_reset_token: {
      type: DataTypes.STRING,
    },
    password_reset_expires: {
      type: DataTypes.DATE,
    },
    two_factor_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    two_factor_secret: {
      type: DataTypes.STRING,
    },
    last_login_at: {
      type: DataTypes.DATE,
    },
    login_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    preferences: {
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

  User.associate = (models) => {
    User.belongsTo(models.Organization, {
      foreignKey: 'organization_id',
      as: 'organization',
    });
    User.belongsToMany(models.Role, {
      through: models.UserRole,
      foreignKey: 'user_id',
      otherKey: 'role_id',
      as: 'roles',
    });
    User.hasMany(models.UserDevice, {
      foreignKey: 'user_id',
      as: 'devices',
    });
    User.hasMany(models.LoginSession, {
      foreignKey: 'user_id',
      as: 'login_sessions',
    });
    User.hasMany(models.LoginApproval, {
      foreignKey: 'user_id',
      as: 'login_approvals',
    });
    User.hasMany(models.LoginAttempt, {
      foreignKey: 'user_id',
      as: 'login_attempts',
    });
    User.hasMany(models.GamingKey, {
      foreignKey: 'assigned_user_id',
      as: 'gaming_keys',
    });
    User.hasMany(models.Notification, {
      foreignKey: 'user_id',
      as: 'notifications',
    });
    User.hasMany(models.AuditLog, {
      foreignKey: 'user_id',
      as: 'audit_logs',
    });
    User.hasMany(models.RefreshToken, {
      foreignKey: 'user_id',
      as: 'refresh_tokens',
    });
  };

  return User;
};