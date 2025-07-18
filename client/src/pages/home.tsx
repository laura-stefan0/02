import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Star, MapPin } from "lucide-react";
import FlightSearchForm from "@/components/flight-search-form";
import FlightResults from "@/components/flight-results";
import RecentSearches from "@/components/recent-searches";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchComplete = (results: any) => {
    setSearchResults(results);
    setIsSearching(false);
  };

  const handleSearchRerun = (results: any) => {
    setSearchResults(results);
  };

  return (
    <div>
      <FlightSearchForm onSearchComplete={handleSearchComplete} />

      {searchResults && (
        <FlightResults results={searchResults} isLoading={isSearching} />
      )}

      <RecentSearches onSearchRerun={handleSearchRerun} />
    </div>
  );
}