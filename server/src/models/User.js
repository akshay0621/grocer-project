const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  user_name: {
    type: String,
    required: true,
    unique: true
  },
  user_password: {
    type: String,
    required: true
  },
  joining_date: {
    type: Date,
    default: Date.now
  },
}
, { 
  timestamps: true 
});

module.exports = mongoose.model('User', UserSchema);