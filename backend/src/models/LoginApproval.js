module.exports = (sequelize, DataTypes) => {
  const LoginApproval = sequelize.define('LoginApproval', {
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
    approval_token: {
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
    requested_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    approved_at: {
      type: DataTypes.DATE,
    },
    approved_by: {
      type: DataTypes.UUID,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    rejected_at: {
      type: DataTypes.DATE,
    },
    rejected_by: {
      type: DataTypes.UUID,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    rejection_reason: {
      type: DataTypes.TEXT,
    },
    expires_at: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'expired'),
      defaultValue: 'pending',
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

  LoginApproval.associate = (models) => {
    LoginApproval.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
    LoginApproval.belongsTo(models.DeviceFingerprint, {
      foreignKey: 'device_fingerprint_id',
      as: 'device_fingerprint',
    });
  };

  return LoginApproval;
};