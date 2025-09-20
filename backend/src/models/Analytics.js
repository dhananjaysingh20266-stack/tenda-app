module.exports = (sequelize, DataTypes) => {
  const Analytics = sequelize.define('Analytics', {
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
    metric_type: {
      type: DataTypes.ENUM('key_generation', 'key_activation', 'user_login', 'device_registration', 'session_duration'),
      allowNull: false,
    },
    metric_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    metric_value: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    dimensions: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    aggregation_period: {
      type: DataTypes.ENUM('hour', 'day', 'week', 'month'),
      allowNull: false,
    },
    period_start: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    period_end: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    indexes: [
      {
        fields: ['organization_id', 'metric_type', 'period_start']
      },
      {
        fields: ['metric_name', 'aggregation_period', 'period_start']
      }
    ]
  });

  Analytics.associate = (models) => {
    Analytics.belongsTo(models.Organization, {
      foreignKey: 'organization_id',
      as: 'organization',
    });
  };

  return Analytics;
};