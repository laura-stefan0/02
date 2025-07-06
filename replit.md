# FlightFinder Application

## Overview

FlightFinder is a modern flight search application built with React and Express.js. It features a comprehensive flight search interface with advanced filtering capabilities, deals discovery, and long layover exploration functionality. The application uses a component-driven architecture with shadcn/ui components and implements a clean separation between frontend and backend concerns.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: PostgreSQL-based session storage
- **API Pattern**: RESTful API with JSON responses

### Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Management**: Type-safe schema definitions in shared/schema.ts
- **Migration Strategy**: Drizzle Kit for schema migrations
- **Connection**: Neon serverless database connection pooling

## Key Components

### Core Pages
1. **Home Page** (`/`): Main flight search interface with form and results
2. **Deals Page** (`/deals`): Curated flight deals with special offers
3. **Layover Explorer** (`/layover-explorer`): Long layover flights for city exploration
4. **404 Page**: Custom not found page

### Database Schema
- **flight_searches**: User search requests with filters
- **flight_results**: Mock flight data with pricing and routing info
- **recent_searches**: User search history with aggregated data
- **flight_deals**: Curated deals with promotional content

### UI Components
- **FlightSearchForm**: Advanced search form with collapsible filters
- **FlightResults**: Paginated search results with sorting
- **RecentSearches**: Quick access to previous searches
- **Navigation**: Responsive navigation with mobile drawer

### Data Storage Strategy
The application implements a dual storage approach:
- **Production**: PostgreSQL database via Drizzle ORM
- **Development**: In-memory storage class for rapid development
- **Interface**: Common IStorage interface for consistent data operations

## Data Flow

1. **Search Flow**: User submits search → Validation → Database storage → Mock results generation → Response
2. **Results Display**: Results rendering → Price formatting → Amenity display → Booking integration
3. **Recent Searches**: Automatic tracking → Aggregation → Quick re-run functionality
4. **Deals System**: Static deals → Database storage → Promotional display

## External Dependencies

### Core Framework Dependencies
- **@tanstack/react-query**: Server state management and caching
- **@hookform/resolvers**: Form validation integration
- **drizzle-orm**: Type-safe database operations
- **@neondatabase/serverless**: Serverless PostgreSQL driver

### UI Dependencies
- **@radix-ui/***: Headless UI primitives for accessibility
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe CSS variants
- **lucide-react**: Icon library

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type checking and compilation
- **tsx**: TypeScript execution for Node.js

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React app to `dist/public`
2. **Backend Build**: esbuild bundles server code to `dist/index.js`
3. **Asset Optimization**: Vite handles asset optimization and chunking

### Environment Configuration
- **Development**: Hot reload with Vite dev server and tsx execution
- **Production**: Static file serving with Express.js
- **Database**: Environment-based DATABASE_URL configuration

### Hosting Requirements
- Node.js runtime environment
- PostgreSQL database (Neon recommended)
- Static file serving capability
- Environment variable support for DATABASE_URL

## Changelog
- July 05, 2025. Initial setup
- July 05, 2025. Migrated from Replit Agent to Replit environment
- July 05, 2025. Updated Deals and Long Layovers pages layout - title/subtitle on left, airport selection on right

## Recent Changes
- Successfully integrated Amadeus API for real flight data and airport search
- Replaced mock airport search with live Amadeus location API
- Implemented smart fallback system for API failures
- Updated airport selection interface with popover design similar to homepage
- Verified real flight search working with authentic airline data

## User Preferences

Preferred communication style: Simple, everyday language.