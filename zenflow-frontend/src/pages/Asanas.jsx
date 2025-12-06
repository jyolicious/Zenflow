import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import { Search, Youtube, Loader2, Filter, X } from 'lucide-react'

export default function Asanas() {
  const [items, setItems] = useState([])
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedTag, setSelectedTag] = useState('')
  const [error, setError] = useState('')

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
      const res = await api.get('/asanas', {
        params: qparam ? { q: qparam } : {}
      })

      // Backend returns: { meta:{}, data:[...] } OR just [...]
      const payload = res.data
      const list = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
        ? payload.data
        : []

      // normalize tags so every asana has tags as an array
      const normalized = list.map(a => ({
        ...a,
        tags: Array.isArray(a.tags)
          ? a.tags
          : (typeof a.tags === 'string'
              ? a.tags.split(',').map(s => s.trim()).filter(Boolean)
              : [])
      }))

      setItems(normalized)

      if (normalized.length === 0) {
        setError('No asanas found. Try a different search term.')
      }
    } catch (err) {
      console.error('Axios error:', err)
      setError('Failed to load asanas. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // load all at start
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Discover <span className="text-teal-600">Asanas</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore yoga poses tailored to your needs. Find asanas for stress relief, better sleep, energy,
            and emotional well-being.
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
                placeholder="Search asanas (e.g., stress, sleep, energy...)"
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl
               focus:border-teal-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="flex gap-2">
              <button 
                onClick={handleSearch}
                disabled={loading}
                className="px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 
               transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                Search
              </button>

              {(q || selectedTag) && (
                <button 
                  onClick={clearFilters}
                  className="px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 
                 transition-all flex items-center gap-2"
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
                  selectedTag === tag.value 
                    ? 'ring-2 ring-offset-2 ring-teal-500 ' + tag.color 
                    : tag.color
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
            Found <span className="font-semibold text-teal-600">{items.length}</span> asanas
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
              // debug each object (comment out or remove in production)
              console.log("ASANA OBJ →", it)
              console.log("ASANA TAGS", it._id, it.tags, typeof it.tags, Array.isArray(it.tags))

              // Defensive tags handling (should be array thanks to normalization above)
              const tagsArray = Array.isArray(it.tags)
                ? it.tags
                : (typeof it.tags === 'string'
                    ? it.tags.split(',').map(s => s.trim()).filter(Boolean)
                    : [])

              return (
                <div 
                  key={it._id} 
                  className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 
                 overflow-hidden group cursor-pointer border border-gray-100"
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden bg-gradient-to-br from-teal-100 to-blue-100">
                    <img 
                      src={it.photo_url || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop'}
                      alt={it.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {it.youtube_url && (
                      <div className="absolute top-3 right-3 bg-red-600 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <Youtube className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{it.name}</h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {it.description}
                    </p>

                    {tagsArray.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {tagsArray.slice(0, 2).map((tag, i) => (
                          <span 
                            key={i}
                            className="px-2 py-1 bg-teal-50 text-teal-700 text-xs font-medium rounded-md"
                          >
                            {tag}
                          </span>
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
                        <Youtube className="w-4 h-4" />
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
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No asanas found</h3>
            <p className="text-gray-500 mb-6">Try another search or use filters</p>
            <button 
              onClick={clearFilters}
              className="px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700"
            >
              Show All Asanas
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
