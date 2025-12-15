// models/Asana.js
import mongoose from "mongoose";

const AsanaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photo_url: { type: String },
  description: { type: String },
  youtube_url: { type: String },
  tags: { type: [String], index: true },
  level: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    default: "beginner",
  },
  duration_minutes: { type: Number },
  created_at: { type: Date, default: Date.now },
});

// text index for search
AsanaSchema.index({ name: "text", description: "text", tags: 1 });

export default mongoose.model("Asana", AsanaSchema);
