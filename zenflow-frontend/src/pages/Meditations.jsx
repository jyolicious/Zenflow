import React, { useEffect, useState } from 'react'
import api from '../api/axios'

export default function Meditations(){
  const [ items, setItems ] = useState([])
  const [ q, setQ ] = useState('')

  useEffect(()=>{ fetchList() }, [])

  async function fetchList(qparam){
    const res = await api.get('/meditations', { params: qparam ? { q: qparam } : {} })
    setItems(res.data || [])
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4">Meditations</h2>
      <div className="flex gap-2 mb-4">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search (sleep, focus...)" className="border px-3 py-2 rounded flex-1" />
        <button onClick={()=>fetchList(q)} className="px-4 py-2 bg-primary text-white rounded">Search</button>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        {items.map(it=>(
          <div key={it._id} className="border rounded p-4 shadow-sm">
            <h3 className="font-semibold">{it.name}</h3>
            <p className="text-sm text-gray-600">{it.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
