import { useState } from "react";
import { ExternalLink, Clock, MapPin, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLongLayoverFlights } from "@/hooks/use-flight-search";
import AirportSelector from "@/components/airport-selector";

export default function LayoverExplorer() {
  const [selectedAirport, setSelectedAirport] = useState<string | null>(null);
  const [showAirportSelector, setShowAirportSelector] = useState(true);
  const { data: layoverFlights, isLoading } = useLongLayoverFlights();

  const handleAirportChange = (airport: { code: string; name: string; city: string; country: string }) => {
    setSelectedAirport(airport.code);
    setShowAirportSelector(false);
  };

  const formatPrice = (price: number) => {
    return `€${(price / 100).toFixed(0)}`;
  };

  if (isLoading) {
    return (
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <Skeleton className="h-10 w-96 mx-auto mb-4" />
            <Skeleton className="h-6 w-64 mx-auto" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section with Title and Airport Selector */}
        {showAirportSelector ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            {/* Left Column - Title and Subtitle */}
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Long Layover Explorer {selectedAirport ? `from ${selectedAirport}` : ''}
              </h1>
              <p className="text-xl text-gray-600">
                Turn your layovers into mini-adventures. Discover flights with extended stopovers perfect for exploring new cities.
              </p>
            </div>
            
            {/* Right Column - Airport Selector */}
            <div>
              <AirportSelector
                selectedAirport={selectedAirport}
                onAirportChange={handleAirportChange}
                title="Select Your Departure Airport"
                subtitle="We'll find long layover flights from your chosen airport"
                onBack={() => setShowAirportSelector(false)}
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            {/* Left Column - Title and Subtitle */}
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Long Layover Explorer {selectedAirport ? `from ${selectedAirport}` : ''}
              </h1>
              <p className="text-xl text-gray-600">
                Turn your layovers into mini-adventures. Discover flights with extended stopovers perfect for exploring new cities.
              </p>
            </div>
            
            {/* Right Column - Change Airport Button */}
            <div className="flex flex-col justify-center">
              {selectedAirport && (
                <div className="text-center lg:text-left">
                  <Button
                    onClick={() => setShowAirportSelector(true)}
                    variant="outline"
                    className="mb-2"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Change Departure Airport
                  </Button>
                  <p className="text-sm text-gray-600">
                    Currently showing layover flights from {selectedAirport}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Only show flights if airport is selected */}
        {!showAirportSelector && selectedAirport && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {layoverFlights?.map((flight) => (
            <Card key={flight.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div 
                className="h-48 relative bg-cover bg-center"
                style={{
                  backgroundImage: `url(${flight.imageUrl})`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">{flight.layoverCity}</h3>
                  <div className="flex items-center mt-1">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{flight.layoverDuration} layover</span>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">{selectedAirport} → {flight.route.split(' → ')[1]}</span>
                    <span className="text-brand-blue font-bold text-xl">{formatPrice(flight.price)}</span>
                  </div>
                  <p className="text-sm text-gray-600">{flight.airline} • Next departure: {flight.nextDeparture}</p>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-amber-800 mb-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    What you can do in {flight.layoverDuration}:
                  </h4>
                  <ul className="text-sm text-amber-700 space-y-1">
                    {flight.activities.map((activity, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-3 w-3 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{activity}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    <Clock className="h-3 w-3 mr-1" />
                    Long Layover
                  </Badge>
                  <Button className="bg-brand-blue hover:bg-brand-blue-dark">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Book This Adventure
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          </div>
        )}

        {/* Call to Action */}
        {!showAirportSelector && selectedAirport && (
        <div className="text-center mt-12">
          <Card className="bg-gradient-to-br from-brand-blue to-brand-blue-dark text-white">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Ready for Your Next Adventure?</h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Discover more long layover opportunities and turn your travel time into exploration time. 
                Every stop is a chance to see something new!
              </p>
              <Button size="lg" variant="secondary" className="font-semibold">
                Find More Long Layover Flights
              </Button>
            </CardContent>
          </Card>
        </div>

        )}

        {/* Tips Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Long Layover Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-brand-blue" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-3">Plan Your Time</h3>
                <p className="text-gray-600 text-sm">
                  Allow at least 3 hours total for airport procedures. Use the remaining time to explore the city or relax at the airport.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-3">Check Visa Requirements</h3>
                <p className="text-gray-600 text-sm">
                  Some countries allow transit passengers to leave the airport without a visa. Always verify requirements before traveling.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-3">Pack Smart</h3>
                <p className="text-gray-600 text-sm">
                  Keep essentials in your carry-on and dress in layers. Consider leaving heavy luggage at the airport if storage is available.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
