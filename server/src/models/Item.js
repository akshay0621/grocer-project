const mongoose = require('mongoose');
const { Schema } = mongoose;

const item_schema = new Schema({
  item_name: {
    type: String,
    required: true
  },
  item_quantity: {
    type: String,
    required: true,
  },
  added_by: {
    type: String,
    ref: 'User',
    required: true
  },
  item_description: {
    type: String,
    required: false
  },
  is_purchased: {
    type: Boolean,
    default: false
  },
  purchased_by: {
    type: String,
    ref: 'User',
    required: false
  },
  schedule_type: {
    type: String,
    enum: ['none', 'regular', 'specific'],
    default: 'none'
  },
  regular_days: {
    type: [String], // e.g., ['Monday', 'Wednesday']
    default: []
  },
  specific_date: {
    type: Date,
    required: false
  }
}, { timestamps: true });

module.exports = mongoose.model('items', item_schema);