"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REFRESH_TOKEN_CONFIG = exports.JWT_CONFIG = void 0;
exports.JWT_CONFIG = {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    algorithm: 'HS256',
};
exports.REFRESH_TOKEN_CONFIG = {
    secret: process.env.REFRESH_TOKEN_SECRET || 'your-super-secret-refresh-key',
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d',
};
