// Hardcoded locations data for prototype

export interface LocationData {
  id: string
  name: string
  lat: number
  lng: number
  image: string
  description: string
  terrain: {
    elevation: number
    slope: number
    terrainType: string
    landslideRisk: string
    soilType: string
  }
  earthquakes: {
    total: number
    recent: number
    maxMagnitude: number
    frequency: string
    riskLevel: string
  }
  geological: {
    seismicActivity: string
    faultLines: string
    rockStability: string
    erosionRisk: string
    waterTable: string
  }
}

export const locations: LocationData[] = [
  {
    id: 'himalayas-uttarakhand',
    name: 'Himalayas, Uttarakhand',
    lat: 30.7333,
    lng: 79.0667,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1920&q=80&auto=format&fit=crop',
    description: 'High-altitude mountainous terrain in the Himalayan region, characterized by steep slopes, snow-capped peaks, and challenging geomorphic conditions.',
    terrain: {
      elevation: 3200,
      slope: 28.5,
      terrainType: 'Mountainous',
      landslideRisk: 'Very High',
      soilType: 'Rocky',
    },
    earthquakes: {
      total: 45,
      recent: 12,
      maxMagnitude: 6.8,
      frequency: 'Moderate',
      riskLevel: 'High',
    },
    geological: {
      seismicActivity: 'High',
      faultLines: 'Active',
      rockStability: 'Unstable',
      erosionRisk: 'High',
      waterTable: 'Variable',
    },
  },
  {
    id: 'western-ghats-kerala',
    name: 'Western Ghats, Kerala',
    lat: 10.8505,
    lng: 76.2711,
    image: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=1920&q=80&auto=format&fit=crop',
    description: 'Mountainous terrain in the Western Ghats with dense vegetation, high rainfall, and challenging slope conditions.',
    terrain: {
      elevation: 1800,
      slope: 22.3,
      terrainType: 'Mountainous',
      landslideRisk: 'High',
      soilType: 'Clay',
    },
    earthquakes: {
      total: 18,
      recent: 5,
      maxMagnitude: 4.5,
      frequency: 'Low',
      riskLevel: 'Moderate',
    },
    geological: {
      seismicActivity: 'Moderate',
      faultLines: 'Dormant',
      rockStability: 'Stable',
      erosionRisk: 'Very High',
      waterTable: 'High',
    },
  },
  {
    id: 'northeast-assam',
    name: 'Northeast Region, Assam',
    lat: 26.2006,
    lng: 92.9376,
    image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1920&q=80&auto=format&fit=crop',
    description: 'Hilly terrain in Northeast India with high seismic activity, heavy monsoon rainfall, and complex geological formations.',
    terrain: {
      elevation: 850,
      slope: 18.7,
      terrainType: 'Hilly',
      landslideRisk: 'High',
      soilType: 'Mixed',
    },
    earthquakes: {
      total: 67,
      recent: 23,
      maxMagnitude: 7.2,
      frequency: 'High',
      riskLevel: 'Very High',
    },
    geological: {
      seismicActivity: 'Very High',
      faultLines: 'Active',
      rockStability: 'Unstable',
      erosionRisk: 'High',
      waterTable: 'Variable',
    },
  },
]

export function getLocationById(id: string): LocationData | undefined {
  return locations.find(loc => loc.id === id)
}

export function getLocationByCoordinates(lat: number, lng: number, tolerance: number = 0.5): LocationData | undefined {
  return locations.find(loc => 
    Math.abs(loc.lat - lat) < tolerance && Math.abs(loc.lng - lng) < tolerance
  )
}

