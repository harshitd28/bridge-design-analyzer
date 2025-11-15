'use client'

import { motion } from 'framer-motion'
import { TrendingUp, AlertTriangle, Calendar, BarChart3 } from 'lucide-react'
import { useEffect, useState } from 'react'

interface PredictiveAnalyticsProps {
  data: {
    earthquakes: any
    terrain: any
    geological: any
  }
  location: {
    lat: number
    lng: number
    name?: string
  }
}

export default function PredictiveAnalytics({ data, location }: PredictiveAnalyticsProps) {
  const [predictions, setPredictions] = useState({
    landslideProbability: 0,
    seismicTrend: '',
    constructionTimeline: 0,
  })

  useEffect(() => {
    // Calculate landslide probability based on historical patterns
    const landslideProbability = calculateLandslideProbability(data)
    
    // Forecast seismic activity trends
    const seismicTrend = forecastSeismicTrend(data.earthquakes, location)
    
    // Estimate construction timeline
    const constructionTimeline = estimateConstructionTimeline(data.terrain, data.geological)
    
    setPredictions({
      landslideProbability,
      seismicTrend,
      constructionTimeline,
    })
  }, [data, location])

  return (
    <motion.div
      className="absolute top-16 md:top-20 left-2 md:left-4 z-25 bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl w-80 md:w-96 border border-white/10"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Predictive Analytics</h2>
        </div>

        <div className="space-y-4">
          {/* Landslide Probability */}
          <motion.div
            className="bg-white/5 rounded-lg p-4 border border-white/10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-semibold text-white">Landslide Probability</span>
              </div>
              <span className={`text-lg font-bold ${
                predictions.landslideProbability > 70 ? 'text-red-400' :
                predictions.landslideProbability > 40 ? 'text-orange-400' :
                'text-green-400'
              }`}>
                {predictions.landslideProbability}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
              <motion.div
                className={`h-2 rounded-full ${
                  predictions.landslideProbability > 70 ? 'bg-red-500' :
                  predictions.landslideProbability > 40 ? 'bg-orange-500' :
                  'bg-green-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${predictions.landslideProbability}%` }}
                transition={{ duration: 1, delay: 0.7 }}
              />
            </div>
            <p className="text-xs text-gray-400">
              Based on elevation ({data.terrain.elevation}m), slope ({data.terrain.slope}°), 
              and historical patterns
            </p>
          </motion.div>

          {/* Seismic Activity Trend */}
          <motion.div
            className="bg-white/5 rounded-lg p-4 border border-white/10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-semibold text-white">Seismic Trend</span>
              </div>
              <span className={`text-sm font-semibold px-2 py-1 rounded ${
                predictions.seismicTrend === 'Increasing' ? 'bg-red-500/20 text-red-400' :
                predictions.seismicTrend === 'Stable' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-green-500/20 text-green-400'
              }`}>
                {predictions.seismicTrend}
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Forecast based on recent activity ({data.earthquakes.recent} events in past year)
            </p>
            {data.earthquakes.recent > 0 && (
              <div className="mt-2 text-xs text-gray-300">
                Max magnitude: {data.earthquakes.maxMagnitude.toFixed(1)}
              </div>
            )}
          </motion.div>

          {/* Construction Timeline */}
          <motion.div
            className="bg-white/5 rounded-lg p-4 border border-white/10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-semibold text-white">Est. Construction Time</span>
              </div>
              <span className="text-lg font-bold text-cyan-400">
                {predictions.constructionTimeline} months
              </span>
            </div>
            <div className="space-y-1 text-xs text-gray-400">
              <div>Terrain complexity: {getTerrainComplexity(data.terrain)}</div>
              <div>Weather windows: {getWeatherWindows(location.lat)}</div>
              <div>Foundation depth: ~{calculateFoundationDepth(data.terrain, data.geological)}m</div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

function calculateLandslideProbability(data: any): number {
  const { terrain, geological } = data
  let probability = 0

  // Base probability from elevation and slope
  if (terrain.elevation > 2000 && terrain.slope > 30) {
    probability += 50
  } else if (terrain.elevation > 1000 && terrain.slope > 25) {
    probability += 35
  } else if (terrain.elevation > 500 && terrain.slope > 20) {
    probability += 20
  } else if (terrain.elevation > 300 && terrain.slope > 15) {
    probability += 10
  }

  // Add from landslide risk level
  if (terrain.landslideRisk === 'Very High') probability += 30
  else if (terrain.landslideRisk === 'High') probability += 20
  else if (terrain.landslideRisk === 'Moderate') probability += 10

  // Add from erosion risk
  if (geological.erosionRisk === 'High') probability += 15
  else if (geological.erosionRisk === 'Moderate') probability += 8

  // Add from seismic activity
  if (data.earthquakes.riskLevel === 'Very High') probability += 10
  else if (data.earthquakes.riskLevel === 'High') probability += 5

  return Math.min(95, Math.max(5, probability))
}

function forecastSeismicTrend(earthquakes: any, location: { lat: number; lng: number }): string {
  // Check if location is in high seismic zone
  const isHighSeismicZone = 
    (location.lat > 25 && location.lat < 35 && location.lng > 75 && location.lng < 95) || // Himalayas
    (location.lat > 22 && location.lat < 28 && location.lng > 90 && location.lng < 97)   // Northeast

  if (isHighSeismicZone) {
    if (earthquakes.recent > 15) return 'Increasing'
    if (earthquakes.recent > 8) return 'Stable'
    return 'Decreasing'
  }

  if (earthquakes.recent > 10) return 'Increasing'
  if (earthquakes.recent > 5) return 'Stable'
  return 'Decreasing'
}

function estimateConstructionTimeline(terrain: any, geological: any): number {
  let months = 12 // Base timeline

  // Add time based on elevation
  if (terrain.elevation > 2000) months += 8
  else if (terrain.elevation > 1000) months += 4
  else if (terrain.elevation > 500) months += 2

  // Add time based on slope
  if (terrain.slope > 30) months += 6
  else if (terrain.slope > 20) months += 3
  else if (terrain.slope > 15) months += 2

  // Add time based on terrain type
  if (terrain.terrainType === 'Mountainous') months += 6
  else if (terrain.terrainType === 'Hilly') months += 3

  // Add time based on geological factors
  if (geological.rockStability === 'Unstable') months += 4
  if (geological.waterTable === 'High') months += 2

  // Add time based on seismic risk
  if (geological.seismicActivity === 'Very High') months += 3
  else if (geological.seismicActivity === 'High') months += 2

  return Math.round(months)
}

function getTerrainComplexity(terrain: any): string {
  if (terrain.elevation > 2000 && terrain.slope > 30) return 'Very High'
  if (terrain.elevation > 1000 && terrain.slope > 20) return 'High'
  if (terrain.elevation > 500 && terrain.slope > 15) return 'Moderate'
  return 'Low'
}

function getWeatherWindows(lat: number): string {
  // Estimate weather windows based on latitude (monsoon seasons, etc.)
  if (lat > 8 && lat < 15) return 'Limited (monsoon)' // Western Ghats
  if (lat > 22 && lat < 28) return 'Seasonal' // Northeast
  if (lat > 25 && lat < 35) return 'Limited (winter)' // Himalayas
  return 'Good'
}

function calculateFoundationDepth(terrain: any, geological: any): number {
  let depth = 5 // Base depth in meters

  if (terrain.elevation > 2000) depth += 10
  else if (terrain.elevation > 1000) depth += 5

  if (geological.rockStability === 'Unstable') depth += 8
  else if (geological.rockStability === 'Moderately Stable') depth += 4

  if (geological.waterTable === 'High') depth += 3

  return Math.round(depth)
}

