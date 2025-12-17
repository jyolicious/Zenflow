import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import api from "../api/axios";
import { Search, MapPin, Filter, X, User, Loader2, Phone, Mail, Instagram } from "lucide-react";
import "leaflet/dist/leaflet.css";

/* Fix Leaflet marker issue */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* Maharashtra focus */
const MAP_CENTER = [18.96, 73.13];
const MAP_ZOOM = 9;

export default function Instructors() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("All");
  const [specialization, setSpecialization] = useState("All");

  /* Fetch instructors */
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await api.get("/instructors");
        setInstructors(res.data || []);
      } catch (err) {
        console.error("Failed to fetch instructors:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  /* Derive specializations dynamically */
  const allSpecializations = Array.from(
    new Set(
      instructors.flatMap((i) => i.specializations || [])
    )
  );

  /* Apply filters */
  const filtered = instructors.filter((i) => {
    const textMatch =
      `${i.name} ${i.specializations?.join(" ") || ""}`
        .toLowerCase()
        .includes(query.toLowerCase());

    const locationMatch =
      location === "All" ||
      i.centers?.some((c) =>
        c.address.toLowerCase().includes(location.toLowerCase())
      );

    const specializationMatch =
      specialization === "All" ||
      i.specializations?.includes(specialization);

    return textMatch && locationMatch && specializationMatch;
  });

  const resetFilters = () => {
    setQuery("");
    setLocation("All");
    setSpecialization("All");
  };

  const hasActiveFilters = query || location !== "All" || specialization !== "All";

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading instructors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full mb-4">
            <User className="w-4 h-4" />
            <span className="text-sm font-semibold">Expert Instructors</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Find Your <span className="text-teal-600">Yoga Instructor</span>
          </h1>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with certified yoga instructors across Mumbai and Pune. Explore specializations and book your trial session.
          </p>
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-teal-600" />
            <h2 className="text-xl font-bold text-gray-800">Instructor Locations</h2>
            <span className="ml-auto text-sm text-gray-500">
              {filtered.length} location{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="rounded-xl overflow-hidden">
            <MapContainer
              center={MAP_CENTER}
              zoom={MAP_ZOOM}
              className="h-96 w-full"
            >
              <TileLayer
                attribution="© OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {filtered.map((ins) =>
                ins.centers?.map((c, idx) => (
                  <Marker key={`${ins._id}-${idx}`} position={[c.lat, c.lng]}>
                    <Popup>
                      <div className="p-1">
                        <strong className="text-teal-700">{ins.name}</strong>
                        <br />
                        <span className="text-sm">{c.name}</span>
                        <br />
                        <span className="text-xs text-gray-600">{c.address}</span>
                      </div>
                    </Popup>
                  </Marker>
                ))
              )}
            </MapContainer>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-800">Filter Instructors</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name or skill..."
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Location Filter */}
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors appearance-none bg-white cursor-pointer"
            >
              <option value="All">All Locations</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Pune">Pune</option>
            </select>

            {/* Specialization Filter */}
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors appearance-none bg-white cursor-pointer"
            >
              <option value="All">All Specializations</option>
              {allSpecializations.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {/* Reset Button */}
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Results Count */}
        {!loading && instructors.length > 0 && (
          <div className="mb-6">
            <p className="text-gray-600">
              Found <span className="font-semibold text-teal-600">{filtered.length}</span> instructor{filtered.length !== 1 ? 's' : ''}
              {location !== "All" && ` in ${location}`}
              {specialization !== "All" && ` specializing in ${specialization}`}
            </p>
          </div>
        )}

        {/* Instructor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((ins) => (
            <div
              key={ins._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden bg-gradient-to-br from-teal-100 to-blue-100">
                <img
                  src={ins.photo_url || 'https://i.pravatar.cc/300'}
                  alt={ins.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = 'https://i.pravatar.cc/300';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Specialization Count Badge */}
                {ins.specializations && ins.specializations.length > 0 && (
                  <div className="absolute top-3 right-3 bg-teal-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                    {ins.specializations.length} Skill{ins.specializations.length !== 1 ? 's' : ''}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Name */}
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-teal-600 transition-colors">
                  {ins.name}
                </h3>

                {/* Bio */}
                <p className="text-sm text-gray-600 mb-3 line-clamp-2 min-h-[2.5rem]">
                  {ins.bio}
                </p>

                {/* Specializations */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {ins.specializations?.slice(0, 3).map((s, i) => (
                    <span
                      key={i}
                      className="text-xs bg-teal-50 text-teal-700 px-2 py-1 rounded-md font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* Location */}
                {ins.centers && ins.centers.length > 0 && ins.centers[0] && (
                  <div className="flex items-start gap-2 mb-4 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-800">{ins.centers[0].name}</p>
                      <p className="text-xs">{ins.centers[0].address}</p>
                    </div>
                  </div>
                )}

                {/* Contact Info */}
                {(ins.contact_email || ins.phone || ins.social_links) && (
                  <div className="flex gap-2 mb-4 pb-4 border-b border-gray-100">
                    {ins.social_links?.instagram && (
                      <a
                        href={ins.social_links.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition-colors"
                        title="Instagram"
                      >
                        <Instagram size={16} />
                      </a>
                    )}
                    {ins.phone && (
                      <a
                        href={`tel:${ins.phone}`}
                        className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                        title="Phone"
                      >
                        <Phone size={16} />
                      </a>
                    )}
                    {ins.contact_email && (
                      <a
                        href={`mailto:${ins.contact_email}`}
                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        title="Email"
                      >
                        <Mail size={16} />
                      </a>
                    )}
                  </div>
                )}

                {/* Book Button */}
                <button
                  onClick={() =>
                    (window.location.href = `/contact?instructor=${encodeURIComponent(
                      ins.name
                    )}`)
                  }
                  className="w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-teal-600 hover:to-blue-600 transition-all shadow-md hover:shadow-lg"
                >
                  Book Trial Session
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No instructors found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters or search query</p>
            <button
              onClick={resetFilters}
              className="px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-all"
            >
              Show All Instructors
            </button>
          </div>
        )}
      </div>
    </div>
  );
}