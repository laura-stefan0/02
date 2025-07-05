import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFlightSearchSchema, insertRecentSearchSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Flight search
  app.post("/api/flights/search", async (req, res) => {
    try {
      const searchData = insertFlightSearchSchema.parse(req.body);
      
      // Create search record
      const search = await storage.createFlightSearch(searchData);
      
      // Get flight results
      const results = await storage.searchFlights(searchData);
      
      // Add to recent searches
      await storage.addRecentSearch({
        fromAirport: searchData.fromAirport,
        toAirport: searchData.toAirport,
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
