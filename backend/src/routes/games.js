const express = require('express');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Placeholder routes for games
router.get('/', authMiddleware.optionalAuth, (req, res) => {
  res.json({ message: 'Games endpoint - to be implemented' });
});

module.exports = router;