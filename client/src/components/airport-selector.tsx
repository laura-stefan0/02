import { useState, useEffect } from "react";
import { MapPin, Plane, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getNearestAirport, defaultDepartureAirports, type GeolocationResult } from "@/lib/geolocation";
import { airports } from "@/lib/airports";

interface AirportSelectorProps {
  selectedAirport: string | null;
  onAirportChange: (airport: { code: string; name: string; city: string; country: string }) => void;
  title: string;
  subtitle: string;
  onBack?: () => void;
}

export default function AirportSelector({ selectedAirport, onAirportChange, title, subtitle, onBack }: AirportSelectorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [nearestAirport, setNearestAirport] = useState<GeolocationResult | null>(null);
  const [showManualSelection, setShowManualSelection] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [hasTriedGeolocation, setHasTriedGeolocation] = useState(false);

  // Automatically try to get location on mount
  useEffect(() => {
    if (!hasTriedGeolocation) {
      handleGetLocation();
    }
  }, [hasTriedGeolocation]);

  const handleGetLocation = async () => {
    setIsLoading(true);
    setHasTriedGeolocation(true);
    
    try {
      const result = await getNearestAirport();
      if (result) {
        setNearestAirport(result);
        if (!selectedAirport) {
          onAirportChange(result.airport);
        }
      }
    } catch (error) {
      console.error('Geolocation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAirports = airports.filter(airport =>
    airport.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    airport.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    airport.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    airport.country.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 10);

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600">{subtitle}</p>
        </div>

        {/* Current Selection */}
        {selectedAirport && (
          <div className="mb-4">
            <button
              onClick={onBack}
              className="w-full p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Plane className="h-5 w-5 text-blue-600 mr-2" />
                  <div className="text-left">
                    <p className="font-medium text-blue-900">
                      {airports.find(a => a.code === selectedAirport)?.name || selectedAirport}
                    </p>
                    <p className="text-sm text-blue-700">
                      {airports.find(a => a.code === selectedAirport)?.city}, {airports.find(a => a.code === selectedAirport)?.country}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  <Check className="h-3 w-3 mr-1" />
                  Selected
                </Badge>
              </div>
            </button>
            <p className="text-xs text-gray-600 text-center mt-2">Click to confirm and continue</p>
          </div>
        )}

        {/* Geolocation Option */}
        {!showManualSelection && (
          <div className="space-y-4">
            {nearestAirport && !selectedAirport && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-green-600 mr-2" />
                    <div>
                      <p className="font-medium text-green-900">Nearest Airport Found</p>
                      <p className="text-sm text-green-700">
                        {nearestAirport.airport.name} ({nearestAirport.airport.code}) - {nearestAirport.distance}km away
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => onAirportChange(nearestAirport.airport)}
                    variant="outline"
                    size="sm"
                    className="border-green-300 text-green-700 hover:bg-green-100"
                  >
                    Use This Airport
                  </Button>
                </div>
              </div>
            )}

            {!nearestAirport && !selectedAirport && (
              <div className="text-center">
                <Button
                  onClick={handleGetLocation}
                  disabled={isLoading}
                  className="bg-brand-blue hover:bg-brand-blue-dark"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Getting Location...
                    </>
                  ) : (
                    <>
                      <MapPin className="h-4 w-4 mr-2" />
                      Use My Location
                    </>
                  )}
                </Button>
              </div>
            )}

            <div className="text-center">
              <Button
                onClick={() => setShowManualSelection(true)}
                variant="outline"
                size="sm"
              >
                Choose Different Airport
              </Button>
            </div>
          </div>
        )}

        {/* Manual Selection */}
        {showManualSelection && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="airport-search">Search Airports</Label>
              <Input
                id="airport-search"
                placeholder="Search by airport name, city, or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2">
              {filteredAirports.map((airport) => (
                <button
                  key={airport.code}
                  onClick={() => {
                    onAirportChange({
                      code: airport.code,
                      name: airport.name,
                      city: airport.city,
                      country: airport.country
                    });
                    setShowManualSelection(false);
                    setSearchTerm("");
                  }}
                  className="w-full p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 text-left transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{airport.name} ({airport.code})</p>
                      <p className="text-sm text-gray-600">{airport.city}, {airport.country}</p>
                    </div>
                    {selectedAirport === airport.code && (
                      <Check className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="text-center">
              <Button
                onClick={() => {
                  setShowManualSelection(false);
                  setSearchTerm("");
                }}
                variant="outline"
                size="sm"
              >
                Back
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}