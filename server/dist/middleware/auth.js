"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireIndividualAccess = exports.requireOrganizationAccess = exports.authenticate = void 0;
const User_1 = __importDefault(require("@/models/User"));
const Organization_1 = __importDefault(require("@/models/Organization"));
const jwt_1 = require("@/utils/jwt");
const response_1 = require("@/utils/response");
const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            res.status(401).json(response_1.ApiResponse.error('Access token required'));
            return;
        }
        const decoded = (0, jwt_1.verifyToken)(token);
        const user = await User_1.default.findByPk(decoded.userId, {
            attributes: { exclude: ['passwordHash'] }
        });
        if (!user || !user.isActive) {
            res.status(401).json(response_1.ApiResponse.error('Invalid token'));
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json(response_1.ApiResponse.error('Invalid token'));
    }
};
exports.authenticate = authenticate;
const requireOrganizationAccess = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json(response_1.ApiResponse.error('Authentication required'));
            return;
        }
        // Check if user is organization owner
        const organization = await Organization_1.default.findOne({
            where: { ownerId: req.user.id }
        });
        if (!organization) {
            res.status(403).json(response_1.ApiResponse.error('Organization access required'));
            return;
        }
        req.organization = organization;
        next();
    }
    catch (error) {
        res.status(500).json(response_1.ApiResponse.error('Internal server error'));
    }
};
exports.requireOrganizationAccess = requireOrganizationAccess;
const requireIndividualAccess = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json(response_1.ApiResponse.error('Authentication required'));
            return;
        }
        // For now, we'll just check if user exists
        // In a full implementation, you'd check organization membership
        next();
    }
    catch (error) {
        res.status(500).json(response_1.ApiResponse.error('Internal server error'));
    }
};
exports.requireIndividualAccess = requireIndividualAccess;
