export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  type: string;
}

export const airports: Airport[] = [
  // Italian airports
  { code: "VCE", name: "Venice Marco Polo Airport", city: "Venice", country: "Italy", latitude: 45.5053, longitude: 12.3519, type: "airport" },
  { code: "TSF", name: "Treviso Airport", city: "Treviso", country: "Italy", latitude: 45.6477, longitude: 12.1944, type: "airport" },
  { code: "FCO", name: "Rome Fiumicino", city: "Rome", country: "Italy", latitude: 41.8003, longitude: 12.2389, type: "airport" },
  { code: "CIA", name: "Rome Ciampino", city: "Rome", country: "Italy", latitude: 41.7994, longitude: 12.5949, type: "airport" },
  { code: "BGY", name: "Milan Bergamo", city: "Milan", country: "Italy", latitude: 45.6739, longitude: 9.7042, type: "airport" },
  { code: "MXP", name: "Milan Malpensa", city: "Milan", country: "Italy", latitude: 45.6306, longitude: 8.7281, type: "airport" },
  { code: "LIN", name: "Milan Linate", city: "Milan", country: "Italy", latitude: 45.4453, longitude: 9.2767, type: "airport" },
  { code: "BOL", name: "Bologna", city: "Bologna", country: "Italy", latitude: 44.5354, longitude: 11.2887, type: "airport" },
  { code: "FLR", name: "Florence", city: "Florence", country: "Italy", latitude: 43.8100, longitude: 11.2047, type: "airport" },
  { code: "PSA", name: "Pisa", city: "Pisa", country: "Italy", latitude: 43.6839, longitude: 10.3928, type: "airport" },
  { code: "NAP", name: "Naples", city: "Naples", country: "Italy", latitude: 40.8860, longitude: 14.2908, type: "airport" },
  { code: "CTA", name: "Catania", city: "Catania", country: "Italy", latitude: 37.4668, longitude: 15.0664, type: "airport" },
  { code: "PMO", name: "Palermo", city: "Palermo", country: "Italy", latitude: 38.1759, longitude: 13.0910, type: "airport" },
  { code: "BRI", name: "Bari", city: "Bari", country: "Italy", latitude: 41.1389, longitude: 16.7606, type: "airport" },

  // Major European airports
  { code: "CDG", name: "Paris Charles de Gaulle", city: "Paris", country: "France", latitude: 49.0097, longitude: 2.5479, type: "airport" },
  { code: "ORY", name: "Paris Orly", city: "Paris", country: "France", latitude: 48.7233, longitude: 2.3794, type: "airport" },
  { code: "LHR", name: "London Heathrow", city: "London", country: "United Kingdom", latitude: 51.4700, longitude: -0.4543, type: "airport" },
  { code: "LGW", name: "London Gatwick", city: "London", country: "United Kingdom", latitude: 51.1481, longitude: -0.1903, type: "airport" },
  { code: "STN", name: "London Stansted", city: "London", country: "United Kingdom", latitude: 51.8860, longitude: 0.2389, type: "airport" },
  { code: "BCN", name: "Barcelona", city: "Barcelona", country: "Spain", latitude: 41.2971, longitude: 2.0785, type: "airport" },
  { code: "MAD", name: "Madrid", city: "Madrid", country: "Spain", latitude: 40.4719, longitude: -3.5626, type: "airport" },
  { code: "AMS", name: "Amsterdam", city: "Amsterdam", country: "Netherlands", latitude: 52.3086, longitude: 4.7639, type: "airport" },
  { code: "BER", name: "Berlin Brandenburg", city: "Berlin", country: "Germany", latitude: 52.3617, longitude: 13.5003, type: "airport" },
  { code: "MUC", name: "Munich", city: "Munich", country: "Germany", latitude: 48.3538, longitude: 11.7861, type: "airport" },
  { code: "FRA", name: "Frankfurt", city: "Frankfurt", country: "Germany", latitude: 50.0333, longitude: 8.5706, type: "airport" },
  { code: "VIE", name: "Vienna", city: "Vienna", country: "Austria", latitude: 48.1103, longitude: 16.5697, type: "airport" },
  { code: "ZUR", name: "Zurich", city: "Zurich", country: "Switzerland", latitude: 47.4647, longitude: 8.5492, type: "airport" },
  { code: "GVA", name: "Geneva", city: "Geneva", country: "Switzerland", latitude: 46.2381, longitude: 6.1089, type: "airport" },
  { code: "ARN", name: "Stockholm", city: "Stockholm", country: "Sweden", latitude: 59.6519, longitude: 17.9186, type: "airport" },
  { code: "CPH", name: "Copenhagen", city: "Copenhagen", country: "Denmark", latitude: 55.6181, longitude: 12.6561, type: "airport" },
  { code: "OSL", name: "Oslo", city: "Oslo", country: "Norway", latitude: 60.1939, longitude: 11.1004, type: "airport" },
  { code: "HEL", name: "Helsinki", city: "Helsinki", country: "Finland", latitude: 60.3172, longitude: 24.9633, type: "airport" },
  { code: "LIS", name: "Lisbon", city: "Lisbon", country: "Portugal", latitude: 38.7813, longitude: -9.1361, type: "airport" },
  { code: "OPO", name: "Porto", city: "Porto", country: "Portugal", latitude: 41.2481, longitude: -8.6814, type: "airport" },

  // Eastern European airports
  { code: "ATH", name: "Athens", city: "Athens", country: "Greece", latitude: 37.9364, longitude: 23.9445, type: "airport" },
  { code: "BUD", name: "Budapest", city: "Budapest", country: "Hungary", latitude: 47.4425, longitude: 19.2611, type: "airport" },
  { code: "PRG", name: "Prague", city: "Prague", country: "Czech Republic", latitude: 50.1008, longitude: 14.2600, type: "airport" },
  { code: "WAW", name: "Warsaw", city: "Warsaw", country: "Poland", latitude: 52.1657, longitude: 20.9671, type: "airport" },
  { code: "KRK", name: "Krakow", city: "Krakow", country: "Poland", latitude: 50.0777, longitude: 19.7848, type: "airport" },

  // Global major airports
  { code: "JFK", name: "New York JFK", city: "New York", country: "United States", latitude: 40.6413, longitude: -73.7781, type: "airport" },
  { code: "LAX", name: "Los Angeles", city: "Los Angeles", country: "United States", latitude: 34.0522, longitude: -118.2437, type: "airport" },
  { code: "YYZ", name: "Toronto", city: "Toronto", country: "Canada", latitude: 43.6777, longitude: -79.6248, type: "airport" },
  { code: "DXB", name: "Dubai", city: "Dubai", country: "United Arab Emirates", latitude: 25.2532, longitude: 55.3657, type: "airport" },
  { code: "DOH", name: "Doha", city: "Doha", country: "Qatar", latitude: 25.2731, longitude: 51.6080, type: "airport" },
  { code: "SIN", name: "Singapore", city: "Singapore", country: "Singapore", latitude: 1.3644, longitude: 103.9915, type: "airport" },
  { code: "NRT", name: "Tokyo Narita", city: "Tokyo", country: "Japan", latitude: 35.7653, longitude: 140.3856, type: "airport" },
  { code: "HND", name: "Tokyo Haneda", city: "Tokyo", country: "Japan", latitude: 35.5494, longitude: 139.7798, type: "airport" },
  { code: "ICN", name: "Seoul", city: "Seoul", country: "South Korea", latitude: 37.4602, longitude: 126.4407, type: "airport" },
  { code: "PEK", name: "Beijing", city: "Beijing", country: "China", latitude: 40.0799, longitude: 116.6031, type: "airport" },
  { code: "PVG", name: "Shanghai", city: "Shanghai", country: "China", latitude: 31.1443, longitude: 121.8083, type: "airport" },
  { code: "SYD", name: "Sydney", city: "Sydney", country: "Australia", latitude: -33.9399, longitude: 151.1753, type: "airport" },
  { code: "MEL", name: "Melbourne", city: "Melbourne", country: "Australia", latitude: -37.6690, longitude: 144.8410, type: "airport" },

  // Middle East & Africa
  { code: "CAI", name: "Cairo", city: "Cairo", country: "Egypt", latitude: 30.1219, longitude: 31.4056, type: "airport" },
  { code: "TUN", name: "Tunis", city: "Tunis", country: "Tunisia", latitude: 36.8510, longitude: 10.2272, type: "airport" },
  { code: "CPT", name: "Cape Town", city: "Cape Town", country: "South Africa", latitude: -33.9648, longitude: 18.6017, type: "airport" },
  { code: "JNB", name: "Johannesburg", city: "Johannesburg", country: "South Africa", latitude: -26.1392, longitude: 28.2460, type: "airport" },

  // South America
  { code: "GRU", name: "São Paulo", city: "São Paulo", country: "Brazil", latitude: -23.4356, longitude: -46.4731, type: "airport" },
  { code: "EZE", name: "Buenos Aires", city: "Buenos Aires", country: "Argentina", latitude: -34.8222, longitude: -58.5358, type: "airport" },
  { code: "BOG", name: "Bogotá", city: "Bogotá", country: "Colombia", latitude: 4.7016, longitude: -74.1469, type: "airport" },
  { code: "LIM", name: "Lima", city: "Lima", country: "Peru", latitude: -12.0219, longitude: -77.1144, type: "airport" },
  { code: "SCL", name: "Santiago", city: "Santiago", country: "Chile", latitude: -33.3928, longitude: -70.7858, type: "airport" },

  // Asia
  { code: "BOM", name: "Mumbai", city: "Mumbai", country: "India", latitude: 19.0896, longitude: 72.8656, type: "airport" },
  { code: "DEL", name: "Delhi", city: "Delhi", country: "India", latitude: 28.5562, longitude: 77.1000, type: "airport" },
  { code: "BLR", name: "Bangalore", city: "Bangalore", country: "India", latitude: 13.1986, longitude: 77.7066, type: "airport" },
  { code: "BKK", name: "Bangkok", city: "Bangkok", country: "Thailand", latitude: 13.6900, longitude: 100.7501, type: "airport" },
  { code: "KUL", name: "Kuala Lumpur", city: "Kuala Lumpur", country: "Malaysia", latitude: 2.7456, longitude: 101.7072, type: "airport" },
  { code: "CGK", name: "Jakarta", city: "Jakarta", country: "Indonesia", latitude: -6.1256, longitude: 106.6559, type: "airport" },
  { code: "MNL", name: "Manila", city: "Manila", country: "Philippines", latitude: 14.5086, longitude: 121.0194, type: "airport" },
];