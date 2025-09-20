const express = require('express');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Placeholder routes for services
router.get('/', authMiddleware.optionalAuth, (req, res) => {
  res.json({ message: 'Services endpoint - to be implemented' });
});

module.exports = router;