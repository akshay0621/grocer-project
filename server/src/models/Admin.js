const mongoose = require('mongoose');
const { Schema } = mongoose;

const admin_schema = new Schema({
  admin_name: {
    type: String,
    required: true,
    unique: true
  },
  admin_password: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('admin', admin_schema);