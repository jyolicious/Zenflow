const mongoose = require('mongoose');

const MeditationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  audio_url: { type: String },
  video_url: { type: String },
  tags: { type: [String], index: true },
  duration_minutes: { type: Number },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Meditation', MeditationSchema);
