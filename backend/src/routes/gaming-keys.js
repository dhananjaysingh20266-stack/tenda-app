const express = require('express');
const authMiddleware = require('../middleware/auth');
const { GamingKey, Game, Service } = require('../models');

const router = express.Router();

// GET /api/v1/gaming-keys - List gaming keys
router.get('/', authMiddleware.authenticate, authMiddleware.authorize('gaming_keys', 'read'), async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const keys = await GamingKey.findAndCountAll({
      where: { organization_id: req.organizationId },
      include: [
        { model: Game, as: 'game' },
        { model: Service, as: 'service' },
      ],
      limit,
      offset,
      order: [['created_at', 'DESC']],
    });

    res.json({
      gaming_keys: keys.rows,
      pagination: {
        total: keys.count,
        page,
        limit,
        totalPages: Math.ceil(keys.count / limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/gaming-keys/generate - Generate new gaming keys
router.post('/generate', authMiddleware.authenticate, authMiddleware.authorize('gaming_keys', 'create'), async (req, res, next) => {
  try {
    // Implementation for key generation would go here
    res.json({ message: 'Key generation endpoint - to be implemented' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;