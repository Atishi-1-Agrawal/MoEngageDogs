const mongoose = require('mongoose');

const HttpCodeSchema = new mongoose.Schema({
  code: {
    type: Number,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['1xx', '2xx', '3xx', '4xx', '5xx'],
    required: true
  }
});

module.exports = mongoose.model('HttpCode', HttpCodeSchema);