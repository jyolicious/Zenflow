import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema({
  title: String,
  summary: String,
  link: String,
});

const NewsletterSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    theme: String,
    description: String,
    articles: [ArticleSchema],
    pdf_url: String,

    // access control
    publishedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

/* Virtual: premium window (15 days) */
NewsletterSchema.virtual("isPremium").get(function () {
  const FIFTEEN_DAYS = 15 * 24 * 60 * 60 * 1000;
  return Date.now() - new Date(this.publishedAt).getTime() < FIFTEEN_DAYS;
});

NewsletterSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Newsletter", NewsletterSchema);
