import { airports } from './airports';

export interface GeolocationResult {
  airport: {
    code: string;
    name: string;
    city: string;
    country: string;
  };
  distance: number;
}

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Get user's current location and find nearest airport
export async function getNearestAirport(): Promise<GeolocationResult | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported by this browser');
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Find nearest airport
        let nearestAirport = null;
        let shortestDistance = Infinity;

        airports.forEach(airport => {
          if (airport.latitude && airport.longitude) {
            const distance = calculateDistance(
              latitude, 
              longitude, 
              airport.latitude, 
              airport.longitude
            );
            
            if (distance < shortestDistance) {
              shortestDistance = distance;
              nearestAirport = {
                code: airport.code,
                name: airport.name,
                city: airport.city,
                country: airport.country
              };
            }
          }
        });

        if (nearestAirport) {
          resolve({
            airport: nearestAirport,
            distance: Math.round(shortestDistance)
          });
        } else {
          resolve(null);
        }
      },
      (error) => {
        console.warn('Geolocation error:', error.message);
        resolve(null);
      },
      {
        timeout: 5000,
        enableHighAccuracy: false
      }
    );
  });
}

// Default airports for fallback (Venice area)
export const defaultDepartureAirports = [
  { code: 'VCE', name: 'Venice Marco Polo Airport', city: 'Venice', country: 'Italy' },
  { code: 'TSF', name: 'Treviso Airport', city: 'Treviso', country: 'Italy' }
];