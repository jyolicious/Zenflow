import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Search, Instagram, Phone, Mail, MapPin, Award, User } from "lucide-react";
import "leaflet/dist/leaflet.css";

/* -------------------------------
   Fix default marker issue
-------------------------------- */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* -------------------------------
   Maharashtra Focus
-------------------------------- */
const mapCenter = [18.96, 73.13]; // Mumbai–Pune
const mapZoom = 9;

/* -------------------------------
   SEALED MOCK DATA (8 INSTRUCTORS)
-------------------------------- */
const INSTRUCTORS = [
  {
    id: 1,
    name: "Ananya Deshmukh",
    photo_url: "https://i.pravatar.cc/300?img=47",
    bio: "Certified Hatha and Vinyasa instructor with 7+ years of experience.",
    specializations: ["Hatha Yoga", "Vinyasa", "Stress Relief"],
    contact_email: "ananya.yoga@gmail.com",
    phone: "+91 9876543210",
    social_links: {
      instagram: "https://instagram.com/ananya.yoga",
      whatsapp: "https://wa.me/919876543210",
    },
    centers: [
      { name: "Zen Pune Studio", address: "Baner, Pune", lat: 18.559, lng: 73.789 },
    ],
  },
  {
    id: 2,
    name: "Rohit Kulkarni",
    photo_url: "https://i.pravatar.cc/300?img=12",
    bio: "Ashtanga practitioner focused on strength and discipline.",
    specializations: ["Ashtanga", "Power Yoga"],
    contact_email: "rohit.ashtanga@gmail.com",
    phone: "+91 9822011223",
    social_links: {
      instagram: "https://instagram.com/rohit.ashtanga",
    },
    centers: [
      {
        name: "Mumbai Yoga Kendra",
        address: "Andheri West, Mumbai",
        lat: 19.136,
        lng: 72.829,
      },
    ],
  },
  {
    id: 3,
    name: "Sneha Patil",
    photo_url: "https://i.pravatar.cc/300?img=32",
    bio: "Therapeutic yoga instructor specialising in mental wellness.",
    specializations: ["Therapeutic Yoga", "Meditation"],
    contact_email: "sneha.therapy@gmail.com",
    phone: "+91 9811144556",
    social_links: {
      whatsapp: "https://wa.me/919811144556",
    },
    centers: [
      {
        name: "Mindful Space",
        address: "Kothrud, Pune",
        lat: 18.507,
        lng: 73.807,
      },
    ],
  },
  {
    id: 4,
    name: "Amit Joshi",
    photo_url: "https://i.pravatar.cc/300?img=8",
    bio: "Pranayama and breathwork expert.",
    specializations: ["Pranayama", "Breathwork"],
    contact_email: "amit.prana@gmail.com",
    phone: "+91 9900077889",
    social_links: {
      instagram: "https://instagram.com/amit.prana",
    },
    centers: [
      {
        name: "Calm Breaths Studio",
        address: "Dadar, Mumbai",
        lat: 19.017,
        lng: 72.847,
      },
    ],
  },
  {
    id: 5,
    name: "Neha Shah",
    photo_url: "https://i.pravatar.cc/300?img=21",
    bio: "Beginner-friendly instructor focusing on flexibility.",
    specializations: ["Beginner Yoga", "Flexibility"],
    contact_email: "neha.flex@gmail.com",
    phone: "+91 9933011223",
    social_links: {
      instagram: "https://instagram.com/neha.flex",
    },
    centers: [
      {
        name: "Flex Studio",
        address: "Powai, Mumbai",
        lat: 19.119,
        lng: 72.905,
      },
    ],
  },
  {
    id: 6,
    name: "Kunal Mehta",
    photo_url: "https://i.pravatar.cc/300?img=5",
    bio: "Yoga for corporate professionals and desk workers.",
    specializations: ["Corporate Yoga", "Posture Correction"],
    contact_email: "kunal.officeyoga@gmail.com",
    phone: "+91 9870055443",
    social_links: {
      whatsapp: "https://wa.me/919870055443",
    },
    centers: [
      {
        name: "Office Wellness Hub",
        address: "Lower Parel, Mumbai",
        lat: 18.995,
        lng: 72.825,
      },
    ],
  },
  {
    id: 7,
    name: "Pooja Nair",
    photo_url: "https://i.pravatar.cc/300?img=25",
    bio: "Restorative yoga and sleep improvement coach.",
    specializations: ["Restorative Yoga", "Sleep Therapy"],
    contact_email: "pooja.sleep@gmail.com",
    phone: "+91 9810066778",
    social_links: {
      instagram: "https://instagram.com/pooja.sleep",
    },
    centers: [
      {
        name: "Rest & Restore",
        address: "Viman Nagar, Pune",
        lat: 18.567,
        lng: 73.915,
      },
    ],
  },
  {
    id: 8,
    name: "Siddharth Rao",
    photo_url: "https://i.pravatar.cc/300?img=15",
    bio: "Traditional yoga rooted in Indian philosophy.",
    specializations: ["Traditional Yoga", "Philosophy"],
    contact_email: "sid.traditional@gmail.com",
    phone: "+91 9822233445",
    social_links: {
      whatsapp: "https://wa.me/919822233445",
    },
    centers: [
      {
        name: "Sanatan Yoga Hall",
        address: "Shivaji Nagar, Pune",
        lat: 18.531,
        lng: 73.847,
      },
    ],
  },
];

export default function Instructors() {
  const [query, setQuery] = useState("");

  const filtered = INSTRUCTORS.filter((i) =>
    `${i.name} ${i.specializations.join(" ")}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

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
            Connect with certified yoga instructors in Maharashtra. Explore their specializations and book your trial session today.
          </p>
        </div>

        {/* MAP */}
        <div className="mb-10">
          <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-teal-600" />
              <h2 className="text-xl font-bold text-gray-800">Instructor Locations</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">All centers across Mumbai and Pune</p>
            
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              className="h-96 w-full rounded-xl"
            >
              <TileLayer
                attribution="© OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {INSTRUCTORS.map((ins) =>
                ins.centers.map((c, idx) => (
                  <Marker key={`${ins.id}-${idx}`} position={[c.lat, c.lng]}>
                    <Popup>
                      <strong>{ins.name}</strong>
                      <br />
                      {c.name}
                      <br />
                      <span className="text-sm text-gray-600">{c.address}</span>
                    </Popup>
                  </Marker>
                ))
              )}
            </MapContainer>
          </div>
        </div>

        {/* SEARCH */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search instructors by name or specialization..."
              className="w-full outline-none text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Results Count */}
        {query && (
          <div className="mb-6">
            <p className="text-gray-600">
              Found <span className="font-semibold text-teal-600">{filtered.length}</span> instructor{filtered.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((ins) => (
            <div
              key={ins.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden bg-gradient-to-br from-teal-100 to-blue-100">
                <img
                  src={ins.photo_url}
                  alt={ins.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Specialization Badge */}
                <div className="absolute top-3 right-3 bg-teal-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {ins.specializations.length} Skills
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Name */}
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {ins.name}
                </h3>

                {/* Bio */}
                <p className="text-sm text-gray-600 mb-3 line-clamp-2 min-h-[2.5rem]">
                  {ins.bio}
                </p>

                {/* Specializations */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {ins.specializations.slice(0, 3).map((spec, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-teal-50 text-teal-700 text-xs font-medium rounded-md"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Center Location */}
                {ins.centers && ins.centers.length > 0 && (
                  <div className="flex items-start gap-2 mb-4 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-800">{ins.centers[0].name}</p>
                      <p className="text-xs">{ins.centers[0].address}</p>
                    </div>
                  </div>
                )}

                {/* Contact Icons */}
                <div className="flex gap-3 mb-4 pb-4 border-b border-gray-100">
                  {ins.social_links?.instagram && (
                    <a
                      href={ins.social_links.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition-colors"
                    >
                      <Instagram size={18} />
                    </a>
                  )}
                  {ins.social_links?.whatsapp && (
                    <a
                      href={ins.social_links.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      <Phone size={18} />
                    </a>
                  )}
                  {ins.contact_email && (
                    <a
                      href={`mailto:${ins.contact_email}`}
                      className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Mail size={18} />
                    </a>
                  )}
                </div>

                {/* Book Button */}
                <button className="w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-teal-600 hover:to-blue-600 transition-all shadow-md hover:shadow-lg">
                  Book Trial Session
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No instructors found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search query</p>
            <button
              onClick={() => setQuery("")}
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