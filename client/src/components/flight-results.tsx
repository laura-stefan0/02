import { Clock, Plane, Wifi, Briefcase, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { FlightResult } from "@/lib/types";

interface FlightResultsProps {
  results?: {
    results: FlightResult[];
    count: number;
    search: any;
  };
  isLoading?: boolean;
}

export default function FlightResults({ results, isLoading }: FlightResultsProps) {
  if (isLoading) {
    return (
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="w-12 h-12 rounded-lg" />
                    <div>
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-6 w-16 mb-1" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
                <Skeleton className="h-20 w-full" />
              </div>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (!results || results.results.length === 0) {
    return (
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plane className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No flights found</h3>
          <p className="text-gray-600">
            Try adjusting your search criteria or check back later for new flights.
          </p>
        </div>
      </section>
    );
  }

  const formatPrice = (price: number) => {
    return `€${(price / 100).toFixed(0)}`;
  };

  const getStopsBadge = (stops: number) => {
    if (stops === 0) {
      return <Badge variant="secondary" className="bg-green-100 text-green-800">Direct</Badge>;
    } else if (stops === 1) {
      return <Badge variant="secondary" className="bg-amber-100 text-amber-800">1 Stop</Badge>;
    } else {
      return <Badge variant="secondary" className="bg-gray-100 text-gray-800">{stops} Stops</Badge>;
    }
  };

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Flight Results</h3>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-gray-600">
            {results.count} flights found for {results.search?.fromAirport} → {results.search?.toAirport}
          </p>
          <div className="flex items-center space-x-4">
            <Select defaultValue="price">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Sort by: Price (Low to High)</SelectItem>
                <SelectItem value="duration">Sort by: Duration</SelectItem>
                <SelectItem value="departure">Sort by: Departure Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {results.results.map((flight) => (
          <Card key={flight.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Plane className="text-brand-blue text-xl" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{flight.airline} • {flight.flightNumber}</h4>
                        <p className="text-sm text-gray-500">{flight.aircraftType}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{formatPrice(flight.price)}</div>
                      <p className="text-sm text-gray-500">per person</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Flight Route */}
                    <div className="flex items-center space-x-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{flight.departureTime}</div>
                        <div className="text-sm text-gray-500">{flight.fromAirport}</div>
                      </div>
                      <div className="flex-1">
                        <div className="relative">
                          <div className="h-px bg-gray-300 w-full"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white px-2">
                              <div className="text-xs text-gray-500">{flight.duration}</div>
                            </div>
                          </div>
                        </div>
                        <div className="text-center mt-1">
                          {getStopsBadge(flight.stops)}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{flight.arrivalTime}</div>
                        <div className="text-sm text-gray-500">{flight.toAirport}</div>
                      </div>
                    </div>

                    {/* Layover Info (if applicable) */}
                    {flight.isLongLayover && flight.layoverAirport && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <div className="flex items-center mb-2">
                          <Clock className="text-amber-600 mr-2 h-4 w-4" />
                          <span className="font-medium text-amber-800">Long Layover in {flight.layoverAirport}</span>
                        </div>
                        <p className="text-sm text-amber-700">{flight.layoverDuration} layover - Perfect for city exploration!</p>
                        <button className="text-xs text-brand-blue hover:underline mt-1">Explore {flight.layoverAirport}</button>
                      </div>
                    )}

                    {/* Flight Details */}
                    <div className={`flex flex-wrap gap-4 text-sm text-gray-600 ${flight.isLongLayover ? 'md:col-span-1' : 'md:col-span-2'}`}>
                      <div className="flex items-center">
                        <Clock className="mr-2 text-gray-400 h-4 w-4" />
                        <span>Duration: {flight.duration}</span>
                      </div>
                      {flight.amenities?.includes("1 bag included") && (
                        <div className="flex items-center">
                          <Briefcase className="mr-2 text-gray-400 h-4 w-4" />
                          <span>1 bag included</span>
                        </div>
                      )}
                      {flight.amenities?.includes("WiFi") && (
                        <div className="flex items-center">
                          <Wifi className="mr-2 text-gray-400 h-4 w-4" />
                          <span>WiFi available</span>
                        </div>
                      )}
                      {flight.stops > 0 && flight.layoverAirport && (
                        <div className="flex items-center">
                          <MapPin className="mr-2 text-gray-400 h-4 w-4" />
                          <span>Via {flight.layoverAirport}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 lg:mt-0 lg:ml-6">
                  <Button className="w-full lg:w-auto bg-brand-blue hover:bg-brand-blue-dark">
                    Select Flight
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center mt-8">
        <Button variant="outline" size="lg">
          Load More Results
        </Button>
      </div>
    </section>
  );
}
