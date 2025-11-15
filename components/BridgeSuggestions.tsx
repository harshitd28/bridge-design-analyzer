'use client'

import { motion } from 'framer-motion'
import { Building2, CheckCircle, X } from 'lucide-react'
import { useState } from 'react'

interface BridgeSuggestionsProps {
  data: any
}

interface BridgeDesign {
  name: string
  type: string
  suitability: number
  reasons: string[]
  pros: string[]
  cons: string[]
  image: string
}

export default function BridgeSuggestions({ data }: BridgeSuggestionsProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [selectedBridge, setSelectedBridge] = useState<number | null>(null)

  const bridgeDesigns = generateBridgeSuggestions(data)

  return (
    <motion.div
      className="absolute top-[280px] md:top-[300px] right-2 md:right-4 z-20 bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl w-80 md:w-96 border border-white/10 flex flex-col"
      style={{ bottom: '80px' }}
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="p-4 md:p-6 flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-3 md:mb-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Bridge Designs</h2>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isExpanded && (
          <div className="space-y-3 overflow-y-auto flex-1 min-h-0">
            {bridgeDesigns.map((bridge, index) => (
              <motion.div
                key={index}
                className={`p-4 rounded-lg border cursor-pointer transition-all backdrop-blur-md ${
                  selectedBridge === index
                    ? 'bg-blue-600/20 border-blue-500'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
                onClick={() => setSelectedBridge(selectedBridge === index ? null : index)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-white text-lg">{bridge.name}</h3>
                    <p className="text-gray-400 text-sm">{bridge.type}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="text-right">
                      <div className="text-blue-400 font-bold">
                        {bridge.suitability}%
                      </div>
                      <div className="text-xs text-gray-400">Match</div>
                    </div>
                    <CheckCircle
                      className={`w-6 h-6 ${
                        bridge.suitability >= 80
                          ? 'text-green-400'
                          : bridge.suitability >= 60
                          ? 'text-yellow-400'
                          : 'text-orange-400'
                      }`}
                    />
                  </div>
                </div>

                {selectedBridge === index && (
                  <motion.div
                    className="mt-4 space-y-2 pt-4 border-t border-white/10"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto', maxHeight: '280px' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="overflow-y-auto max-h-[120px] pr-1">
                      <h4 className="text-xs font-semibold text-white mb-1.5">Why This Design?</h4>
                      <ul className="space-y-1">
                        {bridge.reasons.map((reason, i) => (
                          <li key={i} className="text-xs text-gray-300 flex items-start gap-1.5">
                            <span className="text-blue-400 mt-0.5 flex-shrink-0">•</span>
                            <span className="break-words leading-relaxed">{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="overflow-y-auto max-h-[100px] pr-1">
                        <h4 className="text-xs font-semibold text-green-400 mb-1">Pros</h4>
                        <ul className="space-y-0.5">
                          {bridge.pros.map((pro, i) => (
                            <li key={i} className="text-xs text-gray-300 break-words leading-relaxed">+ {pro}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="overflow-y-auto max-h-[100px] pr-1">
                        <h4 className="text-xs font-semibold text-orange-400 mb-1">Considerations</h4>
                        <ul className="space-y-0.5">
                          {bridge.cons.map((con, i) => (
                            <li key={i} className="text-xs text-gray-300 break-words leading-relaxed">- {con}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

function generateBridgeSuggestions(data: any): BridgeDesign[] {
  const designs: BridgeDesign[] = []
  const { earthquakes, terrain, geological } = data

  // Calculate suitability scores
  const seismicRisk = earthquakes.riskLevel
  const landslideRisk = terrain.landslideRisk
  const elevation = terrain.elevation
  const slope = terrain.slope
  const isHighSeismic = ['High', 'Very High'].includes(seismicRisk)
  const isHighLandslide = ['High', 'Very High'].includes(landslideRisk)

  // 1. Suspension Bridge - Score based on multiple factors
  let suspensionScore = 50 // Lower base score
  const suspensionReasons: string[] = []
  const suspensionPros: string[] = []
  const suspensionCons: string[] = []

  // Elevation and slope factors
  if (elevation > 2000 && slope > 25) {
    suspensionScore += 25
    suspensionReasons.push('Ideal for very high elevation and steep terrain')
    suspensionPros.push('Long spans possible', 'Minimal ground disturbance')
  } else if (elevation > 1000 && slope > 20) {
    suspensionScore += 15
    suspensionReasons.push('Good for high elevation and steep terrain')
    suspensionPros.push('Long spans possible')
  } else if (elevation > 500) {
    suspensionScore += 5
  } else {
    suspensionScore -= 10
    suspensionCons.push('Not ideal for low elevation areas')
  }

  // Seismic factors
  if (isHighSeismic) {
    suspensionScore += 12
    suspensionReasons.push('Good seismic resistance with flexible design')
    suspensionPros.push('Flexible under seismic loads')
  } else if (seismicRisk === 'Moderate') {
    suspensionScore += 5
  } else {
    suspensionCons.push('Requires strong anchorages')
  }

  // Landslide factors
  if (isHighLandslide) {
    suspensionScore += 8
    suspensionReasons.push('Minimal ground contact reduces landslide impact')
  }

  // Soil type factors
  if (terrain.soilType === 'Rocky') {
    suspensionScore += 5
  } else if (terrain.soilType === 'Clay') {
    suspensionScore -= 5
    suspensionCons.push('Challenging soil conditions')
  }

  designs.push({
    name: 'Suspension Bridge',
    type: 'Cable-Stayed Suspension',
    suitability: Math.max(40, Math.min(95, suspensionScore)),
    reasons: suspensionReasons.length > 0 ? suspensionReasons : ['Suitable for long spans and high elevations'],
    pros: suspensionPros.length > 0 ? suspensionPros : ['Long span capability', 'Aesthetic appeal', 'Minimal piers'],
    cons: suspensionCons.length > 0 ? suspensionCons : ['Higher cost', 'Complex construction', 'Wind sensitivity'],
    image: 'suspension',
  })

  // 2. Arch Bridge - Score varies significantly based on conditions
  let archScore = 45 // Lower base score
  const archReasons: string[] = []
  const archPros: string[] = []
  const archCons: string[] = []

  // Terrain and rock stability factors
  if (terrain.terrainType === 'Mountainous' && geological.rockStability === 'Stable') {
    archScore += 30
    archReasons.push('Excellent for rocky, stable terrain')
    archPros.push('Natural load distribution', 'Durable in stable rock')
  } else if (terrain.terrainType === 'Mountainous' && geological.rockStability === 'Unstable') {
    archScore -= 15
    archCons.push('Unstable rock conditions')
  } else if (terrain.soilType === 'Rocky') {
    archScore += 15
    archReasons.push('Good for rocky terrain')
  } else {
    archScore -= 5
  }

  // Seismic factors - significant impact
  if (isHighSeismic) {
    archScore -= 15
    archCons.push('Less flexible under seismic loads')
  } else if (seismicRisk === 'Moderate') {
    archScore += 8
    archReasons.push('Strong and stable for moderate seismic zones')
  } else {
    archScore += 12
  }

  // Elevation factors
  if (elevation > 1000) {
    archScore += 8
    archReasons.push('Good for elevated crossings')
  } else if (elevation > 500) {
    archScore += 5
  } else {
    archScore -= 3
  }

  // Landslide factors
  if (isHighLandslide) {
    archScore -= 8
    archCons.push('Vulnerable to landslide damage')
  }

  designs.push({
    name: 'Arch Bridge',
    type: 'Concrete/Steel Arch',
    suitability: Math.max(35, Math.min(95, archScore)),
    reasons: archReasons.length > 0 ? archReasons : ['Strong and durable design'],
    pros: archPros.length > 0 ? archPros : ['Excellent load distribution', 'Aesthetic', 'Long-lasting'],
    cons: archCons.length > 0 ? archCons : ['Requires stable foundations', 'Limited span length', 'Complex formwork'],
    image: 'arch',
  })

  // 3. Cable-Stayed Bridge - Modern and versatile
  let cableStayedScore = 60 // Moderate base score
  const cableStayedReasons: string[] = []
  const cableStayedPros: string[] = []
  const cableStayedCons: string[] = []

  // Seismic factors - major advantage
  if (isHighSeismic) {
    cableStayedScore += 20
    cableStayedReasons.push('Excellent seismic performance with redundancy')
    cableStayedPros.push('Redundant cable system', 'Good seismic damping')
  } else if (seismicRisk === 'Moderate') {
    cableStayedScore += 10
  } else {
    cableStayedScore += 5
  }

  // Elevation factors
  if (elevation > 1500) {
    cableStayedScore += 12
    cableStayedReasons.push('Suitable for very high elevation crossings')
  } else if (elevation > 800) {
    cableStayedScore += 8
    cableStayedReasons.push('Suitable for high elevation crossings')
  } else if (elevation > 500) {
    cableStayedScore += 5
  } else {
    cableStayedScore -= 5
  }

  // Slope factors
  if (slope > 30) {
    cableStayedScore += 8
    cableStayedReasons.push('Minimal ground impact on very steep slopes')
  } else if (slope > 25) {
    cableStayedScore += 5
    cableStayedReasons.push('Minimal ground impact on steep slopes')
  } else if (slope > 15) {
    cableStayedScore += 3
  }

  // Landslide factors
  if (isHighLandslide) {
    cableStayedScore += 8
    cableStayedReasons.push('Fewer piers reduce landslide risk exposure')
  }

  // Soil factors
  if (terrain.soilType === 'Rocky') {
    cableStayedScore += 5
  } else if (terrain.soilType === 'Clay') {
    cableStayedScore -= 3
  }

  designs.push({
    name: 'Cable-Stayed Bridge',
    type: 'Modern Cable-Stayed',
    suitability: Math.max(45, Math.min(95, cableStayedScore)),
    reasons: cableStayedReasons.length > 0 ? cableStayedReasons : ['Modern, efficient design'],
    pros: cableStayedPros.length > 0 ? cableStayedPros : ['Good seismic resistance', 'Efficient material use', 'Modern aesthetics'],
    cons: cableStayedCons.length > 0 ? cableStayedCons : ['Requires tall towers', 'Cable maintenance', 'Wind considerations'],
    image: 'cable-stayed',
  })

  // 4. Beam Bridge - Best for low-risk areas
  let beamScore = 40 // Lower base score
  const beamReasons: string[] = []
  const beamPros: string[] = []
  const beamCons: string[] = []

  // Risk factors - critical for beam bridges
  if (seismicRisk === 'Low' && landslideRisk === 'Low') {
    beamScore += 30
    beamReasons.push('Cost-effective for low-risk areas')
    beamPros.push('Lower cost', 'Simple construction', 'Quick to build')
  } else if (seismicRisk === 'Low' && landslideRisk === 'Moderate') {
    beamScore += 15
    beamReasons.push('Suitable for low seismic risk areas')
  } else if (seismicRisk === 'Moderate' && landslideRisk === 'Low') {
    beamScore += 10
  } else {
    beamScore -= 5
  }

  // High risk penalties
  if (isHighSeismic) {
    beamScore -= 25
    beamCons.push('Not recommended for high seismic risk areas')
  }
  if (isHighLandslide) {
    beamScore -= 20
    beamCons.push('Not recommended for high landslide risk areas')
  }

  // Terrain factors
  if (elevation < 300 && slope < 10) {
    beamScore += 20
    beamReasons.push('Ideal for flat, low elevation terrain')
  } else if (elevation < 500 && slope < 15) {
    beamScore += 12
    beamReasons.push('Suitable for moderate terrain')
  } else if (elevation > 1000 || slope > 20) {
    beamScore -= 15
    beamCons.push('Not suitable for high elevation or steep slopes')
  }

  // Soil factors
  if (terrain.soilType === 'Clay' || terrain.soilType === 'Loamy') {
    beamScore += 5
  } else if (terrain.soilType === 'Rocky') {
    beamScore -= 5
    beamCons.push('Challenging for rocky terrain')
  }

  designs.push({
    name: 'Beam Bridge',
    type: 'Pre-stressed Concrete Beam',
    suitability: Math.max(25, Math.min(90, beamScore)),
    reasons: beamReasons.length > 0 ? beamReasons : ['Simple and economical'],
    pros: beamPros.length > 0 ? beamPros : ['Cost-effective', 'Simple design', 'Quick construction'],
    cons: beamCons.length > 0 ? beamCons : ['Limited span length', 'Less suitable for high-risk areas', 'More piers needed'],
    image: 'beam',
  })

  // 5. Truss Bridge - Versatile but seismic-sensitive
  let trussScore = 50 // Moderate base score
  const trussReasons: string[] = []
  const trussPros: string[] = []
  const trussCons: string[] = []

  // Elevation factors
  if (elevation > 1500) {
    trussScore += 12
    trussReasons.push('Excellent for very high elevation crossings')
  } else if (elevation > 600) {
    trussScore += 8
    trussReasons.push('Good for elevated crossings')
  } else if (elevation > 300) {
    trussScore += 5
  } else {
    trussScore -= 3
  }

  // Seismic factors - significant impact
  if (isHighSeismic) {
    trussScore -= 15
    trussCons.push('May need seismic retrofitting', 'Less flexible under seismic loads')
  } else if (seismicRisk === 'Moderate') {
    trussScore += 5
    trussReasons.push('Strong and reliable for moderate seismic zones')
  } else {
    trussScore += 12
    trussReasons.push('Excellent for low seismic risk areas')
  }

  // Soil factors
  if (terrain.soilType === 'Rocky') {
    trussScore += 10
    trussReasons.push('Works well with rocky foundations')
  } else if (terrain.soilType === 'Clay') {
    trussScore -= 5
    trussCons.push('Challenging soil conditions')
  }

  // Slope factors
  if (slope > 20) {
    trussScore += 5
  } else if (slope < 10) {
    trussScore += 3
  }

  // Landslide factors
  if (isHighLandslide) {
    trussScore -= 8
    trussCons.push('Vulnerable to landslide damage')
  }

  designs.push({
    name: 'Truss Bridge',
    type: 'Steel Truss',
    suitability: Math.max(35, Math.min(90, trussScore)),
    reasons: trussReasons.length > 0 ? trussReasons : ['Strong and efficient design'],
    pros: trussPros.length > 0 ? trussPros : ['Strong structure', 'Efficient material use', 'Good load distribution'],
    cons: trussCons.length > 0 ? trussCons : ['More complex construction', 'Maintenance requirements', 'Visual impact'],
    image: 'truss',
  })

  // Sort by suitability
  return designs.sort((a, b) => b.suitability - a.suitability)
}

