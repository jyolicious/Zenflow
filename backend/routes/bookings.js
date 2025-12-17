// routes/bookings.js
import express from "express";
import Booking from "../models/Booking.js";

const router = express.Router();

/**
 * POST /bookings
 * Create booking request
 */
router.post("/", async (req, res) => {
  try {
    console.log("BOOKING BODY:", req.body); // 👈 ADD THIS
    const booking = await Booking.create(req.body);

    return res.status(201).json({
      message: "Booking request received",
      bookingId: booking._id,
    });
  } catch (err) {
    console.error("POST /bookings error:", err);
    return res.status(400).json({
      error: "Failed to create booking",
    });
  }
});

/**
 * GET /bookings
 * (Admin use later)
 */
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

export default router;
