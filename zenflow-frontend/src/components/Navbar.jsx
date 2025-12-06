// src/components/Navbar.jsx
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

export default function Navbar(){
  const navigate = useNavigate()
  const location = useLocation()

  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
  })

  const token = localStorage.getItem('token')
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    function update() {
      try { setUser(JSON.parse(localStorage.getItem('user'))) } catch { setUser(null) }
    }
    window.addEventListener('storage', update)
    window.addEventListener('authChanged', update)
    return () => {
      window.removeEventListener('storage', update)
      window.removeEventListener('authChanged', update)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function logout(){
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.dispatchEvent(new Event('authChanged'))
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  const navLinks = [
    { path: '/asanas', label: 'Asanas' },
    { path: '/meditations', label: 'Meditations'},
    { path: '/instructors', label: 'Instructors' },
    { path: '/news', label: 'News' },
    { path: '/newsletters', label: 'Newsletters' },
    { path: '/contact', label: 'Book Trial' }
  ]

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-lg py-3' : 'bg-white/95 backdrop-blur-sm shadow-md py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">

          {/* --------------------------------------------------
               LOGO — ROTATING CHAKRA (brown / tan version)
          --------------------------------------------------- */}
          <Link to="/" className="flex items-center gap-3 group">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center transform group-hover:rotate-180 transition-transform duration-500"
              style={{ background: 'linear-gradient(135deg,#8B5E3C 0%,#C79A6E 50%,#E7D2B4 100%)' }}
            >
              {/* Chakra SVG */}
              <svg
                viewBox="0 0 64 64"
                width="28"
                height="28"
                className="text-white"
                style={{ animation: 'spin 8s linear infinite' }}
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="32" cy="32" r="18" fill="none" stroke="#5a3f2a" strokeWidth="2.5" />
                <circle cx="32" cy="32" r="10.5" fill="none" stroke="#8b5e3c" strokeWidth="2" />

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
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      opacity="0.95"
                    />
                  )
                })}

                <circle cx="32" cy="32" r="2.2" fill="#5a3f2a" />
              </svg>

              {/* keyframes for chakra spinning */}
              <style>{`
                @keyframes spin {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
              `}</style>
            </div>

            <span className="text-3xl font-bold bg-gradient-to-r from-yellow-700 via-amber-600 to-rose-500 bg-clip-text text-transparent tracking-tight">
              ZenFlow
            </span>
          </Link>
          {/* -------------------------------------------------- */}

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-teal-50 hover:text-teal-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Section */}
          <div className="flex items-center gap-4">
            {token && user ? (
              <div className="hidden md:flex items-center gap-4">
                <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-teal-50 to-purple-50 rounded-full">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="font-semibold text-gray-700">Hi, {user.name}</span>
                </div>

                <button
                  onClick={logout}
                  className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  to="/signup"
                  className="px-6 py-2.5 border-2 border-teal-600 text-teal-600 font-semibold rounded-lg hover:bg-teal-50 transition-all duration-200"
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Login
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white'
                      : 'text-gray-700 hover:bg-teal-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Auth Buttons */}
              <div className="mt-4 flex flex-col gap-2">
                {token && user ? (
                  <>
                    <div className="px-4 py-3 bg-gradient-to-r from-teal-50 to-purple-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {user.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <span className="font-semibold text-gray-700">Hi, {user.name}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => { logout(); setMobileMenuOpen(false); }}
                      className="px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-3 border-2 border-teal-600 text-teal-600 font-semibold rounded-lg text-center"
                    >
                      Sign Up
                    </Link>

                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-lg text-center"
                    >
                      Login
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </nav>
  )
}
