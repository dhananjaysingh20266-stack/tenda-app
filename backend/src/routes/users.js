const express = require('express');
const authMiddleware = require('../middleware/auth');
const { User } = require('../models');

const router = express.Router();

// GET /api/v1/users - List users (with pagination)
router.get('/', authMiddleware.authenticate, authMiddleware.authorize('users', 'read'), async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const users = await User.findAndCountAll({
      where: { organization_id: req.organizationId },
      limit,
      offset,
      attributes: { exclude: ['password_hash'] },
      order: [['created_at', 'DESC']],
    });

    res.json({
      users: users.rows,
      pagination: {
        total: users.count,
        page,
        limit,
        totalPages: Math.ceil(users.count / limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/users/:id - Get user by ID
router.get('/:id', authMiddleware.authenticate, authMiddleware.authorize('users', 'read'), async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { 
        id: req.params.id,
        organization_id: req.organizationId,
      },
      attributes: { exclude: ['password_hash'] },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
});

module.exports = router;