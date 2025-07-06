import { useState } from "react";
import { MapPin, ChevronDown, Globe, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface DestinationSelectorProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export default function DestinationSelector({ 
  value, 
  onChange, 
  placeholder = "Add destination",
  label = "To"
}: DestinationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"specific" | "anywhere">("specific");
  const [searchTerm, setSearchTerm] = useState("");

  // Comprehensive destinations including cities, airports, countries, and regions
  const allDestinations = [
    // Major Italian destinations
    { code: "VCE", name: "Venice", city: "Venice", country: "Italy", type: "airport" },
    { code: "TSF", name: "Treviso", city: "Treviso", country: "Italy", type: "airport" },
    { code: "FCO", name: "Rome Fiumicino", city: "Rome", country: "Italy", type: "airport" },
    { code: "CIA", name: "Rome Ciampino", city: "Rome", country: "Italy", type: "airport" },
    { code: "MXP", name: "Milan Malpensa", city: "Milan", country: "Italy", type: "airport" },
    { code: "LIN", name: "Milan Linate", city: "Milan", country: "Italy", type: "airport" },
    { code: "BGY", name: "Milan Bergamo", city: "Milan", country: "Italy", type: "airport" },
    { code: "NAP", name: "Naples", city: "Naples", country: "Italy", type: "airport" },
    { code: "CTA", name: "Catania", city: "Catania", country: "Italy", type: "airport" },
    { code: "PMO", name: "Palermo", city: "Palermo", country: "Italy", type: "airport" },
    
    // Major European destinations
    { code: "CDG", name: "Paris Charles de Gaulle", city: "Paris", country: "France", type: "airport" },
    { code: "ORY", name: "Paris Orly", city: "Paris", country: "France", type: "airport" },
    { code: "LHR", name: "London Heathrow", city: "London", country: "United Kingdom", type: "airport" },
    { code: "LGW", name: "London Gatwick", city: "London", country: "United Kingdom", type: "airport" },
    { code: "STN", name: "London Stansted", city: "London", country: "United Kingdom", type: "airport" },
    { code: "BCN", name: "Barcelona", city: "Barcelona", country: "Spain", type: "airport" },
    { code: "MAD", name: "Madrid", city: "Madrid", country: "Spain", type: "airport" },
    { code: "AMS", name: "Amsterdam", city: "Amsterdam", country: "Netherlands", type: "airport" },
    { code: "BER", name: "Berlin Brandenburg", city: "Berlin", country: "Germany", type: "airport" },
    { code: "MUC", name: "Munich", city: "Munich", country: "Germany", type: "airport" },
    { code: "FRA", name: "Frankfurt", city: "Frankfurt", country: "Germany", type: "airport" },
    { code: "VIE", name: "Vienna", city: "Vienna", country: "Austria", type: "airport" },
    { code: "ZUR", name: "Zurich", city: "Zurich", country: "Switzerland", type: "airport" },
    { code: "GVA", name: "Geneva", city: "Geneva", country: "Switzerland", type: "airport" },
    { code: "ARN", name: "Stockholm", city: "Stockholm", country: "Sweden", type: "airport" },
    { code: "CPH", name: "Copenhagen", city: "Copenhagen", country: "Denmark", type: "airport" },
    { code: "OSL", name: "Oslo", city: "Oslo", country: "Norway", type: "airport" },
    { code: "HEL", name: "Helsinki", city: "Helsinki", country: "Finland", type: "airport" },
    { code: "LIS", name: "Lisbon", city: "Lisbon", country: "Portugal", type: "airport" },
    { code: "OPO", name: "Porto", city: "Porto", country: "Portugal", type: "airport" },
    { code: "ATH", name: "Athens", city: "Athens", country: "Greece", type: "airport" },
    { code: "BUD", name: "Budapest", city: "Budapest", country: "Hungary", type: "airport" },
    { code: "PRG", name: "Prague", city: "Prague", country: "Czech Republic", type: "airport" },
    { code: "WAW", name: "Warsaw", city: "Warsaw", country: "Poland", type: "airport" },
    { code: "KRK", name: "Krakow", city: "Krakow", country: "Poland", type: "airport" },
    
    // Countries
    { code: "IT", name: "Italy", city: "", country: "Italy", type: "country" },
    { code: "FR", name: "France", city: "", country: "France", type: "country" },
    { code: "ES", name: "Spain", city: "", country: "Spain", type: "country" },
    { code: "DE", name: "Germany", city: "", country: "Germany", type: "country" },
    { code: "UK", name: "United Kingdom", city: "", country: "United Kingdom", type: "country" },
    { code: "NL", name: "Netherlands", city: "", country: "Netherlands", type: "country" },
    { code: "AT", name: "Austria", city: "", country: "Austria", type: "country" },
    { code: "CH", name: "Switzerland", city: "", country: "Switzerland", type: "country" },
    { code: "GR", name: "Greece", city: "", country: "Greece", type: "country" },
    { code: "PT", name: "Portugal", city: "", country: "Portugal", type: "country" },
    
    // Regions
    { code: "SOUTHERN_EUROPE", name: "Southern Europe", city: "", country: "", type: "region" },
    { code: "NORTHERN_EUROPE", name: "Northern Europe", city: "", country: "", type: "region" },
    { code: "WESTERN_EUROPE", name: "Western Europe", city: "", country: "", type: "region" },
    { code: "EASTERN_EUROPE", name: "Eastern Europe", city: "", country: "", type: "region" },
    { code: "SCANDINAVIA", name: "Scandinavia", city: "", country: "", type: "region" },
    { code: "BALKANS", name: "Balkans", city: "", country: "", type: "region" },
  ];

  // European regions for "anywhere" mode
  const regions = [
    { code: "europe", name: "Anywhere in Europe" },
    { code: "mediterranean", name: "Mediterranean" },
    { code: "northern-europe", name: "Northern Europe" },
    { code: "western-europe", name: "Western Europe" },
    { code: "eastern-europe", name: "Eastern Europe" },
    { code: "worldwide", name: "Anywhere in the world" },
  ];

  const filteredDestinations = allDestinations.filter(dest => {
    if (!searchTerm) return false; // Show nothing when no search term for "From" field
    
    const search = searchTerm.toLowerCase();
    return (
      dest.name.toLowerCase().includes(search) ||
      dest.code.toLowerCase().includes(search) ||
      dest.city.toLowerCase().includes(search) ||
      dest.country.toLowerCase().includes(search) ||
      (dest.type === "region" && dest.name.toLowerCase().includes(search))
    );
  });

  // For "To" field, show popular destinations when no search term
  const isFromField = label === "From";
  const popularDestinations = allDestinations.filter(dest => dest.type === "airport").slice(0, 8);

  const handleDestinationSelect = (destination: { code: string; name: string }) => {
    onChange(destination.code);
    setIsOpen(false);
  };

  const handleRegionSelect = (region: { code: string; name: string }) => {
    onChange(`anywhere:${region.code}`);
    setIsOpen(false);
  };

  const getDisplayValue = () => {
    if (!value) return placeholder;
    
    if (value.startsWith("anywhere:")) {
      const regionCode = value.split(":")[1];
      const region = regions.find(r => r.code === regionCode);
      return region ? region.name : "Anywhere";
    }
    
    const destination = allDestinations.find(d => d.code === value);
    if (destination) {
      if (destination.type === "airport") {
        return `${destination.city || destination.name} (${destination.code})`;
      }
      return destination.name;
    }
    
    return value;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-between text-left font-normal h-12",
            !value && "text-muted-foreground"
          )}
        >
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-400" />
            {getDisplayValue()}
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="start">
        {/* Tab navigation */}
        <div className="flex border-b">
          <button
            onClick={() => setMode("specific")}
            className={cn(
              "flex-1 px-3 py-2 text-sm font-medium border-b-2 transition-colors",
              mode === "specific" 
                ? "border-blue-500 text-blue-600 bg-blue-50" 
                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            )}
          >
            Destinations
          </button>
          <button
            onClick={() => setMode("anywhere")}
            className={cn(
              "flex-1 px-3 py-2 text-sm font-medium border-b-2 transition-colors",
              mode === "anywhere" 
                ? "border-blue-500 text-blue-600 bg-blue-50" 
                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            )}
          >
            Anywhere
          </button>
        </div>

        {/* Quick access regions always visible */}
        <div className="p-3 border-b bg-gray-50">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRegionSelect({ code: "europe", name: "Anywhere in Europe" })}
              className="text-xs"
            >
              <Globe className="h-3 w-3 mr-1" />
              Europe
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRegionSelect({ code: "mediterranean", name: "Mediterranean" })}
              className="text-xs"
            >
              <Globe className="h-3 w-3 mr-1" />
              Mediterranean
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRegionSelect({ code: "northern-europe", name: "Northern Europe" })}
              className="text-xs"
            >
              <Globe className="h-3 w-3 mr-1" />
              Northern
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRegionSelect({ code: "worldwide", name: "Anywhere in the world" })}
              className="text-xs"
            >
              <Globe className="h-3 w-3 mr-1" />
              Worldwide
            </Button>
          </div>
        </div>

        {/* Search bar always visible */}
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search destinations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="p-0">
          {mode === "specific" && (
            <div className="max-h-64 overflow-y-auto">
              {searchTerm ? (
                // Show filtered results when typing
                <>
                  {filteredDestinations.map((destination) => (
                    <button
                      key={destination.code}
                      onClick={() => handleDestinationSelect(destination)}
                      className="w-full text-left p-3 hover:bg-gray-50 flex items-center justify-between border-b border-gray-100 last:border-b-0"
                    >
                      <div>
                        <div className="font-medium">{destination.name}</div>
                        <div className="text-sm text-gray-500">
                          {destination.type === "airport" && destination.city && `${destination.city}, `}
                          {destination.country}
                          {destination.type === "region" && " • Region"}
                          {destination.type === "country" && " • Country"}
                        </div>
                      </div>
                      <div className="text-sm font-mono text-gray-400">
                        {destination.type === "airport" ? destination.code : ""}
                      </div>
                    </button>
                  ))}
                  {filteredDestinations.length === 0 && (
                    <div className="p-3 text-center text-gray-500">
                      No destinations found for "{searchTerm}"
                    </div>
                  )}
                </>
              ) : (
                // Show popular destinations only for "To" field when no search term
                <>
                  {!isFromField && (
                    <div className="p-3">
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">
                        Popular destinations
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        {popularDestinations.slice(0, 6).map((destination) => (
                          <Button
                            key={destination.code}
                            variant="outline"
                            size="sm"
                            onClick={() => handleDestinationSelect(destination)}
                            className="text-xs justify-start"
                          >
                            {destination.city || destination.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  {isFromField && (
                    <div className="p-3 text-center text-gray-500">
                      Start typing to search for destinations...
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {mode === "anywhere" && (
            <div className="max-h-64 overflow-y-auto">
              <div className="p-3">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Explore by region
                </Label>
                <div className="space-y-2">
                  {regions.map((region) => (
                    <button
                      key={region.code}
                      onClick={() => handleRegionSelect(region)}
                      className="w-full text-left p-2 hover:bg-gray-50 flex items-center gap-3 rounded border border-gray-200"
                    >
                      <Globe className="h-4 w-4 text-blue-500" />
                      <span className="font-medium text-sm">{region.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}