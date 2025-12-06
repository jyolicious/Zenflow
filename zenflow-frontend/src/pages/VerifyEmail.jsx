import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function VerifyEmail(){
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [msg, setMsg] = useState('Verifying...')

  useEffect(()=>{
    const token = searchParams.get('token')
    if (!token) { setMsg('Missing token'); return }
    // call backend endpoint /api/auth/verify-email?token=...
    fetch(`${import.meta.env.VITE_API_BASE}/auth/verify-email?token=${token}`, { method: 'GET', redirect: 'follow' })
      .then(async (r) => {
        // backend redirects to /verify-success; if it returns 200 with redirect, handle
        if (r.redirected) {
          window.location.href = r.url
        } else {
          const text = await r.text()
          setMsg(text || 'Verified')
        }
      }).catch(e=>{
        setMsg('Verification failed')
      })
  }, [])

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h2 className="text-xl font-semibold mb-4">Email verification</h2>
      <div>{msg}</div>
    </div>
  )
}
