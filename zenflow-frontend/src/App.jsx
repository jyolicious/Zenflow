// src/App.jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToHash from "./components/ScrollToHash";

// PUBLIC pages
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import VerifyEmail from './pages/VerifyEmail'
import VerifySuccess from './pages/VerifySuccess'

// PROTECTED pages
import Asanas from './pages/Asanas'
import Meditations from './pages/Meditations'
import Instructors from './pages/Instructors'
import News from './pages/News'
import Newsletters from './pages/Newsletters'
import Contact from './pages/Contact'

import ProtectedRoute from './components/ProtectedRoute'

export default function App(){
  return (
    <div className="min-h-screen flex flex-col">

      {/* 👇 ADD HERE */}
      <ScrollToHash />

      <Navbar />
      <main className="flex-1">

        <Routes>

          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/verify-success" element={<VerifySuccess />} />

          {/* ALL PRIVATE ROUTES */}
          <Route path="/asanas" element={
            <ProtectedRoute><Asanas /></ProtectedRoute>
          } />

          <Route path="/meditations" element={
            <ProtectedRoute><Meditations /></ProtectedRoute>
          } />

          <Route path="/instructors" element={
            <ProtectedRoute><Instructors /></ProtectedRoute>
          } />

          <Route path="/news" element={
            <ProtectedRoute><News /></ProtectedRoute>
          } />

          <Route path="/newsletters" element={
            <ProtectedRoute><Newsletters /></ProtectedRoute>
          } />

          <Route path="/contact" element={
            <ProtectedRoute><Contact /></ProtectedRoute>
          } />

          {/* fallback */}
          <Route path="*" element={<Home />} />

        </Routes>

      </main>
      <Footer />
    </div>
  )
}
