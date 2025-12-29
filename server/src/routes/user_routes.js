const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const requireAuth = require('../middleware/requireAuth');
const requireAdmin = require('../middleware/requireAdmin');

// Get all users (requires admin authentication)
router.get('/', requireAuth, requireAdmin, userController.getAllUsers);

// Approve user access (requires admin authentication)
router.put('/:id/approve', requireAuth, requireAdmin, userController.approveUser);

// Revoke user access (requires admin authentication)
router.put('/:id/revoke', requireAuth, requireAdmin, userController.revokeUser);

module.exports = router;