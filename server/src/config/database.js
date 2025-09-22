const { Sequelize } = require("sequelize");

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

const connection = {};

module.exports = async () => {
  const Models = {};
  if (connection.isConnected) {
    console.log("=> Using existing connection.");
    return Models;
  }
  await sequelize.authenticate();
  connection.isConnected = true;
  console.log("=> Created a new connection.");
  return Models;
};

// usage
//    const reader = await connectToDatabase_RO();
//    const writer = await connectToDatabase_RW();
