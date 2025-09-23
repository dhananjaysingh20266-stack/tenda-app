const { Sequelize } = require("sequelize");

// Create in-memory SQLite database for testing
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: ":memory:",
  logging: false,
});

module.exports = sequelize;