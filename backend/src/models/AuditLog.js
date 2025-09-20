module.exports = (sequelize, DataTypes) => {
  const AuditLog = sequelize.define('AuditLog', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    organization_id: {
      type: DataTypes.UUID,
      references: {
        model: 'Organizations',
        key: 'id',
      },
    },
    user_id: {
      type: DataTypes.UUID,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    resource_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    resource_id: {
      type: DataTypes.UUID,
    },
    old_values: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    new_values: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    ip_address: {
      type: DataTypes.INET,
    },
    user_agent: {
      type: DataTypes.TEXT,
    },
    severity: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
      defaultValue: 'low',
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    occurred_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  AuditLog.associate = (models) => {
    AuditLog.belongsTo(models.Organization, {
      foreignKey: 'organization_id',
      as: 'organization',
    });
    AuditLog.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  };

  return AuditLog;
};