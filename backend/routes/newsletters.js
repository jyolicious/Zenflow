import express from "express";
import Newsletter from "../models/Newsletter.js";

const router = express.Router();

/**
 * GET /newsletters
 * List all newsletters (metadata + pdf_url for redirect)
 */
router.get("/", async (req, res) => {
  try {
    const newsletters = await Newsletter.find()
      .sort({ publishedAt: -1 })
      .select("title theme description publishedAt pdf_url");

    res.json(newsletters);
  } catch (err) {
    console.error("Error fetching newsletters:", err);
    res.status(500).json({ message: "Failed to fetch newsletters" });
  }
});

/**
 * GET /newsletters/:id
 * Fetch single newsletter with access control (future use)
 */
router.get("/:id", async (req, res) => {
  try {
    const newsletter = await Newsletter.findById(req.params.id);

    if (!newsletter) {
      return res.status(404).json({ message: "Newsletter not found" });
    }

    // ⚠️ Placeholder until auth middleware is added
    const isLoggedIn = Boolean(req.user);

    // 🔐 Login required
    if (!isLoggedIn) {
      return res.json({
        locked: true,
        reason: "LOGIN_REQUIRED",
        preview: {
          title: newsletter.title,
          theme: newsletter.theme,
          description: newsletter.description,
          publishedAt: newsletter.publishedAt,
        },
      });
    }

    // 🔒 Premium early access logic (15 days)
    const daysSincePublished =
      (Date.now() - new Date(newsletter.publishedAt).getTime()) /
      (1000 * 60 * 60 * 24);

    if (daysSincePublished < 15) {
      return res.json({
        locked: true,
        reason: "PREMIUM_EARLY_ACCESS",
        preview: {
          title: newsletter.title,
          theme: newsletter.theme,
          description: newsletter.description,
          publishedAt: newsletter.publishedAt,
        },
      });
    }

    // ✅ Free access
    return res.json({
      locked: false,
      newsletter,
    });
  } catch (err) {
    console.error("Error fetching newsletter:", err);
    res.status(500).json({ message: "Failed to fetch newsletter" });
  }
});

export default router;
