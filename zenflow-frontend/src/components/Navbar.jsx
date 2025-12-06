// src/components/Navbar.jsx
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar(){
  const navigate = useNavigate()
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
  })
  const token = localStorage.getItem('token')

  useEffect(() => {
    // handler for both same-tab and cross-tab events
    function update() {
      try { setUser(JSON.parse(localStorage.getItem('user'))) } catch { setUser(null) }
    }
    window.addEventListener('storage', update)             // cross-tab
    window.addEventListener('authChanged', update)         // same-tab custom event

    return () => {
      window.removeEventListener('storage', update)
      window.removeEventListener('authChanged', update)
    }
  }, [])

  function logout(){
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    // notify navbar to update immediately
    window.dispatchEvent(new Event('authChanged'))
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold text-primary">ZenFlow</Link>
          <div className="hidden sm:flex gap-4 text-sm">
            <Link to="/asanas" className="hover:underline">Asanas</Link>
            <Link to="/meditations" className="hover:underline">Meditations</Link>
            <Link to="/instructors" className="hover:underline">Instructors</Link>
            <Link to="/news" className="hover:underline">News</Link>
            <Link to="/newsletters" className="hover:underline">Newsletters</Link>
            <Link to="/contact" className="hover:underline">Book Trial</Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          { token && user ? (
            <>
              <span className="text-sm hidden sm:inline">Hi, {user.name || 'User'}</span>
              <button onClick={logout} className="px-3 py-1 bg-accent text-white rounded">Logout</button>
            </>
          ) : (
            <>
              <Link to="/signup" className="text-sm px-3 py-1 border rounded">Signup</Link>
              <Link to="/login" className="px-3 py-1 bg-primary text-white rounded">Login</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
