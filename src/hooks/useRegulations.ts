import { useQuery } from "@tanstack/react-query";
import { regulationsApi } from "@/lib/api/regulations";

export function useRegulations() {
  return useQuery({
    queryKey: ["regulations"],
    queryFn: async () => {
      const response = await regulationsApi.getRegulations();
      if (!response.success) {
        throw new Error(response.error?.message || "Failed to fetch regulations");
      }
      return response.data || [];
    }
  });
}

export function useRegulation(id: string) {
  return useQuery({
    queryKey: ["regulations", id],
    queryFn: async () => {
      const response = await regulationsApi.getRegulation(id);
      if (!response.success) {
        throw new Error(response.error?.message || "Failed to fetch regulation");
      }
      return response.data;
    },
    enabled: !!id
  });
}
