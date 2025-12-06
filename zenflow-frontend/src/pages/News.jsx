import React, { useEffect, useState } from 'react'
import api from '../api/axios'

export default function News(){
  const [items, setItems] = useState([])

  useEffect(()=>{ api.get('/news').then(r=>setItems(r.data || [])) }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4">Yoga & Health News</h2>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        {items.map(n=>(
          <a key={n._id || n.url} href={n.url || '#'} target="_blank" rel="noreferrer" className="border rounded p-4 hover:shadow">
            <h3 className="font-semibold">{n.title}</h3>
            <p className="text-sm text-gray-600">{n.summary || n.description}</p>
            <div className="text-xs mt-2 text-gray-500">{n.source || n.source?.name}</div>
          </a>
        ))}
      </div>
    </div>
  )
}
