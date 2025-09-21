"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("@/config/database"));
class User extends sequelize_1.Model {
}
User.init({
    id: {
        type: sequelize_1.DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    passwordHash: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
    },
    isActive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
    },
    emailVerified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    emailVerificationToken: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    passwordResetToken: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    passwordResetExpires: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    lastLogin: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    loginAttempts: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
    lockedUntil: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
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
    tableName: 'users',
    indexes: [
        {
            unique: true,
            fields: ['email'],
        },
    ],
});
exports.default = User;
