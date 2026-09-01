import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { complianceApi } from "@/lib/api/compliance";

export function useCompliance(businessId: string | null) {
  return useQuery({
    queryKey: ["compliance", businessId],
    queryFn: async () => {
      if (!businessId) return null;
      const response = await complianceApi.getComplianceList(businessId);
      if (response.error) throw new Error(response.error.message);
      return response.data || [];
    },
    enabled: !!businessId,
  });
}

export function useComplianceItem(businessId: string | null, complianceId: string | null) {
  return useQuery({
    queryKey: ["compliance", businessId, complianceId],
    queryFn: async () => {
      if (!businessId || !complianceId) return null;
      const response = await complianceApi.getComplianceItem(businessId, complianceId);
      if (response.error) throw new Error(response.error.message);
      return response.data;
    },
    enabled: !!businessId && !!complianceId,
  });
}

export function useAnalyzeCompliance() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (businessId: string) => {
      const response = await complianceApi.analyzeCompliance(businessId);
      if (response.error) throw new Error(response.error.message);
      return response.data;
    },
    onSuccess: (_, businessId) => {
      queryClient.invalidateQueries({ queryKey: ["compliance", businessId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", businessId] });
    },
  });
}
