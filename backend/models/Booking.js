// models/Booking.js
import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },

    program: {
      type: String,
      enum: ["Trial Class", "Yoga Class", "Meditation Session"],
      default: "Trial Class",
    },

    instructor: {
      type: String, // instructor name for now (can be ObjectId later)
    },

    timeslot: {
      type: String,
      enum: ["Morning", "Afternoon", "Evening"],
      default: "Morning",
    },

    message: { type: String },

    status: {
      type: String,
      enum: ["Pending", "Contacted", "Completed"],
      default: "Pending",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", BookingSchema);
