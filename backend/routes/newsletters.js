import express from "express";
import Newsletter from "../models/Newsletter.js";

const router = express.Router();

/**
 * GET /newsletters
 * List all newsletters (metadata only)
 */
router.get("/", async (req, res) => {
  try {
    const newsletters = await Newsletter.find()
      .sort({ publishedAt: -1 })
      .select("title theme description publishedAt");

    res.json(newsletters);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch newsletters" });
  }
});

/**
 * GET /newsletters/:id
 * Single newsletter with access control
 */
router.get("/:id", async (req, res) => {
  try {
    const newsletter = await Newsletter.findById(req.params.id);

    if (!newsletter) {
      return res.status(404).json({ message: "Newsletter not found" });
    }

    const isLoggedIn = Boolean(req.user); // later from auth middleware

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

    // 🔒 Premium early access (15 days)
    if (newsletter.isPremium) {
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
    res.status(500).json({ message: "Failed to fetch newsletter" });
  }
});

export default router;
