export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
}

export interface FlightSearchFilters {
  priceRange?: [number, number];
  departureTime?: string[];
  stops?: string[];
  maxDuration?: [number, number];
  layoverDuration?: string[];
  aircraftType?: string[];
}

export interface FlightSearchParams {
  fromAirport: string | string[];
  toAirport: string | string[];
  departureDate: string;
  returnDate?: string;
  passengers: number;
  filters?: FlightSearchFilters;
}

export interface FlightResult {
  id: number;
  airline: string;
  flightNumber: string;
  aircraftType: string;
  fromAirport: string;
  toAirport: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  layoverAirport?: string;
  layoverDuration?: string;
  price: number;
  currency: string;
  isLongLayover?: boolean;
  amenities?: string[];
}

export interface FlightDeal {
  id: number;
  title: string;
  fromAirport: string;
  toAirport: string;
  airline: string;
  originalPrice: number;
  dealPrice: number;
  discount: number;
  validUntil: string;
  dealType: string;
  imageUrl?: string;
  isActive: boolean;
}

export interface RecentSearch {
  id: number;
  fromAirport: string;
  toAirport: string;
  departureDate: string;
  returnDate?: string;
  bestPrice?: number;
  searchCount: number;
  lastSearched: string;
}

export interface LongLayoverFlight {
  id: number;
  route: string;
  airline: string;
  price: number;
  layoverCity: string;
  layoverDuration: string;
  layoverAirport: string;
  departureTime: string;
  nextDeparture: string;
  activities: string[];
  imageUrl: string;
}
