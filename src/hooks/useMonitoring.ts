import { useQuery } from "@tanstack/react-query";
import { monitoringApi } from "@/lib/api/monitoring";

export function useMonitoring(businessId: string | null) {
  return useQuery({
    queryKey: ["monitoring", businessId],
    queryFn: async () => {
      if (!businessId) return null;
      const response = await monitoringApi.getOverview(businessId);
      if (!response.success) throw new Error(response.error?.message || "Failed to load monitoring data");
      return response.data;
    },
    enabled: !!businessId,
    staleTime: 1000 * 60 * 5, // 5 mins
  });
}
