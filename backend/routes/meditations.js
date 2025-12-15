// routes/meditations.js
import express from "express";
import Meditation from "../models/Meditation.js";

const router = express.Router();

// GET /api/meditations?q=search
router.get("/", async (req, res) => {
  try {
    const q = req.query.q;
    let filter = {};

    if (q) {
      const re = new RegExp(q, "i");
      filter.$or = [
        { name: re },
        { description: re },
        { tags: re },
      ];
    }

    const items = await Meditation.find(filter).limit(100).lean();
    res.json(items);
  } catch (err) {
    console.error("GET /api/meditations error", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST / PUT / DELETE routes can follow the same pattern as Asanas

export default router;
