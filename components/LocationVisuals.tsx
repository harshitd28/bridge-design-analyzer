'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Mountain, MapPin } from 'lucide-react'
import { useState } from 'react'

interface LocationVisualsProps {
  location: { lat: number; lng: number; name?: string } | null
  data: any
}

export default function LocationVisuals({ location, data }: LocationVisualsProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  if (!location || !data) return null

  // Determine location type and visuals
  const isHimalayas = location.lat > 25 && location.lat < 35 && location.lng > 70 && location.lng < 100
  const isMountainous = data.terrain?.terrainType === 'Mountainous' || data.terrain?.elevation > 1000
  const locationName = location.name || 'Selected Location'

  const getLocationVisual = () => {
    // Use actual terrain data to generate location-specific visuals
    const elevation = data.terrain?.elevation || 0
    const slope = data.terrain?.slope || 0
    const terrainType = data.terrain?.terrainType || 'Unknown'
    const soilType = data.terrain?.soilType || 'Unknown'
    const landslideRisk = data.terrain?.landslideRisk || 'Unknown'
    const seismicRisk = data.earthquakes?.riskLevel || 'Unknown'
    
    // Generate location-specific description
    let description = ''
    let features: string[] = []
    
    if (elevation > 2500) {
      description = `High-altitude terrain at ${elevation}m elevation with ${slope}° slope. ${terrainType} terrain with ${soilType} soil composition.`
      features = [`${elevation}m Elevation`, `${slope}° Slope`, terrainType, `${landslideRisk} Landslide Risk`]
      return {
        title: 'High-Altitude Mountainous Region',
        description,
        image: '🏔️',
        gradient: 'from-amber-900 via-amber-800 to-amber-900',
        features,
      }
    } else if (elevation > 1000) {
      description = `Mountainous terrain at ${elevation}m elevation with ${slope}° slope. ${terrainType} terrain with ${soilType} soil.`
      features = [`${elevation}m Elevation`, `${slope}° Slope`, `${soilType} Soil`, `${seismicRisk} Seismic Risk`]
      return {
        title: 'Mountainous Terrain',
        description,
        image: '⛰️',
        gradient: 'from-slate-700 via-slate-600 to-slate-700',
        features,
      }
    } else if (elevation > 500) {
      description = `Hilly terrain at ${elevation}m elevation with ${slope}° slope. ${terrainType} terrain with ${soilType} soil composition.`
      features = [`${elevation}m Elevation`, `${slope}° Slope`, terrainType, `${landslideRisk} Landslide Risk`]
      return {
        title: 'Hilly Terrain',
        description,
        image: '🌄',
        gradient: 'from-green-800 via-green-700 to-green-800',
        features,
      }
    } else {
      description = `Moderate terrain at ${elevation}m elevation with ${slope}° slope. ${terrainType} terrain with ${soilType} soil.`
      features = [`${elevation}m Elevation`, `${slope}° Slope`, `${soilType} Soil`, `${seismicRisk} Seismic Risk`]
      return {
        title: 'Moderate Terrain',
        description,
        image: '🌍',
        gradient: 'from-blue-700 via-blue-600 to-blue-700',
        features,
      }
    }
  }

  const visual = getLocationVisual()

  return (
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          className="absolute top-16 md:top-20 right-2 md:right-4 z-25"
          style={{ top: '64px', right: '8px', width: '380px', height: '200px' }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-4 md:p-5 border border-white/10 h-full flex flex-col overflow-hidden">
            <div className="flex items-start justify-between mb-2 flex-shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <div className="text-2xl md:text-3xl flex-shrink-0">{visual.image}</div>
                <div className="min-w-0">
                  <h3 className="text-base md:text-lg font-bold text-white truncate">{visual.title}</h3>
                  <p className="text-blue-100 text-xs truncate">{locationName}</p>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-white/80 hover:text-white transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 pr-1">
              <p className="text-white/90 mb-2 text-xs md:text-sm leading-tight">{visual.description}</p>

              <div className="grid grid-cols-2 gap-1.5 mb-3">
                {visual.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-lg p-1.5 text-center overflow-hidden"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <p className="text-white text-xs font-medium truncate leading-tight">{feature}</p>
                  </motion.div>
                ))}
              </div>

              {/* Terrain stats */}
              {data.terrain && (
                <div className="pt-3 border-t border-white/20">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-white/70 text-xs">Elevation</p>
                      <p className="text-white text-sm font-bold">{data.terrain.elevation}m</p>
                    </div>
                    <div>
                      <p className="text-white/70 text-xs">Slope</p>
                      <p className="text-white text-sm font-bold">{data.terrain.slope}°</p>
                    </div>
                    <div>
                      <p className="text-white/70 text-xs">Soil</p>
                      <p className="text-white text-sm font-bold truncate">{data.terrain.soilType}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

