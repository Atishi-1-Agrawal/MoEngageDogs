const CodeList = require('../models/CodeList');
const HttpCode = require('../models/HttpCode');

// Create a new list
exports.createList = async (req, res) => {
  try {
    const { name, filter, codes } = req.body;
    
    const newList = new CodeList({
      name,
      filter,
      codes,
      user: req.user.id
    });
    
    const savedList = await newList.save();
    res.status(201).json(savedList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all lists for a user
exports.getUserLists = async (req, res) => {
  try {
    const lists = await CodeList.find({ user: req.user.id })
      .sort({ createdAt: -1 });
      
    res.json(lists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single list by ID
exports.getListById = async (req, res) => {
  try {
    const list = await CodeList.findById(req.params.id);
    
    // Check if list exists
    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }
    
    // Check list ownership
    if (list.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a list
exports.updateList = async (req, res) => {
  try {
    const { name, codes } = req.body;
    
    // Find the list
    let list = await CodeList.findById(req.params.id);
    
    // Check if list exists
    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }
    
    // Check list ownership
    if (list.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Update fields
    if (name) list.name = name;
    if (codes) list.codes = codes;
    list.updatedAt = Date.now();
    
    // Save updated list
    const updatedList = await list.save();
    res.json(updatedList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a list
exports.deleteList = async (req, res) => {
  try {
    // Find the list
    const list = await CodeList.findById(req.params.id);
    
    // Check if list exists
    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }
    
    // Check list ownership
    if (list.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Delete the list
    await list.remove();
    res.json({ message: 'List removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};