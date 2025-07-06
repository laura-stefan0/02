import { useState, useRef, useEffect } from "react";
import { CalendarDays, X, Calendar, Clock, Infinity } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format, addDays, startOfMonth, endOfMonth, addMonths, isSameMonth } from "date-fns";

type DateSelectionMode = "specific" | "flexible" | "period" | "anytime";

interface DepartureDateSelectorProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function DepartureDateSelector({ value, onChange, placeholder = "Add departure" }: DepartureDateSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Popular date options to show when no search term
  const popularDateOptions = [
    { 
      id: "today", 
      name: "Today", 
      description: format(new Date(), "MMM d, yyyy"),
      value: format(new Date(), "yyyy-MM-dd")
    },
    { 
      id: "tomorrow", 
      name: "Tomorrow", 
      description: format(addDays(new Date(), 1), "MMM d, yyyy"),
      value: format(addDays(new Date(), 1), "yyyy-MM-dd")
    },
    { 
      id: "this-weekend", 
      name: "This Weekend", 
      description: "Saturday - Sunday",
      value: `period:${format(addDays(new Date(), (6 - new Date().getDay()) % 7), "yyyy-MM-dd")}:${format(addDays(new Date(), (7 - new Date().getDay()) % 7), "yyyy-MM-dd")}`
    },
    { 
      id: "next-week", 
      name: "Next Week", 
      description: "7 days from today",
      value: `period:${format(addDays(new Date(), 7), "yyyy-MM-dd")}:${format(addDays(new Date(), 14), "yyyy-MM-dd")}`
    },
    { 
      id: "this-month", 
      name: "This Month", 
      description: format(new Date(), "MMMM yyyy"),
      value: `flexible:${format(startOfMonth(new Date()), "yyyy-MM-dd")}:${format(endOfMonth(new Date()), "yyyy-MM-dd")}`
    },
    { 
      id: "next-month", 
      name: "Next Month", 
      description: format(addMonths(new Date(), 1), "MMMM yyyy"),
      value: `flexible:${format(startOfMonth(addMonths(new Date(), 1)), "yyyy-MM-dd")}:${format(endOfMonth(addMonths(new Date(), 1)), "yyyy-MM-dd")}`
    },
    { 
      id: "anytime", 
      name: "Anytime", 
      description: "Find the best deals across all dates",
      value: "anytime"
    },
  ];

  // Filter options based on search term
  const filteredOptions = searchTerm 
    ? popularDateOptions.filter(option => 
        option.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : popularDateOptions;

  const handleOptionSelect = (option: { name: string; value: string }) => {
    setSelectedValue(option.name);
    setSearchTerm("");
    setShowResults(false);
    onChange(option.value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setShowResults(true);

    if (newValue === "") {
      setSelectedValue("");
      onChange("");
    }
  };

  const handleInputClick = () => {
    setShowResults(true);
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
      // Handle different value formats
      if (value === "anytime") {
        return "Anytime";
      } else if (value.startsWith("flexible:")) {
        const [, startDate] = value.split(":");
        const date = new Date(startDate);
        return format(date, "MMMM yyyy");
      } else if (value.startsWith("period:")) {
        const [, startDate] = value.split(":");
        const date = new Date(startDate);
        const today = new Date();
        const daysDiff = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDiff === 0) return "Today";
        if (daysDiff === 1) return "Tomorrow";
        if (daysDiff >= 5 && daysDiff <= 7) return "This Weekend";
        if (daysDiff >= 7 && daysDiff <= 14) return "Next Week";

        return format(date, "MMM d, yyyy");
      } else {
        // Specific date
        const date = new Date(value);
        return format(date, "MMM d, yyyy");
      }
    }

    return "";
  };

  const getIconForOption = (optionId: string) => {
    switch (optionId) {
      case "today":
      case "tomorrow":
        return <Calendar className="h-4 w-4" />;
      case "this-weekend":
      case "next-week":
        return <Clock className="h-4 w-4" />;
      case "this-month":
      case "next-month":
        return <CalendarDays className="h-4 w-4" />;
      case "anytime":
        return <Infinity className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
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
        <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        {(selectedValue || searchTerm) && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Results dropdown */}
      {showResults && (
        <div 
          ref={resultsRef}
          className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-y-auto"
        >
          {filteredOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleOptionSelect(option)}
              className="w-full text-left p-3 hover:bg-gray-50 flex items-center justify-between border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div className="text-gray-400">
                  {getIconForOption(option.id)}
                </div>
                <div>
                  <div className="font-medium">{option.name}</div>
                  <div className="text-sm text-gray-500">{option.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}