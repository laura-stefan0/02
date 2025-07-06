import { useState } from "react";
import { Link } from "wouter";
import { Percent, Clock, ArrowRight, Star, MapPin } from "lucide-react";
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

      {/* Featured Deals Section */}
      <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Percent className="h-4 w-4 mr-2" />
              Limited Time Offers
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              🔥 Hot Flight Deals
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Don't miss out on these incredible flight deals. Save big on your next adventure!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white overflow-hidden transform hover:scale-105 transition-transform">
              <CardContent className="p-6">
                <Badge variant="secondary" className="bg-white text-red-600 mb-3">
                  <Star className="h-3 w-3 mr-1" />
                  BEST DEAL
                </Badge>
                <h3 className="text-xl font-bold mb-2">Venice → London</h3>
                <p className="text-red-100 mb-4">British Airways • Round trip</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold">€89</span>
                    <span className="text-red-200 line-through ml-2">€159</span>
                  </div>
                  <span className="text-sm bg-white/20 px-2 py-1 rounded">44% OFF</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white overflow-hidden transform hover:scale-105 transition-transform">
              <CardContent className="p-6">
                <Badge variant="secondary" className="bg-white text-blue-600 mb-3">
                  <Percent className="h-3 w-3 mr-1" />
                  30% OFF
                </Badge>
                <h3 className="text-xl font-bold mb-2">Venice → Paris</h3>
                <p className="text-blue-100 mb-4">Air France • Round trip</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold">€125</span>
                    <span className="text-blue-200 line-through ml-2">€179</span>
                  </div>
                  <span className="text-sm bg-white/20 px-2 py-1 rounded">Limited</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white overflow-hidden transform hover:scale-105 transition-transform">
              <CardContent className="p-6">
                <Badge variant="secondary" className="bg-white text-emerald-600 mb-3">
                  <Clock className="h-3 w-3 mr-1" />
                  FLASH SALE
                </Badge>
                <h3 className="text-xl font-bold mb-2">Venice → Barcelona</h3>
                <p className="text-emerald-100 mb-4">Vueling • Round trip</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold">€67</span>
                    <span className="text-emerald-200 line-through ml-2">€134</span>
                  </div>
                  <span className="text-sm bg-white/20 px-2 py-1 rounded">50% OFF</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Link href="/deals">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-3">
                View All Deals
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Long Layovers Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Clock className="h-4 w-4 mr-2" />
              Adventure Awaits
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              ✈️ Turn Layovers into Adventures
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Why waste time at the airport? Explore amazing cities during your long layovers and make every stop an adventure.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div 
                className="h-48 relative bg-cover bg-center"
                style={{
                  backgroundImage: `url(https://images.unsplash.com/photo-1512632578888-169bbbc64f33)`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">Dubai Layover</h3>
                  <div className="flex items-center mt-1">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>12h layover perfect for city tour</span>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">Venice → London via Dubai</span>
                    <span className="text-brand-blue font-bold text-xl">€285</span>
                  </div>
                  <p className="text-sm text-gray-600">Emirates • Next departure: Tomorrow</p>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-amber-800 mb-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    What you can do in 12 hours:
                  </h4>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• Visit Burj Khalifa and Dubai Mall</li>
                    <li>• Explore Dubai Marina and beaches</li>
                    <li>• Experience traditional souks</li>
                  </ul>
                </div>

                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  <Clock className="h-3 w-3 mr-1" />
                  Long Layover Adventure
                </Badge>
              </CardContent>
            </Card>

            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div 
                className="h-48 relative bg-cover bg-center"
                style={{
                  backgroundImage: `url(https://images.unsplash.com/photo-1534351590666-13e3e96b5017)`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">Amsterdam Layover</h3>
                  <div className="flex items-center mt-1">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>8h layover perfect for city exploration</span>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">Venice → New York via Amsterdam</span>
                    <span className="text-brand-blue font-bold text-xl">€425</span>
                  </div>
                  <p className="text-sm text-gray-600">KLM • Next departure: Friday</p>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-amber-800 mb-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    What you can do in 8 hours:
                  </h4>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• Canal boat cruise</li>
                    <li>• Visit Anne Frank House area</li>
                    <li>• Explore Jordaan district</li>
                  </ul>
                </div>

                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  <Clock className="h-3 w-3 mr-1" />
                  Long Layover Adventure
                </Badge>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Link href="/layover-explorer">
              <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3">
                Explore Long Layovers
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
