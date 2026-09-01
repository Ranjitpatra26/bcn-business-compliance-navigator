import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsApi } from "@/lib/api/notifications";
import { NotificationFilters, NotificationPreferences } from "@/types/notification";

export function useNotifications(businessId: string | null, filters?: NotificationFilters) {
  return useQuery({
    queryKey: ["notifications", businessId, filters],
    queryFn: async () => {
      if (!businessId) return [];
      const response = await notificationsApi.getNotifications(businessId, filters);
      if (!response.success) throw new Error(response.error?.message || "Failed to load notifications");
      return response.data || [];
    },
    enabled: !!businessId,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await notificationsApi.markAsRead(notificationId);
      if (!response.success) throw new Error(response.error?.message || "Failed to mark as read");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (businessId: string) => {
      const response = await notificationsApi.markAllAsRead(businessId);
      if (!response.success) throw new Error(response.error?.message || "Failed to mark all as read");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useNotificationPreferences(businessId: string | null) {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ["notificationPreferences", businessId],
    queryFn: async () => {
      if (!businessId) return null;
      const response = await notificationsApi.getPreferences(businessId);
      if (!response.success) throw new Error(response.error?.message || "Failed to load preferences");
      return response.data;
    },
    enabled: !!businessId,
  });

  const mutation = useMutation({
    mutationFn: async (preferences: NotificationPreferences) => {
      if (!businessId) throw new Error("No active business");
      const response = await notificationsApi.updatePreferences(businessId, preferences);
      if (!response.success) throw new Error(response.error?.message || "Failed to update preferences");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notificationPreferences", businessId] });
    },
  });

  return { ...query, updatePreferences: mutation.mutateAsync, isUpdating: mutation.isPending };
}
