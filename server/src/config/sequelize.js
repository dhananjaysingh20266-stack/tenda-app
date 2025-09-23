const { Sequelize } = require("sequelize");

// Use SQLite for development/local testing by default
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
  logging: console.log,
});

module.exports = sequelize;
