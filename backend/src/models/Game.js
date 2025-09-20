module.exports = (sequelize, DataTypes) => {
  const Game = sequelize.define('Game', {
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
    developer: {
      type: DataTypes.STRING,
    },
    publisher: {
      type: DataTypes.STRING,
    },
    release_date: {
      type: DataTypes.DATEONLY,
    },
    genre: {
      type: DataTypes.STRING,
    },
    platform: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    rating: {
      type: DataTypes.ENUM('E', 'E10', 'T', 'M', 'AO', 'RP'),
    },
    logo_url: {
      type: DataTypes.STRING,
    },
    banner_url: {
      type: DataTypes.STRING,
    },
    trailer_url: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'discontinued'),
      defaultValue: 'active',
    },
    metadata: {
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

  Game.associate = (models) => {
    Game.hasMany(models.GamingKey, {
      foreignKey: 'game_id',
      as: 'gaming_keys',
    });
    Game.hasMany(models.PricingTier, {
      foreignKey: 'game_id',
      as: 'pricing_tiers',
    });
  };

  return Game;
};