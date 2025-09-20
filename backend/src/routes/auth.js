const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { User, Organization, Role, DeviceFingerprint, LoginAttempt, RefreshToken, AuditLog } = require('../models');
const config = require('../config');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('username').isLength({ min: 3, max: 50 }).matches(/^[a-zA-Z0-9_]+$/),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
  body('firstName').isLength({ min: 1, max: 50 }).trim(),
  body('lastName').isLength({ min: 1, max: 50 }).trim(),
  body('organizationName').optional().isLength({ min: 1, max: 100 }).trim(),
];

const loginValidation = [
  body('username').notEmpty().trim(),
  body('password').notEmpty(),
  body('deviceFingerprint').optional().isObject(),
];

// Helper function to generate tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user.id, organizationId: user.organization_id },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
  
  const refreshToken = jwt.sign(
    { userId: user.id, type: 'refresh' },
    config.jwt.secret,
    { expiresIn: config.jwt.refreshExpiresIn }
  );
  
  return { accessToken, refreshToken };
};

// Helper function to create device fingerprint
const createDeviceFingerprint = async (fingerprintData, req) => {
  if (!fingerprintData) return null;
  
  const fingerprintHash = require('crypto')
    .createHash('sha256')
    .update(JSON.stringify(fingerprintData))
    .digest('hex');
  
  const [fingerprint] = await DeviceFingerprint.findOrCreate({
    where: { fingerprint_hash: fingerprintHash },
    defaults: {
      fingerprint_hash: fingerprintHash,
      user_agent: req.get('User-Agent'),
      raw_data: fingerprintData,
      ...fingerprintData,
    },
  });
  
  return fingerprint;
};

// POST /api/v1/auth/register
router.post('/register', registerValidation, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const { username, email, password, firstName, lastName, organizationName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        $or: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return res.status(409).json({
        error: 'User already exists',
        field: existingUser.username === username ? 'username' : 'email',
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, config.security.bcryptRounds);

    // Create or find organization
    let organization;
    if (organizationName) {
      const slug = organizationName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      organization = await Organization.create({
        name: organizationName,
        slug,
      });
    } else {
      // Find a default organization or create personal one
      organization = await Organization.findOne({ where: { slug: 'default' } });
      if (!organization) {
        organization = await Organization.create({
          name: 'Default Organization',
          slug: 'default',
        });
      }
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password_hash: passwordHash,
      first_name: firstName,
      last_name: lastName,
      organization_id: organization.id,
      status: 'pending',
    });

    // Assign default role
    const userRole = await Role.findOne({ where: { name: 'user' } });
    if (userRole) {
      await user.addRole(userRole);
    }

    // Log registration
    await AuditLog.create({
      organization_id: organization.id,
      user_id: user.id,
      action: 'user_register',
      resource_type: 'user',
      resource_id: user.id,
      ip_address: req.ip,
      user_agent: req.get('User-Agent'),
      severity: 'low',
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        status: user.status,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/auth/login
router.post('/login', loginValidation, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const { username, password, deviceFingerprint } = req.body;
    const ipAddress = req.ip;
    const userAgent = req.get('User-Agent');

    // Find user
    const user = await User.findOne({
      where: {
        $or: [{ username }, { email: username }],
      },
      include: [
        { model: Organization, as: 'organization' },
        { model: Role, as: 'roles' },
      ],
    });

    // Log login attempt
    const loginAttempt = {
      username_attempted: username,
      ip_address: ipAddress,
      user_agent: userAgent,
      attempt_type: 'password',
      success: false,
    };

    if (user) {
      loginAttempt.user_id = user.id;
    }

    // Verify password
    if (!user || !await bcrypt.compare(password, user.password_hash)) {
      loginAttempt.failure_reason = 'invalid_credentials';
      await LoginAttempt.create(loginAttempt);
      
      return res.status(401).json({
        error: 'Invalid credentials',
      });
    }

    // Check account status
    if (user.status !== 'active') {
      loginAttempt.failure_reason = 'account_suspended';
      await LoginAttempt.create(loginAttempt);
      
      return res.status(401).json({
        error: 'Account not active',
        status: user.status,
      });
    }

    // Create device fingerprint if provided
    const deviceFingerprintRecord = await createDeviceFingerprint(deviceFingerprint, req);

    // Generate tokens
    const tokens = generateTokens(user);

    // Store refresh token
    const refreshTokenHash = require('crypto')
      .createHash('sha256')
      .update(tokens.refreshToken)
      .digest('hex');

    await RefreshToken.create({
      user_id: user.id,
      token_hash: refreshTokenHash,
      device_fingerprint_id: deviceFingerprintRecord?.id,
      ip_address: ipAddress,
      user_agent: userAgent,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    // Log successful login
    loginAttempt.success = true;
    await LoginAttempt.create(loginAttempt);

    // Update user login stats
    await user.update({
      last_login_at: new Date(),
      login_count: user.login_count + 1,
    });

    // Log login
    await AuditLog.create({
      organization_id: user.organization_id,
      user_id: user.id,
      action: 'user_login',
      resource_type: 'user',
      resource_id: user.id,
      ip_address: ipAddress,
      user_agent: userAgent,
      severity: 'low',
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        status: user.status,
        organization: {
          id: user.organization.id,
          name: user.organization.name,
        },
        roles: user.roles.map(role => role.name),
      },
      tokens,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/auth/refresh
router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        error: 'Refresh token required',
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, config.jwt.secret);

    if (decoded.type !== 'refresh') {
      return res.status(401).json({
        error: 'Invalid token type',
      });
    }

    // Find stored refresh token
    const refreshTokenHash = require('crypto')
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    const storedToken = await RefreshToken.findOne({
      where: {
        token_hash: refreshTokenHash,
        user_id: decoded.userId,
        is_active: true,
      },
    });

    if (!storedToken || new Date() > storedToken.expires_at) {
      return res.status(401).json({
        error: 'Invalid or expired refresh token',
      });
    }

    // Find user
    const user = await User.findByPk(decoded.userId);

    if (!user || user.status !== 'active') {
      return res.status(401).json({
        error: 'User not found or not active',
      });
    }

    // Generate new tokens
    const tokens = generateTokens(user);

    // Update refresh token usage
    await storedToken.update({
      last_used_at: new Date(),
    });

    res.json({
      tokens,
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid refresh token',
      });
    }
    next(error);
  }
});

// POST /api/v1/auth/logout
router.post('/logout', authMiddleware.authenticate, async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    // Invalidate refresh token if provided
    if (refreshToken) {
      const refreshTokenHash = require('crypto')
        .createHash('sha256')
        .update(refreshToken)
        .digest('hex');

      await RefreshToken.update(
        { is_active: false },
        {
          where: {
            token_hash: refreshTokenHash,
            user_id: req.userId,
          },
        }
      );
    }

    // Log logout
    await AuditLog.create({
      organization_id: req.organizationId,
      user_id: req.userId,
      action: 'user_logout',
      resource_type: 'user',
      resource_id: req.userId,
      ip_address: req.ip,
      user_agent: req.get('User-Agent'),
      severity: 'low',
    });

    res.json({
      message: 'Logout successful',
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/auth/me
router.get('/me', authMiddleware.authenticate, async (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      firstName: req.user.first_name,
      lastName: req.user.last_name,
      status: req.user.status,
      organization: {
        id: req.user.organization.id,
        name: req.user.organization.name,
      },
      roles: req.user.roles.map(role => role.name),
      permissions: req.user.roles.flatMap(role => 
        role.permissions.map(permission => `${permission.resource}:${permission.action}`)
      ),
    },
  });
});

module.exports = router;