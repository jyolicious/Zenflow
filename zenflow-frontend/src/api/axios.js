// src/api/axios.js
import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' }
})

// attach token if exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
}, (err) => Promise.reject(err))
window.api = api
export default api
