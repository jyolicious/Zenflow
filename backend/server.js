import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./db.js";

import asanasRoutes from "./routes/asanas.js";
import meditationsRoutes from "./routes/meditations.js";
import instructorsRoutes from "./routes/instructors.js";
import newslettersRoutes from "./routes/newsletters.js";
import authRoutes from "./routes/auth.js";
import newsRoutes from "./routes/news.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/asanas", asanasRoutes);
app.use("/api/meditations", meditationsRoutes);
app.use("/api/instructors", instructorsRoutes);
app.use("/api/newsletters", newslettersRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
