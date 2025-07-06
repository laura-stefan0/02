import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFlightSearchSchema, insertRecentSearchSchema } from "@shared/schema";
import { amadeusService } from "./lib/amadeus";

export async function registerRoutes(app: Express): Promise<Server> {
  // Flight search
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
      
      // Handle "ANYWHERE" destination by falling back to mock data
      let results;
      if (searchData.toAirport === "ANYWHERE") {
        results = await storage.searchFlights(searchData);
      } else {
        try {
          // Use Amadeus API for real flight search
          const fromAirport = Array.isArray(searchData.fromAirport) ? searchData.fromAirport[0] : searchData.fromAirport;
          const toAirport = Array.isArray(searchData.toAirport) ? searchData.toAirport[0] : searchData.toAirport;
          
          results = await amadeusService.searchFlights({
            originLocationCode: fromAirport.toUpperCase(),
            destinationLocationCode: toAirport.toUpperCase(),
            departureDate: searchData.departureDate,
            returnDate: searchData.returnDate || undefined,
            adults: searchData.passengers,
            max: 20
          });
        } catch (amadeusError) {
          console.error("Amadeus API failed, falling back to mock data:", amadeusError);
          // Fall back to mock data if Amadeus fails
          results = await storage.searchFlights(searchData);
        }
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
        message: error instanceof Error ? error.message : "Invalid search parameters" 
      });
    }
  });

  // Get flight deals
  app.get("/api/deals", async (req, res) => {
    try {
      const deals = await storage.getActiveDeals();
      res.json(deals);
    } catch (error) {
      console.error("Get deals error:", error);
      res.status(500).json({ message: "Failed to fetch deals" });
    }
  });

  // Get deals by airport
  app.get("/api/deals/:airport", async (req, res) => {
    try {
      const { airport } = req.params;
      const deals = await storage.getDealsByAirport(airport.toUpperCase());
      res.json(deals);
    } catch (error) {
      console.error("Get deals by airport error:", error);
      res.status(500).json({ message: "Failed to fetch deals for airport" });
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

  // Get long layover flights
  app.get("/api/long-layovers", async (req, res) => {
    try {
      // Mock long layover flights data
      const longLayoverFlights = [
        {
          id: 1,
          route: "Venice → London via Dubai",
          airline: "Emirates",
          price: 28500, // €285
          layoverCity: "Dubai",
          layoverDuration: "12h",
          layoverAirport: "DXB",
          departureTime: "08:15",
          nextDeparture: "Tomorrow 08:15",


  // Airport search using Amadeus
  app.get("/api/airports/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const suggestions = await amadeusService.getAirportSuggestions(q);
      res.json(suggestions);
    } catch (error) {
      console.error("Airport search error:", error);
      res.status(500).json({ message: "Failed to search airports" });
    }
  });

          activities: [
            "Visit Burj Khalifa and Dubai Mall",
            "Explore Dubai Marina and beaches", 
            "Experience traditional souks",
            "Enjoy world-class dining"
          ],
          imageUrl: "https://images.unsplash.com/photo-1512632578888-169bbbc64f33"
        },
        {
          id: 2,
          route: "Venice → New York via Amsterdam",
          airline: "KLM",
          price: 42500, // €425
          layoverCity: "Amsterdam",
          layoverDuration: "8h",
          layoverAirport: "AMS",
          departureTime: "10:30",
          nextDeparture: "Friday 10:30",
          activities: [
            "Canal boat cruise",
            "Visit Anne Frank House area",
            "Explore Jordaan district",
            "Try local Dutch cuisine"
          ],
          imageUrl: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017"
        }
      ];
      
      res.json(longLayoverFlights);
    } catch (error) {
      console.error("Get long layovers error:", error);
      res.status(500).json({ message: "Failed to fetch long layover flights" });
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

      // Create new search with same parameters
      const searchData = {
        fromAirport: search.fromAirport,
        toAirport: search.toAirport,
        departureDate: search.departureDate,
        returnDate: search.returnDate,
        passengers: 1,
        filters: null,
      };

      const newSearch = await storage.createFlightSearch(searchData);
      const results = await storage.searchFlights(searchData);

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

  const httpServer = createServer(app);
  return httpServer;
}
