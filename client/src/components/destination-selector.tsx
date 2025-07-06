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

  // Popular destinations for quick selection
  const popularDestinations = [
    { code: "CDG", name: "Paris", country: "France" },
    { code: "LHR", name: "London", country: "United Kingdom" },
    { code: "FCO", name: "Rome", country: "Italy" },
    { code: "BCN", name: "Barcelona", country: "Spain" },
    { code: "AMS", name: "Amsterdam", country: "Netherlands" },
    { code: "BER", name: "Berlin", country: "Germany" },
    { code: "MAD", name: "Madrid", country: "Spain" },
    { code: "VIE", name: "Vienna", country: "Austria" },
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

  const filteredDestinations = popularDestinations.filter(dest =>
    dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dest.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dest.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    
    const destination = popularDestinations.find(d => d.code === value);
    return destination ? `${destination.name} (${destination.code})` : value;
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
              {filteredDestinations.map((destination) => (
                <button
                  key={destination.code}
                  onClick={() => handleDestinationSelect(destination)}
                  className="w-full text-left p-3 hover:bg-gray-50 flex items-center justify-between border-b border-gray-100 last:border-b-0"
                >
                  <div>
                    <div className="font-medium">{destination.name}</div>
                    <div className="text-sm text-gray-500">{destination.country}</div>
                  </div>
                  <div className="text-sm font-mono text-gray-400">
                    {destination.code}
                  </div>
                </button>
              ))}
              {filteredDestinations.length === 0 && searchTerm && (
                <div className="p-3 text-center text-gray-500">
                  No destinations found for "{searchTerm}"
                </div>
              )}
              {!searchTerm && (
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
                        {destination.name}
                      </Button>
                    ))}
                  </div>
                </div>
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