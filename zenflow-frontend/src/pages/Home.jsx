import React from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  return (
    <section className="bg-[linear-gradient(90deg,#F5E6D3,white)] min-h-[60vh] flex items-center">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-primary">Find calm in your day — guided yoga & meditation for every body.</h1>
          <p className="text-gray-700">Short practices, gentle guidance, lifelong calm. Join live classes or practice on-demand.</p>
          <div className="flex gap-3">
            <Link to="/signup" className="px-4 py-2 bg-primary text-white rounded">Start Free Trial</Link>
            <Link to="/asanas" className="px-4 py-2 border rounded">Browse Asanas</Link>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <img src="https://images.unsplash.com/photo-1549575810-8bd7a2476c3b?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=example" alt="meditation" className="rounded shadow-lg w-full max-w-md" />
        </div>
      </div>
    </section>
  )
}
