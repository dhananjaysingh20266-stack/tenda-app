const { Sequelize } = require("sequelize");

// Read-Only connection configuration
const readerConfig = {
  host: process.env.DB_HOST_RO || process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT_RO || process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "gaming_key_platform",
  username: process.env.DB_USER_RO || process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD_RO || process.env.DB_PASSWORD || "",
  dialect: "postgres",
  logging: process.env.NODE_ENV === "development" ? true : false,
  pool: {
    max: 3,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

// Read-Write connection configuration
const writerConfig = {
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
};

// Create default sequelize instance for models (uses RW config)
const sequelize = new Sequelize(writerConfig);

let readerConnection = null;
let writerConnection = null;

// Read-Only database connection
const connectToDatabase_RO = async () => {
  if (readerConnection) {
    console.log("=> Using existing RO connection.");
    return readerConnection;
  }
  
  readerConnection = new Sequelize(readerConfig);
  await readerConnection.authenticate();
  console.log("=> Created a new RO connection.");
  return readerConnection;
};

// Read-Write database connection
const connectToDatabase_RW = async () => {
  if (writerConnection) {
    console.log("=> Using existing RW connection.");
    return writerConnection;
  }
  
  writerConnection = new Sequelize(writerConfig);
  await writerConnection.authenticate();
  console.log("=> Created a new RW connection.");
  return writerConnection;
};

// Legacy support - use RW connection by default
const connection = {};
const legacyConnect = async () => {
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

// Export default sequelize instance for models
module.exports = sequelize;
module.exports.connectToDatabase_RO = connectToDatabase_RO;
module.exports.connectToDatabase_RW = connectToDatabase_RW;
module.exports.legacyConnect = legacyConnect;

// usage
//    const reader = await connectToDatabase_RO();
//    const writer = await connectToDatabase_RW();
