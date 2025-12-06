const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true, index: true },
  password_hash: String,
  role: { type: String, enum: ['user','admin'], default: 'user' },
  is_verified: { type: Boolean, default: false },   // new
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
