const { Sequelize } = require("sequelize");

// Export a single sequelize instance for use in all models and config
const sequelize = new Sequelize({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "gaming_key_platform",
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
  dialect: "postgres",
  logging: process.env.NODE_ENV === "development" ? true : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

module.exports = sequelize;
