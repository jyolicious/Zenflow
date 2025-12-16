import mongoose from "mongoose";
import Newsletter from "./models/Newsletter.js";

const MONGO_URI = "mongodb://127.0.0.1:27017/zenflowdb"; // adjust if needed

async function seed() {
  await mongoose.connect(MONGO_URI);

  await Newsletter.deleteMany();

  await Newsletter.insertMany([
    {
      title: "Zenflow Wellness Digest – April 2025",
      theme: "Mental Clarity & Stress Reset",
      description: "A monthly guide to calm, focus, and balance.",
      articles: [
        {
          title: "7-Day Calm Reset",
          summary: "A simple yoga and breathing plan.",
        },
        {
          title: "Breathing for Anxiety",
          summary: "How pranayama regulates the nervous system.",
        },
      ],
      pdf_url: "https://yourcdn.com/april-2025.pdf",
      publishedAt: new Date(), // PREMIUM (last 15 days)
    },
    {
      title: "Zenflow Wellness Digest – January 2025",
      theme: "Foundations of Mindfulness",
      description: "Build sustainable mindfulness habits.",
      articles: [
        {
          title: "Morning Mindfulness",
          summary: "Start your day with awareness.",
        },
      ],
      pdf_url: "https://yourcdn.com/january-2025.pdf",
      publishedAt: new Date("2025-01-01"), // FREE
    },
  ]);

  console.log("✅ Newsletters seeded");
  process.exit();
}

seed();
