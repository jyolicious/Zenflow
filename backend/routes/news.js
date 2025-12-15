import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/yoga", async (req, res) => {
  try {
    const response = await axios.get(
      "https://newsapi.org/v2/everything",
      {
        params: {
          q: "yoga OR meditation",
          language: "en",
          sortBy: "publishedAt",
          pageSize: 20,
          apiKey: process.env.NEWS_API_KEY,
        },
      }
    );

    // Send raw articles for now (important)
    res.json(response.data.articles);

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "News fetch failed" });
  }
});

export default router;
