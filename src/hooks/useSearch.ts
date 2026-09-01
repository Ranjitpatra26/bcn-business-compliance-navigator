import { useQuery } from "@tanstack/react-query";
import { searchApi } from "@/lib/api/search";
import { SearchRequest } from "@/types/search";

export function useSearch(request: SearchRequest, enabled: boolean = true) {
  return useQuery({
    queryKey: ["search", request.query, request.businessId, request.filters],
    queryFn: async () => {
      if (!request.query.trim()) return { results: [], total: 0 };
      
      const response = await searchApi.search(request);
      if (!response.success) {
        throw new Error(response.error?.message || "Search failed");
      }
      return response.data;
    },
    enabled: enabled && request.query.trim().length > 0,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}
