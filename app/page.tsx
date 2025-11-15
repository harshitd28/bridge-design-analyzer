'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { AnimatePresence } from 'framer-motion'
import LoadingAnimation from '@/components/LoadingAnimation'
import SearchPanel from '@/components/SearchPanel'
import DataPanel from '@/components/DataPanel'
import BridgeSuggestions from '@/components/BridgeSuggestions'
import LocationVisuals from '@/components/LocationVisuals'
import ViewSiteButton from '@/components/ViewSiteButton'
import SiteView from '@/components/SiteView'
import { getLocationByCoordinates, locations } from '@/data/locations'

const Globe = dynamic(() => import('@/components/Globe'), { ssr: false })

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number
    lng: number
    name?: string
  } | null>(null)
  const [locationData, setLocationData] = useState<any>(null)
  const [showSiteView, setShowSiteView] = useState(false)
  const [hardcodedLocation, setHardcodedLocation] = useState<any>(null)

  useEffect(() => {
    // Reduced loading time for better UX
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500) // Reduced from 3000ms to 1500ms
    return () => clearTimeout(timer)
  }, [])

  const handleLocationSelect = async (location: { lat: number; lng: number; name?: string }) => {
    // Check if it's one of our hardcoded locations
    const hardcodedLoc = getLocationByCoordinates(location.lat, location.lng, 0.5)
    
    if (hardcodedLoc) {
      // Use hardcoded data with image URL
      setSelectedLocation({ ...location, name: hardcodedLoc.name, imageUrl: hardcodedLoc.image } as any)
      setHardcodedLocation(hardcodedLoc)
      setLocationData({
        coordinates: { lat: hardcodedLoc.lat, lng: hardcodedLoc.lng },
        earthquakes: hardcodedLoc.earthquakes,
        terrain: hardcodedLoc.terrain,
        geological: hardcodedLoc.geological,
      })
    } else {
      // Fetch location data for other locations
      setSelectedLocation(location)
      setHardcodedLocation(null)
      const data = await fetchLocationData(location.lat, location.lng)
      setLocationData(data)
    }
  }

  const handleViewSite = () => {
    if (locationData && selectedLocation) {
      setShowSiteView(true)
    }
  }

  if (loading) {
    return <LoadingAnimation />
  }

  return (
    <main className="relative w-full h-screen overflow-hidden">
      <Globe selectedLocation={selectedLocation} onLocationSelect={handleLocationSelect} />
      
      {!selectedLocation ? (
        <div className="absolute top-0 left-0 right-0 z-10 p-3 md:p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-1 md:mb-2 drop-shadow-lg">
              Bridge Design Analyzer
            </h1>
            <p className="text-blue-200 text-xs sm:text-sm md:text-base lg:text-lg">
              Geomorphic Analysis for Hilly Terrain Bridge Structures
            </p>
          </div>
        </div>
      ) : (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 flex items-center gap-4">
          <button
            onClick={() => {
              setSelectedLocation(null)
              setLocationData(null)
              setHardcodedLocation(null)
              setShowSiteView(false)
            }}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20 transition-all flex items-center gap-2 text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden md:inline">Back</span>
          </button>
          <div className="bg-white/10 backdrop-blur-xl px-6 py-3 rounded-full border border-white/20">
            <h2 className="text-xl md:text-2xl font-bold text-white">
              {selectedLocation.name || 'Selected Location'}
            </h2>
          </div>
        </div>
      )}

      <SearchPanel onLocationSelect={handleLocationSelect} />
      
      {/* Quick location buttons for prototype - only show when no location selected */}
      {!selectedLocation && (
        <div className="absolute top-24 md:top-32 left-4 md:left-6 z-20 flex flex-col gap-2">
          <p className="text-white/90 text-xs mb-2 font-semibold drop-shadow-lg">Quick Locations:</p>
          {locations.map((loc) => (
            <button
              key={loc.id}
              onClick={() => handleLocationSelect({ lat: loc.lat, lng: loc.lng, name: loc.name })}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white px-4 py-2 rounded-lg text-sm transition-all border border-white/20 hover:border-white/30 shadow-lg"
            >
              {loc.name}
            </button>
          ))}
        </div>
      )}

      {locationData && (
        <>
          <LocationVisuals location={selectedLocation} data={locationData} />
          <DataPanel data={locationData} location={selectedLocation} />
          <BridgeSuggestions data={locationData} />
          <ViewSiteButton 
            location={selectedLocation} 
            onViewSite={handleViewSite}
          />
        </>
      )}

      {showSiteView && locationData && selectedLocation && (
        <AnimatePresence mode="wait">
          <SiteView 
            key={`${selectedLocation.lat}-${selectedLocation.lng}`}
            locationData={hardcodedLocation || {
              id: `location-${selectedLocation.lat}-${selectedLocation.lng}`,
              name: selectedLocation.name || 'Selected Location',
              lat: selectedLocation.lat,
              lng: selectedLocation.lng,
              image: hardcodedLocation?.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80&auto=format&fit=crop',
              description: `Geomorphic analysis for ${selectedLocation.name || 'the selected location'} showing terrain characteristics, seismic activity, and geological factors affecting bridge design.`,
              terrain: locationData.terrain,
              earthquakes: locationData.earthquakes,
              geological: locationData.geological,
            }}
            onClose={() => setShowSiteView(false)}
          />
        </AnimatePresence>
      )}
    </main>
  )
}

async function fetchLocationData(lat: number, lng: number) {
  // Fetch earthquake data from USGS
  const earthquakeData = await fetchEarthquakeData(lat, lng)
  
  // Calculate terrain data
  const terrainData = calculateTerrainData(lat, lng)
  
  // Get geological factors
  const geologicalFactors = getGeologicalFactors(lat, lng, earthquakeData)
  
  return {
    coordinates: { lat, lng },
    earthquakes: earthquakeData,
    terrain: terrainData,
    geological: geologicalFactors,
  }
}

async function fetchEarthquakeData(lat: number, lng: number) {
  try {
    // USGS API for earthquake data
    const response = await fetch(
      `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&latitude=${lat}&longitude=${lng}&maxradiuskm=500&limit=100&minmagnitude=3.0`
    )
    const data = await response.json()
    
    const earthquakes = data.features || []
    const recentEarthquakes = earthquakes.filter((eq: any) => {
      const date = new Date(eq.properties.time)
      const now = new Date()
      const daysDiff = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
      return daysDiff <= 365 // Last year
    })
    
    const magnitudes = earthquakes.map((eq: any) => eq.properties.mag || 0).filter((mag: number) => mag > 0)
    
    return {
      total: earthquakes.length,
      recent: recentEarthquakes.length,
      maxMagnitude: magnitudes.length > 0 ? Math.max(...magnitudes) : 0,
      frequency: calculateFrequency(recentEarthquakes),
      riskLevel: calculateSeismicRisk(recentEarthquakes),
    }
  } catch (error) {
    console.error('Error fetching earthquake data:', error)
    return {
      total: 0,
      recent: 0,
      maxMagnitude: 0,
      frequency: 'Low',
      riskLevel: 'Low',
    }
  }
}

function calculateFrequency(earthquakes: any[]) {
  if (earthquakes.length === 0) return 'None'
  if (earthquakes.length < 5) return 'Low'
  if (earthquakes.length < 20) return 'Moderate'
  if (earthquakes.length < 50) return 'High'
  return 'Very High'
}

function calculateSeismicRisk(earthquakes: any[]) {
  const avgMagnitude = earthquakes.reduce((sum, eq) => sum + (eq.properties.mag || 0), 0) / earthquakes.length || 0
  if (avgMagnitude === 0) return 'Low'
  if (avgMagnitude < 4.0) return 'Low'
  if (avgMagnitude < 5.5) return 'Moderate'
  if (avgMagnitude < 7.0) return 'High'
  return 'Very High'
}

function calculateTerrainData(lat: number, lng: number) {
  // Generate realistic terrain data based on actual Indian geography
  const seed = Math.abs(lat * 1000 + lng * 1000)
  const random1 = (seed % 1000) / 1000
  const random2 = ((seed * 7) % 1000) / 1000
  const random3 = ((seed * 13) % 1000) / 1000
  const random4 = ((seed * 17) % 1000) / 1000
  
  // Define Indian regions accurately
  const isHimalayan = lat > 25 && lat < 35 && lng > 75 && lng < 95
  const isWesternGhats = lat > 8 && lat < 15 && lng > 73 && lng < 78
  const isNortheast = lat > 22 && lat < 28 && lng > 90 && lng < 97
  const isCentralIndia = lat > 20 && lat < 26 && lng > 74 && lng < 82 // Madhya Pradesh - mostly plateau/plains
  const isNorthernPlains = lat > 24 && lat < 32 && lng > 74 && lng < 88
  const isDeccanPlateau = lat > 15 && lat < 20 && lng > 73 && lng < 80
  const isGangeticPlains = lat > 24 && lat < 30 && lng > 77 && lng < 88
  const isRajasthan = lat > 24 && lat < 30 && lng > 69 && lng < 78
  
  let elevation: number
  let slope: number
  let terrainType: string
  
  if (isHimalayan) {
    // Himalayas: High altitude mountainous
    elevation = 2000 + random1 * 3000
    slope = 20 + random2 * 20
    terrainType = 'Mountainous'
  } else if (isWesternGhats) {
    // Western Ghats: Mountainous with high elevation
    elevation = 800 + random1 * 2000
    slope = 15 + random2 * 20
    terrainType = 'Mountainous'
  } else if (isNortheast) {
    // Northeast: Hilly to mountainous
    elevation = 500 + random1 * 1500
    slope = 12 + random2 * 18
    terrainType = random3 > 0.4 ? 'Mountainous' : 'Hilly'
  } else if (isCentralIndia) {
    // Madhya Pradesh: Plateau region, mostly plains with some hills
    elevation = 300 + random1 * 700 // MP elevation: 300-1000m
    slope = 2 + random2 * 8 // Mostly gentle slopes
    terrainType = random3 > 0.7 ? 'Hilly' : 'Plains' // Mostly plains/plateau
  } else if (isNorthernPlains || isGangeticPlains) {
    // Northern/Gangetic Plains: Flat plains
    elevation = 100 + random1 * 300
    slope = 0 + random2 * 5
    terrainType = 'Plains'
  } else if (isDeccanPlateau) {
    // Deccan Plateau: Elevated plateau
    elevation = 500 + random1 * 800
    slope = 3 + random2 * 10
    terrainType = random3 > 0.6 ? 'Hilly' : 'Plains'
  } else if (isRajasthan) {
    // Rajasthan: Desert and plains
    elevation = 200 + random1 * 400
    slope = 0 + random2 * 5
    terrainType = 'Plains'
  } else {
    // Default: Mostly plains with some variation
    elevation = 100 + random1 * 600
    slope = 0 + random2 * 10
    terrainType = random3 > 0.6 ? 'Hilly' : 'Plains'
  }

  return {
    elevation: Math.round(elevation),
    slope: Math.round(slope * 10) / 10,
    terrainType,
    landslideRisk: calculateLandslideRisk(elevation, slope),
    soilType: getSoilType(lat, lng, random4),
  }
}

function calculateLandslideRisk(elevation: number, slope: number) {
  let risk = 'Low'
  if (elevation > 1000 && slope > 25) risk = 'Very High'
  else if (elevation > 500 && slope > 20) risk = 'High'
  else if (elevation > 300 && slope > 15) risk = 'Moderate'
  return risk
}

function getSoilType(lat: number, lng: number, random?: number) {
  // Generate realistic soil type based on actual Indian geography
  const seed = Math.abs(lat * 100 + lng * 100)
  const rand = random !== undefined ? random : (seed % 1000) / 1000
  
  // Define Indian regions with accurate soil types
  const isHimalayan = lat > 25 && lat < 35 && lng > 75 && lng < 95
  const isWesternGhats = lat > 8 && lat < 15 && lng > 73 && lng < 78
  const isNortheast = lat > 22 && lat < 28 && lng > 90 && lng < 97
  const isCentralIndia = lat > 20 && lat < 26 && lng > 74 && lng < 82 // Madhya Pradesh, Chhattisgarh
  const isNorthernPlains = lat > 24 && lat < 32 && lng > 74 && lng < 88 // Punjab, Haryana, UP, Bihar
  const isDeccanPlateau = lat > 15 && lat < 20 && lng > 73 && lng < 80 // Maharashtra, Karnataka
  const isCoastal = (lat > 8 && lat < 15 && lng > 73 && lng < 78) || // West Coast
                    (lat > 8 && lat < 20 && lng > 77 && lng < 85) || // East Coast
                    (lat > 15 && lat < 20 && lng > 72 && lng < 73)   // Konkan Coast
  const isGangeticPlains = lat > 24 && lat < 30 && lng > 77 && lng < 88
  const isRajasthan = lat > 24 && lat < 30 && lng > 69 && lng < 78
  
  if (isHimalayan) {
    // Himalayan region: Rocky, mixed, clay
    return rand > 0.6 ? 'Rocky' : rand > 0.3 ? 'Mixed' : 'Clay'
  } else if (isWesternGhats) {
    // Western Ghats: Laterite, red soil, clay
    return rand > 0.5 ? 'Clay' : rand > 0.25 ? 'Loamy' : 'Mixed'
  } else if (isNortheast) {
    // Northeast: Alluvial, loamy, mixed
    return rand > 0.4 ? 'Loamy' : rand > 0.2 ? 'Mixed' : 'Clay'
  } else if (isCentralIndia) {
    // Madhya Pradesh, Chhattisgarh: Black soil (regur), red soil, alluvial in valleys
    // Madhya Pradesh is known for black cotton soil, not rocky
    return rand > 0.6 ? 'Clay' : rand > 0.3 ? 'Loamy' : 'Mixed' // Black soil falls under Clay/Loamy
  } else if (isNorthernPlains || isGangeticPlains) {
    // Northern/Gangetic Plains: Alluvial soil
    return rand > 0.5 ? 'Loamy' : 'Mixed' // Alluvial is loamy/mixed
  } else if (isDeccanPlateau) {
    // Deccan Plateau: Black soil, red soil
    return rand > 0.5 ? 'Clay' : 'Loamy'
  } else if (isCoastal) {
    // Coastal regions: Alluvial, sandy
    return rand > 0.6 ? 'Sandy' : rand > 0.3 ? 'Loamy' : 'Mixed'
  } else if (isRajasthan) {
    // Rajasthan: Sandy, desert soil
    return rand > 0.7 ? 'Sandy' : rand > 0.4 ? 'Mixed' : 'Loamy'
  } else {
    // Default: Most of India has alluvial, black, or red soil
    return rand > 0.5 ? 'Loamy' : rand > 0.25 ? 'Clay' : 'Mixed'
  }
}

function getGeologicalFactors(lat: number, lng: number, earthquakeData: any) {
  // Generate unique geological factors based on location and earthquake data
  const seed = Math.abs(lat * 1000 + lng * 1000)
  const random1 = (seed % 1000) / 1000
  const random2 = ((seed * 11) % 1000) / 1000
  
  const isHimalayan = lat > 25 && lat < 35 && lng > 75 && lng < 95
  const isNortheast = lat > 22 && lat < 28 && lng > 90 && lng < 97
  
  let faultLines: string
  let rockStability: string
  let erosionRisk: string
  let waterTable: string
  
  if (isHimalayan) {
    faultLines = earthquakeData.recent > 8 ? 'Active' : 'Moderately Active'
    rockStability = earthquakeData.maxMagnitude > 6.5 ? 'Unstable' : random1 > 0.5 ? 'Moderately Stable' : 'Stable'
    erosionRisk = random2 > 0.6 ? 'High' : random2 > 0.3 ? 'Moderate' : 'Low'
    waterTable = random1 > 0.5 ? 'Variable' : 'Low'
  } else if (isNortheast) {
    faultLines = earthquakeData.recent > 15 ? 'Very Active' : 'Active'
    rockStability = earthquakeData.maxMagnitude > 7 ? 'Unstable' : 'Moderately Stable'
    erosionRisk = 'High'
    waterTable = random1 > 0.6 ? 'High' : 'Variable'
  } else {
    faultLines = earthquakeData.recent > 10 ? 'Active' : earthquakeData.recent > 5 ? 'Moderately Active' : 'Dormant'
    rockStability = earthquakeData.maxMagnitude > 6 ? 'Unstable' : earthquakeData.maxMagnitude > 4.5 ? 'Moderately Stable' : 'Stable'
    erosionRisk = random2 > 0.5 ? 'Moderate' : 'Low'
    waterTable = random1 > 0.5 ? 'Variable' : random1 > 0.25 ? 'High' : 'Low'
  }
  
  return {
    seismicActivity: earthquakeData.riskLevel,
    faultLines,
    rockStability,
    erosionRisk,
    waterTable,
  }
}

