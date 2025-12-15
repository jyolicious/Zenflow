// routes/asanas.js
import express from "express";
import mongoose from "mongoose";
import Asana from "../models/Asana.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// small helper to safely create regex from user input
function escapeRegex(text = "") {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// GET /api/asanas?q=searchText&tag=stress&page=1&limit=20
router.get("/", async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    const tag = (req.query.tag || "").trim();
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "50", 10), 1), 100);
    const skip = (page - 1) * limit;

    const filter = {};

    if (tag) {
      filter.tags = tag;
    } else if (q) {
      const safe = escapeRegex(q);
      const re = new RegExp(safe, "i");
      filter.$or = [{ name: re }, { description: re }, { tags: re }];
    }

    const [items, total] = await Promise.all([
      Asana.find(filter).sort({ name: 1 }).skip(skip).limit(limit).lean(),
      Asana.countDocuments(filter),
    ]);

    res.json({
      meta: { total, page, limit, pages: Math.ceil(total / limit) },
      data: items,
    });
  } catch (err) {
    console.error("GET /api/asanas error", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/asanas/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const item = await Asana.findById(id).lean();
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (err) {
    console.error("GET /api/asanas/:id error", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/asanas (admin)
router.post("/", requireAdmin, async (req, res) => {
  try {
    const { name, description, tags, photo_url, youtube_url } = req.body;

    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "Name is required" });
    }

    const doc = {
      name: name.trim(),
      description: description ? String(description).trim() : "",
      tags: Array.isArray(tags) ? tags.map((t) => String(t).trim()) : [],
      photo_url: photo_url ? String(photo_url).trim() : "",
      youtube_url: youtube_url ? String(youtube_url).trim() : "",
    };

    const created = await Asana.create(doc);
    res.status(201).json(created);
  } catch (err) {
    console.error("POST /api/asanas error", err);
    res.status(400).json({ error: "Bad request" });
  }
});

// PUT /api/asanas/:id (admin)
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const updates = {};
    if (req.body.name) updates.name = String(req.body.name).trim();
    if (req.body.description !== undefined) updates.description = String(req.body.description);
    if (req.body.tags) {
      updates.tags = Array.isArray(req.body.tags)
        ? req.body.tags.map((t) => String(t).trim())
        : [];
    }
    if (req.body.photo_url !== undefined) updates.photo_url = String(req.body.photo_url);
    if (req.body.youtube_url !== undefined) updates.youtube_url = String(req.body.youtube_url);

    const updated = await Asana.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err) {
    console.error("PUT /api/asanas/:id error", err);
    res.status(400).json({ error: "Bad request" });
  }
});

// DELETE /api/asanas/:id (admin)
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const deleted = await Asana.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Not found" });

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/asanas/:id error", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
