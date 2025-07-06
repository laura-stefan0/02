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

      // Handle "ANYWHERE" destination
      if (searchData.toAirport === "ANYWHERE") {
        return res.status(400).json({ 
          message: "ANYWHERE destination is not supported with Amadeus API. Please select a specific destination." 
        });
      }

      // Use Amadeus API for real flight search
      const fromAirport = Array.isArray(searchData.fromAirport) ? searchData.fromAirport[0] : searchData.fromAirport;
      const toAirport = Array.isArray(searchData.toAirport) ? searchData.toAirport[0] : searchData.toAirport;

      const results = await amadeusService.searchFlights({
        originLocationCode: fromAirport.toUpperCase(),
        destinationLocationCode: toAirport.toUpperCase(),
        departureDate: searchData.departureDate,
        returnDate: searchData.returnDate || undefined,
        adults: searchData.passengers,
        max: 20
      });

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

      // Use Amadeus API for search
      const results = await amadeusService.searchFlights({
        originLocationCode: search.fromAirport.toUpperCase(),
        destinationLocationCode: search.toAirport.toUpperCase(),
        departureDate: search.departureDate,
        returnDate: search.returnDate || undefined,
        adults: 1,
        max: 20
      });

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