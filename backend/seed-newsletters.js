import mongoose from "mongoose";
import Newsletter from "./models/Newsletter.js";

const MONGO_URI = "mongodb://127.0.0.1:27017/zenflowdb";

const PDF_URL =
  "https://drive.google.com/file/d/1_7cB3metCx4QkY8GNKUzqKGqudBFcesP/view?usp=drive_link";

async function seed() {
  await mongoose.connect(MONGO_URI);

  await Newsletter.deleteMany();

  await Newsletter.insertMany([
    // 🔒 PREMIUM — Recent (within 15 days)
    {
      title: "Zenflow Wellness Digest – April 2025",
      theme: "Mental Clarity & Stress Reset",
      description:
        "A monthly guide to calm your mind, reduce stress, and regain clarity through yoga and mindfulness.",
      articles: [
        {
          title: "7-Day Calm Reset",
          summary: "A short daily yoga and breathing routine to reduce stress.",
        },
        {
          title: "Breathing for Anxiety",
          summary: "How pranayama helps regulate the nervous system.",
        },
      ],
      pdf_url: PDF_URL,
      publishedAt: new Date(),
    },

    {
      title: "Zenflow Wellness Digest – Late March 2025",
      theme: "Focus & Productivity",
      description:
        "Yoga and mindfulness practices designed to improve focus and productivity.",
      articles: [
        {
          title: "Yoga for Deep Focus",
          summary: "Simple poses to improve attention and concentration.",
        },
      ],
      pdf_url: PDF_URL,
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },

    // ✅ FREE — Older than 15 days
    {
      title: "Zenflow Wellness Digest – February 2025",
      theme: "Mindfulness & Daily Balance",
      description:
        "Build sustainable mindfulness habits and balance your daily routine.",
      articles: [
        {
          title: "Morning Mindfulness",
          summary: "Start your day with clarity and intention.",
        },
        {
          title: "Mindful Work Breaks",
          summary: "Short practices to stay calm and productive at work.",
        },
      ],
      pdf_url: PDF_URL,
      publishedAt: new Date("2025-02-01"),
    },

    {
      title: "Zenflow Wellness Digest – January 2025",
      theme: "Healthy New Year Foundations",
      description:
        "Create healthy routines and reset your mind and body for the new year.",
      articles: [
        {
          title: "Gentle Yoga for Beginners",
          summary: "Easy poses to start your wellness journey.",
        },
      ],
      pdf_url: PDF_URL,
      publishedAt: new Date("2025-01-05"),
    },

    {
      title: "Zenflow Wellness Digest – December 2024",
      theme: "Inner Peace & Reflection",
      description:
        "Reflect, release, and reconnect with yourself through mindful practices.",
      articles: [
        {
          title: "Year-End Reflection Meditation",
          summary: "A guided meditation for closure and renewal.",
        },
      ],
      pdf_url: PDF_URL,
      publishedAt: new Date("2024-12-10"),
    },

    {
      title: "Zenflow Wellness Digest – November 2024",
      theme: "Sleep & Recovery",
      description:
        "Improve sleep quality and recovery with restorative yoga and breathing.",
      articles: [
        {
          title: "Yoga Nidra for Deep Sleep",
          summary: "A powerful practice to improve sleep quality.",
        },
      ],
      pdf_url: PDF_URL,
      publishedAt: new Date("2024-11-12"),
    },

    {
      title: "Zenflow Wellness Digest – October 2024",
      theme: "Emotional Well-being",
      description:
        "Practices to support emotional health and resilience.",
      articles: [
        {
          title: "Yoga for Emotional Balance",
          summary: "Gentle movement to stabilize emotions.",
        },
      ],
      pdf_url: PDF_URL,
      publishedAt: new Date("2024-10-08"),
    },

    {
      title: "Zenflow Wellness Digest – September 2024",
      theme: "Stress Management Basics",
      description:
        "Foundational yoga and mindfulness techniques for managing stress.",
      articles: [
        {
          title: "Breathing Techniques for Stress",
          summary: "Simple breathing exercises to calm the mind.",
        },
      ],
      pdf_url: PDF_URL,
      publishedAt: new Date("2024-09-05"),
    },
  ]);

  console.log("✅ Newsletters seeded with Google Drive PDF");
  process.exit();
}

seed();
