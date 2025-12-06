// src/components/Footer.jsx
import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer(){
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-teal-900 to-purple-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#8B5E3C 0%,#C79A6E 50%,#E7D2B4 100%)' }}
                aria-hidden
              >
                {/* small brown chakra to match navbar */}
                <svg viewBox="0 0 64 64" width="26" height="26" className="text-white" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="32" cy="32" r="18" fill="none" stroke="#5a3f2a" strokeWidth="2.2" />
                  <circle cx="32" cy="32" r="10.5" fill="none" stroke="#8b5e3c" strokeWidth="1.8" />
                  {Array.from({length:12}).map((_, i) => {
                    const angle = (i * 30) * (Math.PI / 180)
                    const x1 = 32 + Math.cos(angle) * 10.5
                    const y1 = 32 + Math.sin(angle) * 10.5
                    const x2 = 32 + Math.cos(angle) * 17.8
                    const y2 = 32 + Math.sin(angle) * 17.8
                    return (
                      <line
                        key={i}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="#5a3f2a"
                        strokeWidth="1"
                        strokeLinecap="round"
                        opacity="0.95"
                      />
                    )
                  })}
                  <circle cx="32" cy="32" r="2" fill="#5a3f2a" />
                </svg>
              </div>

              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-yellow-700 via-amber-600 to-rose-500 bg-clip-text text-transparent tracking-tight">
                  ZenFlow
                </span>
                <div className="text-xs text-gray-300 -mt-0.5">Yoga • Meditation • Wellness</div>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed max-w-sm">
              Your journey to inner peace — transform your body, calm your mind and nurture your spirit with short guided practices and approachable routines.
            </p>

            <div className="flex items-center gap-3 mt-3">
              {/* Social icons (inline SVGs) */}
              <a href="#" aria-label="Instagram" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z" stroke="#e6e6e6" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="3.2" stroke="#e6e6e6" strokeWidth="1.2"/>
                  <circle cx="17.8" cy="6.2" r="0.6" fill="#e6e6e6"/>
                </svg>
              </a>
              <a href="#" aria-label="YouTube" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M22 8.5s-.2-1.6-.8-2.3c-.8-.9-1.7-.9-2.1-1C15.7 4.7 12 4.7 12 4.7h0s-3.7 0-6.9.5c-.4.1-1.3.1-2.1 1C2.2 6.9 2 8.5 2 8.5S1.8 10.4 1.8 12.3v0c0 1.9.2 3.8.2 3.8s.2 1.6.8 2.3c.8.9 1.9.9 2.4 1 1.7.3 7 .4 7 .4s3.7 0 6.9-.5c.4-.1 1.3-.1 2.1-1 .6-.7.8-2.3.8-2.3s.2-1.9.2-3.8v0c0-1.9-.2-3.8-.2-3.8z" stroke="#e6e6e6" strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 15l6-3-6-3v6z" fill="#e6e6e6"/>
                </svg>
              </a>
              <a href="#" aria-label="Twitter" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M23 3s-1 .6-2 1c0 0-1-1.2-3.5-1.2C15 2.8 13.5 3.8 12.5 5.1 9.7 8 6 8.6 3.6 7.5 3.8 8.1 4.2 9 4.8 9.6 6 10.8 7.8 11.1 9.2 10.7 7.8 11.1 6.6 10.8 5.6 10.1 6.6 10.1 7.5 10 8.4 9.8c-2.3 1.9-5.1 3.2-8.4 3.4 2.4 1.5 5.2 2.3 8.1 2.3 9 0 13.9-7.4 13.9-13.8V4c0 0 .1-.6.1-.7" stroke="#e6e6e6" strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-teal-300">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/asanas" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                  Asanas
                </Link>
              </li>
              <li>
                <Link to="/meditations" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                  Meditations
                </Link>
              </li>
              <li>
                <Link to="/instructors" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                  Instructors
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                  Book Trial
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-purple-300">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/news" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                  News & Articles
                </Link>
              </li>
              <li>
                <Link to="/newsletters" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                  Newsletters
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                  Yoga Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-teal-300">Get In Touch</h3>
            <ul className="space-y-3">
              <li className="text-gray-300">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-white">Email</span>
                </div>
                <a href="mailto:hello@zenflow.app" className="text-teal-300 hover:text-teal-200 transition-colors">
                  hello@zenflow.app
                </a>
              </li>
              <li className="text-gray-300">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-white">Phone</span>
                </div>
                <a href="tel:+1234567890" className="text-teal-300 hover:text-teal-200 transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="text-gray-300">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-white">Location</span>
                </div>
                <span className="text-gray-300">Mumbai, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-300 text-sm">
              © {new Date().getFullYear()} ZenFlow. All rights reserved.
            </div>

            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Cookie Policy</a>
            </div>

            <div className="text-gray-300 text-sm flex items-center gap-2">
              Built with <span className="text-red-400 animate-pulse">❤️</span> for wellness
            </div>
          </div>
        </div>

        {/* Inspirational Quote */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 italic text-sm">
            "Yoga is the journey of the self, through the self, to the self." — The Bhagavad Gita
          </p>
        </div>
      </div>
    </footer>
  )
}
