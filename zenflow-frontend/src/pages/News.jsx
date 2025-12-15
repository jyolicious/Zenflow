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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8 px-6">
        <div className="max-w-7xl mx-auto flex gap-8">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Yoga & Health News
            </h2>
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
              <span className="ml-3 text-gray-600">Loading news...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8 px-6">
        <div className="max-w-7xl mx-auto flex gap-8">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Yoga & Health News
            </h2>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8 px-6">
      <div className="max-w-7xl mx-auto flex gap-8">
        {/* Left Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-8 space-y-6">
            {/* Categories */}
            <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Categories</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded hover:bg-purple-50 cursor-pointer transition-colors">
                  <span className="text-gray-700">Yoga Practice</span>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                    {articles.length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded hover:bg-purple-50 cursor-pointer transition-colors">
                  <span className="text-gray-700">Wellness</span>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">12</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded hover:bg-purple-50 cursor-pointer transition-colors">
                  <span className="text-gray-700">Meditation</span>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">8</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded hover:bg-purple-50 cursor-pointer transition-colors">
                  <span className="text-gray-700">Nutrition</span>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">5</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-sm p-5 text-white">
              <h3 className="text-lg font-semibold mb-4">Today's Updates</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-purple-100">Total Articles</span>
                  <span className="text-2xl font-bold">{articles.length}</span>
                </div>
                <div className="border-t border-purple-400 pt-3">
                  <p className="text-sm text-purple-100">
                    Stay informed with the latest yoga and wellness news
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Yoga & Health News
          </h2>

          {articles.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-gray-500">
                No yoga or health news available at the moment.
              </p>
            </div>
          )}

          {/* News List */}
          <div className="space-y-4">
            {articles.map((item, index) => (
              <a
                key={index}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-5 border border-gray-100 flex gap-4 block group"
              >
                {/* Image */}
                {item.urlToImage && (
                  <div className="flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden bg-gray-200">
                    <img
                      src={item.urlToImage}
                      alt={item.title || "News image"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                    {item.title || "Untitled"}
                  </h4>

                  {item.description && (
                    <p className="text-gray-600 leading-relaxed mb-3 line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  <div className="flex items-center text-sm text-gray-500">
                    <span className="font-medium text-purple-600">
                      {item.source?.name || "Unknown source"}
                    </span>
                    <span className="mx-2">•</span>
                    <span>
                      {item.publishedAt
                        ? new Date(item.publishedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : ""}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="hidden xl:block w-80 flex-shrink-0">
          <div className="sticky top-8 space-y-6">
            {/* Trending Topics */}
            <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Trending Topics</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🧘</span>
                  <span className="text-gray-700">Morning Yoga Routines</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🌿</span>
                  <span className="text-gray-700">Mindful Meditation</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">💪</span>
                  <span className="text-gray-700">Strength & Flexibility</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🍃</span>
                  <span className="text-gray-700">Ayurvedic Wellness</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">😌</span>
                  <span className="text-gray-700">Stress Relief</span>
                </div>
              </div>
            </div>

            {/* Popular Sources */}
            <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Popular Sources</h3>
              <div className="space-y-2">
                <div className="p-2 rounded hover:bg-gray-50 cursor-pointer transition-colors">
                  <p className="font-medium text-gray-800">Yoga Journal</p>
                  <p className="text-xs text-gray-500">Daily yoga insights</p>
                </div>
                <div className="p-2 rounded hover:bg-gray-50 cursor-pointer transition-colors">
                  <p className="font-medium text-gray-800">Health Today</p>
                  <p className="text-xs text-gray-500">Wellness updates</p>
                </div>
                <div className="p-2 rounded hover:bg-gray-50 cursor-pointer transition-colors">
                  <p className="font-medium text-gray-800">Wellness Weekly</p>
                  <p className="text-xs text-gray-500">Lifestyle & health</p>
                </div>
              </div>
            </div>

            {/* Newsletter Box */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm p-5 text-white">
              <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
              <p className="text-sm text-blue-100 mb-4">
                Get the latest yoga and wellness news delivered to your inbox
              </p>
              <button className="w-full bg-white text-blue-600 font-medium py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}