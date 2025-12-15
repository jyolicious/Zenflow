// routes/newsletters.js
import express from "express";
import Newsletter from "../models/Newsletter.js";

const router = express.Router();

// GET /api/newsletters
// (If not public, restrict via auth on frontend or add middleware later)
router.get("/", async (req, res) => {
  try {
    const items = await Newsletter.find({})
      .sort({ created_at: -1 })
      .lean();

    res.json(items);
  } catch (err) {
    console.error("GET /api/newsletters error", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/newsletters (admin)
router.post("/", async (req, res) => {
  try {
    // TODO: restrict to admin using requireAdmin middleware
    const created = await Newsletter.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    console.error("POST /api/newsletters error", err);
    res.status(400).json({ error: "Bad request" });
  }
});

export default router;
