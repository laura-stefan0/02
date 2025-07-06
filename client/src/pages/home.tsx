
import { useState } from "react";
import FlightSearchForm from "@/components/flight-search-form";
import FlightResults from "@/components/flight-results";
import RecentSearches from "@/components/recent-searches";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plane, MapPin, Calendar, Users, TrendingUp, Globe, Star, Zap } from "lucide-react";

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

  const features = [
    {
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      title: "Lightning Fast",
      description: "Find flights in seconds with our super-powered search",
      color: "bg-yellow-50 border-yellow-200"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-green-500" />,
      title: "Best Prices",
      description: "We scan 500+ airlines to find you the cheapest deals",
      color: "bg-green-50 border-green-200"
    },
    {
      icon: <Globe className="h-8 w-8 text-blue-500" />,
      title: "Worldwide",
      description: "Search flights to anywhere in the world",
      color: "bg-blue-50 border-blue-200"
    }
  ];

  const popularDestinations = [
    { city: "Paris", country: "France", code: "CDG", image: "🇫🇷", discount: "25%" },
    { city: "Tokyo", country: "Japan", code: "NRT", image: "🇯🇵", discount: "30%" },
    { city: "New York", country: "USA", code: "JFK", image: "🇺🇸", discount: "20%" },
    { city: "London", country: "UK", code: "LHR", image: "🇬🇧", discount: "15%" },
    { city: "Dubai", country: "UAE", code: "DXB", image: "🇦🇪", discount: "35%" },
    { city: "Sydney", country: "Australia", code: "SYD", image: "🇦🇺", discount: "40%" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-8">
              <Star className="h-4 w-4 text-yellow-300 mr-2" />
              <span className="text-white font-medium">Trusted by 2M+ travelers</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              Find Your Next
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                Adventure
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto font-medium">
              Discover amazing flight deals and explore the world with confidence. 
              Your journey starts here! ✈️
            </p>

            {/* Search Form Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-4xl mx-auto transform hover:scale-[1.02] transition-all duration-300">
              <FlightSearchForm onSearchComplete={handleSearchComplete} />
            </div>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 animate-bounce">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
            <Plane className="h-8 w-8 text-white rotate-45" />
          </div>
        </div>
        <div className="absolute top-40 right-16 animate-bounce delay-1000">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
            <MapPin className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Why Choose FlightsHacked?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We've revolutionized flight search to make your travel dreams come true
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className={`${feature.color} border-2 hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer`}>
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-2xl font-black text-gray-900">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-700 font-medium">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            🔥 Trending Destinations
          </h2>
          <p className="text-xl text-gray-600">
            Hot deals that won't last long!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularDestinations.map((dest, index) => (
            <Card key={index} className="group hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden border-2 hover:border-blue-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">{dest.image}</div>
                  <Badge className="bg-red-500 text-white font-black text-sm px-3 py-1 animate-pulse">
                    {dest.discount} OFF
                  </Badge>
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-1">{dest.city}</h3>
                <p className="text-gray-600 font-medium mb-2">{dest.country}</p>
                <p className="text-sm text-gray-500 font-mono">{dest.code}</p>
                <Button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 rounded-xl transform group-hover:scale-105 transition-all">
                  Explore Deals ✈️
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
            Ready to Take Off?
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-10 font-medium">
            Join millions of happy travelers who found their perfect flights with us!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 font-black text-lg px-8 py-4 rounded-xl transform hover:scale-105 transition-all">
              🚀 Start Searching Now
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 font-black text-lg px-8 py-4 rounded-xl transform hover:scale-105 transition-all">
              📱 Download App
            </Button>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchResults && (
        <div className="py-12">
          <FlightResults results={searchResults} isLoading={isSearching} />
        </div>
      )}
      
      {/* Recent Searches */}
      <div className="py-12">
        <RecentSearches onSearchRerun={handleSearchRerun} />
      </div>
    </div>
  );
}
