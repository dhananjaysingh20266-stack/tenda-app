const express = require('express');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Placeholder routes for notifications
router.get('/', authMiddleware.authenticate, (req, res) => {
  res.json({ message: 'Notifications endpoint - to be implemented' });
});

module.exports = router;