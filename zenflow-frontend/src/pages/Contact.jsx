// src/pages/Contact.jsx
import React, { useState } from 'react'
import api from '../api/axios'

export default function Contact(){
  const [form, setForm] = useState({ name:'', email:'', program:'Trial Class', message:'', timeslot:'Morning' })
  const [msg, setMsg] = useState(null)
  const [loading, setLoading] = useState(false)

  async function submit(e){
    e.preventDefault()
    setMsg(null); setLoading(true)
    try {
      await api.post('/bookings', form)
      setMsg('Booking request sent. We will contact you soon.')
      setForm({ name:'', email:'', program:'Trial Class', message:'', timeslot:'Morning' })
    } catch (e) {
      setMsg(e.response?.data?.error || 'Failed to send booking')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4">Book a Trial Class</h2>
      {msg && <div className="mb-4 text-sm">{msg}</div>}
      <form onSubmit={submit} className="space-y-3 bg-white p-6 rounded shadow">
        <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} placeholder="Name" className="w-full border px-3 py-2 rounded" required />
        <input value={form.email} onChange={e=>setForm({...form, email:e.target.value})} type="email" placeholder="Email" className="w-full border px-3 py-2 rounded" required />
        <select value={form.program} onChange={e=>setForm({...form, program:e.target.value})} className="w-full border px-3 py-2 rounded">
          <option>Trial Class</option>
          <option>Yoga Class</option>
          <option>Meditation Session</option>
        </select>
        <select value={form.timeslot} onChange={e=>setForm({...form, timeslot:e.target.value})} className="w-full border px-3 py-2 rounded">
          <option>Morning</option><option>Afternoon</option><option>Evening</option>
        </select>
        <textarea value={form.message} onChange={e=>setForm({...form, message:e.target.value})} placeholder="Message (optional)" className="w-full border px-3 py-2 rounded" rows="3"></textarea>
        <button type="submit" className="w-full bg-primary text-white py-2 rounded" disabled={loading}>{loading ? 'Sending…' : 'Request Booking'}</button>
      </form>
    </div>
  )
}
