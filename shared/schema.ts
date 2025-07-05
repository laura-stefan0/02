import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Flight search requests
export const flightSearches = pgTable("flight_searches", {
  id: serial("id").primaryKey(),
  fromAirport: text("from_airport").notNull(),
  toAirport: text("to_airport").notNull(),
  departureDate: text("departure_date").notNull(),
  returnDate: text("return_date"),
  passengers: integer("passengers").notNull().default(1),
  filters: jsonb("filters").$type<{
    priceRange?: [number, number];
    departureTime?: string[];
    stops?: "direct" | "1-stop" | "2plus-stops";
    airlines?: string[];
    maxDuration?: number;
    layoverDuration?: "short" | "long";
    aircraftType?: string[];
  }>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Flight results (mock data structure)
export const flightResults = pgTable("flight_results", {
  id: serial("id").primaryKey(),
  searchId: integer("search_id").references(() => flightSearches.id),
  airline: text("airline").notNull(),
  flightNumber: text("flight_number").notNull(),
  aircraftType: text("aircraft_type").notNull(),
  fromAirport: text("from_airport").notNull(),
  toAirport: text("to_airport").notNull(),
  departureTime: text("departure_time").notNull(),
  arrivalTime: text("arrival_time").notNull(),
  duration: text("duration").notNull(),
  stops: integer("stops").notNull().default(0),
  layoverAirport: text("layover_airport"),
  layoverDuration: text("layover_duration"),
  price: integer("price").notNull(), // in cents
  currency: text("currency").notNull().default("EUR"),
  isLongLayover: boolean("is_long_layover").default(false),
  amenities: jsonb("amenities").$type<string[]>(),
});

// Recent searches for user tracking
export const recentSearches = pgTable("recent_searches", {
  id: serial("id").primaryKey(),
  fromAirport: text("from_airport").notNull(),
  toAirport: text("to_airport").notNull(),
  departureDate: text("departure_date").notNull(),
  returnDate: text("return_date"),
  bestPrice: integer("best_price"), // in cents
  searchCount: integer("search_count").notNull().default(1),
  lastSearched: timestamp("last_searched").defaultNow().notNull(),
});

// Flight deals
export const flightDeals = pgTable("flight_deals", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  fromAirport: text("from_airport").notNull(),
  toAirport: text("to_airport").notNull(),
  airline: text("airline").notNull(),
  originalPrice: integer("original_price").notNull(),
  dealPrice: integer("deal_price").notNull(),
  discount: integer("discount").notNull(), // percentage
  validUntil: text("valid_until").notNull(),
  dealType: text("deal_type").notNull(), // "percentage" | "best-deal" | "limited"
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true),
});

// Zod schemas
export const insertFlightSearchSchema = createInsertSchema(flightSearches).omit({
  id: true,
  createdAt: true,
});

export const insertFlightResultSchema = createInsertSchema(flightResults).omit({
  id: true,
});

export const insertRecentSearchSchema = createInsertSchema(recentSearches).omit({
  id: true,
  lastSearched: true,
});

export const insertFlightDealSchema = createInsertSchema(flightDeals).omit({
  id: true,
});

// Types
export type InsertFlightSearch = z.infer<typeof insertFlightSearchSchema>;
export type FlightSearch = typeof flightSearches.$inferSelect;
export type InsertFlightResult = z.infer<typeof insertFlightResultSchema>;
export type FlightResult = typeof flightResults.$inferSelect;
export type InsertRecentSearch = z.infer<typeof insertRecentSearchSchema>;
export type RecentSearch = typeof recentSearches.$inferSelect;
export type InsertFlightDeal = z.infer<typeof insertFlightDealSchema>;
export type FlightDeal = typeof flightDeals.$inferSelect;
