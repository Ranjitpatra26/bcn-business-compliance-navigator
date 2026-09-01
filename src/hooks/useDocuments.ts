import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { documentsApi } from "@/lib/api/documents";

export function useDocuments(businessId: string | null) {
  return useQuery({
    queryKey: ["documents", businessId],
    queryFn: async () => {
      if (!businessId) return [];
      const response = await documentsApi.getDocuments(businessId);
      if (!response.success) {
        throw new Error(response.error?.message || "Failed to fetch documents");
      }
      return response.data || [];
    },
    enabled: !!businessId
  });
}

export function useDocument(businessId: string | null, id: string) {
  return useQuery({
    queryKey: ["documents", businessId, id],
    queryFn: async () => {
      if (!businessId) return null;
      const response = await documentsApi.getDocument(businessId, id);
      if (!response.success) {
        throw new Error(response.error?.message || "Failed to fetch document");
      }
      return response.data;
    },
    enabled: !!businessId && !!id
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ businessId, file, type, relatedRequirementId }: { businessId: string, file: File, type?: string, relatedRequirementId?: string }) => {
      const response = await documentsApi.uploadDocument(businessId, file, type, relatedRequirementId);
      if (!response.success) {
        throw new Error(response.error?.message || "Failed to upload document");
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["documents", variables.businessId] });
      // If we tied it to a requirement, invalidate compliance lists to refresh document counts/statuses
      if (variables.relatedRequirementId) {
        queryClient.invalidateQueries({ queryKey: ["compliance", variables.businessId] });
        queryClient.invalidateQueries({ queryKey: ["complianceItem", variables.businessId, variables.relatedRequirementId] });
      }
    }
  });
}

export function useProcessDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ businessId, id }: { businessId: string, id: string }) => {
      const response = await documentsApi.processDocument(businessId, id);
      if (!response.success) {
        throw new Error(response.error?.message || "Failed to process document");
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["documents", variables.businessId] });
      queryClient.invalidateQueries({ queryKey: ["documents", variables.businessId, variables.id] });
    }
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ businessId, id }: { businessId: string, id: string }) => {
      const response = await documentsApi.deleteDocument(businessId, id);
      if (!response.success) {
        throw new Error(response.error?.message || "Failed to delete document");
      }
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["documents", variables.businessId] });
    }
  });
}
