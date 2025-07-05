import { RotateCcw, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRecentSearches, useFlightSearch } from "@/hooks/use-flight-search";
import type { RecentSearch } from "@/lib/types";

interface RecentSearchesProps {
  onSearchRerun?: (results: any) => void;
}

export default function RecentSearches({ onSearchRerun }: RecentSearchesProps) {
  const { data: recentSearches, isLoading } = useRecentSearches();
  const { rerunSearch } = useFlightSearch();

  const formatPrice = (price: number) => {
    return `€${(price / 100).toFixed(0)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return "1 week ago";
    return `${Math.floor(diffDays / 7)} weeks ago`;
  };

  const handleRerunSearch = (search: RecentSearch) => {
    rerunSearch(search.id, {
      onSuccess: (data) => {
        onSearchRerun?.(data);
      },
    });
  };

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-6 w-20" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="animate-pulse">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <div>
                          <Skeleton className="h-4 w-24 mb-1" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                      <Skeleton className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <Skeleton className="h-3 w-32" />
                      <Skeleton className="h-3 w-28" />
                      <Skeleton className="h-3 w-36" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!recentSearches || recentSearches.length === 0) {
    return (
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Recent Searches</h2>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Route className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No recent searches</h3>
            <p className="text-gray-600">
              Your recent flight searches will appear here.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Recent Searches</h2>
          <Button variant="ghost" className="text-brand-blue hover:text-brand-blue-dark">
            Clear All
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentSearches.map((search) => (
            <Card key={search.id} className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-brand-blue bg-opacity-10 rounded-full flex items-center justify-center">
                      <Route className="text-brand-blue text-sm" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {search.fromAirport} → {search.toAirport}
                      </h4>
                      <p className="text-xs text-gray-500">{getTimeAgo(search.lastSearched)}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRerunSearch(search);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <RotateCcw className="h-4 w-4 text-gray-400 hover:text-brand-blue" />
                  </Button>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Departure: {formatDate(search.departureDate)}</p>
                  {search.returnDate && <p>Return: {formatDate(search.returnDate)}</p>}
                  {search.bestPrice && (
                    <p>
                      Best price found: <span className="font-semibold text-brand-blue">{formatPrice(search.bestPrice)}</span>
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Searched {search.searchCount} time{search.searchCount > 1 ? 's' : ''}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
