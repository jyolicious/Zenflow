// src/pages/Signup.jsx
import React, { useState } from 'react'
import api from '../api/axios' // make sure this file exists and baseURL is correct

export default function Signup(){
  const [form, setForm] = useState({ name:'', email:'', password:'' })
  const [msg, setMsg] = useState(null)
  const [loading, setLoading] = useState(false)

  async function submit(e){
    e.preventDefault()
    setMsg(null)
    setLoading(true)
    console.log('Submitting signup', form)

    try {
      const res = await api.post('/auth/signup', form)
      console.log('Signup response', res.data)
      // show server message or fallback
      setMsg(res.data.message || res.data.warning || 'Check your email to verify your account.')
    } catch (err) {
      console.error('Signup error', err)
      // server may send { error: '...' }
      setMsg(err?.response?.data?.error || 'Signup failed. See console for details.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h2 className="text-2xl font-semibold mb-4">Create account</h2>

      {msg && <div className="mb-4 p-3 rounded bg-yellow-50 border">{msg}</div>}

      <form onSubmit={submit} className="space-y-3 bg-white p-6 rounded shadow">
        <label className="block text-sm">Name
          <input
            value={form.name}
            onChange={e=>setForm({...form, name:e.target.value})}
            required
            className="w-full border px-3 py-2 rounded mt-1"
            placeholder="Your name"
          />
        </label>

        <label className="block text-sm">Email
          <input
            value={form.email}
            onChange={e=>setForm({...form, email:e.target.value})}
            required
            type="email"
            className="w-full border px-3 py-2 rounded mt-1"
            placeholder="you@example.com"
          />
        </label>

        <label className="block text-sm">Password
          <input
            value={form.password}
            onChange={e=>setForm({...form, password:e.target.value})}
            required
            type="password"
            className="w-full border px-3 py-2 rounded mt-1"
            placeholder="min 6 characters"
          />
        </label>

        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Signing up...' : 'Sign up'}
        </button>
      </form>
    </div>
  )
}
