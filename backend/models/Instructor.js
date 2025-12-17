import mongoose from "mongoose";

const CenterSchema = new mongoose.Schema(
  {
    name: String,
    address: { type: String, required: true },
    lat: Number,
    lng: Number,
  },
  { _id: false }
);

const InstructorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    photo_url: { type: String, required: true },
    bio: String,
    specializations: [String],
    contact_email: String,
    phone: String,
    centers: [CenterSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Instructor", InstructorSchema);
