import { useState, useEffect } from "react";
import { ExternalLink, Percent, Star, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useFlightDeals } from "@/hooks/use-flight-search";
import AirportSelector from "@/components/airport-selector";
import { getNearestAirport, defaultDepartureAirports } from "@/lib/geolocation";

export default function Deals() {
  const [selectedAirport, setSelectedAirport] = useState<string | null>(null);
  const [showAirportSelector, setShowAirportSelector] = useState(true);
  const { data: deals, isLoading } = useFlightDeals();

  const handleAirportChange = (airport: { code: string; name: string; city: string; country: string }) => {
    setSelectedAirport(airport.code);
    setShowAirportSelector(false);
  };

  const formatPrice = (price: number) => {
    return `€${(price / 100).toFixed(0)}`;
  };

  const getDealBadge = (dealType: string) => {
    switch (dealType) {
      case "percentage":
        return <Badge variant="destructive" className="bg-red-500"><Percent className="h-3 w-3 mr-1" />30% OFF</Badge>;
      case "best-deal":
        return <Badge variant="destructive" className="bg-amber-500"><Star className="h-3 w-3 mr-1" />BEST DEAL</Badge>;
      case "limited":
        return <Badge variant="destructive" className="bg-red-500"><Clock className="h-3 w-3 mr-1" />LIMITED</Badge>;
      default:
        return <Badge variant="secondary">DEAL</Badge>;
    }
  };

  const getDealGradient = (dealType: string) => {
    return "bg-white shadow-lg hover:shadow-xl transition-shadow";
  };

  if (isLoading) {
    return (
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <Skeleton className="h-10 w-96 mx-auto mb-4" />
            <Skeleton className="h-6 w-64 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-24 mb-4" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-10 w-20" />
                    </div>
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
      {/* Header Section - Title, subtitle, and airport selection always visible */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Title and Subtitle */}
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Deals {selectedAirport ? `from ${selectedAirport}` : 'from Your Area'}
            </h1>
            <p className="text-xl text-gray-600">
              Discover amazing flight deals departing from your closest airport
            </p>
          </div>
          
          {/* Right Column - Airport Controls */}
          <div className="flex flex-col justify-center">
            {showAirportSelector ? (
              <AirportSelector
                selectedAirport={selectedAirport}
                onAirportChange={handleAirportChange}
                title="Select Your Departure Airport"
                subtitle="We'll show you the best deals from your chosen airport"
                onBack={() => setShowAirportSelector(false)}
              />
            ) : selectedAirport ? (
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
                  Currently showing deals from {selectedAirport}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Cards Section - Separate div for all cards content */}
      {!showAirportSelector && selectedAirport && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Deals Cards */}
          <div className="mb-24">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deals?.map((deal) => (
                <Card key={deal.id} className={`${getDealGradient(deal.dealType)} overflow-hidden`}>
                  <div 
                    className="h-48 relative bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${deal.imageUrl || 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad'})`,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute top-4 right-4">
                      {getDealBadge(deal.dealType)}
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold">{deal.title}</h3>
                      <p className="text-white/90">From {selectedAirport} • {deal.airline}</p>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-2xl font-bold text-brand-blue">{formatPrice(deal.dealPrice)}</span>
                        <span className="text-gray-500 line-through ml-2">{formatPrice(deal.originalPrice)}</span>
                      </div>
                      <Button className="bg-brand-blue hover:bg-brand-blue-dark">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Deal
                      </Button>
                    </div>
                    <div className="text-sm text-gray-600">
                      Valid until: {new Date(deal.validUntil).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Airport Information Cards */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Venice Marco Polo Airport (VCE)</h3>
                  <p className="text-gray-600 mb-4">
                    Venice's main international airport, perfectly positioned for exploring Northern Italy and beyond.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Direct flights to major European destinations</li>
                    <li>• Easy access to Venice city center via water bus</li>
                    <li>• Modern facilities and duty-free shopping</li>
                    <li>• Car rental and public transport connections</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Treviso Airport (TSF)</h3>
                  <p className="text-gray-600 mb-4">
                    Budget-friendly airport serving the Veneto region with excellent low-cost carrier connections.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Popular with budget airlines like Ryanair</li>
                    <li>• 40-minute bus ride to Venice</li>
                    <li>• Smaller, more manageable airport experience</li>
                    <li>• Great deals to European destinations</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
