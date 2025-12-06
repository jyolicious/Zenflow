const mongoose = require('mongoose');

const CenterSchema = new mongoose.Schema({
  name: String,
  address: String,
  lat: Number,
  lng: Number
}, { _id: false });

const InstructorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photo_url: String,
  bio: String,
  specializations: [String],
  contact_email: String,
  phone: String,
  centers: [CenterSchema],
  social_links: { type: Map, of: String },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Instructor', InstructorSchema);
