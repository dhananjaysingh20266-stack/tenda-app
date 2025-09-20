module.exports = (sequelize, DataTypes) => {
  const DeviceFingerprint = sequelize.define('DeviceFingerprint', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    fingerprint_hash: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    user_agent: {
      type: DataTypes.TEXT,
    },
    screen_resolution: {
      type: DataTypes.STRING,
    },
    timezone: {
      type: DataTypes.STRING,
    },
    language: {
      type: DataTypes.STRING,
    },
    platform: {
      type: DataTypes.STRING,
    },
    canvas_fingerprint: {
      type: DataTypes.STRING,
    },
    webgl_fingerprint: {
      type: DataTypes.STRING,
    },
    audio_fingerprint: {
      type: DataTypes.STRING,
    },
    fonts_list: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    plugins_list: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    raw_data: {
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

  DeviceFingerprint.associate = (models) => {
    DeviceFingerprint.hasMany(models.UserDevice, {
      foreignKey: 'device_fingerprint_id',
      as: 'user_devices',
    });
  };

  return DeviceFingerprint;
};