"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("@/config/database"));
const User_1 = __importDefault(require("./User"));
class Organization extends sequelize_1.Model {
}
Organization.init({
    id: {
        type: sequelize_1.DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    slug: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            is: /^[a-z0-9-]+$/,
        },
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    ownerId: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    logoUrl: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true,
    },
    website: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    industry: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
    },
    companySize: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true,
    },
    subscriptionTier: {
        type: sequelize_1.DataTypes.ENUM('free', 'basic', 'premium', 'enterprise'),
        allowNull: false,
        defaultValue: 'free',
    },
    billingEmail: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
        validate: {
            isEmail: true,
        },
    },
    isActive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: database_1.default,
    tableName: 'organizations',
    indexes: [
        {
            unique: true,
            fields: ['slug'],
        },
        {
            fields: ['ownerId'],
        },
    ],
});
// Define associations
Organization.belongsTo(User_1.default, { foreignKey: 'ownerId', as: 'owner' });
User_1.default.hasOne(Organization, { foreignKey: 'ownerId', as: 'ownedOrganization' });
exports.default = Organization;
