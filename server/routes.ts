import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFlightSearchSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Flight search - Amadeus API only
  app.post("/api/flights/search", async (req, res) => {
    try {
      const searchData = insertFlightSearchSchema.parse(req.body);

      // Convert arrays to strings for database storage
      const normalizedSearchData = {
        ...searchData,
        fromAirport: Array.isArray(searchData.fromAirport) ? searchData.fromAirport.join(',') : searchData.fromAirport,
        toAirport: Array.isArray(searchData.toAirport) ? searchData.toAirport.join(',') : searchData.toAirport,
      };

      // Create search record
      const search = await storage.createFlightSearch(normalizedSearchData);

      // Generate mock flight results
      const fromAirport = Array.isArray(searchData.fromAirport) ? searchData.fromAirport[0] : searchData.fromAirport;
      const toAirport = Array.isArray(searchData.toAirport) ? searchData.toAirport[0] : searchData.toAirport;

      const results = generateMockFlightResults(fromAirport, toAirport, searchData.departureDate, searchData.returnDate);

      // Add to recent searches
      await storage.addRecentSearch({
        fromAirport: normalizedSearchData.fromAirport,
        toAirport: normalizedSearchData.toAirport,
        departureDate: searchData.departureDate,
        returnDate: searchData.returnDate || null,
        bestPrice: results.length > 0 ? Math.min(...results.map(r => r.price)) : null,
        searchCount: 1,
      });

      res.json({
        search,
        results,
        count: results.length,
      });
    } catch (error) {
      console.error("Flight search error:", error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Flight search failed" 
      });
    }
  });

  // Airport search using mock data
  app.get("/api/airports/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ message: "Search query is required" });
      }

      const suggestions = getMockAirportSuggestions(q);
      res.json(suggestions);
    } catch (error) {
      console.error("Airport search error:", error);
      res.status(500).json({ message: "Failed to search airports" });
    }
  });

  // Get recent searches
  app.get("/api/recent-searches", async (req, res) => {
    try {
      const recentSearches = await storage.getRecentSearches();
      res.json(recentSearches);
    } catch (error) {
      console.error("Get recent searches error:", error);
      res.status(500).json({ message: "Failed to fetch recent searches" });
    }
  });

  // Re-run recent search
  app.post("/api/recent-searches/:id/rerun", async (req, res) => {
    try {
      const searchId = parseInt(req.params.id);
      const recentSearch = await storage.getRecentSearches();
      const search = recentSearch.find(s => s.id === searchId);

      if (!search) {
        return res.status(404).json({ message: "Search not found" });
      }

      // Create new search with same parameters using Amadeus API
      const searchData = {
        fromAirport: search.fromAirport,
        toAirport: search.toAirport,
        departureDate: search.departureDate,
        returnDate: search.returnDate,
        passengers: 1,
        filters: null,
      };

      const newSearch = await storage.createFlightSearch(searchData);

      // Generate mock flight results for rerun
      const results = generateMockFlightResults(search.fromAirport, search.toAirport, search.departureDate, search.returnDate);

      // Update recent search count
      await storage.updateRecentSearch(searchId, {
        searchCount: search.searchCount + 1,
        lastSearched: new Date(),
      });

      res.json({
        search: newSearch,
        results,
        count: results.length,
      });
    } catch (error) {
      console.error("Rerun search error:", error);
      res.status(500).json({ message: "Failed to rerun search" });
    }
  });

  // Remove deals endpoints - no longer needed

  // Remove long layovers endpoint - no longer needed

  const httpServer = createServer(app);
  return httpServer;
}

// Mock data generation functions
function generateMockFlightResults(fromAirport: string, toAirport: string, departureDate: string, returnDate?: string) {
  const airlines = ['AA', 'BA', 'LH', 'AF', 'KL', 'EK', 'QR', 'TK', 'SQ', 'CX'];
  const aircraftTypes = ['A320', 'A321', 'A330', 'A350', 'B737', 'B747', 'B777', 'B787', 'E190'];
  const results = [];

  for (let i = 0; i < Math.min(15, Math.floor(Math.random() * 20) + 5); i++) {
    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const aircraftType = aircraftTypes[Math.floor(Math.random() * aircraftTypes.length)];
    const flightNumber = `${airline}${Math.floor(Math.random() * 9000) + 1000}`;
    
    // Generate random departure and arrival times
    const depHour = Math.floor(Math.random() * 24);
    const depMinute = Math.floor(Math.random() * 60);
    const duration = Math.floor(Math.random() * 10) + 2; // 2-12 hours
    const arrHour = (depHour + duration) % 24;
    const arrMinute = depMinute + Math.floor(Math.random() * 60);
    
    const stops = Math.floor(Math.random() * 3); // 0-2 stops
    const price = Math.floor(Math.random() * 1500) + 200; // $200-$1700
    
    let layoverAirport = null;
    let layoverDuration = null;
    let isLongLayover = false;
    
    if (stops > 0) {
      const layoverAirports = ['FRA', 'AMS', 'CDG', 'LHR', 'DXB', 'DOH', 'IST'];
      layoverAirport = layoverAirports[Math.floor(Math.random() * layoverAirports.length)];
      const layoverHours = Math.floor(Math.random() * 12) + 1;
      const layoverMins = Math.floor(Math.random() * 60);
      layoverDuration = `${layoverHours}h ${layoverMins}m`;
      isLongLayover = layoverHours >= 8;
    }
    
    const amenities = [];
    if (Math.random() > 0.3) amenities.push('In-flight entertainment');
    if (Math.random() > 0.2) amenities.push('WiFi');
    if (Math.random() > 0.5) amenities.push('Power outlets');
    if (Math.random() > 0.4) amenities.push('Refreshments');
    
    results.push({
      id: i + 1,
      airline,
      flightNumber,
      aircraftType,
      fromAirport: fromAirport.toUpperCase(),
      toAirport: toAirport.toUpperCase(),
      departureTime: `${String(depHour).padStart(2, '0')}:${String(depMinute).padStart(2, '0')}`,
      arrivalTime: `${String(arrHour).padStart(2, '0')}:${String(arrMinute % 60).padStart(2, '0')}`,
      duration: `${duration}h ${Math.floor(Math.random() * 60)}m`,
      stops,
      layoverAirport,
      layoverDuration,
      price: price * 100, // Convert to cents
      currency: 'USD',
      isLongLayover,
      amenities
    });
  }
  
  return results.sort((a, b) => a.price - b.price);
}

function getMockAirportSuggestions(query: string) {
  const mockAirports = [
    { iataCode: 'NYC', name: 'New York', cityName: 'New York', countryName: 'United States' },
    { iataCode: 'LAX', name: 'Los Angeles International', cityName: 'Los Angeles', countryName: 'United States' },
    { iataCode: 'LHR', name: 'London Heathrow', cityName: 'London', countryName: 'United Kingdom' },
    { iataCode: 'CDG', name: 'Charles de Gaulle', cityName: 'Paris', countryName: 'France' },
    { iataCode: 'FRA', name: 'Frankfurt Airport', cityName: 'Frankfurt', countryName: 'Germany' },
    { iataCode: 'AMS', name: 'Amsterdam Schiphol', cityName: 'Amsterdam', countryName: 'Netherlands' },
    { iataCode: 'DXB', name: 'Dubai International', cityName: 'Dubai', countryName: 'UAE' },
    { iataCode: 'SIN', name: 'Singapore Changi', cityName: 'Singapore', countryName: 'Singapore' },
    { iataCode: 'NRT', name: 'Tokyo Narita', cityName: 'Tokyo', countryName: 'Japan' },
    { iataCode: 'HKG', name: 'Hong Kong International', cityName: 'Hong Kong', countryName: 'Hong Kong' }
  ];
  
  const queryLower = query.toLowerCase();
  return mockAirports.filter(airport => 
    airport.name.toLowerCase().includes(queryLower) ||
    airport.cityName.toLowerCase().includes(queryLower) ||
    airport.iataCode.toLowerCase().includes(queryLower)
  );
}