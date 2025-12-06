// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

/**
 * ProtectedRoute
 * - Blocks if no token in localStorage
 * - Optionally checks user.is_verified (default true)
 * - Performs a best-effort client-side JWT expiry check (no external lib)
 *
 * Note: This is a UX-level check only. For security verify token on the server (/auth/me).
 */
export default function ProtectedRoute({ children, requireVerified = true }) {
  const location = useLocation()
  const [checking, setChecking] = useState(true)
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setAllowed(false)
      setChecking(false)
      return
    }

    // best-effort decode to check expiry (client-side only)
    try {
      const parts = token.split('.')
      if (parts.length === 3) {
        // base64url -> base64
        const payloadB64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
        // add padding if needed
        const pad = payloadB64.length % 4
        const padded = pad ? payloadB64 + '='.repeat(4 - pad) : payloadB64
        const decoded = JSON.parse(atob(padded))
        if (decoded && decoded.exp && Date.now() >= decoded.exp * 1000) {
          // token expired
          setAllowed(false)
          setChecking(false)
          return
        }
      }
    } catch (err) {
      // ignore decode errors — continue to check local user object
      // console.warn('JWT decode failed', err)
    }

    // check saved user object for verification status
    let user = null
    try {
      const userJson = localStorage.getItem('user')
      user = userJson ? JSON.parse(userJson) : null
    } catch (err) {
      user = null
    }

    if (requireVerified && user && user.is_verified === false) {
      setAllowed(false)
      setChecking(false)
      return
    }

    // all quick checks passed
    setAllowed(true)
    setChecking(false)
  }, [requireVerified, location.pathname])

  if (checking) {
    return <div className="p-6 text-center">Checking authentication…</div>
  }

  if (!allowed) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
