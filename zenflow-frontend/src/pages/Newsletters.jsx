// src/pages/Newsletters.jsx
import React, { useEffect, useState } from 'react'
import api from '../api/axios'

export default function Newsletters(){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(null)

  useEffect(()=>{
    async function load(){
      setLoading(true); setErr(null)
      try {
        const res = await api.get('/newsletters')
        setItems(res.data || [])
      } catch (e) {
        setErr(e.response?.data?.error || 'Failed to load')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4">Newsletters (members only)</h2>
      {loading && <div>Loading…</div>}
      {err && <div className="text-red-600">{err}</div>}
      <div className="grid gap-4">
        {items.map(n=>(
          <div key={n._id} className="border p-4 rounded bg-white">
            <h3 className="font-semibold">{n.title}</h3>
            <p className="text-sm text-gray-600">{n.description}</p>
            <a className="text-primary underline mt-2 inline-block" href={n.file_url} target="_blank" rel="noreferrer">Read</a>
          </div>
        ))}
        {!loading && items.length === 0 && <div>No newsletters yet.</div>}
      </div>
    </div>
  )
}
