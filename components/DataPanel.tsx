'use client'

import { motion } from 'framer-motion'
import { X, AlertTriangle, Mountain, Droplet, Activity } from 'lucide-react'
import { useState } from 'react'

interface DataPanelProps {
  data: any
  location: { lat: number; lng: number; name?: string } | null
}

export default function DataPanel({ data, location }: DataPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  if (!data || !location) return null

  const getRiskColor = (risk: string) => {
    const colors: Record<string, string> = {
      Low: 'text-green-400',
      Moderate: 'text-yellow-400',
      High: 'text-orange-400',
      'Very High': 'text-red-400',
    }
    return colors[risk] || 'text-gray-400'
  }

  const getRiskBgColor = (risk: string) => {
    const colors: Record<string, string> = {
      Low: 'bg-green-500/20 border-green-500/50',
      Moderate: 'bg-yellow-500/20 border-yellow-500/50',
      High: 'bg-orange-500/20 border-orange-500/50',
      'Very High': 'bg-red-500/20 border-red-500/50',
    }
    return colors[risk] || 'bg-gray-500/20 border-gray-500/50'
  }

  return (
    <motion.div
      className="absolute top-16 md:top-20 left-2 md:left-4 bottom-2 md:bottom-4 z-20 bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl w-80 md:w-96 border border-white/10 flex flex-col"
      initial={{ x: -400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-4 md:p-6 flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-3 md:mb-4 flex-shrink-0">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Location Analysis</h2>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {location.name && (
          <p className="text-blue-300 mb-4 text-sm md:text-base">{location.name}</p>
        )}
        <p className="text-gray-400 text-xs md:text-sm mb-6">
          {location.lat.toFixed(4)}°N, {location.lng.toFixed(4)}°E
        </p>

        {isExpanded && (
          <div className="space-y-4 overflow-y-auto flex-1 min-h-0">
            {/* Earthquake Data */}
            <div className={`p-4 rounded-lg border backdrop-blur-md ${getRiskBgColor(data.earthquakes.riskLevel)}`}>
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-red-400" />
                <h3 className="font-semibold text-white">Seismic Activity</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Risk Level:</span>
                  <span className={getRiskColor(data.earthquakes.riskLevel)}>
                    {data.earthquakes.riskLevel}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Frequency:</span>
                  <span className="text-white">{data.earthquakes.frequency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Recent Events:</span>
                  <span className="text-white">{data.earthquakes.recent} (1 year)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Max Magnitude:</span>
                  <span className="text-white">{data.earthquakes.maxMagnitude.toFixed(1)}</span>
                </div>
              </div>
            </div>

            {/* Terrain Data */}
            <div className="p-4 rounded-lg bg-white/5 backdrop-blur-md border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Mountain className="w-5 h-5 text-amber-400" />
                <h3 className="font-semibold text-white">Terrain Characteristics</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Elevation:</span>
                  <span className="text-white">{data.terrain.elevation} m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Slope:</span>
                  <span className="text-white">{data.terrain.slope}°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Terrain Type:</span>
                  <span className="text-white">{data.terrain.terrainType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Soil Type:</span>
                  <span className="text-white">{data.terrain.soilType}</span>
                </div>
              </div>
            </div>

            {/* Landslide Risk */}
            <div className={`p-4 rounded-lg border backdrop-blur-md ${getRiskBgColor(data.terrain.landslideRisk)}`}>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                <h3 className="font-semibold text-white">Landslide Risk</h3>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Risk Level:</span>
                <span className={getRiskColor(data.terrain.landslideRisk)}>
                  {data.terrain.landslideRisk}
                </span>
              </div>
            </div>

            {/* Geological Factors */}
            <div className="p-4 rounded-lg bg-white/5 backdrop-blur-md border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Droplet className="w-5 h-5 text-cyan-400" />
                <h3 className="font-semibold text-white">Geological Factors</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Fault Lines:</span>
                  <span className="text-white">{data.geological.faultLines}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Rock Stability:</span>
                  <span className="text-white">{data.geological.rockStability}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Erosion Risk:</span>
                  <span className="text-white">{data.geological.erosionRisk}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Water Table:</span>
                  <span className="text-white">{data.geological.waterTable}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

