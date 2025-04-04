const express = require('express');
const router = express.Router();
const listController = require('../controllers/listController');
const auth = require('../middleware/auth');

// Create a new list
router.post('/', auth, listController.createList);

// Get all lists for a user
router.get('/', auth, listController.getUserLists);

// Get a single list by ID
router.get('/:id', auth, listController.getListById);

// Update a list
router.put('/:id', auth, listController.updateList);

// Delete a list
router.delete('/:id', auth, listController.deleteList);

module.exports = router;