export type MonitoringStatus = 'active' | 'paused' | 'needs_attention';

export interface MonitoringItem {
  id: string;
  name: string;
  type: 'regulatory_change' | 'deadline_approaching' | 'profile_mismatch';
  status: MonitoringStatus;
  lastChecked: string;
  changeDetected: boolean;
  impact?: string;
  actionRequired?: string;
  relatedRequirementId?: string;
  source?: string;
}

export interface MonitoringOverview {
  status: MonitoringStatus;
  lastScanTime: string;
  items: MonitoringItem[];
  activeAlertsCount: number;
}
