// models/Newsletter.js
import mongoose from "mongoose";

const NewsletterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  file_url: { type: String, required: true }, // cloud link or Google Drive
  is_public: { type: Boolean, default: false },
  uploaded_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model("Newsletter", NewsletterSchema);
