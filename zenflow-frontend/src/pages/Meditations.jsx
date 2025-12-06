import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import { Search, Loader2, Filter, X, Maximize2 } from 'lucide-react'

export default function Meditations() {
  const [items, setItems] = useState([])
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedTag, setSelectedTag] = useState('')
  const [error, setError] = useState('')

  // modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [activeItem, setActiveItem] = useState(null)

  const quickTags = [
    { label: 'Stress Relief', value: 'stress', color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
    { label: 'Better Sleep', value: 'sleep', color: 'bg-purple-100 text-purple-700 hover:bg-purple-200' },
    { label: 'Energy Boost', value: 'energy', color: 'bg-orange-100 text-orange-700 hover:bg-orange-200' },
    { label: 'Depression', value: 'depression', color: 'bg-pink-100 text-pink-700 hover:bg-pink-200' },
    { label: 'Peaceful', value: 'peaceful', color: 'bg-teal-100 text-teal-700 hover:bg-teal-200' },
    { label: 'Focus', value: 'focus', color: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' }
  ]

  // ------------------ FETCH LIST ------------------
  async function fetchList(qparam) {
    setLoading(true)
    setError('')

    try {
      const res = await api.get('/meditations', {
        params: qparam ? { q: qparam } : {}
      })

      const payload = res.data
      const list = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
        ? payload.data
        : []

      // normalize fields so frontend always has message, tags array, and photo fallback
      const normalized = list.map(a => ({
        ...a,
        message: a.message || a.description || '',
        tags: typeof a.tags === 'string' ? a.tags : (Array.isArray(a.tags) ? a.tags.join(' ') : ''),
        tags_array: Array.isArray(a.tags_array)
          ? a.tags_array
          : (Array.isArray(a.tags) ? a.tags : (typeof a.tags === 'string' ? a.tags.split(' ').map(s=>s.trim()).filter(Boolean) : [])),
        photo_url: a.photo_url || `${a.name}.jpg`
      }))

      setItems(normalized)

      if (normalized.length === 0) {
        setError('No meditations found. Try a different search term.')
      }
    } catch (err) {
      console.error('Axios error:', err)
      setError('Failed to load meditations. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  const handleSearch = () => fetchList(q)

  const handleTagClick = (tag) => {
    setSelectedTag(tag)
    setQ(tag)
    fetchList(tag)
  }

  const clearFilters = () => {
    setQ('')
    setSelectedTag('')
    fetchList()
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  // modal helpers
  const openModal = (item) => {
    setActiveItem(item)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setTimeout(() => setActiveItem(null), 180)
  }

  // esc to close
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && modalOpen) closeModal() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [modalOpen])

  // lock scroll when modal open
  useEffect(() => {
    if (modalOpen) document.documentElement.classList.add('overflow-hidden')
    else document.documentElement.classList.remove('overflow-hidden')
  }, [modalOpen])

  // truncate ~50 words for modal
  const truncateWords = (text = '', limit = 50) => {
    const words = text.split(/\s+/).filter(Boolean)
    if (words.length <= limit) return text
    return words.slice(0, limit).join(' ') + '...'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Explore <span className="text-teal-600">Meditations</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Guided practices to calm the mind, improve sleep, boost focus, and restore balance.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search meditations (e.g., sleep, focus, grounding...)"
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                Search
              </button>

              {(q || selectedTag) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all flex items-center gap-2"
                >
                  <X className="w-5 h-5" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-semibold text-gray-600">Quick Filters:</span>

            {quickTags.map(tag => (
              <button
                key={tag.value}
                onClick={() => handleTagClick(tag.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedTag === tag.value ? 'ring-2 ring-offset-2 ring-teal-500 ' + tag.color : tag.color
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Count */}
        {!loading && items.length > 0 && (
          <p className="text-gray-600 mb-6">
            Found <span className="font-semibold text-teal-600">{items.length}</span> meditations
            {selectedTag && ` for "${selectedTag}"`}
          </p>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-teal-600 animate-spin" />
          </div>
        )}

        {/* Cards Grid */}
        {!loading && items.length > 0 && (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map(it => {
              const tagsArray = Array.isArray(it.tags_array)
                ? it.tags_array
                : (typeof it.tags === 'string' ? it.tags.split(' ').map(s => s.trim()).filter(Boolean) : [])

              return (
                <div
                  key={it._id}
                  onClick={() => openModal(it)}
                  className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer border border-gray-100"
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden bg-gradient-to-br from-teal-100 to-blue-100">
                    <img
                      src={it.photo_url || `/${it.name}.jpg`}
                      alt={it.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Maximize icon */}
                    <div
                      className="absolute top-3 right-3 bg-white/80 p-2 rounded-full opacity-90 shadow-sm hover:scale-105 transition-transform"
                      onClick={(e) => { e.stopPropagation(); openModal(it) }}
                    >
                      <Maximize2 className="w-5 h-5 text-gray-700" />
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{it.name}</h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {it.message}
                    </p>

                    {tagsArray.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {tagsArray.slice(0, 2).map((tag, i) => (
                          <span key={i} className="px-2 py-1 bg-teal-50 text-teal-700 text-xs font-medium rounded-md">{tag}</span>
                        ))}
                      </div>
                    )}

                    {it.youtube_url && (
                      <a
                        href={it.youtube_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold text-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                          <path d="M10 8.64L15.27 12 10 15.36V8.64z" />
                        </svg>
                        Watch Video →
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Empty */}
        {!loading && items.length === 0 && !error && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No meditations found</h3>
            <p className="text-gray-500 mb-6">Try another search or use filters</p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700"
            >
              Show All Meditations
            </button>
          </div>
        )}
      </div>

      {/* Modal Overlay (glass) */}
      {modalOpen && activeItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
          aria-modal="true"
          role="dialog"
          onClick={closeModal}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />

          <div
            className="relative z-10 max-w-4xl w-full bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl overflow-hidden
                       flex flex-col md:flex-row gap-0"
            onClick={(e) => e.stopPropagation()}
            role="document"
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-white/40 hover:bg-white/60 p-2 rounded-full z-20"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-800" />
            </button>

            {/* Left image */}
            <div className="md:w-1/2 w-full h-64 md:h-auto relative">
              <img
                src={activeItem.photo_url || `/${activeItem.name}.jpg`}
                alt={activeItem.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right content */}
            <div className="md:w-1/2 w-full p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{activeItem.name}</h2>

                <p className="text-gray-800 text-sm leading-relaxed mb-4">
                  {truncateWords(activeItem.message || activeItem.description, 50)}
                </p>

                {Array.isArray(activeItem.tags_array) && activeItem.tags_array.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {activeItem.tags_array.map((t, i) => (
                      <span key={i} className="px-3 py-1 bg-white/30 border border-white/40 rounded-full text-xs text-gray-800">{t}</span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4">
                {activeItem.youtube_url ? (
                  <a
                    href={activeItem.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M10 8.64L15.27 12 10 15.36V8.64z" />
                    </svg>
                    Open YouTube Video
                  </a>
                ) : (
                  <div className="text-sm text-gray-700 italic">No video available for this meditation.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
