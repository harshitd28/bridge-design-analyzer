'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, TrendingUp, Calendar, BarChart3, Zap } from 'lucide-react'
import { X } from 'lucide-react'

interface AIBridgeOptimizerProps {
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
  onClose: () => void
}

interface OptimizedDesign {
  name: string
  type: string
  suitability: number
  estimatedCost: number
  lifespan: number
  maintenanceCost: number
  annualMaintenance: number
  constructionTime: number
  riskScore: number
  benefits: string[]
  factors: {
    seismic: number
    terrain: number
    geological: number
    economic: number
  }
}

export default function AIBridgeOptimizer({ data, location, onClose }: AIBridgeOptimizerProps) {
  const [optimizedDesigns, setOptimizedDesigns] = useState<OptimizedDesign[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(true)
  const [selectedDesign, setSelectedDesign] = useState<number | null>(null)

  useEffect(() => {
    // Simulate AI analysis
    setTimeout(() => {
      const designs = generateOptimizedDesigns(data, location)
      setOptimizedDesigns(designs)
      setIsAnalyzing(false)
    }, 2000)
  }, [data, location])

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-6xl border border-white/20 p-6 my-8"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">AI Bridge Design Optimizer</h2>
              <p className="text-sm text-gray-400">ML-powered analysis with cost predictions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="mb-4"
            >
              <Zap className="w-16 h-16 text-blue-400" />
            </motion.div>
            <h3 className="text-xl font-semibold text-white mb-2">AI Analyzing Terrain...</h3>
            <p className="text-gray-400">Generating optimized bridge designs</p>
            <div className="mt-4 w-64 bg-gray-700 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                animate={{ width: ['0%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <motion.div
                className="bg-white/5 rounded-lg p-4 border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-gray-400">Designs Analyzed</span>
                </div>
                <div className="text-2xl font-bold text-white">{optimizedDesigns.length}</div>
              </motion.div>
              <motion.div
                className="bg-white/5 rounded-lg p-4 border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-400 text-xl font-bold">₹</span>
                  <span className="text-sm text-gray-400">Avg. Cost</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  ₹{(optimizedDesigns.reduce((sum, d) => sum + d.estimatedCost, 0) / optimizedDesigns.length / 10000000).toFixed(1)} Cr
                </div>
              </motion.div>
              <motion.div
                className="bg-white/5 rounded-lg p-4 border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  <span className="text-sm text-gray-400">Avg. Lifespan</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {Math.round(optimizedDesigns.reduce((sum, d) => sum + d.lifespan, 0) / optimizedDesigns.length)} years
                </div>
              </motion.div>
              <motion.div
                className="bg-white/5 rounded-lg p-4 border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm text-gray-400">Best Suitability</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {Math.max(...optimizedDesigns.map(d => d.suitability))}%
                </div>
              </motion.div>
            </div>

            {/* Optimized Designs */}
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {optimizedDesigns.map((design, index) => (
                <motion.div
                  key={index}
                  className={`bg-white/5 rounded-lg p-5 border cursor-pointer transition-all ${
                    selectedDesign === index
                      ? 'bg-blue-600/20 border-blue-500'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  onClick={() => setSelectedDesign(selectedDesign === index ? null : index)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{design.name}</h3>
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs font-semibold">
                          {design.type}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          design.suitability >= 85 ? 'bg-green-500/20 text-green-300' :
                          design.suitability >= 70 ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-orange-500/20 text-orange-300'
                        }`}>
                          {design.suitability}% Match
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Construction Cost</div>
                      <div className="text-lg font-bold text-white">
                        ₹{(design.estimatedCost / 10000000).toFixed(2)} Cr
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Lifespan</div>
                      <div className="text-lg font-bold text-white">{design.lifespan} years</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Annual Maintenance</div>
                      <div className="text-lg font-bold text-white">
                        ₹{(design.annualMaintenance / 100000).toFixed(1)} L
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Construction Time</div>
                      <div className="text-lg font-bold text-white">{design.constructionTime} months</div>
                    </div>
                  </div>

                  {/* Cost-Benefit Analysis */}
                  {selectedDesign === index && (
                    <motion.div
                      className="mt-4 pt-4 border-t border-white/10 space-y-4"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-2">Cost-Benefit Analysis</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="bg-white/5 rounded p-3">
                            <div className="text-gray-400 mb-1">Total Lifetime Cost</div>
                            <div className="text-lg font-bold text-white">
                              ₹{((design.estimatedCost + design.maintenanceCost) / 10000000).toFixed(2)} Cr
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              (Initial + {design.lifespan} years maintenance)
                            </div>
                          </div>
                          <div className="bg-white/5 rounded p-3">
                            <div className="text-gray-400 mb-1">Cost per Year</div>
                            <div className="text-lg font-bold text-white">
                              ₹{((design.estimatedCost + design.maintenanceCost) / design.lifespan / 100000).toFixed(1)} L
                            </div>
                            <div className="text-xs text-gray-500 mt-1">Average annual cost</div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-white mb-2">Key Benefits</h4>
                        <ul className="space-y-1">
                          {design.benefits.map((benefit, i) => (
                            <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                              <span className="text-green-400 mt-1">✓</span>
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-white mb-2">Optimization Factors</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-white/5 rounded p-2">
                            <div className="text-xs text-gray-400">Seismic Performance</div>
                            <div className="text-sm font-semibold text-white">{design.factors.seismic}/100</div>
                          </div>
                          <div className="bg-white/5 rounded p-2">
                            <div className="text-xs text-gray-400">Terrain Adaptation</div>
                            <div className="text-sm font-semibold text-white">{design.factors.terrain}/100</div>
                          </div>
                          <div className="bg-white/5 rounded p-2">
                            <div className="text-xs text-gray-400">Geological Stability</div>
                            <div className="text-sm font-semibold text-white">{design.factors.geological}/100</div>
                          </div>
                          <div className="bg-white/5 rounded p-2">
                            <div className="text-xs text-gray-400">Economic Value</div>
                            <div className="text-sm font-semibold text-white">{design.factors.economic}/100</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-3 border border-blue-500/30">
                        <div className="text-xs text-gray-300 mb-1">Risk Score</div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                design.riskScore < 30 ? 'bg-green-500' :
                                design.riskScore < 60 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${design.riskScore}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-white">{design.riskScore}/100</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {design.riskScore < 30 ? 'Low Risk' :
                           design.riskScore < 60 ? 'Moderate Risk' :
                           'High Risk'} - Lower is better
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

function generateOptimizedDesigns(data: any, location: any): OptimizedDesign[] {
  const { earthquakes, terrain, geological } = data
  const designs: OptimizedDesign[] = []

  // Base factors
  const seismicRisk = ['Very High', 'High'].includes(earthquakes.riskLevel) ? 1.3 : 
                      earthquakes.riskLevel === 'Moderate' ? 1.1 : 1.0
  const elevationFactor = terrain.elevation > 2000 ? 1.4 : terrain.elevation > 1000 ? 1.2 : 1.0
  const slopeFactor = terrain.slope > 30 ? 1.3 : terrain.slope > 20 ? 1.15 : 1.0
  const complexityFactor = seismicRisk * elevationFactor * slopeFactor

  // 1. Suspension Bridge (Costs in INR - Crores)
  const suspensionCost = 1245000000 * complexityFactor // ~₹124.5 Cr base (equivalent to $15M)
  const suspensionLifespan = 80 + (terrain.elevation > 1000 ? 10 : 0) - (seismicRisk > 1.2 ? 5 : 0)
  const suspensionMaintenance = suspensionCost * 0.02 * suspensionLifespan
  const suspensionAnnual = suspensionMaintenance / suspensionLifespan

  designs.push({
    name: 'Optimized Suspension Bridge',
    type: 'Advanced Suspension',
    suitability: calculateSuitability('Suspension', data),
    estimatedCost: suspensionCost,
    lifespan: suspensionLifespan,
    maintenanceCost: suspensionMaintenance,
    annualMaintenance: suspensionAnnual,
    constructionTime: Math.round(18 + complexityFactor * 6),
    riskScore: calculateRiskScore('Suspension', data),
    benefits: [
      'Excellent for high elevation crossings',
      'Minimal ground disturbance',
      'Long span capability reduces pier count',
      'Flexible design handles seismic activity well',
      'Low maintenance requirements'
    ],
    factors: {
      seismic: 85,
      terrain: 90,
      geological: 75,
      economic: 70
    }
  })

  // 2. Cable-Stayed Bridge (Costs in INR - Crores)
  const cableStayedCost = 996000000 * complexityFactor // ~₹99.6 Cr base (equivalent to $12M)
  const cableStayedLifespan = 75 + (seismicRisk < 1.1 ? 10 : 0)
  const cableStayedMaintenance = cableStayedCost * 0.025 * cableStayedLifespan
  const cableStayedAnnual = cableStayedMaintenance / cableStayedLifespan

  designs.push({
    name: 'Modern Cable-Stayed Bridge',
    type: 'Cable-Stayed',
    suitability: calculateSuitability('Cable-Stayed', data),
    estimatedCost: cableStayedCost,
    lifespan: cableStayedLifespan,
    maintenanceCost: cableStayedMaintenance,
    annualMaintenance: cableStayedAnnual,
    constructionTime: Math.round(15 + complexityFactor * 5),
    riskScore: calculateRiskScore('Cable-Stayed', data),
    benefits: [
      'Modern design with excellent seismic resistance',
      'Good balance of cost and performance',
      'Redundant cable system for safety',
      'Aesthetic appeal',
      'Moderate maintenance requirements'
    ],
    factors: {
      seismic: 90,
      terrain: 80,
      geological: 80,
      economic: 75
    }
  })

  // 3. Arch Bridge (Costs in INR - Crores)
  const archCost = 664000000 * complexityFactor // ~₹66.4 Cr base (equivalent to $8M)
  const archLifespan = 100 + (geological.rockStability === 'Stable' ? 20 : 0)
  const archMaintenance = archCost * 0.015 * archLifespan
  const archAnnual = archMaintenance / archLifespan

  designs.push({
    name: 'Reinforced Arch Bridge',
    type: 'Concrete/Steel Arch',
    suitability: calculateSuitability('Arch', data),
    estimatedCost: archCost,
    lifespan: archLifespan,
    maintenanceCost: archMaintenance,
    annualMaintenance: archAnnual,
    constructionTime: Math.round(12 + complexityFactor * 4),
    riskScore: calculateRiskScore('Arch', data),
    benefits: [
      'Longest lifespan with proper foundation',
      'Excellent load distribution',
      'Low maintenance costs',
      'Durable construction',
      'Good for stable rock formations'
    ],
    factors: {
      seismic: 70,
      terrain: 75,
      geological: 90,
      economic: 85
    }
  })

  // 4. Beam Bridge (Costs in INR - Crores)
  const beamCost = 415000000 * complexityFactor // ~₹41.5 Cr base (equivalent to $5M)
  const beamLifespan = 60 - (terrain.elevation > 1000 ? 10 : 0)
  const beamMaintenance = beamCost * 0.03 * beamLifespan
  const beamAnnual = beamMaintenance / beamLifespan

  designs.push({
    name: 'Reinforced Beam Bridge',
    type: 'Pre-stressed Concrete Beam',
    suitability: calculateSuitability('Beam', data),
    estimatedCost: beamCost,
    lifespan: beamLifespan,
    maintenanceCost: beamMaintenance,
    annualMaintenance: beamAnnual,
    constructionTime: Math.round(8 + complexityFactor * 3),
    riskScore: calculateRiskScore('Beam', data),
    benefits: [
      'Most economical option',
      'Quick construction time',
      'Simple maintenance',
      'Proven design',
      'Good for moderate terrain'
    ],
    factors: {
      seismic: 60,
      terrain: 65,
      geological: 70,
      economic: 95
    }
  })

  // 5. Truss Bridge (Costs in INR - Crores)
  const trussCost = 581000000 * complexityFactor // ~₹58.1 Cr base (equivalent to $7M)
  const trussLifespan = 70
  const trussMaintenance = trussCost * 0.025 * trussLifespan
  const trussAnnual = trussMaintenance / trussLifespan

  designs.push({
    name: 'Steel Truss Bridge',
    type: 'Modern Truss',
    suitability: calculateSuitability('Truss', data),
    estimatedCost: trussCost,
    lifespan: trussLifespan,
    maintenanceCost: trussMaintenance,
    annualMaintenance: trussAnnual,
    constructionTime: Math.round(10 + complexityFactor * 4),
    riskScore: calculateRiskScore('Truss', data),
    benefits: [
      'High strength-to-weight ratio',
      'Good for medium spans',
      'Durable steel construction',
      'Moderate cost',
      'Suitable for varied terrain'
    ],
    factors: {
      seismic: 65,
      terrain: 75,
      geological: 75,
      economic: 80
    }
  })

  return designs.sort((a, b) => b.suitability - a.suitability)
}

function calculateSuitability(bridgeType: string, data: any): number {
  const { earthquakes, terrain, geological } = data
  let score = 50

  if (bridgeType === 'Suspension') {
    if (terrain.elevation > 1000) score += 20
    if (terrain.slope > 20) score += 15
    if (['High', 'Very High'].includes(earthquakes.riskLevel)) score += 10
  } else if (bridgeType === 'Cable-Stayed') {
    if (['High', 'Very High'].includes(earthquakes.riskLevel)) score += 20
    if (terrain.elevation > 800) score += 15
  } else if (bridgeType === 'Arch') {
    if (geological.rockStability === 'Stable') score += 25
    if (terrain.terrainType === 'Mountainous') score += 15
  } else if (bridgeType === 'Beam') {
    if (terrain.elevation < 500) score += 20
    if (terrain.slope < 15) score += 15
  } else if (bridgeType === 'Truss') {
    if (terrain.elevation < 1000) score += 15
    if (terrain.slope < 20) score += 10
  }

  return Math.min(95, Math.max(40, score))
}

function calculateRiskScore(bridgeType: string, data: any): number {
  const { earthquakes, terrain, geological } = data
  let risk = 50

  // Higher elevation = higher risk
  if (terrain.elevation > 2000) risk += 15
  else if (terrain.elevation > 1000) risk += 10

  // Steeper slope = higher risk
  if (terrain.slope > 30) risk += 15
  else if (terrain.slope > 20) risk += 10

  // Seismic risk
  if (earthquakes.riskLevel === 'Very High') risk += 20
  else if (earthquakes.riskLevel === 'High') risk += 15
  else if (earthquakes.riskLevel === 'Moderate') risk += 5

  // Geological risk
  if (geological.rockStability === 'Unstable') risk += 15
  if (geological.erosionRisk === 'High') risk += 10

  // Bridge type adjustments
  if (bridgeType === 'Suspension' || bridgeType === 'Cable-Stayed') risk -= 10
  if (bridgeType === 'Beam') risk += 5

  return Math.min(100, Math.max(10, risk))
}

