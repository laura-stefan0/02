
import { useState, useRef, useEffect } from "react";
import { MapPin, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface DepartureSelectorProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export default function DepartureSelector({ 
  value, 
  onChange, 
  placeholder = "Add departure",
  label = "From"
}: DepartureSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

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
    
    // Global cities with airports
    { code: "TUN", name: "Tunis", city: "Tunis", country: "Tunisia", type: "airport" },
    { code: "PEK", name: "Beijing", city: "Beijing", country: "China", type: "airport" },
    { code: "PVG", name: "Shanghai", city: "Shanghai", country: "China", type: "airport" },
    { code: "NRT", name: "Tokyo Narita", city: "Tokyo", country: "Japan", type: "airport" },
    { code: "HND", name: "Tokyo Haneda", city: "Tokyo", country: "Japan", type: "airport" },
    { code: "ICN", name: "Seoul", city: "Seoul", country: "South Korea", type: "airport" },
    { code: "SIN", name: "Singapore", city: "Singapore", country: "Singapore", type: "airport" },
    { code: "DXB", name: "Dubai", city: "Dubai", country: "United Arab Emirates", type: "airport" },
    { code: "DOH", name: "Doha", city: "Doha", country: "Qatar", type: "airport" },
    { code: "CAI", name: "Cairo", city: "Cairo", country: "Egypt", type: "airport" },
    { code: "JFK", name: "New York JFK", city: "New York", country: "United States", type: "airport" },
    { code: "LAX", name: "Los Angeles", city: "Los Angeles", country: "United States", type: "airport" },
    { code: "YYZ", name: "Toronto", city: "Toronto", country: "Canada", type: "airport" },
    { code: "GRU", name: "São Paulo", city: "São Paulo", country: "Brazil", type: "airport" },
    { code: "BOG", name: "Bogotá", city: "Bogotá", country: "Colombia", type: "airport" },
    { code: "LIM", name: "Lima", city: "Lima", country: "Peru", type: "airport" },
    { code: "SCL", name: "Santiago", city: "Santiago", country: "Chile", type: "airport" },
    { code: "EZE", name: "Buenos Aires", city: "Buenos Aires", country: "Argentina", type: "airport" },
    { code: "CPT", name: "Cape Town", city: "Cape Town", country: "South Africa", type: "airport" },
    { code: "JNB", name: "Johannesburg", city: "Johannesburg", country: "South Africa", type: "airport" },
    { code: "DKR", name: "Dakar", city: "Dakar", country: "Senegal", type: "airport" },
    { code: "LOS", name: "Lagos", city: "Lagos", country: "Nigeria", type: "airport" },
    { code: "ACC", name: "Accra", city: "Accra", country: "Ghana", type: "airport" },
    { code: "ADD", name: "Addis Ababa", city: "Addis Ababa", country: "Ethiopia", type: "airport" },
    { code: "NBO", name: "Nairobi", city: "Nairobi", country: "Kenya", type: "airport" },
    { code: "BOM", name: "Mumbai", city: "Mumbai", country: "India", type: "airport" },
    { code: "DEL", name: "Delhi", city: "Delhi", country: "India", type: "airport" },
    { code: "BLR", name: "Bangalore", city: "Bangalore", country: "India", type: "airport" },
    { code: "BKK", name: "Bangkok", city: "Bangkok", country: "Thailand", type: "airport" },
    { code: "KUL", name: "Kuala Lumpur", city: "Kuala Lumpur", country: "Malaysia", type: "airport" },
    { code: "CGK", name: "Jakarta", city: "Jakarta", country: "Indonesia", type: "airport" },
    { code: "MNL", name: "Manila", city: "Manila", country: "Philippines", type: "airport" },
    { code: "SYD", name: "Sydney", city: "Sydney", country: "Australia", type: "airport" },
    { code: "MEL", name: "Melbourne", city: "Melbourne", country: "Australia", type: "airport" },
    { code: "AKL", name: "Auckland", city: "Auckland", country: "New Zealand", type: "airport" },
    { code: "TAS", name: "Tashkent", city: "Tashkent", country: "Uzbekistan", type: "airport" },
    { code: "ALA", name: "Almaty", city: "Almaty", country: "Kazakhstan", type: "airport" },
    { code: "SVO", name: "Moscow", city: "Moscow", country: "Russia", type: "airport" },
    
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
    { code: "TN", name: "Tunisia", city: "", country: "Tunisia", type: "country" },
    { code: "SN", name: "Senegal", city: "", country: "Senegal", type: "country" },
    { code: "CO", name: "Colombia", city: "", country: "Colombia", type: "country" },
    { code: "CN", name: "China", city: "", country: "China", type: "country" },
    { code: "JP", name: "Japan", city: "", country: "Japan", type: "country" },
    { code: "KR", name: "South Korea", city: "", country: "South Korea", type: "country" },
    { code: "SG", name: "Singapore", city: "", country: "Singapore", type: "country" },
    { code: "AE", name: "United Arab Emirates", city: "", country: "United Arab Emirates", type: "country" },
    { code: "QA", name: "Qatar", city: "", country: "Qatar", type: "country" },
    { code: "EG", name: "Egypt", city: "", country: "Egypt", type: "country" },
    { code: "US", name: "United States", city: "", country: "United States", type: "country" },
    { code: "CA", name: "Canada", city: "", country: "Canada", type: "country" },
    { code: "BR", name: "Brazil", city: "", country: "Brazil", type: "country" },
    { code: "PE", name: "Peru", city: "", country: "Peru", type: "country" },
    { code: "CL", name: "Chile", city: "", country: "Chile", type: "country" },
    { code: "AR", name: "Argentina", city: "", country: "Argentina", type: "country" },
    { code: "ZA", name: "South Africa", city: "", country: "South Africa", type: "country" },
    { code: "NG", name: "Nigeria", city: "", country: "Nigeria", type: "country" },
    { code: "GH", name: "Ghana", city: "", country: "Ghana", type: "country" },
    { code: "ET", name: "Ethiopia", city: "", country: "Ethiopia", type: "country" },
    { code: "KE", name: "Kenya", city: "", country: "Kenya", type: "country" },
    { code: "IN", name: "India", city: "", country: "India", type: "country" },
    { code: "TH", name: "Thailand", city: "", country: "Thailand", type: "country" },
    { code: "MY", name: "Malaysia", city: "", country: "Malaysia", type: "country" },
    { code: "ID", name: "Indonesia", city: "", country: "Indonesia", type: "country" },
    { code: "PH", name: "Philippines", city: "", country: "Philippines", type: "country" },
    { code: "AU", name: "Australia", city: "", country: "Australia", type: "country" },
    { code: "NZ", name: "New Zealand", city: "", country: "New Zealand", type: "country" },
    { code: "UZ", name: "Uzbekistan", city: "", country: "Uzbekistan", type: "country" },
    { code: "KZ", name: "Kazakhstan", city: "", country: "Kazakhstan", type: "country" },
    { code: "RU", name: "Russia", city: "", country: "Russia", type: "country" },
    
    // Regions
    { code: "EUROPE", name: "Europe", city: "", country: "", type: "region" },
    { code: "ASIA", name: "Asia", city: "", country: "", type: "region" },
    { code: "SOUTHEAST_ASIA", name: "Southeast Asia", city: "", country: "", type: "region" },
    { code: "EAST_ASIA", name: "East Asia", city: "", country: "", type: "region" },
    { code: "CENTRAL_ASIA", name: "Central Asia", city: "", country: "", type: "region" },
    { code: "SOUTH_ASIA", name: "South Asia", city: "", country: "", type: "region" },
    { code: "MIDDLE_EAST", name: "Middle East", city: "", country: "", type: "region" },
    { code: "NORTH_AFRICA", name: "North Africa", city: "", country: "", type: "region" },
    { code: "WEST_AFRICA", name: "West Africa", city: "", country: "", type: "region" },
    { code: "EAST_AFRICA", name: "East Africa", city: "", country: "", type: "region" },
    { code: "SOUTHERN_AFRICA", name: "Southern Africa", city: "", country: "", type: "region" },
    { code: "NORTH_AMERICA", name: "North America", city: "", country: "", type: "region" },
    { code: "SOUTH_AMERICA", name: "South America", city: "", country: "", type: "region" },
    { code: "OCEANIA", name: "Oceania", city: "", country: "", type: "region" },
    { code: "SOUTHERN_EUROPE", name: "Southern Europe", city: "", country: "", type: "region" },
    { code: "NORTHERN_EUROPE", name: "Northern Europe", city: "", country: "", type: "region" },
    { code: "WESTERN_EUROPE", name: "Western Europe", city: "", country: "", type: "region" },
    { code: "EASTERN_EUROPE", name: "Eastern Europe", city: "", country: "", type: "region" },
    { code: "SCANDINAVIA", name: "Scandinavia", city: "", country: "", type: "region" },
    { code: "BALKANS", name: "Balkans", city: "", country: "", type: "region" },
  ];
  
  // Filter destinations based on search term
  const filteredDestinations = allDestinations.filter(dest => {
    if (!searchTerm) return false;
    
    const search = searchTerm.toLowerCase();
    return (
      dest.name.toLowerCase().includes(search) ||
      dest.code.toLowerCase().includes(search) ||
      dest.city.toLowerCase().includes(search) ||
      dest.country.toLowerCase().includes(search)
    );
  });

  // Sort filtered destinations by priority: regions, countries, cities, then airports
  const sortedDestinations = filteredDestinations.sort((a, b) => {
    const typePriority = { region: 1, country: 2, airport: 3 };
    const aPriority = typePriority[a.type as keyof typeof typePriority] || 4;
    const bPriority = typePriority[b.type as keyof typeof typePriority] || 4;
    
    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }
    
    // If same type, sort alphabetically
    return a.name.localeCompare(b.name);
  });

  const handleDestinationSelect = (destination: { code: string; name: string; type: string; city?: string }) => {
    const displayValue = destination.type === "airport" 
      ? `${destination.city || destination.name} (${destination.code})`
      : destination.name;
    
    setSelectedValue(displayValue);
    setSearchTerm("");
    setShowResults(false);
    onChange(destination.code);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setShowResults(newValue.length > 0); // Only show results when typing
    
    if (newValue === "") {
      setSelectedValue("");
      onChange("");
    }
  };

  const handleInputClick = () => {
    // Don't show anything on initial click for departure field
    setShowResults(false);
  };

  const handleClear = () => {
    setSearchTerm("");
    setSelectedValue("");
    setShowResults(false);
    onChange("");
    inputRef.current?.focus();
  };

  const getDisplayValue = () => {
    if (selectedValue) return selectedValue;
    if (searchTerm) return searchTerm;
    
    if (value) {
      const destination = allDestinations.find(d => d.code === value);
      if (destination) {
        if (destination.type === "airport") {
          return `${destination.city || destination.name} (${destination.code})`;
        }
        return destination.name;
      }
      
      return value;
    }
    
    return "";
  };

  // Handle clicks outside to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <div className="relative">
        <Input
          ref={inputRef}
          value={getDisplayValue()}
          placeholder={placeholder}
          onChange={handleInputChange}
          onClick={handleInputClick}
          onFocus={handleInputClick}
          className={cn(
            "w-full h-12 pl-10 pr-10",
            !getDisplayValue() && "text-muted-foreground"
          )}
        />
        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        {(selectedValue || searchTerm) && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Results dropdown - only show when typing */}
      {showResults && searchTerm && (
        <div 
          ref={resultsRef}
          className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-y-auto"
        >
          {sortedDestinations.map((destination) => (
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
        </div>
      )}
    </div>
  );
}
