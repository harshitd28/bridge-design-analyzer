'use client'

import { useState } from 'react'
import { Search, MapPin, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface SearchPanelProps {
  onLocationSelect: (location: { lat: number; lng: number; name?: string }) => void
}

export default function SearchPanel({ onLocationSelect }: SearchPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchType, setSearchType] = useState<'location' | 'coordinates'>('location')
  const [locationInput, setLocationInput] = useState('')
  const [latInput, setLatInput] = useState('')
  const [lngInput, setLngInput] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const handleLocationSearch = async () => {
    if (!locationInput.trim()) return
    
    setIsSearching(true)
    try {
      // Use Nominatim (OpenStreetMap) geocoding API
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationInput)}&limit=1`
      )
      const data = await response.json()
      
      if (data && data.length > 0) {
        const result = data[0]
        onLocationSelect({
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
          name: result.display_name,
        })
        setIsOpen(false)
        setLocationInput('')
      } else {
        alert('Location not found. Please try a different search term.')
      }
    } catch (error) {
      console.error('Error searching location:', error)
      alert('Error searching location. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }

  const handleCoordinateSearch = () => {
    const lat = parseFloat(latInput)
    const lng = parseFloat(lngInput)
    
    if (isNaN(lat) || isNaN(lng)) {
      alert('Please enter valid coordinates')
      return
    }
    
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      alert('Invalid coordinates. Latitude must be between -90 and 90, Longitude between -180 and 180.')
      return
    }
    
    onLocationSelect({ lat, lng })
    setIsOpen(false)
    setLatInput('')
    setLngInput('')
  }

  return (
    <>
      <motion.button
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 md:px-8 md:py-4 rounded-full shadow-lg flex items-center gap-2 transition-colors"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Search className="w-5 h-5" />
        <span className="hidden md:inline">Search Location</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-white/20"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Search Location</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setSearchType('location')}
                  className={`flex-1 py-2 px-4 rounded-lg transition-colors backdrop-blur-md ${
                    searchType === 'location'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/10'
                  }`}
                >
                  Location Name
                </button>
                <button
                  onClick={() => setSearchType('coordinates')}
                  className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                    searchType === 'coordinates'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  Coordinates
                </button>
              </div>

              {searchType === 'location' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Enter Location</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={locationInput}
                        onChange={(e) => setLocationInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleLocationSearch()}
                        placeholder="e.g., Himalayas, Nepal"
                        className="flex-1 bg-white/10 backdrop-blur-md text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/10"
                      />
                      <button
                        onClick={handleLocationSearch}
                        disabled={isSearching}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {isSearching ? '...' : <Search className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Latitude</label>
                    <input
                      type="number"
                      value={latInput}
                      onChange={(e) => setLatInput(e.target.value)}
                      placeholder="e.g., 28.3949"
                      min="-90"
                      max="90"
                      step="0.0001"
                      className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Longitude</label>
                    <input
                      type="number"
                      value={lngInput}
                      onChange={(e) => setLngInput(e.target.value)}
                      placeholder="e.g., 84.1240"
                      min="-180"
                      max="180"
                      step="0.0001"
                      className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={handleCoordinateSearch}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <MapPin className="w-5 h-5" />
                    Search Coordinates
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

