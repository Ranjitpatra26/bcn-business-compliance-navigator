import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { businessApi } from "@/lib/api/business";
import { CreateBusinessRequest } from "@/types/business";

export function useBusinesses() {
  return useQuery({
    queryKey: ["businesses"],
    queryFn: async () => {
      const response = await businessApi.getBusinesses();
      if (response.error) throw new Error(response.error.message);
      return response.data || [];
    },
  });
}

export function useBusiness(id: string | null) {
  return useQuery({
    queryKey: ["business", id],
    queryFn: async () => {
      if (!id) return null;
      const response = await businessApi.getBusiness(id);
      if (response.error) throw new Error(response.error.message);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateBusiness() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateBusinessRequest) => {
      const response = await businessApi.createBusiness(data);
      if (response.error) throw new Error(response.error.message);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
    },
  });
}

export function useUpdateBusiness() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateBusinessRequest> }) => {
      const response = await businessApi.updateBusiness(id, data);
      if (response.error) throw new Error(response.error.message);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
      queryClient.invalidateQueries({ queryKey: ["business", variables.id] });
    },
  });
}

export function useDeleteBusiness() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await businessApi.deleteBusiness(id);
      if (response.error) throw new Error(response.error.message);
      return true;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
      queryClient.removeQueries({ queryKey: ["business", id] });
    },
  });
}
