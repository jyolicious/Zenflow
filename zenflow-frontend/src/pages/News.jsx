import React, { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import { Search, Loader2, Filter, X } from 'lucide-react';

/* -----------------------------
   Category keyword rules
-------------------------------- */
const CATEGORY_RULES = {
  "Yoga Practice": ["yoga", "asana", "pose", "practice"],
  Wellness: ["wellness", "health", "lifestyle"],
  Meditation: ["meditation", "mindfulness", "pranayama"],
  Nutrition: ["nutrition", "diet", "ayurveda"],
};

export default function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastFetched, setLastFetched] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const quickCategories = [
    { label: 'Yoga Practice', value: 'Yoga Practice', color: 'bg-teal-100 text-teal-700 hover:bg-teal-200' },
    { label: 'Wellness', value: 'Wellness', color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
    { label: 'Meditation', value: 'Meditation', color: 'bg-purple-100 text-purple-700 hover:bg-purple-200' },
    { label: 'Nutrition', value: 'Nutrition', color: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' }
  ];

  const fetchNews = async () => {
    setLoading(true);
    setError("");
    try {
      const timestamp = new Date().getTime();
      const res = await api.get(`/news/yoga?_t=${timestamp}`);
      setArticles(res.data || []);
      setLastFetched(new Date());
    } catch (err) {
      console.error("News fetch error:", err);
      setError("Failed to load news");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  /* -----------------------------
     Real-time derived data
  -------------------------------- */

  const categoryCounts = useMemo(() => {
    const counts = {
      "Yoga Practice": 0,
      Wellness: 0,
      Meditation: 0,
      Nutrition: 0,
    };

    articles.forEach((a) => {
      const text = `${a.title || ""} ${a.description || ""}`.toLowerCase();
      for (const [category, keywords] of Object.entries(CATEGORY_RULES)) {
        if (keywords.some((k) => text.includes(k))) {
          counts[category]++;
          break;
        }
      }
    });

    return counts;
  }, [articles]);

  const trendingTopics = useMemo(() => {
    const freq = {};
    articles.forEach((a) => {
      (a.title || "")
        .toLowerCase()
        .split(" ")
        .filter((w) => w.length > 5)
        .forEach((w) => {
          freq[w] = (freq[w] || 0) + 1;
        });
    });

    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);
  }, [articles]);

  const popularSources = useMemo(() => {
    const map = {};
    articles.forEach((a) => {
      const src = a.source?.name;
      if (!src) return;
      map[src] = (map[src] || 0) + 1;
    });

    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  }, [articles]);

  // Filter articles
  const filteredArticles = useMemo(() => {
    let filtered = articles;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(a => 
        (a.title || "").toLowerCase().includes(query) ||
        (a.description || "").toLowerCase().includes(query)
      );
    }

    if (selectedCategory) {
      const keywords = CATEGORY_RULES[selectedCategory];
      if (keywords) {
        filtered = filtered.filter(a => {
          const text = `${a.title || ""} ${a.description || ""}`.toLowerCase();
          return keywords.some(k => text.includes(k));
        });
      }
    }

    return filtered;
  }, [articles, searchQuery, selectedCategory]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category === selectedCategory ? "" : category);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      // Filtering happens automatically via useMemo
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-8">
            Latest News
          </h2>
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-200 border-t-teal-600"></div>
            <span className="ml-4 text-gray-600 text-lg font-medium">Loading news...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-8">
            Latest News
          </h2>
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-xl shadow-md">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Search & Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search news articles..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={fetchNews}
                disabled={loading}
                className="px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                Refresh
              </button>

              {(searchQuery || selectedCategory) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all flex items-center gap-2"
                >
                  <X className="w-5 h-5" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-semibold text-gray-600">Quick Filters:</span>

            {quickCategories.map(cat => (
              <button
                key={cat.value}
                onClick={() => handleCategoryClick(cat.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat.value ? 'ring-2 ring-offset-2 ring-teal-500 ' + cat.color : cat.color
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-6">
          {/* Left Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-8 space-y-6">
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                  Categories
                </h3>

                <div className="space-y-3">
                  {Object.entries(categoryCounts).map(([cat, count]) => (
                    <div
                      key={cat}
                      onClick={() => handleCategoryClick(cat)}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 cursor-pointer transition-all duration-200 group"
                    >
                      <span className="text-gray-700 font-medium group-hover:text-teal-700 transition-colors">
                        {cat}
                      </span>
                      <span className="text-xs bg-teal-100 text-teal-700 px-3 py-1.5 rounded-full font-semibold group-hover:bg-teal-600 group-hover:text-white transition-all">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                 Latest News
              </h2>
              <div className="flex items-center gap-3">
                {lastFetched && (
                  <span className="text-sm text-gray-500">
                    Updated: {lastFetched.toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>

            {!loading && filteredArticles.length > 0 && (
              <p className="text-gray-600 mb-6">
                Found <span className="font-semibold text-teal-600">{filteredArticles.length}</span> articles
                {selectedCategory && ` in "${selectedCategory}"`}
              </p>
            )}

            <div className="space-y-5">
              {filteredArticles.map((item, index) => (
                <a
                  key={index}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 flex gap-5 block group hover:border-teal-300 hover:-translate-y-1"
                >
                  {item.urlToImage && (
                    <div className="flex-shrink-0 w-36 h-36 rounded-xl overflow-hidden bg-gray-200 ring-2 ring-gray-100 group-hover:ring-teal-300 transition-all">
                      <img
                        src={item.urlToImage}
                        alt={item.title || "News image"}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors leading-snug">
                      {item.title || "Untitled"}
                    </h4>

                    {item.description && (
                      <p className="text-gray-600 leading-relaxed mb-4 line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    <div className="flex items-center text-sm text-gray-500">
                      <span className="font-semibold text-teal-600 group-hover:text-teal-700 transition-colors">
                        {item.source?.name || "Unknown source"}
                      </span>
                      <span className="mx-2.5 text-gray-400">•</span>
                      <span>
                        {item.publishedAt
                          ? new Date(item.publishedAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )
                          : ""}
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {!loading && filteredArticles.length === 0 && (
              <div className="text-center py-20">
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">No articles found</h3>
                <p className="text-gray-500 mb-6">Try different search terms or clear filters</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700"
                >
                  Show All Articles
                </button>
              </div>
            )}
          </main>

          {/* Right Sidebar */}
          <aside className="hidden xl:block w-80 flex-shrink-0">
            <div className="sticky top-8 space-y-6">
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                  Trending Topics
                </h3>

                <div className="space-y-3">
                  {trendingTopics.map((topic, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all cursor-pointer group"
                    >
                      <span className="text-sm font-semibold text-teal-600 group-hover:text-blue-600 transition-colors">
                        #{i + 1}
                      </span>
                      <span className="text-gray-700 capitalize font-medium group-hover:text-gray-900 transition-colors">
                        {topic}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                  Popular Sources
                </h3>

                <div className="space-y-3">
                  {popularSources.map(([src, count]) => (
                    <div
                      key={src}
                      className="p-3 rounded-lg hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 transition-all cursor-pointer group"
                    >
                      <p className="font-semibold text-gray-900 group-hover:text-teal-700 transition-colors">
                        {src}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 font-medium">
                        {count} {count === 1 ? "article" : "articles"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}