import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { LogIn, Crown, BookOpen, Calendar, Lock, Unlock, Sparkles, FileText, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Newsletter() {
  const navigate = useNavigate();

  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
    setIsSubscribed(localStorage.getItem("isSubscribed") === "true");

    async function fetchNewsletters() {
      try {
        const res = await api.get("/newsletters");
        console.log("NEWSLETTER RESPONSE:", res.data);
        setNewsletters(res.data || []);
      } catch {
        setError("Failed to load newsletters");
      } finally {
        setLoading(false);
      }
    }

    fetchNewsletters();
  }, []);

  const isPremium = (publishedAt) => {
    const days =
      (Date.now() - new Date(publishedAt).getTime()) /
      (1000 * 60 * 60 * 24);
    return days < 15;
  };

  const resolvePdfUrl = (item) => {
    return (
      item.pdf_url ||
      item.pdfUrl ||
      item.pdf ||
      item.file_url ||
      null
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-teal-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Loading newsletters...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg max-w-md">
          <p className="text-red-700 font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full mb-4">
            <BookOpen className="w-4 h-4" />
            <span className="text-sm font-semibold">Monthly Insights</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            ZenFlow <span className="text-teal-600">Newsletter</span>
          </h1>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Curated wellness insights, yoga practices, meditation techniques, and holistic health tips delivered to your reading list
          </p>
        </div>

        {/* Login/Subscribe Banner */}
        {!isLoggedIn && (
          <div className="bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl p-6 mb-10 shadow-lg">
            <div className="flex flex-col md:flex-row items-center gap-4 text-white">
              <div className="flex-shrink-0 bg-white/20 p-4 rounded-full">
                <LogIn className="w-8 h-8" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold mb-1">Login Required</h3>
                <p className="text-teal-50">Sign in to access our exclusive wellness newsletters and premium content</p>
              </div>
              <button 
                onClick={() => navigate("/login")}
                className="bg-white text-teal-600 px-6 py-3 rounded-xl font-semibold hover:bg-teal-50 transition-all shadow-md"
              >
                Login Now
              </button>
            </div>
          </div>
        )}

        {/* Subscription Info Banner for Logged In Users */}
        {isLoggedIn && !isSubscribed && (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 mb-10 shadow-lg">
            <div className="flex flex-col md:flex-row items-center gap-4 text-white">
              <div className="flex-shrink-0 bg-white/20 p-4 rounded-full">
                <Crown className="w-8 h-8" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold mb-1">Unlock Premium Content</h3>
                <p className="text-purple-50">Subscribe to access the latest newsletters within 15 days of publication</p>
              </div>
            </div>
          </div>
        )}

        {/* Newsletter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsletters.map((item) => {
            const premium = isPremium(item.publishedAt);
            const needsLogin = !isLoggedIn;
            const needsSubscription = premium && !isSubscribed;
            const pdfUrl = resolvePdfUrl(item);
            const isAccessible = !needsLogin && !needsSubscription;

            return (
              <div
                key={item._id}
                className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border ${
                  premium ? 'border-yellow-200' : 'border-gray-100'
                }`}
              >
                {/* Header with Date and Premium Badge */}
                <div className={`p-6 pb-4 ${premium ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : 'bg-gradient-to-r from-teal-50 to-blue-50'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium">
                        {new Date(item.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    {premium && (
                      <span className="flex items-center gap-1 text-xs bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full font-semibold shadow-sm">
                        <Crown size={12} />
                        Premium
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 min-h-[3.5rem]">
                    {item.title}
                  </h3>
                </div>

                {/* Content */}
                <div className="p-6 pt-4">
                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-6 line-clamp-3 min-h-[4.5rem]">
                    {item.description}
                  </p>

                  {/* Access Status Indicator */}
                  <div className="mb-4">
                    {isAccessible ? (
                      <div className="flex items-center gap-2 text-teal-600 text-sm">
                        <Unlock className="w-4 h-4" />
                        <span className="font-medium">Full Access Available</span>
                      </div>
                    ) : needsLogin ? (
                      <div className="flex items-center gap-2 text-blue-600 text-sm">
                        <Lock className="w-4 h-4" />
                        <span className="font-medium">Login Required</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-purple-600 text-sm">
                        <Lock className="w-4 h-4" />
                        <span className="font-medium">Premium Access Only</span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <button
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                      needsLogin
                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
                        : needsSubscription
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-md hover:shadow-lg"
                        : "bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-600 hover:to-blue-600 shadow-md hover:shadow-lg"
                    }`}
                    onClick={() => {
                      if (needsLogin) {
                        navigate("/login");
                        return;
                      }

                      if (needsSubscription) {
                        localStorage.setItem("isSubscribed", "true");
                        setIsSubscribed(true);
                        alert("🎉 Subscription activated! You now have access to all premium content.");
                        return;
                      }

                      if (!pdfUrl) {
                        alert("PDF URL missing from backend response");
                        return;
                      }

                      window.location.assign(pdfUrl);
                    }}
                  >
                    {needsLogin ? (
                      <>
                        <LogIn className="w-5 h-5" />
                        Login to Read
                      </>
                    ) : needsSubscription ? (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Subscribe to Unlock
                      </>
                    ) : (
                      <>
                        <FileText className="w-5 h-5" />
                        Read Newsletter
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {newsletters.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No newsletters yet</h3>
            <p className="text-gray-500">Check back soon for wellness insights and updates</p>
          </div>
        )}

        {/* Footer CTA */}
        {isLoggedIn && newsletters.length > 0 && (
          <div className="mt-12 text-center bg-white rounded-2xl p-8 shadow-md">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Want More Wellness Content?</h3>
            <p className="text-gray-600 mb-6">
              Subscribe to receive notifications when new newsletters are published
            </p>
            <button className="bg-gradient-to-r from-teal-500 to-blue-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-teal-600 hover:to-blue-600 transition-all shadow-md hover:shadow-lg">
              Enable Notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
}