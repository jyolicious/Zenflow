import React from 'react'
import { Link } from 'react-router-dom'

export default function VerifySuccess(){
  return (
    <div className="max-w-md mx-auto px-4 py-12 text-center">
      <h2 className="text-2xl font-semibold mb-4">Email verified ✅</h2>
      <p>You can now log in and access members-only content.</p>
      <Link to="/login" className="inline-block mt-6 px-4 py-2 bg-primary text-white rounded">Go to Login</Link>
    </div>
  )
}
