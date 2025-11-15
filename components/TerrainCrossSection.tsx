'use client'

import { motion } from 'framer-motion'
import { X, Layers, Droplet, Mountain } from 'lucide-react'
import { useState } from 'react'

interface TerrainCrossSectionProps {
  terrain: {
    elevation: number
    slope: number
    terrainType: string
    soilType: string
  }
  geological: {
    rockStability: string
    waterTable: string
    erosionRisk: string
  }
  onClose: () => void
}

export default function TerrainCrossSection({ terrain, geological, onClose }: TerrainCrossSectionProps) {
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null)

  // Calculate layer depths based on terrain and geological data
  const surfaceDepth = 0
  const topsoilDepth = 2
  const subsoilDepth = topsoilDepth + (terrain.soilType === 'Rocky' ? 3 : 5)
  const bedrockDepth = subsoilDepth + (geological.rockStability === 'Stable' ? 8 : 12)
  const waterTableDepth = getWaterTableDepth(geological.waterTable, bedrockDepth)

  const layers = [
    { name: 'Surface Layer', depth: surfaceDepth, color: '#8B7355', height: topsoilDepth },
    { name: 'Topsoil', depth: topsoilDepth, color: '#A0826D', height: subsoilDepth - topsoilDepth },
    { name: 'Subsoil', depth: subsoilDepth, color: getSoilColor(terrain.soilType), height: bedrockDepth - subsoilDepth },
    { name: 'Bedrock', depth: bedrockDepth, color: '#5A5A5A', height: 10 },
  ]

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-4xl border border-white/20 p-6"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Mountain className="w-6 h-6 text-blue-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">Terrain Cross-Section</h2>
              <p className="text-sm text-gray-400">
                Geological layers and foundation interaction
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cross-Section Visualization */}
          <div className="lg:col-span-2">
            <div className="bg-black/30 rounded-lg p-6 h-96 relative overflow-hidden">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5" />
                Geological Layers
              </h3>
              
              {/* Cross-section diagram */}
              <div className="relative h-80">
                {/* Surface line */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-yellow-400" />
                
                {/* Layers */}
                {layers.map((layer, index) => (
                  <motion.div
                    key={layer.name}
                    className="absolute left-0 right-0 border-t-2 border-gray-600 cursor-pointer"
                    style={{
                      top: `${(layer.depth / bedrockDepth) * 100}%`,
                      height: `${(layer.height / bedrockDepth) * 100}%`,
                      backgroundColor: layer.color,
                      opacity: selectedLayer === layer.name ? 1 : 0.7,
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: selectedLayer === layer.name ? 1 : 0.7, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedLayer(selectedLayer === layer.name ? null : layer.name)}
                    whileHover={{ opacity: 1 }}
                  >
                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white text-xs font-semibold">
                      {layer.name}
                    </div>
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white text-xs">
                      {layer.depth}-{layer.depth + layer.height}m
                    </div>
                  </motion.div>
                ))}

                {/* Water Table */}
                {waterTableDepth < bedrockDepth && (
                  <motion.div
                    className="absolute left-0 right-0 border-t-2 border-dashed border-blue-400"
                    style={{
                      top: `${(waterTableDepth / bedrockDepth) * 100}%`,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="absolute left-2 -top-3 flex items-center gap-1 text-blue-300 text-xs">
                      <Droplet className="w-3 h-3" />
                      Water Table ({waterTableDepth}m)
                    </div>
                    <div className="absolute top-2 left-0 right-0 h-full bg-blue-500/20" />
                  </motion.div>
                )}

                {/* Bridge Foundation Visualization */}
                <motion.div
                  className="absolute left-1/2 transform -translate-x-1/2"
                  style={{
                    top: '5%',
                    width: '60px',
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {/* Foundation pillars */}
                  <div className="relative">
                    <div 
                      className="absolute bg-gray-700 border-2 border-gray-500 rounded-t"
                      style={{
                        height: `${((bedrockDepth + 2) / bedrockDepth) * 100}%`,
                        width: '20px',
                        left: '0',
                      }}
                    >
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-xs text-white font-semibold">
                        Foundation
                      </div>
                    </div>
                    <div 
                      className="absolute bg-gray-700 border-2 border-gray-500 rounded-t"
                      style={{
                        height: `${((bedrockDepth + 2) / bedrockDepth) * 100}%`,
                        width: '20px',
                        right: '0',
                      }}
                    />
                    {/* Bridge deck */}
                    <div className="absolute -top-8 left-0 right-0 h-4 bg-gray-800 rounded border-2 border-gray-600" />
                  </div>
                </motion.div>

                {/* Depth markers */}
                <div className="absolute right-4 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-400">
                  {[0, 5, 10, 15, bedrockDepth].map((depth) => (
                    <div key={depth} className="flex items-center gap-2">
                      <div className="w-8 h-0.5 bg-gray-600" />
                      <span>{depth}m</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Layer Information */}
          <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold text-white mb-4">Layer Details</h3>
          <div className="space-y-3">
            {layers.map((layer) => (
              <motion.div
                key={layer.name}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedLayer === layer.name
                    ? 'bg-blue-600/20 border-blue-500'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
                onClick={() => setSelectedLayer(selectedLayer === layer.name ? null : layer.name)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: layer.color }}
                  />
                  <span className="font-semibold text-white">{layer.name}</span>
                </div>
                <div className="text-xs text-gray-400">
                  Depth: {layer.depth}-{layer.depth + layer.height}m
                </div>
                {selectedLayer === layer.name && (
                  <motion.div
                    className="mt-2 text-xs text-gray-300"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    {getLayerDescription(layer.name, terrain, geological)}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Water Table Info */}
          {waterTableDepth < bedrockDepth && (
            <motion.div
              className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Droplet className="w-4 h-4 text-blue-400" />
                <span className="font-semibold text-white">Water Table</span>
              </div>
              <div className="text-xs text-gray-300">
                Depth: {waterTableDepth}m ({geological.waterTable})
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Foundation must extend below water table to prevent instability
              </div>
            </motion.div>
          )}

          {/* Foundation Recommendation */}
          <motion.div
            className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="font-semibold text-white mb-1">Foundation Recommendation</div>
            <div className="text-xs text-gray-300">
              Minimum depth: {bedrockDepth + 2}m
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Based on bedrock depth ({bedrockDepth}m) and stability requirements
            </div>
          </motion.div>
        </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function getSoilColor(soilType: string): string {
  const colors: Record<string, string> = {
    'Rocky': '#6B6B6B',
    'Clay': '#8B6F47',
    'Sandy': '#D4A574',
    'Loamy': '#9B7D5E',
    'Mixed': '#7A6B5A',
  }
  return colors[soilType] || '#8B7355'
}

function getWaterTableDepth(waterTable: string, bedrockDepth: number): number {
  const depths: Record<string, number> = {
    'High': bedrockDepth - 2,
    'Variable': bedrockDepth - 5,
    'Low': bedrockDepth + 5,
  }
  return depths[waterTable] || bedrockDepth - 3
}

function getLayerDescription(layerName: string, terrain: any, geological: any): string {
  const descriptions: Record<string, string> = {
    'Surface Layer': 'Top layer affected by weathering and erosion. Contains organic matter.',
    'Topsoil': `Rich in organic matter. ${terrain.soilType} composition affects foundation design.`,
    'Subsoil': `Denser layer with ${terrain.soilType} characteristics. Critical for foundation bearing capacity.`,
    'Bedrock': `${geological.rockStability} rock layer. Provides stable foundation base. Recommended foundation depth extends into this layer.`,
  }
  return descriptions[layerName] || 'Geological layer with varying composition.'
}

