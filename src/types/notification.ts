export type NotificationType = 'compliance' | 'document' | 'deadline' | 'system';
export type NotificationPriority = 'critical' | 'high' | 'normal' | 'info';

export interface BCNNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  isRead: boolean;
  createdAt: string;
  businessId?: string;
  relatedRequirementId?: string;
  relatedDocumentId?: string;
}

export interface NotificationFilters {
  status?: 'all' | 'unread' | 'read';
  type?: NotificationType | 'all';
}

export interface NotificationPreferences {
  complianceAlerts: boolean;
  deadlineReminders: boolean;
  documentUpdates: boolean;
  systemNotifications: boolean;
}
