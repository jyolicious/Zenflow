const mongoose = require('mongoose');

const NewsletterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  file_url: { type: String, required: true }, // cloud link or google drive
  is_public: { type: Boolean, default: false },
  uploaded_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Newsletter', NewsletterSchema);
