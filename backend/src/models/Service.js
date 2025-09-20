module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define('Service', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    service_type: {
      type: DataTypes.ENUM('gaming_platform', 'cloud_service', 'subscription', 'marketplace'),
      allowNull: false,
    },
    logo_url: {
      type: DataTypes.STRING,
    },
    website_url: {
      type: DataTypes.STRING,
    },
    api_endpoint: {
      type: DataTypes.STRING,
    },
    api_key: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'maintenance'),
      defaultValue: 'active',
    },
    configuration: {
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

  Service.associate = (models) => {
    Service.hasMany(models.GamingKey, {
      foreignKey: 'service_id',
      as: 'gaming_keys',
    });
  };

  return Service;
};