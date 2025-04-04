const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Register
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Get user profile (protected)
router.get('/profile', auth, authController.getProfile);

module.exports = router;