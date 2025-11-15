'use client'

import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Text } from '@react-three/drei'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, RotateCcw, Pause } from 'lucide-react'

interface Bridge3DPreviewProps {
  bridgeType: string
  terrain: {
    elevation: number
    slope: number
    terrainType: string
  }
  onClose: () => void
}

export default function Bridge3DPreview({ bridgeType, terrain, onClose }: Bridge3DPreviewProps) {
  const [constructionStage, setConstructionStage] = useState<'foundation' | 'piers' | 'deck' | 'complete'>('foundation')
  const [isAnimating, setIsAnimating] = useState(false)
  const [progress, setProgress] = useState(0)
  const animationRef = useRef<NodeJS.Timeout[]>([])

  const startConstructionAnimation = () => {
    setIsAnimating(true)
    setProgress(0)
    setConstructionStage('foundation')
    
    // Clear any existing timeouts
    animationRef.current.forEach(clearTimeout)
    animationRef.current = []
    
    // Foundation stage
    const t1 = setTimeout(() => {
      setConstructionStage('piers')
      setProgress(33)
    }, 3000)
    animationRef.current.push(t1)
    
    // Piers stage
    const t2 = setTimeout(() => {
      setConstructionStage('deck')
      setProgress(66)
    }, 6000)
    animationRef.current.push(t2)
    
    // Complete stage
    const t3 = setTimeout(() => {
      setConstructionStage('complete')
      setProgress(100)
      setIsAnimating(false)
    }, 9000)
    animationRef.current.push(t3)
  }

  const resetAnimation = () => {
    animationRef.current.forEach(clearTimeout)
    animationRef.current = []
    setIsAnimating(false)
    setConstructionStage('foundation')
    setProgress(0)
  }

  useEffect(() => {
    return () => {
      animationRef.current.forEach(clearTimeout)
    }
  }, [])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-6xl h-[80vh] border border-white/20"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/60 to-transparent rounded-t-2xl flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">{bridgeType} - 3D Preview</h2>
              <p className="text-sm text-gray-300">
                Terrain: {terrain.terrainType} | Elevation: {terrain.elevation}m | Slope: {terrain.slope}°
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={resetAnimation}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                title="Reset"
              >
                <RotateCcw className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={onClose}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* 3D Canvas */}
          <div className="w-full h-full">
            <Canvas shadows camera={{ position: [0, 8, 20], fov: 45 }}>
              <ambientLight intensity={0.7} />
              <directionalLight position={[10, 15, 10]} intensity={1.5} castShadow />
              <directionalLight position={[-10, 8, -5]} intensity={0.5} />
              <pointLight position={[0, 15, 0]} intensity={0.4} />
              <hemisphereLight args={['#87CEEB', '#8B7355', 0.5]} />
              
              <Grid />
              <Terrain elevation={terrain.elevation} slope={terrain.slope} />
              <BridgeModel 
                bridgeType={bridgeType} 
                constructionStage={constructionStage}
                terrain={terrain}
              />
              <StageLabel stage={constructionStage} />
              
              <OrbitControls
                enableZoom={true}
                enablePan={true}
                minDistance={8}
                maxDistance={40}
                autoRotate={!isAnimating}
                autoRotateSpeed={0.3}
                enableDamping={true}
                dampingFactor={0.05}
              />
            </Canvas>
          </div>

          {/* Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-2xl">
            <div className="flex items-center justify-center gap-4 mb-4">
              <button
                onClick={startConstructionAnimation}
                disabled={isAnimating}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg flex items-center gap-2 transition-colors font-semibold"
              >
                {isAnimating ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                <span>{isAnimating ? 'Animation Running...' : 'Play Construction Animation'}</span>
              </button>
              <button
                onClick={resetAnimation}
                className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg flex items-center gap-2 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Reset</span>
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-3">
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-green-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
            
            {/* Stage Info */}
            <div className="text-center">
              <div className="text-lg font-bold text-white mb-1 capitalize">
                {constructionStage === 'foundation' && '🏗️ Foundation Construction'}
                {constructionStage === 'piers' && '🏛️ Building Piers/Towers'}
                {constructionStage === 'deck' && '🛣️ Installing Deck'}
                {constructionStage === 'complete' && '✅ Bridge Complete'}
              </div>
              <div className="text-sm text-gray-300">
                {constructionStage === 'foundation' && 'Excavating and pouring foundation bases'}
                {constructionStage === 'piers' && 'Erecting support structures'}
                {constructionStage === 'deck' && 'Placing bridge deck and road surface'}
                {constructionStage === 'complete' && 'Final structure ready for use'}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function Grid() {
  return (
    <gridHelper args={[30, 30, '#666666', '#333333']} position={[0, 0, 0]} />
  )
}

function Terrain({ elevation, slope }: { elevation: number; slope: number }) {
  const terrainRef = useRef<THREE.Mesh>(null)
  
  // Create terrain geometry based on elevation and slope
  const terrainHeight = elevation / 800 // Scale down for visualization
  const slopeRad = (slope * Math.PI) / 180

  return (
    <group>
      <mesh ref={terrainRef} rotation={[-slopeRad, 0, 0]} position={[0, -terrainHeight, 0]} receiveShadow>
        <planeGeometry args={[25, 25, 64, 64]} />
        <meshStandardMaterial 
          color="#5a8a6a" 
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      {/* Valley/terrain depth visualization */}
      <mesh position={[0, -terrainHeight - 0.1, 0]} rotation={[-slopeRad, 0, 0]}>
        <planeGeometry args={[25, 25]} />
        <meshStandardMaterial color="#3a5a4a" side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function StageLabel({ stage }: { stage: string }) {
  const stageText = {
    foundation: 'FOUNDATION',
    piers: 'PIERS & TOWERS',
    deck: 'DECK INSTALLATION',
    complete: 'COMPLETE'
  }[stage] || ''

  return (
    <Text
      position={[0, 6, 0]}
      fontSize={1.5}
      color="#ffffff"
      anchorX="center"
      anchorY="middle"
      outlineWidth={0.1}
      outlineColor="#000000"
    >
      {stageText}
    </Text>
  )
}

function BridgeModel({ 
  bridgeType, 
  constructionStage,
  terrain 
}: { 
  bridgeType: string
  constructionStage: string
  terrain: any
}) {
  const bridgeRef = useRef<THREE.Group>(null)
  const foundationRef = useRef<THREE.Group>(null)
  const piersRef = useRef<THREE.Group>(null)
  const deckRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (bridgeRef.current && constructionStage === 'complete') {
      bridgeRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.05) * 0.05
    }
  })

  const showFoundation = ['foundation', 'piers', 'deck', 'complete'].includes(constructionStage)
  const showPiers = ['piers', 'deck', 'complete'].includes(constructionStage)
  const showDeck = ['deck', 'complete'].includes(constructionStage)
  const showCables = constructionStage === 'complete' && (bridgeType.includes('Suspension') || bridgeType.includes('Cable'))

  const baseY = -terrain.elevation / 800
  const foundationDepth = 2

  return (
    <group ref={bridgeRef} position={[0, 0, 0]}>
      {/* Foundation - Larger and more visible */}
      {showFoundation && (
        <group ref={foundationRef}>
          <AnimatedMesh
            position={[-4, baseY + foundationDepth / 2, 0]}
            scale={constructionStage === 'foundation' ? [1, 1, 1] : [1, 1, 1]}
          >
            <boxGeometry args={[2, foundationDepth, 2]} />
            <meshStandardMaterial 
              color="#8B4513" 
              roughness={0.9}
              metalness={0.1}
            />
          </AnimatedMesh>
          <AnimatedMesh
            position={[4, baseY + foundationDepth / 2, 0]}
            scale={constructionStage === 'foundation' ? [1, 1, 1] : [1, 1, 1]}
          >
            <boxGeometry args={[2, foundationDepth, 2]} />
            <meshStandardMaterial 
              color="#8B4513" 
              roughness={0.9}
              metalness={0.1}
            />
          </AnimatedMesh>
          {/* Foundation labels */}
          {constructionStage === 'foundation' && (
            <>
              <Text position={[-4, baseY + foundationDepth + 0.5, 0]} fontSize={0.5} color="#ffaa00" anchorX="center">
                Foundation
              </Text>
              <Text position={[4, baseY + foundationDepth + 0.5, 0]} fontSize={0.5} color="#ffaa00" anchorX="center">
                Foundation
              </Text>
            </>
          )}
        </group>
      )}

      {/* Piers/Towers - Much larger and more detailed */}
      {showPiers && (
        <group ref={piersRef}>
          {bridgeType.includes('Suspension') || bridgeType.includes('Cable') ? (
            // Suspension/Cable-Stayed: Tall Towers
            <>
              <AnimatedMesh position={[-4, baseY + foundationDepth + 3, 0]} castShadow>
                <boxGeometry args={[0.8, 6, 0.8]} />
                <meshStandardMaterial color="#708090" metalness={0.3} roughness={0.4} />
              </AnimatedMesh>
              <AnimatedMesh position={[4, baseY + foundationDepth + 3, 0]} castShadow>
                <boxGeometry args={[0.8, 6, 0.8]} />
                <meshStandardMaterial color="#708090" metalness={0.3} roughness={0.4} />
              </AnimatedMesh>
              {constructionStage === 'piers' && (
                <>
                  <Text position={[-4, baseY + foundationDepth + 6.5, 0]} fontSize={0.6} color="#00ff00" anchorX="center">
                    Tower
                  </Text>
                  <Text position={[4, baseY + foundationDepth + 6.5, 0]} fontSize={0.6} color="#00ff00" anchorX="center">
                    Tower
                  </Text>
                </>
              )}
            </>
          ) : bridgeType.includes('Arch') ? (
            // Arch Bridge - Larger arch
            <AnimatedMesh position={[0, baseY + foundationDepth + 2, 0]} castShadow>
              <torusGeometry args={[4, 0.4, 16, 64]} />
              <meshStandardMaterial color="#708090" metalness={0.2} roughness={0.5} />
            </AnimatedMesh>
          ) : (
            // Beam/Truss: Multiple piers
            <>
              <AnimatedMesh position={[-3, baseY + foundationDepth + 1.5, 0]} castShadow>
                <cylinderGeometry args={[0.4, 0.4, 3, 16]} />
                <meshStandardMaterial color="#708090" metalness={0.2} roughness={0.5} />
              </AnimatedMesh>
              <AnimatedMesh position={[0, baseY + foundationDepth + 1.5, 0]} castShadow>
                <cylinderGeometry args={[0.4, 0.4, 3, 16]} />
                <meshStandardMaterial color="#708090" metalness={0.2} roughness={0.5} />
              </AnimatedMesh>
              <AnimatedMesh position={[3, baseY + foundationDepth + 1.5, 0]} castShadow>
                <cylinderGeometry args={[0.4, 0.4, 3, 16]} />
                <meshStandardMaterial color="#708090" metalness={0.2} roughness={0.5} />
              </AnimatedMesh>
            </>
          )}
        </group>
      )}

      {/* Deck - Much wider and more visible */}
      {showDeck && (
        <AnimatedMesh
          ref={deckRef}
          position={[0, bridgeType.includes('Arch') ? baseY + foundationDepth + 2.2 : baseY + foundationDepth + 3.2, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[8, 0.3, 1.5]} />
          <meshStandardMaterial 
            color="#2a2a2a" 
            roughness={0.7}
            metalness={0.1}
          />
        </AnimatedMesh>
      )}

      {/* Cables (Suspension/Cable-Stayed) - More visible */}
      {showCables && (
        <group>
          {/* Main suspension cables */}
          <mesh position={[-4, baseY + foundationDepth + 6, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 8, 16]} />
            <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Suspender cables - More visible */}
          {Array.from({ length: 12 }).map((_, i) => {
            const x = -4 + (i * 8) / 11
            const y = baseY + foundationDepth + 6 - (i * 2.8) / 11
            return (
              <mesh key={i} position={[x, y, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
                <meshStandardMaterial color="#e0e0e0" metalness={0.7} roughness={0.3} />
              </mesh>
            )
          })}
        </group>
      )}
    </group>
  )
}

// Animated mesh component for smooth transitions
function AnimatedMesh({ children, position, scale = [1, 1, 1], ...props }: any) {
  const meshRef = useRef<THREE.Mesh>(null)
  const targetScale = Array.isArray(scale) ? new THREE.Vector3(...scale) : new THREE.Vector3(scale, scale, scale)
  const currentScale = useRef(new THREE.Vector3(0, 0, 0))

  useFrame(() => {
    if (meshRef.current) {
      currentScale.current.lerp(targetScale, 0.1)
      meshRef.current.scale.copy(currentScale.current)
    }
  })

  useEffect(() => {
    if (meshRef.current) {
      currentScale.current.set(0, 0, 0)
    }
  }, [scale])

  return (
    <mesh ref={meshRef} position={position} {...props}>
      {children}
    </mesh>
  )
}

