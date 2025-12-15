// models/Meditation.js
import mongoose from "mongoose";

const MeditationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  audio_url: { type: String },
  video_url: { type: String },
  tags: { type: [String], index: true },
  duration_minutes: { type: Number },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model("Meditation", MeditationSchema);
