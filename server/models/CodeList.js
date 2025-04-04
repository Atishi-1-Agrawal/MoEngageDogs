const mongoose = require('mongoose');

const CodeListSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  codes: [{
    code: {
      type: Number,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    description: {
      type: String
    }
  }],
  filter: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CodeList', CodeListSchema);