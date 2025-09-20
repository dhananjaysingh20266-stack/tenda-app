module.exports = (sequelize, DataTypes) => {
  const SystemConfiguration = sequelize.define('SystemConfiguration', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    value: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    category: {
      type: DataTypes.STRING,
      defaultValue: 'general',
    },
    is_sensitive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_public: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    updated_by: {
      type: DataTypes.UUID,
      references: {
        model: 'Users',
        key: 'id',
      },
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

  return SystemConfiguration;
};