import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@shared/schema";
import type { 
  FlightSearch, 
  InsertFlightSearch, 
  FlightResult, 
  RecentSearch, 
  InsertRecentSearch, 
  FlightDeal 
} from "@shared/schema";

class InMemoryStorage {
  private flightSearches = new Map<number, FlightSearch>();
  private recentSearches = new Map<number, RecentSearch>();
  private currentSearchId = 1;
  private currentRecentId = 1;

  constructor() {
    // No sample data initialization
  }

  async createFlightSearch(insertSearch: InsertFlightSearch): Promise<FlightSearch> {
    const id = this.currentSearchId++;
    const search: FlightSearch = {
      ...insertSearch,
      id,
      returnDate: insertSearch.returnDate || null,
      passengers: insertSearch.passengers || 1,
      filters: insertSearch.filters as any || null,
      createdAt: new Date(),
    };
    this.flightSearches.set(id, search);
    return search;
  }

  async getFlightSearch(id: number): Promise<FlightSearch | undefined> {
    return this.flightSearches.get(id);
  }

  async getRecentSearches(): Promise<RecentSearch[]> {
    return Array.from(this.recentSearches.values())
      .sort((a, b) => new Date(b.lastSearched).getTime() - new Date(a.lastSearched).getTime());
  }

  async addRecentSearch(insertSearch: InsertRecentSearch): Promise<RecentSearch> {
    const id = this.currentRecentId++;
    const search: RecentSearch = {
      ...insertSearch,
      id,
      returnDate: insertSearch.returnDate || null,
      bestPrice: insertSearch.bestPrice || null,
      searchCount: insertSearch.searchCount || 1,
      lastSearched: new Date(),
    };
    this.recentSearches.set(id, search);
    return search;
  }

  async updateRecentSearch(id: number, data: Partial<RecentSearch>): Promise<RecentSearch> {
    const existing = this.recentSearches.get(id);
    if (!existing) {
      throw new Error(`Recent search with id ${id} not found`);
    }
    const updated = { ...existing, ...data };
    this.recentSearches.set(id, updated);
    return updated;
  }

  // Remove all deal-related methods since we're focusing on Amadeus API only
  async getActiveDeals(): Promise<FlightDeal[]> {
    return [];
  }

  async getDealsByAirport(airport: string): Promise<FlightDeal[]> {
    return [];
  }

  // The following are the functions that were not present in the edited code, they are required as defined in the interface IStorage
  async createFlightResult(result: any): Promise<FlightResult> {
    throw new Error("Method not implemented.");
  }

  async getFlightResults(searchId: number): Promise<FlightResult[]> {
    throw new Error("Method not implemented.");
  }

  async searchFlights(search: InsertFlightSearch): Promise<FlightResult[]> {
    throw new Error("Method not implemented.");
  }
  
  async createFlightDeal(deal: any): Promise<FlightDeal> {
    throw new Error("Method not implemented.");
  }
}

// Initialize storage instance
export const storage = new InMemoryStorage();