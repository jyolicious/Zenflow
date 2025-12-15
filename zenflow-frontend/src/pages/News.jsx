// src/pages/News.jsx
import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await api.get("/news/yoga");
        console.log("NEWS FROM BACKEND:", res.data); // ✅ verify data
        setArticles(res.data || []);
      } catch (err) {
        console.error("News fetch error:", err);
        setError("Failed to load news");
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "24px" }}>
        <h2>Yoga & Health News</h2>
        <p>Loading news...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "24px" }}>
        <h2>Yoga & Health News</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", maxWidth: "1000px", margin: "0 auto" }}>
      <h2>Yoga & Health News</h2>

      {articles.length === 0 && (
        <p>No news available at the moment.</p>
      )}

      {/* TEMPORARY RENDER — will be replaced by horizontal UI */}
      {articles.map((item, index) => (
        <div
          key={index}
          style={{
            borderBottom: "1px solid #ddd",
            padding: "12px 0",
          }}
        >
          <h4 style={{ marginBottom: "6px" }}>
            {item.title || "Untitled"}
          </h4>

          {item.description && (
            <p style={{ color: "#555" }}>
              {item.description}
            </p>
          )}

          <small style={{ color: "#888" }}>
            {item.source?.name || "Unknown source"} •{" "}
            {item.publishedAt
              ? new Date(item.publishedAt).toLocaleDateString()
              : ""}
          </small>
        </div>
      ))}
    </div>
  );
}
