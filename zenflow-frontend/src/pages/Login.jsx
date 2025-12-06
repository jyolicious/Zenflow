// src/pages/Login.jsx
import React, { useState } from 'react'
import api from '../api/axios'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Login(){
  const [form, setForm] = useState({ email: '', password: '' })
  const [err, setErr] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  async function submit(e){
    e.preventDefault()
    setErr(null)
    setLoading(true)

    try {
      const res = await api.post('/auth/login', form)
      const { token, user } = res.data

      if (!token) {
        setErr('Login response missing token')
        setLoading(false)
        return
      }

      // save token + user in localStorage
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user || {}))
      // notify Navbar in same tab
      window.dispatchEvent(new Event('authChanged'))
      // navigate to original page user wanted
      navigate(from, { replace: true })
    } catch (e) {
      console.error('Login error', e)
      setErr(e.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      {err && <div className="mb-4 text-red-600">{err}</div>}
      <form onSubmit={submit} className="space-y-3 bg-white p-6 rounded shadow">
        <input required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}
               type="email" placeholder="Email" className="w-full border px-3 py-2 rounded" />
        <input required value={form.password} onChange={e=>setForm({...form,password:e.target.value})}
               type="password" placeholder="Password" className="w-full border px-3 py-2 rounded" />
        <button type="submit" disabled={loading} className="w-full bg-primary text-white py-2 rounded">
          {loading ? 'Logging in…' : 'Login'}
        </button>
      </form>
    </div>
  )
}
