const jwt = require('jsonwebtoken');
const { User, Role, Permission, Organization } = require('../models');
const config = require('../config');

const authMiddleware = {
  // Verify JWT token
  authenticate: async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentication token required' });
      }

      const token = authHeader.substring(7);
      
      const decoded = jwt.verify(token, config.jwt.secret);
      
      const user = await User.findByPk(decoded.userId, {
        include: [
          {
            model: Organization,
            as: 'organization',
          },
          {
            model: Role,
            as: 'roles',
            include: [{
              model: Permission,
              as: 'permissions',
            }],
          },
        ],
      });

      if (!user) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      if (user.status !== 'active') {
        return res.status(401).json({ error: 'Account not active' });
      }

      req.user = user;
      req.userId = user.id;
      req.organizationId = user.organization_id;
      
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' });
      }
      
      return res.status(401).json({ error: 'Invalid token' });
    }
  },

  // Check if user has required permission
  authorize: (resource, action) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const hasPermission = req.user.roles.some(role =>
        role.permissions.some(permission =>
          permission.resource === resource && permission.action === action
        )
      );

      if (!hasPermission) {
        return res.status(403).json({ 
          error: 'Insufficient permissions',
          required: `${resource}:${action}`,
        });
      }

      next();
    };
  },

  // Check if user has any of the specified roles
  requireRole: (...roleNames) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const hasRole = req.user.roles.some(role => 
        roleNames.includes(role.name)
      );

      if (!hasRole) {
        return res.status(403).json({ 
          error: 'Insufficient role permissions',
          required: roleNames,
        });
      }

      next();
    };
  },

  // Optional authentication - doesn't fail if no token provided
  optionalAuth: async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next();
      }

      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, config.jwt.secret);
      
      const user = await User.findByPk(decoded.userId, {
        include: [
          { model: Organization, as: 'organization' },
          { 
            model: Role, 
            as: 'roles',
            include: [{ model: Permission, as: 'permissions' }],
          },
        ],
      });

      if (user && user.status === 'active') {
        req.user = user;
        req.userId = user.id;
        req.organizationId = user.organization_id;
      }
      
      next();
    } catch (error) {
      // Ignore errors for optional auth
      next();
    }
  },
};

module.exports = authMiddleware;