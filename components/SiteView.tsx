'use client'

import { motion } from 'framer-motion'
import { X, ArrowLeft, MapPin, Mountain, Activity, AlertTriangle, Building2, CheckCircle } from 'lucide-react'
import { LocationData } from '@/data/locations'
import { useState } from 'react'

interface SiteViewProps {
  locationData: LocationData
  onClose: () => void
}

// Bridge design images mapping - using local images from public/bridges folder
const getBridgeImage = (bridgeName: string): string => {
  // Map bridge names to image file names
  const imageMap: Record<string, string> = {
    'Suspension Bridge': '/bridges/suspension-bridge.jpg',
    'Arch Bridge': '/bridges/arch-bridge.jpg',
    'Cable-Stayed Bridge': '/bridges/cable-stayed-bridge.jpg',
    'Beam Bridge': '/bridges/beam-bridge.jpg',
    'Truss Bridge': '/bridges/truss-bridge.jpg',
  }
  
  // Return local image path, fallback to Unsplash if local image doesn't exist
  return imageMap[bridgeName] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'
}

function generateBridgeSuggestions(data: any) {
  const designs: any[] = []
  const { earthquakes, terrain, geological } = data

  const seismicRisk = earthquakes.riskLevel
  const landslideRisk = terrain.landslideRisk
  const elevation = terrain.elevation
  const slope = terrain.slope
  const isHighSeismic = ['High', 'Very High'].includes(seismicRisk)
  const isHighLandslide = ['High', 'Very High'].includes(landslideRisk)

  // Suspension Bridge
  let suspensionScore = 70
  if (elevation > 1000 && slope > 20) suspensionScore += 15
  if (isHighSeismic) suspensionScore += 10
  if (isHighLandslide) suspensionScore += 5

  designs.push({
    name: 'Suspension Bridge',
    type: 'Cable-Stayed Suspension',
    suitability: Math.min(95, suspensionScore),
    reasons: elevation > 1000 ? ['Ideal for high elevation and steep terrain'] : ['Suitable for long spans'],
    pros: ['Long span capability', 'Aesthetic appeal', 'Minimal piers'],
    cons: ['Higher cost', 'Complex construction', 'Wind sensitivity'],
  })

  // Arch Bridge
  let archScore = 65
  if (terrain.terrainType === 'Mountainous' && geological.rockStability === 'Stable') archScore += 20
  if (!isHighSeismic) archScore += 10
  if (elevation > 500) archScore += 5

  designs.push({
    name: 'Arch Bridge',
    type: 'Concrete/Steel Arch',
    suitability: Math.max(50, Math.min(95, archScore)),
    reasons: terrain.terrainType === 'Mountainous' ? ['Excellent for rocky, stable terrain'] : ['Strong and durable design'],
    pros: ['Excellent load distribution', 'Aesthetic', 'Long-lasting'],
    cons: ['Requires stable foundations', 'Limited span length', 'Complex formwork'],
  })

  // Cable-Stayed Bridge
  let cableStayedScore = 75
  if (isHighSeismic) cableStayedScore += 15
  if (elevation > 800) cableStayedScore += 10
  if (slope > 25) cableStayedScore += 5
  if (isHighLandslide) cableStayedScore += 5

  designs.push({
    name: 'Cable-Stayed Bridge',
    type: 'Modern Cable-Stayed',
    suitability: Math.min(95, cableStayedScore),
    reasons: isHighSeismic ? ['Excellent seismic performance with redundancy'] : ['Modern, efficient design'],
    pros: ['Good seismic resistance', 'Efficient material use', 'Modern aesthetics'],
    cons: ['Requires tall towers', 'Cable maintenance', 'Wind considerations'],
  })

  // Beam Bridge
  let beamScore = 50
  if (seismicRisk === 'Low' && landslideRisk === 'Low') beamScore += 25
  if (elevation < 500 && slope < 15) beamScore += 15
  if (isHighSeismic || isHighLandslide) beamScore -= 20

  designs.push({
    name: 'Beam Bridge',
    type: 'Pre-stressed Concrete Beam',
    suitability: Math.max(40, Math.min(90, beamScore)),
    reasons: seismicRisk === 'Low' ? ['Cost-effective for low-risk areas'] : ['Simple and economical'],
    pros: ['Cost-effective', 'Simple design', 'Quick construction'],
    cons: ['Limited span length', 'Less suitable for high-risk areas', 'More piers needed'],
  })

  // Truss Bridge
  let trussScore = 60
  if (elevation > 600) trussScore += 10
  if (!isHighSeismic) trussScore += 10
  if (terrain.soilType === 'Rocky') trussScore += 5

  designs.push({
    name: 'Truss Bridge',
    type: 'Steel Truss',
    suitability: Math.max(50, Math.min(85, trussScore)),
    reasons: elevation > 600 ? ['Good for elevated crossings'] : ['Strong and efficient design'],
    pros: ['Strong structure', 'Efficient material use', 'Good load distribution'],
    cons: ['More complex construction', 'Maintenance requirements', 'Visual impact'],
  })

  return designs.sort((a, b) => b.suitability - a.suitability)
}

export default function SiteView({ locationData, onClose }: SiteViewProps) {
  const [selectedBridge, setSelectedBridge] = useState<number | null>(null)
  const bridgeDesigns = generateBridgeSuggestions({
    earthquakes: locationData.earthquakes,
    terrain: locationData.terrain,
    geological: locationData.geological,
  })

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
        <div className="relative min-h-screen">
          {/* Hero Image Section */}
          <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
            <img
              src={locationData.image}
              alt={locationData.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
            
            {/* Back Button */}
            <button
              onClick={onClose}
              className="absolute top-6 left-6 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-3 rounded-full transition-all flex items-center gap-2 border border-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden md:inline">Back</span>
            </button>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full transition-all border border-white/20"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Location Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                  {locationData.name}
                </h1>
                <p className="text-xl text-white/90 max-w-3xl">
                  {locationData.description}
                </p>
                <div className="flex items-center gap-2 mt-4 text-white/80">
                  <MapPin className="w-5 h-5" />
                  <span>{locationData.lat.toFixed(4)}°N, {locationData.lng.toFixed(4)}°E</span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Content Section */}
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Terrain Analysis */}
                <motion.div
                  className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Mountain className="w-8 h-8 text-amber-400" />
                    <h2 className="text-2xl font-bold text-white">Terrain Analysis</h2>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/5 backdrop-blur-md rounded-lg p-4 border border-white/10">
                      <p className="text-gray-400 text-sm mb-1">Elevation</p>
                      <p className="text-white text-2xl font-bold">{locationData.terrain.elevation}m</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md rounded-lg p-4 border border-white/10">
                      <p className="text-gray-400 text-sm mb-1">Slope</p>
                      <p className="text-white text-2xl font-bold">{locationData.terrain.slope}°</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md rounded-lg p-4 border border-white/10">
                      <p className="text-gray-400 text-sm mb-1">Terrain Type</p>
                      <p className="text-white text-lg font-semibold">{locationData.terrain.terrainType}</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md rounded-lg p-4 border border-white/10">
                      <p className="text-gray-400 text-sm mb-1">Soil Type</p>
                      <p className="text-white text-lg font-semibold">{locationData.terrain.soilType}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Seismic Activity */}
                <motion.div
                  className="bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Activity className="w-8 h-8 text-red-400" />
                    <h2 className="text-2xl font-bold text-white">Seismic Activity</h2>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/5 backdrop-blur-md rounded-lg p-4 border border-white/10">
                      <p className="text-gray-400 text-sm mb-1">Risk Level</p>
                      <p className={`text-xl font-bold ${
                        locationData.earthquakes.riskLevel === 'Very High' ? 'text-red-400' :
                        locationData.earthquakes.riskLevel === 'High' ? 'text-orange-400' :
                        locationData.earthquakes.riskLevel === 'Moderate' ? 'text-yellow-400' :
                        'text-green-400'
                      }`}>
                        {locationData.earthquakes.riskLevel}
                      </p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md rounded-lg p-4 border border-white/10">
                      <p className="text-gray-400 text-sm mb-1">Frequency</p>
                      <p className="text-white text-xl font-bold">{locationData.earthquakes.frequency}</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md rounded-lg p-4 border border-white/10">
                      <p className="text-gray-400 text-sm mb-1">Recent Events</p>
                      <p className="text-white text-xl font-bold">{locationData.earthquakes.recent}</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md rounded-lg p-4 border border-white/10">
                      <p className="text-gray-400 text-sm mb-1">Max Magnitude</p>
                      <p className="text-white text-xl font-bold">{locationData.earthquakes.maxMagnitude}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Geological Factors */}
                <motion.div
                  className="bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <AlertTriangle className="w-8 h-8 text-orange-400" />
                    <h2 className="text-2xl font-bold text-white">Geological Factors</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/5 backdrop-blur-md rounded-lg p-4 border border-white/10">
                      <p className="text-gray-400 text-sm mb-1">Fault Lines</p>
                      <p className="text-white text-lg font-semibold">{locationData.geological.faultLines}</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md rounded-lg p-4 border border-white/10">
                      <p className="text-gray-400 text-sm mb-1">Rock Stability</p>
                      <p className="text-white text-lg font-semibold">{locationData.geological.rockStability}</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md rounded-lg p-4 border border-white/10">
                      <p className="text-gray-400 text-sm mb-1">Erosion Risk</p>
                      <p className="text-white text-lg font-semibold">{locationData.geological.erosionRisk}</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md rounded-lg p-4 border border-white/10">
                      <p className="text-gray-400 text-sm mb-1">Water Table</p>
                      <p className="text-white text-lg font-semibold">{locationData.geological.waterTable}</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <motion.div
                  className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 sticky top-6"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <h3 className="text-xl font-bold text-white mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-400 text-sm">Landslide Risk</p>
                      <p className={`text-xl font-bold ${
                        locationData.terrain.landslideRisk === 'Very High' ? 'text-red-400' :
                        locationData.terrain.landslideRisk === 'High' ? 'text-orange-400' :
                        'text-yellow-400'
                      }`}>
                        {locationData.terrain.landslideRisk}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Total Earthquakes</p>
                      <p className="text-white text-xl font-bold">{locationData.earthquakes.total}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Seismic Activity</p>
                      <p className="text-white text-xl font-bold">{locationData.geological.seismicActivity}</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Bridge Recommendations Section */}
            <motion.div
              className="max-w-7xl mx-auto px-4 md:px-6 py-12"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <Building2 className="w-8 h-8 text-blue-400" />
                <h2 className="text-3xl font-bold text-white">Recommended Bridge Designs</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bridgeDesigns.map((bridge, index) => (
                  <motion.div
                    key={index}
                    className={`bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border cursor-pointer transition-all ${
                      selectedBridge === index
                        ? 'bg-blue-600/20 border-blue-500'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                    onClick={() => setSelectedBridge(selectedBridge === index ? null : index)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    {/* Bridge Image */}
                    <div className="relative h-48 w-full overflow-hidden">
                      <img
                        src={getBridgeImage(bridge.name)}
                        alt={bridge.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2">
                        <CheckCircle className={`w-4 h-4 ${
                          bridge.suitability >= 80 ? 'text-green-400' :
                          bridge.suitability >= 60 ? 'text-yellow-400' :
                          'text-orange-400'
                        }`} />
                        <span className="text-white font-bold">{bridge.suitability}%</span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-1">{bridge.name}</h3>
                      <p className="text-gray-400 text-sm mb-4">{bridge.type}</p>

                      {selectedBridge === index && (
                        <motion.div
                          className="mt-4 pt-4 border-t border-white/10 space-y-3"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <div>
                            <h4 className="text-sm font-semibold text-white mb-2">Why This Design?</h4>
                            <ul className="space-y-1">
                              {bridge.reasons.map((reason: string, i: number) => (
                                <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                                  <span className="text-blue-400 mt-1">•</span>
                                  <span>{reason}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <h4 className="text-xs font-semibold text-green-400 mb-1">Pros</h4>
                              <ul className="space-y-1">
                                {bridge.pros.map((pro: string, i: number) => (
                                  <li key={i} className="text-xs text-gray-300">+ {pro}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-xs font-semibold text-orange-400 mb-1">Considerations</h4>
                              <ul className="space-y-1">
                                {bridge.cons.map((con: string, i: number) => (
                                  <li key={i} className="text-xs text-gray-300">- {con}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
    </motion.div>
  )
}

