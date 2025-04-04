const express = require('express');
const router = express.Router();
const httpCodeController = require('../controllers/httpCodeController');

// Get all HTTP codes
router.get('/', httpCodeController.getAllCodes);

// Filter HTTP codes
router.get('/filter', httpCodeController.filterCodes);

module.exports = router;