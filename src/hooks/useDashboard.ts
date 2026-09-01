import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api/dashboard";

export function useDashboard(businessId: string | null) {
  return useQuery({
    queryKey: ["dashboard", businessId],
    queryFn: async () => {
      if (!businessId) return null;
      const response = await dashboardApi.getDashboard(businessId);
      if (response.error) throw new Error(response.error.message);
      return response.data;
    },
    enabled: !!businessId,
  });
}
