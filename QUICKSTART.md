# Quick Start Guide

## Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

## How to Use

1. **Wait for Loading**: The app will show a beautiful loading animation with mountains → terrain → globe (takes ~3 seconds)

2. **Search for a Location**:
   - Click the "Search Location" button (bottom right)
   - Option 1: Enter a location name (e.g., "Himalayas, Nepal", "Mount Everest", "Kashmir, India")
   - Option 2: Enter coordinates manually (Latitude: -90 to 90, Longitude: -180 to 180)

3. **View Analysis**:
   - The globe will automatically zoom to your selected location
   - View geological data in the bottom-left panel:
     - Seismic activity (earthquake frequency, risk level)
     - Terrain characteristics (elevation, slope, soil type)
     - Landslide risk assessment
     - Geological factors (fault lines, rock stability)

4. **Get Bridge Design Suggestions**:
   - View recommended bridge designs in the top-right panel
   - Each design shows a suitability percentage
   - Click on any design to see:
     - Why it's recommended
     - Pros and cons
     - Detailed reasoning based on geological factors

## Example Locations to Try

- **Himalayas**: `28.3949, 84.1240` (Nepal)
- **Rocky Mountains**: `39.7392, -104.9903` (Colorado, USA)
- **Alps**: `46.5197, 9.8573` (Switzerland)
- **Andes**: `-13.1631, -72.5450` (Peru)

## Features

✅ 3D Interactive Globe with smooth animations
✅ Real-time earthquake data from USGS
✅ Terrain analysis and landslide risk assessment
✅ 5 different bridge design types with AI-powered recommendations
✅ Beautiful HD UI with mountain loading animation
✅ Mobile-responsive design
✅ Location search by name or coordinates

## Troubleshooting

- **Globe not loading**: Make sure you have a stable internet connection (globe textures load from CDN)
- **Search not working**: Check your internet connection (uses OpenStreetMap API)
- **No earthquake data**: Some locations may have limited historical data - this is normal
- **Performance issues**: Try refreshing the page or clearing browser cache

## Technical Stack

- Next.js 14 (React Framework)
- TypeScript
- Three.js / react-globe.gl (3D Graphics)
- Framer Motion (Animations)
- Tailwind CSS (Styling)
- USGS API (Earthquake Data)
- OpenStreetMap Nominatim (Geocoding)

