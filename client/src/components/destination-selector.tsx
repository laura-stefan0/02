
import { useState, useRef, useEffect } from "react";
import { MapPin, Globe, X, Plus, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DestinationSelectorProps {
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  label?: string;
  multiSelect?: boolean;
}

export default function DestinationSelector({ 
  value, 
  onChange, 
  placeholder = "Add destination",
  label = "To",
  multiSelect = false
}: DestinationSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [selectedValues, setSelectedValues] = useState<Array<{code: string; name: string; type: string; city?: string; country?: string}>>([]);
  const [recentlyAdded, setRecentlyAdded] = useState<string[]>([]);
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

  // European regions for "anywhere" mode
  const regions = [
    { code: "europe", name: "Europe" },
    { code: "mediterranean", name: "Mediterranean" },
    { code: "northern-europe", name: "Northern Europe" },
    { code: "western-europe", name: "Western Europe" },
    { code: "eastern-europe", name: "Eastern Europe" },
  ];

  // Initialize selected values based on prop value
  useEffect(() => {
    if (value) {
      if (Array.isArray(value)) {
        const destinations = value.map(code => {
          if (code === "ANYWHERE") {
            return { code: "ANYWHERE", name: "Explore everywhere", type: "anywhere" };
          }
          if (code.startsWith("anywhere:")) {
            const regionCode = code.split(":")[1];
            const region = regions.find(r => r.code === regionCode);
            return { code, name: region?.name || "Anywhere", type: "anywhere" };
          }
          const destination = allDestinations.find(d => d.code === code);
          return destination || { code, name: code, type: "unknown" };
        });
        setSelectedValues(destinations);
      } else {
        if (value === "ANYWHERE") {
          setSelectedValues([{ code: "ANYWHERE", name: "Explore everywhere", type: "anywhere" }]);
        } else if (value.startsWith("anywhere:")) {
          const regionCode = value.split(":")[1];
          const region = regions.find(r => r.code === regionCode);
          setSelectedValues([{ code: value, name: region?.name || "Anywhere", type: "anywhere" }]);
        } else {
          const destination = allDestinations.find(d => d.code === value);
          if (destination) {
            setSelectedValues([destination]);
          }
        }
      }
    } else {
      setSelectedValues([]);
    }
  }, [value]);
  
  // Filter destinations based on search term and exclude already selected
  const filteredDestinations = allDestinations.filter(dest => {
    if (!searchTerm) return false;
    if (selectedValues.some(selected => selected.code === dest.code)) return false;
    
    const search = searchTerm.toLowerCase();
    return (
      dest.name.toLowerCase().includes(search) ||
      dest.code.toLowerCase().includes(search) ||
      dest.city.toLowerCase().includes(search) ||
      dest.country.toLowerCase().includes(search)
    );
  });

  // Add "Anywhere" options when searching (exclude if already selected)
  const anywhereOptions = searchTerm && !selectedValues.some(s => s.code === "ANYWHERE") ? [
    { code: "anywhere:europe", name: "Europe", city: "", country: "", type: "anywhere" },
  ].filter(option => option.name.toLowerCase().includes(searchTerm.toLowerCase())) : [];

  // Sort filtered destinations by priority: regions, countries, cities, then airports
  const sortedDestinations = filteredDestinations.sort((a, b) => {
    const typePriority = { region: 1, country: 2, airport: 3, anywhere: 0 };
    const aPriority = typePriority[a.type as keyof typeof typePriority] || 4;
    const bPriority = typePriority[b.type as keyof typeof typePriority] || 4;
    
    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }
    
    // If same type, sort alphabetically
    return a.name.localeCompare(b.name);
  });

  // Popular destinations to show when no search term (exclude selected)
  const popularDestinations = [
    { code: "CDG", name: "Paris", city: "Paris", country: "France", type: "airport" },
    { code: "LHR", name: "London", city: "London", country: "United Kingdom", type: "airport" },
    { code: "FCO", name: "Rome", city: "Rome", country: "Italy", type: "airport" },
    { code: "BCN", name: "Barcelona", city: "Barcelona", country: "Spain", type: "airport" },
    { code: "AMS", name: "Amsterdam", city: "Amsterdam", country: "Netherlands", type: "airport" },
    { code: "VIE", name: "Vienna", city: "Vienna", country: "Austria", type: "airport" },
  ].filter(dest => !selectedValues.some(selected => selected.code === dest.code));

  // Show popular destinations when no search term, otherwise show search results (limit to 5)
  const searchResults = searchTerm ? [...anywhereOptions, ...sortedDestinations].slice(0, 5) : popularDestinations.slice(0, 5);

  const handleDestinationAdd = (destination: { code: string; name: string; type: string; city?: string; country?: string }) => {
    if (multiSelect) {
      // For "Anywhere" option, don't allow other destinations
      if (destination.code === "ANYWHERE" || destination.code.startsWith("anywhere:")) {
        setSelectedValues([destination]);
        onChange([destination.code]);
        setShowResults(false);
        setSearchTerm("");
        return;
      }
      
      // Don't allow other destinations if "Anywhere" is already selected
      if (selectedValues.some(v => v.code === "ANYWHERE" || v.code.startsWith("anywhere:"))) {
        return;
      }
      
      const newSelectedValues = [...selectedValues, destination];
      setSelectedValues(newSelectedValues);
      onChange(newSelectedValues.map(d => d.code));
      
      // Track recently added for UI feedback
      setRecentlyAdded(prev => [...prev, destination.code]);
      
      // Remove from recently added after 2 seconds
      setTimeout(() => {
        setRecentlyAdded(prev => prev.filter(code => code !== destination.code));
      }, 2000);
      
      // Auto-scroll to show the latest destination
      setTimeout(() => {
        const container = inputRef.current?.parentElement?.querySelector('.scrollbar-hide');
        if (container) {
          container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
        }
      }, 100);
      
      // Clear search term when destination is added
      setSearchTerm("");
    } else {
      setSelectedValues([destination]);
      onChange(destination.code);
      setShowResults(false);
      setSearchTerm("");
    }
  };

  const handleDestinationRemove = (codeToRemove: string) => {
    const newSelectedValues = selectedValues.filter(dest => dest.code !== codeToRemove);
    setSelectedValues(newSelectedValues);
    
    if (multiSelect) {
      onChange(newSelectedValues.map(d => d.code));
    } else {
      onChange(newSelectedValues.length > 0 ? newSelectedValues[0].code : "");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setShowResults(newValue.length > 0);
  };

  const handleInputClick = () => {
    setShowResults(searchTerm.length === 0);
  };

  const handleClear = () => {
    setSearchTerm("");
    setSelectedValues([]);
    setShowResults(false);
    onChange(multiSelect ? [] : "");
    inputRef.current?.focus();
  };

  const getDisplayValue = () => {
    if (searchTerm) return searchTerm;
    return "";
  };

  const getDisplayName = (destination: { code: string; name: string; type: string; city?: string; country?: string }) => {
    if (destination.type === "airport") {
      return `${destination.city || destination.name} (${destination.code})`;
    }
    return destination.name;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && searchTerm === '' && selectedValues.length > 0) {
      // Remove the last selected item when backspace is pressed and input is empty
      const lastItem = selectedValues[selectedValues.length - 1];
      handleDestinationRemove(lastItem.code);
    }
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
        <div className={cn(
          "relative flex items-center min-h-[48px] border border-gray-300 rounded-md bg-white px-3 py-2 transition-all duration-200 hover:border-blue-400",
          showResults && "border-blue-500 shadow-md ring-1 ring-blue-500 ring-opacity-20"
        )}>
          <MapPin className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
          
          {/* Selected destinations and input container */}
          <div className="flex-1 flex items-center min-w-0">
            {/* Selected destinations scrollable container */}
            {selectedValues.length > 0 && (
              <div className="flex gap-1 overflow-x-auto scrollbar-hide max-w-[70%] flex-shrink-0" 
                   style={{ scrollBehavior: 'smooth' }}>
                {selectedValues.map((destination, index) => (
                  <div key={destination.code} className="flex items-center gap-1 flex-shrink-0">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium whitespace-nowrap flex items-center gap-1">
                      {getDisplayName(destination)}
                      <button
                        onClick={() => handleDestinationRemove(destination.code)}
                        className="hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                    {index < selectedValues.length - 1 && (
                      <span className="text-gray-400 text-xs">+</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Search input with flexible width */}
            <input
              ref={inputRef}
              value={getDisplayValue()}
              placeholder={selectedValues.length > 0 ? "" : placeholder}
              onChange={handleInputChange}
              onClick={handleInputClick}
              onFocus={handleInputClick}
              onKeyDown={handleKeyDown}
              className={cn(
                "bg-transparent outline-none placeholder:text-gray-400 text-sm flex-1 min-w-[100px]",
                selectedValues.length > 0 && "ml-2"
              )}
            />
          </div>
          
          {(selectedValues.length > 0 || searchTerm) && (
            <button
              onClick={handleClear}
              className="h-4 w-4 text-gray-400 hover:text-gray-600 flex-shrink-0 ml-2"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Results dropdown */}
      {showResults && (
        <div 
          ref={resultsRef}
          className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg"
        >
          {/* Already included section */}
          {selectedValues.length > 0 && (
            <div className="border-b border-gray-200 bg-gray-50">
              <div className="p-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Already included
              </div>
              {selectedValues.map((destination) => (
                <div
                  key={destination.code}
                  className="flex items-center justify-between p-3 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-700">{destination.name}</div>
                    <div className="text-sm text-gray-500">
                      {destination.type === "airport" && destination.city && `${destination.city}, `}
                      {destination.country}
                      {destination.type === "region" && " • Region"}
                      {destination.type === "country" && " • Country"}
                      {destination.type === "anywhere" && " • Anywhere"}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDestinationRemove(destination.code)}
                    className="w-6 h-6 text-gray-400 hover:text-red-600 rounded flex items-center justify-center transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Show "Explore everywhere" only when no search term and not already selected */}
          {!searchTerm && !selectedValues.some(s => s.code === "ANYWHERE") && (
            <div className="p-3 border-b border-gray-200 bg-blue-50 flex items-center justify-between">
              <button 
                onClick={() => {
                  if (!multiSelect) {
                    setSelectedValues([{ code: "ANYWHERE", name: "Explore everywhere", type: "anywhere" }]);
                    onChange("ANYWHERE");
                    setShowResults(false);
                    setSearchTerm("");
                  } else {
                    handleDestinationAdd({ code: "ANYWHERE", name: "Explore everywhere", type: "anywhere" });
                  }
                }}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium flex-1"
              >
                <Globe className="h-4 w-4" />
                Explore everywhere
              </button>

            </div>
          )}

          {/* Show search results */}
          {searchResults.map((destination) => {
            const isAnywhere = destination.code === "ANYWHERE" || destination.code.startsWith("anywhere:");
            const hasAnywhereSelected = selectedValues.some(v => v.code === "ANYWHERE" || v.code.startsWith("anywhere:"));
            const isDisabled = hasAnywhereSelected && !isAnywhere;
            
            return (
              <div
                key={destination.code}
                className={cn(
                  "w-full text-left p-3 flex items-center justify-between border-b border-gray-100 last:border-b-0",
                  isDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
                )}
              >
                <button
                  onClick={() => {
                    if (isDisabled) return;
                    if (!multiSelect) {
                      setSelectedValues([destination]);
                      onChange(destination.code);
                      setShowResults(false);
                      setSearchTerm("");
                    } else {
                      handleDestinationAdd(destination);
                    }
                  }}
                  className="flex-1 text-left"
                  disabled={isDisabled}
                >
                  <div className="font-medium">{destination.name}</div>
                  <div className="text-sm text-gray-500">
                    {destination.type === "airport" && destination.city && `${destination.city}, `}
                    {destination.country}
                    {destination.type === "region" && " • Region"}
                    {destination.type === "country" && " • Country"}
                    {destination.type === "anywhere" && " • Anywhere"}
                  </div>
                </button>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-mono text-gray-400">
                    {destination.type === "airport" ? destination.code : 
                     destination.type === "anywhere" ? <Globe className="h-4 w-4" /> : ""}
                  </div>
                  {multiSelect && !isAnywhere && !isDisabled && (
                    <button
                      onClick={() => handleDestinationAdd(destination)}
                      className={cn(
                        "w-6 h-6 text-white rounded flex items-center justify-center transition-colors",
                        recentlyAdded.includes(destination.code)
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-blue-600 hover:bg-blue-700"
                      )}
                    >
                      {recentlyAdded.includes(destination.code) ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </button>
                  )}
                  {multiSelect && isAnywhere && (
                    <button
                      onClick={() => handleDestinationAdd(destination)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Select
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
