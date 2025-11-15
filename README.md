# GeoBridge AI - Geomorphic Analysis

An AI-powered IT-based tool to redesign bridge structures based on geomorphic conditions, especially for hilly areas.

## Features

- **3D Interactive Globe**: Beautiful HD UI with animated terrain loading and interactive globe visualization
- **Location Search**: Search by location name or enter latitude/longitude coordinates
- **Geological Data Analysis**: 
  - Earthquake frequency and seismic risk assessment
  - Landslide risk evaluation
  - Terrain characteristics (elevation, slope, soil type)
  - Geological factors (fault lines, rock stability, erosion risk)
- **Bridge Design Suggestions**: AI-powered recommendations with suitability scores and detailed reasoning

## Technology Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Three.js / React Three Fiber** - 3D graphics
- **react-globe.gl** - Interactive globe
- **Framer Motion** - Animations
- **Tailwind CSS** - Styling
- **USGS API** - Earthquake data
- **OpenStreetMap Nominatim** - Geocoding

## Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Wait for the loading animation to complete (mountains → terrain → globe)
2. Click "Search Location" button
3. Enter a location name (e.g., "Himalayas, Nepal") or coordinates
4. The globe will zoom to the location with smooth animation
5. View the geological data analysis
6. Review bridge design suggestions with suitability scores
7. Click on any bridge design to see detailed reasoning

## Bridge Design Factors Considered

- **Seismic Activity**: Earthquake frequency, magnitude, and risk level
- **Terrain**: Elevation, slope, terrain type
- **Landslide Risk**: Based on elevation and slope
- **Geological Factors**: Fault lines, rock stability, erosion risk, water table
- **Soil Type**: Rocky, clay, sandy, loamy, or mixed

## Bridge Types Supported

1. **Suspension Bridge** - For long spans and high elevations
2. **Arch Bridge** - For stable rocky terrain
3. **Cable-Stayed Bridge** - Modern design with good seismic resistance
4. **Beam Bridge** - Cost-effective for low-risk areas
5. **Truss Bridge** - Strong and efficient for moderate conditions

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page component
│   └── globals.css         # Global styles
├── components/
│   ├── LoadingAnimation.tsx    # Mountain loading animation
│   ├── Globe.tsx              # 3D globe component
│   ├── SearchPanel.tsx        # Location search UI
│   ├── DataPanel.tsx          # Geological data display
│   └── BridgeSuggestions.tsx  # Bridge design recommendations
└── package.json
```

## Notes

- The tool uses real-time earthquake data from USGS
- Terrain data is simulated based on location coordinates
- Bridge suggestions are generated algorithmically based on geological factors
- All data is fetched client-side for real-time analysis

## License

MIT

