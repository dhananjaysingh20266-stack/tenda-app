"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("@/models/User"));
const Organization_1 = __importDefault(require("@/models/Organization"));
const validation_1 = require("@/middleware/validation");
const auth_1 = require("@/validators/auth");
const response_1 = require("@/utils/response");
const jwt_1 = require("@/utils/jwt");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const generateSlug = (name) => {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
};
app.post('/auth/register', (0, validation_1.validate)(auth_1.registerSchema), async (req, res) => {
    try {
        const { email, password, firstName, lastName, organizationName } = req.body;
        // Check if user already exists
        const existingUser = await User_1.default.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json(response_1.ApiResponse.error('User already exists'));
        }
        // Generate slug and check if organization already exists
        let slug = generateSlug(organizationName);
        const existingOrg = await Organization_1.default.findOne({ where: { slug } });
        if (existingOrg) {
            // Append timestamp to make unique
            slug = `${slug}-${Date.now()}`;
        }
        // Hash password
        const saltRounds = 12;
        const passwordHash = await bcryptjs_1.default.hash(password, saltRounds);
        // Create user and organization in a transaction
        const user = await User_1.default.create({
            email,
            passwordHash,
            firstName,
            lastName,
            isActive: true,
            emailVerified: false,
            loginAttempts: 0,
        });
        const organization = await Organization_1.default.create({
            name: organizationName,
            slug,
            ownerId: user.id,
            subscriptionTier: 'free',
            isActive: true,
        });
        // Generate JWT token
        const token = (0, jwt_1.generateToken)({
            userId: user.id,
            organizationId: organization.id,
            type: 'organization'
        });
        // Remove password hash from response
        const userResponse = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            type: 'organization',
            isActive: user.isActive,
            emailVerified: user.emailVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
        res.status(201).json(response_1.ApiResponse.success({
            user: userResponse,
            organization,
            token,
            expiresIn: 7 * 24 * 60 * 60 // 7 days in seconds
        }, 'Registration successful'));
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json(response_1.ApiResponse.error('Internal server error'));
    }
});
exports.default = app;
