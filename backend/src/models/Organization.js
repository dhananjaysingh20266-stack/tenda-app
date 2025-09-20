module.exports = (sequelize, DataTypes) => {
  const Organization = sequelize.define('Organization', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
    },
    logo_url: {
      type: DataTypes.STRING,
    },
    website: {
      type: DataTypes.STRING,
    },
    contact_email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.TEXT,
    },
    subscription_plan: {
      type: DataTypes.ENUM('basic', 'professional', 'enterprise'),
      defaultValue: 'basic',
    },
    max_users: {
      type: DataTypes.INTEGER,
      defaultValue: 10,
    },
    max_keys: {
      type: DataTypes.INTEGER,
      defaultValue: 100,
    },
    status: {
      type: DataTypes.ENUM('active', 'suspended', 'inactive'),
      defaultValue: 'active',
    },
    settings: {
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

  Organization.associate = (models) => {
    Organization.hasMany(models.User, {
      foreignKey: 'organization_id',
      as: 'users',
    });
    Organization.hasMany(models.GamingKey, {
      foreignKey: 'organization_id',
      as: 'gaming_keys',
    });
    Organization.hasMany(models.KeyBatch, {
      foreignKey: 'organization_id',
      as: 'key_batches',
    });
    Organization.hasMany(models.AuditLog, {
      foreignKey: 'organization_id',
      as: 'audit_logs',
    });
  };

  return Organization;
};