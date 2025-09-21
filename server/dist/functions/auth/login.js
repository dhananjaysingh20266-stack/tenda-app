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
app.post('/auth/login', (0, validation_1.validate)(auth_1.loginSchema), async (req, res) => {
    try {
        const { email, password, loginType } = req.body;
        // Find user
        const user = await User_1.default.findOne({
            where: { email, isActive: true }
        });
        if (!user) {
            return res.status(401).json(response_1.ApiResponse.error('Invalid credentials'));
        }
        // Check password
        const isValidPassword = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isValidPassword) {
            // Increment login attempts
            await user.increment('loginAttempts');
            if (user.loginAttempts >= 5) {
                await user.update({
                    lockedUntil: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
                });
            }
            return res.status(401).json(response_1.ApiResponse.error('Invalid credentials'));
        }
        // Check if account is locked
        if (user.lockedUntil && user.lockedUntil > new Date()) {
            return res.status(423).json(response_1.ApiResponse.error('Account temporarily locked'));
        }
        let organization = null;
        if (loginType === 'organization') {
            // Organization login
            organization = await Organization_1.default.findOne({
                where: { ownerId: user.id, isActive: true }
            });
            if (!organization) {
                return res.status(403).json(response_1.ApiResponse.error('Organization access denied'));
            }
        }
        else {
            // Individual login - for demo purposes, we'll allow any active user
            // In production, you'd check organization membership
        }
        // Reset login attempts on successful login
        await user.update({
            loginAttempts: 0,
            lockedUntil: undefined,
            lastLogin: new Date()
        });
        // Generate JWT token
        const token = (0, jwt_1.generateToken)({
            userId: user.id,
            organizationId: organization?.id,
            type: loginType
        });
        // Remove password hash from response
        const userResponse = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            type: loginType,
            isActive: user.isActive,
            emailVerified: user.emailVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
        res.json(response_1.ApiResponse.success({
            user: userResponse,
            organization,
            token,
            expiresIn: 7 * 24 * 60 * 60 // 7 days in seconds
        }, 'Login successful'));
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json(response_1.ApiResponse.error('Internal server error'));
    }
});
exports.default = app;
