'use client'

import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'

interface ViewSiteButtonProps {
  location: { lat: number; lng: number; name?: string } | null
  onViewSite: () => void
}

export default function ViewSiteButton({ location, onViewSite }: ViewSiteButtonProps) {
  const [position, setPosition] = useState({ x: '50%', y: '50%' })

  useEffect(() => {
    if (!location) return

    // Convert lat/lng to approximate screen position
    // Globe is centered, so we calculate offset from center
    const lat = location.lat
    const lng = location.lng

    // Normalize coordinates (-90 to 90 for lat, -180 to 180 for lng)
    const normalizedLat = (lat + 90) / 180 // 0 to 1
    const normalizedLng = (lng + 180) / 360 // 0 to 1

    // Convert to screen coordinates (globe is roughly centered)
    // Adjust these values based on your globe's actual position
    const screenX = normalizedLng * 100 // 0 to 100%
    const screenY = normalizedLat * 100 // 0 to 100%

    // Offset to account for globe being centered and marker position
    // Adjust these offsets to position button near the marker
    const offsetX = (screenX - 50) * 0.3 // Scale down the offset
    const offsetY = (screenY - 50) * 0.3

    setPosition({
      x: `calc(50% + ${offsetX}%)`,
      y: `calc(50% + ${offsetY}% + 60px)`, // Add offset to position below marker
    })
  }, [location])

  if (!location) return null

  return (
    <motion.div
      className="fixed z-30"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <button
        onClick={onViewSite}
        className="bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 transition-all transform hover:scale-105 font-semibold text-sm md:text-base border border-white/20"
      >
        <MapPin className="w-5 h-5" />
        <span>View Site</span>
      </button>
    </motion.div>
  )
}

