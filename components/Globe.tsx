'use client'

import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, Stars, useTexture } from '@react-three/drei'
import * as THREE from 'three'

interface GlobeProps {
  selectedLocation: { lat: number; lng: number; name?: string } | null
  onLocationSelect: (location: { lat: number; lng: number; name?: string }) => void
}

function GlobeScene({ selectedLocation, onLocationSelect }: GlobeProps) {
  const globeRef = useRef<THREE.Mesh>(null)
  const controlsRef = useRef<any>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  
  // Load high-quality Earth textures - using NASA Blue Marble
  const [earthTexture, bumpMap, specularMap] = useTexture([
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg',
  ])
  
  // Enhance texture quality
  useEffect(() => {
    if (earthTexture) {
      earthTexture.anisotropy = 16
      earthTexture.minFilter = THREE.LinearMipmapLinearFilter
      earthTexture.magFilter = THREE.LinearFilter
    }
    if (bumpMap) {
      bumpMap.anisotropy = 16
    }
    if (specularMap) {
      specularMap.anisotropy = 16
    }
  }, [earthTexture, bumpMap, specularMap])

  useEffect(() => {
    if (selectedLocation && controlsRef.current) {
      setIsAnimating(true)
      
      // Convert lat/lng to spherical coordinates
      const phi = (90 - selectedLocation.lat) * (Math.PI / 180)
      const theta = (selectedLocation.lng + 180) * (Math.PI / 180)
      
      // Calculate target camera position - minimal zoom
      const radius = 2.5
      const targetX = radius * Math.sin(phi) * Math.cos(theta)
      const targetY = radius * Math.cos(phi)
      const targetZ = radius * Math.sin(phi) * Math.sin(theta)
      
      // Animate camera to location
      const startTime = Date.now()
      const duration = 2000
      
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easeProgress = 1 - Math.pow(1 - progress, 3)
        
        if (controlsRef.current) {
          const controls = controlsRef.current
          
          // Smoothly move camera
          const newX = THREE.MathUtils.lerp(0, targetX, easeProgress)
          const newY = THREE.MathUtils.lerp(0, targetY, easeProgress)
          const newZ = THREE.MathUtils.lerp(3, targetZ, easeProgress)
          
          // Update camera position through controls
          if (controls.object) {
            controls.object.position.set(newX, newY, newZ)
            controls.update()
          }
        }
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          // Zoom in slightly - minimal zoom
          const zoomStart = Date.now()
          const zoomDuration = 1000
          const finalRadius = 2.0
          const finalX = finalRadius * Math.sin(phi) * Math.cos(theta)
          const finalY = finalRadius * Math.cos(phi)
          const finalZ = finalRadius * Math.sin(phi) * Math.sin(theta)
          
          const zoomAnimate = () => {
            const zoomElapsed = Date.now() - zoomStart
            const zoomProgress = Math.min(zoomElapsed / zoomDuration, 1)
            const zoomEase = 1 - Math.pow(1 - zoomProgress, 3)
            
            if (controlsRef.current && controlsRef.current.object) {
              const currentPos = controlsRef.current.object.position
              const newX = THREE.MathUtils.lerp(currentPos.x, finalX, zoomEase)
              const newY = THREE.MathUtils.lerp(currentPos.y, finalY, zoomEase)
              const newZ = THREE.MathUtils.lerp(currentPos.z, finalZ, zoomEase)
              
              controlsRef.current.object.position.set(newX, newY, newZ)
              controlsRef.current.update()
            }
            
            if (zoomProgress < 1) {
              requestAnimationFrame(zoomAnimate)
            } else {
              setIsAnimating(false)
            }
          }
          requestAnimationFrame(zoomAnimate)
        }
      }
      requestAnimationFrame(animate)
    } else {
      setIsAnimating(false)
    }
  }, [selectedLocation])

  useFrame((state) => {
    // Stop rotation when location is selected
    if (globeRef.current && !isAnimating && !selectedLocation) {
      globeRef.current.rotation.y += 0.002
    }
  })

  const handleGlobeClick = (event: any) => {
    if (event.distance < 2) {
      const point = event.point
      const radius = Math.sqrt(point.x ** 2 + point.y ** 2 + point.z ** 2)
      const lat = 90 - (Math.acos(point.y / radius) * 180) / Math.PI
      const lng = ((Math.atan2(point.x, point.z) * 180) / Math.PI + 180) % 360 - 180
      onLocationSelect({ lat, lng })
    }
  }

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      <pointLight position={[-5, -5, -5]} intensity={0.6} color="#4a90e2" />
      <Stars radius={300} depth={60} count={1000} factor={4} fade speed={0.5} /> {/* Reduced stars for better performance */}
      
      {/* Enhanced atmosphere glow */}
      <Sphere args={[1.015, 32, 32]}> {/* Reduced resolution for performance */}
        <meshStandardMaterial
          color="#4a90e2"
          transparent
          opacity={0.2}
          side={THREE.BackSide}
        />
      </Sphere>
      
      <Sphere
        ref={globeRef}
        args={[1, 64, 64]} // Optimized resolution for better performance
        onClick={handleGlobeClick}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default'
        }}
      >
        <meshPhongMaterial
          map={earthTexture}
          bumpMap={bumpMap}
          bumpScale={0.15}
          specularMap={specularMap}
          shininess={20}
          emissive={new THREE.Color(0x000000)}
          emissiveIntensity={0}
        />
      </Sphere>
      
      {selectedLocation && (
        <Marker
          lat={selectedLocation.lat}
          lng={selectedLocation.lng}
        />
      )}
      
      <OrbitControls
        ref={controlsRef}
        enableZoom={true}
        enablePan={false}
        autoRotate={false}
        autoRotateSpeed={0.5}
        minDistance={1.8}
        maxDistance={5}
        dampingFactor={0.05}
        enableDamping={true}
      />
    </>
  )
}

function Marker({ lat, lng }: { lat: number; lng: number }) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  const radius = 1.01
  
  const x = radius * Math.sin(phi) * Math.cos(theta)
  const y = radius * Math.cos(phi)
  const z = radius * Math.sin(phi) * Math.sin(theta)

  return (
    <group position={[x, y, z]}>
      {/* Small, clean marker */}
      <mesh>
        <sphereGeometry args={[0.012, 16, 16]} />
        <meshStandardMaterial 
          color="#3b82f6" 
          emissive="#3b82f6" 
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  )
}


export default function GlobeComponent({ selectedLocation, onLocationSelect }: GlobeProps) {
  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
        <GlobeScene selectedLocation={selectedLocation} onLocationSelect={onLocationSelect} />
      </Canvas>
    </div>
  )
}
