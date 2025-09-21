"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenSchema = exports.registerSchema = exports.loginSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string()
        .email()
        .required()
        .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required',
    }),
    password: joi_1.default.string()
        .min(6)
        .required()
        .messages({
        'string.min': 'Password must be at least 6 characters long',
        'any.required': 'Password is required',
    }),
    loginType: joi_1.default.string()
        .valid('organization', 'individual')
        .required()
        .messages({
        'any.only': 'Login type must be either organization or individual',
        'any.required': 'Login type is required',
    }),
});
exports.registerSchema = joi_1.default.object({
    email: joi_1.default.string()
        .email()
        .required()
        .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required',
    }),
    password: joi_1.default.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .required()
        .messages({
        'string.min': 'Password must be at least 8 characters long',
        'string.pattern.base': 'Password must contain uppercase, lowercase, number, and special character',
        'any.required': 'Password is required',
    }),
    firstName: joi_1.default.string()
        .min(2)
        .max(50)
        .required()
        .messages({
        'string.min': 'First name must be at least 2 characters',
        'string.max': 'First name cannot exceed 50 characters',
        'any.required': 'First name is required',
    }),
    lastName: joi_1.default.string()
        .min(2)
        .max(50)
        .required()
        .messages({
        'string.min': 'Last name must be at least 2 characters',
        'string.max': 'Last name cannot exceed 50 characters',
        'any.required': 'Last name is required',
    }),
    organizationName: joi_1.default.string()
        .min(3)
        .max(100)
        .required()
        .messages({
        'string.min': 'Organization name must be at least 3 characters',
        'string.max': 'Organization name cannot exceed 100 characters',
        'any.required': 'Organization name is required',
    }),
});
exports.refreshTokenSchema = joi_1.default.object({
    refreshToken: joi_1.default.string()
        .required()
        .messages({
        'any.required': 'Refresh token is required',
    }),
});
