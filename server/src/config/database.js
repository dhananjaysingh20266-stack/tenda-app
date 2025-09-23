const { Sequelize } = require("sequelize");
const sequelize = require("./sequelize");

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

let readerConnection = null;
let writerConnection = null;

// Read-Only database connection
const connectToDatabase_RO = async () => {
  const models = {
    User,
    Organization,
    Game,
    ApiKey,
    PricingTier,
    OrganizationMember,
  };
  if (readerConnection) {
    console.log("=> Using existing RO connection.");
    return models;
  }
  try {
    readerConnection = new Sequelize(readerConfig);
    await readerConnection.authenticate();
    console.log("=> Created a new RO connection.");
    return models;
  } catch (error) {
    console.error("Unable to connect to the RO database:", error);
  }
};

// Read-Write database connection
const connectToDatabase_RW = async () => {
  const models = {
    User,
    Organization,
    Game,
    ApiKey,
    PricingTier,
    OrganizationMember,
  };
  if (writerConnection) {
    console.log("=> Using existing RW connection.");
    return models;
  }
  try {
    writerConnection = new Sequelize(writerConfig);
    await writerConnection.authenticate();
    console.log("=> Created a new RW connection.");
    return models;
  } catch (error) {
    console.error("Unable to connect to the RW database:", error);
  }
};
async function syncAllModels() {
  // Require models here to ensure they are registered with sequelize
  const { User, Organization, Game, ApiKey, PricingTier, OrganizationMember } = require("../models");
  const models = [User, Organization, Game, ApiKey, PricingTier, OrganizationMember];
  for (const model of models) {
    await model.sync({ alter: true });
  }
  console.log("✅ All models synced and tables created/updated!");
}
module.exports = sequelize;
module.exports.connectToDatabase_RO = connectToDatabase_RO;
module.exports.connectToDatabase_RW = connectToDatabase_RW;
module.exports.syncAllModels = syncAllModels;
