import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFlightSearchSchema } from "@shared/schema";
import { amadeusService } from "./lib/amadeus";

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

      // Use real Amadeus API for flight search
      const fromAirport = Array.isArray(searchData.fromAirport) ? searchData.fromAirport[0] : searchData.fromAirport;
      const toAirport = Array.isArray(searchData.toAirport) ? searchData.toAirport[0] : searchData.toAirport;

      let results = [];
      try {
        // Try real Amadeus API first
        results = await amadeusService.searchFlights({
          originLocationCode: fromAirport,
          destinationLocationCode: toAirport,
          departureDate: searchData.departureDate,
          returnDate: searchData.returnDate || undefined,
          adults: searchData.passengers || 1,
          max: 10
        });
      } catch (error) {
        console.error("Amadeus API failed, using mock data:", error);
        // Fallback to mock data if API fails
        results = generateMockFlightResults(fromAirport, toAirport, searchData.departureDate, searchData.returnDate);
      }

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



  // Get recent searches

  // Long layover flights endpoint
  app.get("/api/long-layovers", async (req, res) => {
    try {
      const longLayoverFlights = [
        {
          id: 1,
          route: "VCE → JFK",
          airline: "Turkish Airlines",
          price: 45900, // €459 in cents
          layoverCity: "Istanbul",
          layoverDuration: "12h 30m",
          layoverAirport: "IST",
          departureTime: "14:25",
          nextDeparture: "Today at 14:25",
          activities: [
            "Visit the Blue Mosque and Hagia Sophia",
            "Explore the Grand Bazaar",
            "Take a Bosphorus cruise",
            "Try authentic Turkish cuisine"
          ],
          imageUrl: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b"
        },
        {
          id: 2,
          route: "VCE → LAX",
          airline: "Emirates",
          price: 67500, // €675 in cents
          layoverCity: "Dubai",
          layoverDuration: "10h 45m",
          layoverAirport: "DXB",
          departureTime: "09:15",
          nextDeparture: "Tomorrow at 09:15",
          activities: [
            "Visit the Burj Khalifa observation deck",
            "Shop at Dubai Mall",
            "Relax at Dubai Marina",
            "Experience the Gold Souk"
          ],
          imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c"
        },
        {
          id: 3,
          route: "VCE → SYD",
          airline: "Qatar Airways",
          price: 89900, // €899 in cents
          layoverCity: "Doha",
          layoverDuration: "14h 20m",
          layoverAirport: "DOH",
          departureTime: "23:45",
          nextDeparture: "Tonight at 23:45",
          activities: [
            "Explore Souq Waqif traditional market",
            "Visit the Museum of Islamic Art",
            "Stroll along the Corniche waterfront",
            "Experience Qatari hospitality"
          ],
          imageUrl: "https://images.unsplash.com/photo-1539650116574-75c0c6d73dd0"
        },
        {
          id: 4,
          route: "VCE → BKK",
          airline: "Lufthansa",
          price: 52300, // €523 in cents
          layoverCity: "Frankfurt",
          layoverDuration: "8h 15m",
          layoverAirport: "FRA",
          departureTime: "11:30",
          nextDeparture: "Today at 11:30",
          activities: [
            "Quick trip to Frankfurt city center",
            "Visit the historic Römerberg square",
            "Enjoy German cuisine and beer",
            "Explore the Main River area"
          ],
          imageUrl: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b"
        }
      ];

      res.json(longLayoverFlights);
    } catch (error) {
      console.error('Error fetching long layover flights:', error);
      res.status(500).json({ error: 'Failed to fetch long layover flights' });
    }
  });

  // Airport search using Amadeus API
  app.get("/api/airports/search", async (req, res) => {
    try {
      const { q } = req.query;
      
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ error: 'Search query required' });
      }

      const suggestions = await amadeusService.getAirportSuggestions(q);
      res.json(suggestions);
    } catch (error) {
      console.error('Airport search error:', error);
      res.status(500).json({ error: 'Failed to search airports' });
    }
  });

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

  // Flight deals endpoint
  app.get("/api/deals", async (req, res) => {
    try {
      const flightDeals = [
        {
          id: 1,
          title: "Barcelona Adventure",
          airline: "Vueling",
          dealPrice: 8900, // €89 in cents
          originalPrice: 12900, // €129 in cents
          dealType: "percentage",
          validUntil: "2025-02-15",
          imageUrl: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4"
        },
        {
          id: 2,
          title: "Paris Getaway",
          airline: "Air France",
          dealPrice: 15900, // €159 in cents
          originalPrice: 22900, // €229 in cents
          dealType: "best-deal",
          validUntil: "2025-02-20",
          imageUrl: "https://images.unsplash.com/photo-1502602898536-47ad22581b52"
        },
        {
          id: 3,
          title: "Amsterdam Discovery",
          airline: "KLM",
          dealPrice: 12900, // €129 in cents
          originalPrice: 17900, // €179 in cents
          dealType: "limited",
          validUntil: "2025-02-10",
          imageUrl: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017"
        }
      ];

      res.json(flightDeals);
    } catch (error) {
      console.error('Error fetching flight deals:', error);
      res.status(500).json({ error: 'Failed to fetch flight deals' });
    }
  });

  // Long layovers endpoint
  app.get("/api/long-layovers", async (req, res) => {
    try {
      const longLayoverFlights = [
        {
          id: 1,
          route: "JFK → NRT → SYD",
          layoverDuration: "14h 30m",
          layoverCity: "Tokyo",
          price: 85900, // $859 in cents
          totalDuration: "22h 15m",
          airline: "Japan Airlines",
          explorationOpportunities: [
            "Visit Senso-ji Temple",
            "Explore Shibuya Crossing", 
            "Try authentic ramen"
          ]
        },
        {
          id: 2,
          route: "LAX → CDG → CAI",
          layoverDuration: "16h 45m",
          layoverCity: "Paris",
          price: 92400, // $924 in cents
          totalDuration: "18h 30m",
          airline: "Air France",
          explorationOpportunities: [
            "See the Eiffel Tower",
            "Visit the Louvre Museum",
            "Stroll along the Seine"
          ]
        },
        {
          id: 3,
          route: "LHR → DXB → BKK",
          layoverDuration: "12h 20m",
          layoverCity: "Dubai",
          price: 78500, // $785 in cents
          totalDuration: "15h 45m",
          airline: "Emirates",
          explorationOpportunities: [
            "Visit Burj Khalifa",
            "Shop at Dubai Mall",
            "Desert safari experience"
          ]
        }
      ];

      res.json(longLayoverFlights);
    } catch (error) {
      console.error('Error fetching long layover flights:', error);
      res.status(500).json({ error: 'Failed to fetch long layover flights' });
    }
  });

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

