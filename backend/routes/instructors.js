// routes/instructors.js
import express from "express";
import Instructor from "../models/Instructor.js";

const router = express.Router();

// GET /api/instructors
router.get("/", async (req, res) => {
  try {
    const items = await Instructor.find({}).lean();
    res.json(items);
  } catch (err) {
    console.error("GET /api/instructors error", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/instructors/:id
router.get("/:id", async (req, res) => {
  try {
    const item = await Instructor.findById(req.params.id).lean();
    if (!item) {
      return res.status(404).json({ error: "Not found" });
    }
    res.json(item);
  } catch (err) {
    console.error("GET /api/instructors/:id error", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST / PUT / DELETE for admin (same pattern as Asanas) – can be added later

export default router;
