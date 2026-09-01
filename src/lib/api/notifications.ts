import { APIResponse } from "@/types/api";
import { BCNNotification, NotificationFilters, NotificationPreferences } from "@/types/notification";

const IS_MOCK = process.env.NEXT_PUBLIC_API_MODE === "mock" || !process.env.NEXT_PUBLIC_API_URL;

// Mock in-memory store
let mockNotifications: BCNNotification[] = [
  {
    id: "notif_1",
    title: "Action Required: Trade License",
    message: "Your Trade License application requires additional documents. Please upload the proof of address.",
    type: "compliance",
    priority: "high",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    relatedRequirementId: "req_2",
  },
  {
    id: "notif_2",
    title: "Document Verified",
    message: "Your FSSAI Registration Certificate has been successfully verified by BCN.",
    type: "document",
    priority: "normal",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    relatedDocumentId: "doc_1",
  },
  {
    id: "notif_3",
    title: "Upcoming Deadline: GST Return",
    message: "Your GSTR-3B return is due in 5 days.",
    type: "deadline",
    priority: "critical",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
  },
  {
    id: "notif_4",
    title: "Welcome to BCN",
    message: "Your business profile has been created. Start by running a compliance analysis.",
    type: "system",
    priority: "info",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
  }
];

let mockPreferences: NotificationPreferences = {
  complianceAlerts: true,
  deadlineReminders: true,
  documentUpdates: true,
  systemNotifications: false,
};

export const notificationsApi = {
  getNotifications: async (businessId: string, filters?: NotificationFilters): Promise<APIResponse<BCNNotification[]>> => {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 600));
      let results = [...mockNotifications];
      
      if (filters?.status === 'unread') {
        results = results.filter(n => !n.isRead);
      } else if (filters?.status === 'read') {
        results = results.filter(n => n.isRead);
      }

      if (filters?.type && filters.type !== 'all') {
        results = results.filter(n => n.type === filters.type);
      }

      return { success: true, data: results };
    }

    try {
      const queryParams = new URLSearchParams({ businessId });
      if (filters?.status) queryParams.append("status", filters.status);
      if (filters?.type) queryParams.append("type", filters.type);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications?${queryParams.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch notifications");
      const data = await response.json();
      return { success: true, data };
    } catch (error: unknown) {
      return { success: false, error: { code: "NOTIFICATIONS_FETCH_ERROR", message: error instanceof Error ? error.message : "Unknown error" } };
    }
  },

  markAsRead: async (notificationId: string): Promise<APIResponse<void>> => {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      mockNotifications = mockNotifications.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      );
      return { success: true, data: undefined };
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/${notificationId}/read`, { method: "POST" });
      if (!response.ok) throw new Error("Failed to mark as read");
      return { success: true, data: undefined };
    } catch (error: unknown) {
      return { success: false, error: { code: "NOTIFICATION_UPDATE_ERROR", message: error instanceof Error ? error.message : "Unknown error" } };
    }
  },

  markAllAsRead: async (businessId: string): Promise<APIResponse<void>> => {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 400));
      mockNotifications = mockNotifications.map(n => ({ ...n, isRead: true }));
      return { success: true, data: undefined };
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/read-all`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId })
      });
      if (!response.ok) throw new Error("Failed to mark all as read");
      return { success: true, data: undefined };
    } catch (error: unknown) {
      return { success: false, error: { code: "NOTIFICATION_UPDATE_ERROR", message: error instanceof Error ? error.message : "Unknown error" } };
    }
  },

  getPreferences: async (businessId: string): Promise<APIResponse<NotificationPreferences>> => {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true, data: mockPreferences };
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/preferences?businessId=${businessId}`);
      if (!response.ok) throw new Error("Failed to fetch preferences");
      const data = await response.json();
      return { success: true, data };
    } catch (error: unknown) {
      return { success: false, error: { code: "PREFERENCES_FETCH_ERROR", message: error instanceof Error ? error.message : "Unknown error" } };
    }
  },

  updatePreferences: async (businessId: string, preferences: NotificationPreferences): Promise<APIResponse<void>> => {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 600));
      mockPreferences = { ...preferences };
      return { success: true, data: undefined };
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/preferences`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId, preferences })
      });
      if (!response.ok) throw new Error("Failed to update preferences");
      return { success: true, data: undefined };
    } catch (error: unknown) {
      return { success: false, error: { code: "PREFERENCES_UPDATE_ERROR", message: error instanceof Error ? error.message : "Unknown error" } };
    }
  }
};
