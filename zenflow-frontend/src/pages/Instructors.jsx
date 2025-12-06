import React, { useEffect, useState } from 'react'
import api from '../api/axios'

export default function Instructors(){
  const [items, setItems] = useState([])

  useEffect(()=>{ api.get('/instructors').then(r=>setItems(r.data || [])) }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4">Instructors & Centers</h2>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {items.map(i=>(
          <div key={i._id} className="border rounded p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <img src={i.photo_url || 'https://via.placeholder.com/96'} alt={i.name} className="w-24 h-24 object-cover rounded-full" />
              <div>
                <h3 className="font-semibold">{i.name}</h3>
                <p className="text-sm text-gray-600">{i.bio}</p>
                <p className="text-xs mt-2">Specializations: {i.specializations?.join(', ')}</p>
                <p className="text-xs mt-1">Contact: {i.contact_email || i.phone}</p>
              </div>
            </div>
            {/* centers list */}
            <div className="mt-3">
              {i.centers?.map((c, idx)=>(
                <div key={idx} className="text-sm">
                  <div className="font-medium">{c.name}</div>
                  <div>{c.address}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
