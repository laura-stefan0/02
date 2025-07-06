import { flightSearches, flightResults, recentSearches, flightDeals, type FlightSearch, type InsertFlightSearch, type FlightResult, type InsertFlightResult, type RecentSearch, type InsertRecentSearch, type FlightDeal, type InsertFlightDeal } from "@shared/schema";

export interface IStorage {
  // Flight Search
  createFlightSearch(search: InsertFlightSearch): Promise<FlightSearch>;
  getFlightSearch(id: number): Promise<FlightSearch | undefined>;
  
  // Flight Results
  createFlightResult(result: InsertFlightResult): Promise<FlightResult>;
  getFlightResults(searchId: number): Promise<FlightResult[]>;
  searchFlights(search: InsertFlightSearch): Promise<FlightResult[]>;
  
  // Recent Searches
  getRecentSearches(): Promise<RecentSearch[]>;
  addRecentSearch(search: InsertRecentSearch): Promise<RecentSearch>;
  updateRecentSearch(id: number, data: Partial<RecentSearch>): Promise<RecentSearch>;
  
  // Flight Deals
  getActiveDeals(): Promise<FlightDeal[]>;
  getDealsByAirport(airport: string): Promise<FlightDeal[]>;
  createFlightDeal(deal: InsertFlightDeal): Promise<FlightDeal>;
}

export class MemStorage implements IStorage {
  private flightSearches: Map<number, FlightSearch>;
  private flightResults: Map<number, FlightResult>;
  private recentSearches: Map<number, RecentSearch>;
  private flightDeals: Map<number, FlightDeal>;
  private currentSearchId: number;
  private currentResultId: number;
  private currentRecentId: number;
  private currentDealId: number;

  constructor() {
    this.flightSearches = new Map();
    this.flightResults = new Map();
    this.recentSearches = new Map();
    this.flightDeals = new Map();
    this.currentSearchId = 1;
    this.currentResultId = 1;
    this.currentRecentId = 1;
    this.currentDealId = 1;
    
    // Initialize with some sample deals
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample deals for Venice and Treviso
    const sampleDeals: InsertFlightDeal[] = [
      {
        title: "Venice → London",
        fromAirport: "VCE",
        toAirport: "LHR",
        airline: "British Airways",
        originalPrice: 19900, // €199
        dealPrice: 13900, // €139
        discount: 30,
        validUntil: "2025-03-31",
        dealType: "percentage",
        imageUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad",
        isActive: true,
      },
      {
        title: "Treviso → Paris",
        fromAirport: "TSF",
        toAirport: "CDG",
        airline: "Ryanair",
        originalPrice: 9900, // €99
        dealPrice: 6900, // €69
        discount: 30,
        validUntil: "2025-04-15",
        dealType: "best-deal",
        imageUrl: "https://images.unsplash.com/photo-1502602898536-47ad22581b52",
        isActive: true,
      },
      {
        title: "Venice → Barcelona",
        fromAirport: "VCE",
        toAirport: "BCN",
        airline: "Vueling",
        originalPrice: 12900, // €129
        dealPrice: 9500, // €95
        discount: 26,
        validUntil: "2025-02-28",
        dealType: "limited",
        imageUrl: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4",
        isActive: true,
      },
    ];

    sampleDeals.forEach(deal => this.createFlightDeal(deal));

    // Sample recent searches
    const sampleRecentSearches: InsertRecentSearch[] = [
      {
        fromAirport: "VCE",
        toAirport: "CDG",
        departureDate: "2025-03-15",
        returnDate: "2025-03-22",
        bestPrice: 18900,
        searchCount: 3,
      },
      {
        fromAirport: "TSF",
        toAirport: "BCN",
        departureDate: "2025-04-08",
        returnDate: null,
        bestPrice: 9500,
        searchCount: 1,
      },
      {
        fromAirport: "VCE",
        toAirport: "NRT",
        departureDate: "2025-06-01",
        returnDate: "2025-06-15",
        bestPrice: 65000,
        searchCount: 2,
      },
    ];

    sampleRecentSearches.forEach(search => this.addRecentSearch(search));
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

  async createFlightResult(insertResult: InsertFlightResult): Promise<FlightResult> {
    const id = this.currentResultId++;
    const result: FlightResult = {
      ...insertResult,
      id,
      searchId: insertResult.searchId || null,
      stops: insertResult.stops || 0,
      layoverAirport: insertResult.layoverAirport || null,
      layoverDuration: insertResult.layoverDuration || null,
      currency: insertResult.currency || "EUR",
      isLongLayover: insertResult.isLongLayover || false,
      amenities: insertResult.amenities as string[] || null,
    };
    this.flightResults.set(id, result);
    return result;
  }

  async getFlightResults(searchId: number): Promise<FlightResult[]> {
    return Array.from(this.flightResults.values()).filter(
      result => result.searchId === searchId
    );
  }

  async searchFlights(search: InsertFlightSearch): Promise<FlightResult[]> {
    // Handle both string and array formats for airport codes
    const fromAirports = Array.isArray(search.fromAirport) ? search.fromAirport : [search.fromAirport];
    const toAirports = Array.isArray(search.toAirport) ? search.toAirport : [search.toAirport];
    
    // Use the first airport for display purposes in mock data
    const primaryFromAirport = fromAirports[0];
    const primaryToAirport = toAirports[0];
    
    // Generate mock flight results based on search criteria
    const mockResults: FlightResult[] = [
      {
        id: 1,
        searchId: null,
        airline: "Lufthansa",
        flightNumber: "LH 1234",
        aircraftType: "Airbus A320",
        fromAirport: primaryFromAirport,
        toAirport: primaryToAirport,
        departureTime: "14:30",
        arrivalTime: "16:45",
        duration: "2h 15m",
        stops: 0,
        layoverAirport: null,
        layoverDuration: null,
        price: 18900, // €189
        currency: "EUR",
        isLongLayover: false,
        amenities: ["WiFi", "1 bag included", "In-flight entertainment"],
      },
      {
        id: 2,
        searchId: null,
        airline: "Emirates",
        flightNumber: "EK 567 + EK 890",
        aircraftType: "Boeing 777 + A380",
        fromAirport: primaryFromAirport,
        toAirport: primaryToAirport,
        departureTime: "08:15",
        arrivalTime: "20:45",
        duration: "12h 30m",
        stops: 1,
        layoverAirport: "DXB",
        layoverDuration: "8h 15m",
        price: 24500, // €245
        currency: "EUR",
        isLongLayover: true,
        amenities: ["WiFi", "2 bags included", "Lounge access", "Meals included"],
      },
      {
        id: 3,
        searchId: null,
        airline: "KLM",
        flightNumber: "KL 456 + KL 789",
        aircraftType: "Boeing 737 + A330",
        fromAirport: primaryFromAirport,
        toAirport: primaryToAirport,
        departureTime: "10:30",
        arrivalTime: "18:45",
        duration: "8h 15m",
        stops: 1,
        layoverAirport: "AMS",
        layoverDuration: "2h 30m",
        price: 21500, // €215
        currency: "EUR",
        isLongLayover: false,
        amenities: ["WiFi", "1 bag included", "Meals included"],
      },
    ];

    return mockResults;
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

  async getActiveDeals(): Promise<FlightDeal[]> {
    return Array.from(this.flightDeals.values()).filter(deal => deal.isActive);
  }

  async getDealsByAirport(airport: string): Promise<FlightDeal[]> {
    return Array.from(this.flightDeals.values()).filter(
      deal => deal.isActive && (deal.fromAirport === airport || deal.toAirport === airport)
    );
  }

  async createFlightDeal(insertDeal: InsertFlightDeal): Promise<FlightDeal> {
    const id = this.currentDealId++;
    const deal: FlightDeal = {
      ...insertDeal,
      id,
      imageUrl: insertDeal.imageUrl || null,
      isActive: insertDeal.isActive !== undefined ? insertDeal.isActive : true,
    };
    this.flightDeals.set(id, deal);
    return deal;
  }
}

export const storage = new MemStorage();
