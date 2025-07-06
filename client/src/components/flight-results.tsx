import { Clock, Plane, Wifi, Briefcase, MapPin, Filter, ArrowUpDown, Calendar, TrendingDown, Star, Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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
    <div className="min-h-screen bg-gray-50">
      {/* Top Results Summary - Skyscanner Style */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">
              {results.count} flights • {results.search?.fromAirport} → {results.search?.toAirport}
            </h3>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Change dates
            </Button>
          </div>

          {/* Quick filter tabs - Skyscanner style */}
          <Tabs defaultValue="best" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="best" className="flex items-center">
                <Star className="h-4 w-4 mr-1" />
                Best
              </TabsTrigger>
              <TabsTrigger value="cheapest" className="flex items-center">
                <TrendingDown className="h-4 w-4 mr-1" />
                Cheapest
              </TabsTrigger>
              <TabsTrigger value="fastest" className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Fastest
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Left Sidebar - Kiwi.com style filters */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">Filters</h4>
                <Button variant="ghost" size="sm" className="text-brand-blue">
                  Reset
                </Button>
              </div>

              <div className="space-y-6">
                {/* Price Range */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">Price Range</Label>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>€0</span>
                      <span>€800</span>
                    </div>
                    <Slider
                      value={[0, 800]}
                      max={800}
                      min={0}
                      step={25}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Stops */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">Stops</Label>
                  <div className="space-y-2">
                    {[
                      { value: "direct", label: "Direct", price: "€245" },
                      { value: "1-stop", label: "1 Stop", price: "€189" },
                      { value: "2-stops", label: "2+ Stops", price: "€156" }
                    ].map((stop) => (
                      <div key={stop.value} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox id={stop.value} />
                          <Label htmlFor={stop.value} className="text-sm text-gray-700">
                            {stop.label}
                          </Label>
                        </div>
                        <span className="text-sm text-gray-500">{stop.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Airlines */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">Airlines</Label>
                  <div className="space-y-2">
                    {["Emirates", "KLM", "Lufthansa", "Turkish Airlines"].map((airline) => (
                      <div key={airline} className="flex items-center space-x-2">
                        <Checkbox id={airline} />
                        <Label htmlFor={airline} className="text-sm text-gray-700">{airline}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Departure Time */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">Departure Time</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { time: "00-06", label: "Night" },
                      { time: "06-12", label: "Morning" },
                      { time: "12-18", label: "Afternoon" },
                      { time: "18-24", label: "Evening" }
                    ].map((slot) => (
                      <div key={slot.time} className="text-center p-2 border border-gray-200 rounded cursor-pointer hover:bg-gray-50">
                        <div className="text-xs text-gray-500">{slot.time}</div>
                        <div className="text-xs font-medium">{slot.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Results - Hybrid design */}
          <div className="flex-1">
            <div className="space-y-3">
              {results.results.map((flight, index) => (
                <Card key={flight.id} className="hover:shadow-md transition-all duration-200 border border-gray-200">
                  <CardContent className="p-4">
                    {/* Top section with airline and price */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {flight.airline.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{flight.airline}</div>
                          <div className="text-sm text-gray-500">{flight.flightNumber}</div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-brand-blue">{formatPrice(flight.price)}</div>
                        <div className="text-sm text-gray-500">per person</div>
                        {index === 0 && (
                          <Badge className="bg-green-100 text-green-800 text-xs mt-1">Best Value</Badge>
                        )}
                      </div>
                    </div>

                    {/* Flight details - Clean Kiwi.com style */}
                    <div className="flex items-center justify-between">
                      {/* Departure */}
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{flight.departureTime}</div>
                        <div className="text-sm text-gray-500">{flight.fromAirport}</div>
                      </div>

                      {/* Flight path */}
                      <div className="flex-1 mx-4">
                        <div className="relative">
                          <div className="flex items-center justify-center">
                            <div className="h-px bg-gray-300 flex-1"></div>
                            <div className="mx-2 text-center">
                              <div className="text-xs font-medium text-gray-600">{flight.duration}</div>
                              {flight.stops === 0 ? (
                                <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs mt-1">
                                  Direct
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="bg-amber-100 text-amber-800 text-xs mt-1">
                                  {flight.stops} stop{flight.stops > 1 ? 's' : ''}
                                </Badge>
                              )}
                            </div>
                            <div className="h-px bg-gray-300 flex-1"></div>
                          </div>
                          {flight.layoverAirport && (
                            <div className="text-center mt-1">
                              <span className="text-xs text-gray-500">via {flight.layoverAirport}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Arrival */}
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{flight.arrivalTime}</div>
                        <div className="text-sm text-gray-500">{flight.toAirport}</div>
                      </div>

                      {/* Book button */}
                      <div className="ml-6">
                        <Button className="bg-brand-blue hover:bg-brand-blue-dark px-6">
                          Select
                        </Button>
                      </div>
                    </div>

                    {/* Amenities - Compact display */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        {flight.amenities?.includes("WiFi") && (
                          <div className="flex items-center">
                            <Wifi className="h-3 w-3 mr-1" />
                            <span>WiFi</span>
                          </div>
                        )}
                        {flight.amenities?.includes("1 bag included") && (
                          <div className="flex items-center">
                            <Briefcase className="h-3 w-3 mr-1" />
                            <span>1 bag</span>
                          </div>
                        )}
                        {flight.amenities?.includes("Meals included") && (
                          <div className="flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            <span>Meals</span>
                          </div>
                        )}
                      </div>
                      
                      {flight.isLongLayover && (
                        <Badge className="bg-blue-100 text-blue-800 text-xs">
                          <MapPin className="h-3 w-3 mr-1" />
                          City break
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load more */}
            <div className="text-center mt-6">
              <Button variant="outline" size="lg">
                Show more results
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
