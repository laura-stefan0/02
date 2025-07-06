import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { FlightSearchParams, FlightResult, FlightDeal, RecentSearch, LongLayoverFlight } from "@/lib/types";

export function useFlightSearch() {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const searchMutation = useMutation({
    mutationFn: async (params: FlightSearchParams) => {
      const response = await apiRequest("POST", "/api/flights/search", params);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recent-searches"] });
    },
  });

  const rerunSearchMutation = useMutation({
    mutationFn: async (searchId: number) => {
      const response = await apiRequest("POST", `/api/recent-searches/${searchId}/rerun`);
      return response.json();
    },
  });

  return {
    searchFlights: searchMutation.mutate,
    rerunSearch: rerunSearchMutation.mutate,
    isLoading: searchMutation.isPending || rerunSearchMutation.isPending,
    error: searchMutation.error || rerunSearchMutation.error,
    results: searchMutation.data,
  };
}

export function useFlightDeals() {
  return useQuery<FlightDeal[]>({
    queryKey: ["/api/deals"],
  });
}

export function useRecentSearches() {
  return useQuery<RecentSearch[]>({
    queryKey: ["/api/recent-searches"],
  });
}

export function useLongLayoverFlights() {
  return useQuery<LongLayoverFlight[]>({
    queryKey: ["/api/long-layovers"],
  });
}
