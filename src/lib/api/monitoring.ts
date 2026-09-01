import { APIResponse } from "@/types/api";
import { MonitoringOverview } from "@/types/monitoring";

const IS_MOCK = process.env.NEXT_PUBLIC_API_MODE === "mock" || !process.env.NEXT_PUBLIC_API_URL;

const mockMonitoringOverview: MonitoringOverview = {
  status: "needs_attention",
  lastScanTime: new Date().toISOString(),
  activeAlertsCount: 2,
  items: [
    {
      id: "mon_1",
      name: "FSSAI Renewal Deadline",
      type: "deadline_approaching",
      status: "needs_attention",
      lastChecked: new Date().toISOString(),
      changeDetected: true,
      impact: "License expires in 30 days. Operating without a valid license attracts penalties.",
      actionRequired: "File renewal application immediately.",
      relatedRequirementId: "req_2",
    },
    {
      id: "mon_2",
      name: "GST Rate Changes - Hospitality",
      type: "regulatory_change",
      status: "active",
      lastChecked: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      changeDetected: true,
      impact: "New GST slab applies to AC restaurants starting next month.",
      actionRequired: "Update billing software to reflect new 5% without ITC rate.",
      source: "CBIC Notification No. 11/2026",
    },
    {
      id: "mon_3",
      name: "Local Municipal Trade License",
      type: "regulatory_change",
      status: "active",
      lastChecked: new Date().toISOString(),
      changeDetected: false,
    }
  ]
};

export const monitoringApi = {
  getOverview: async (businessId: string): Promise<APIResponse<MonitoringOverview>> => {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return { success: true, data: mockMonitoringOverview };
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/monitoring/overview?businessId=${businessId}`);
      if (!response.ok) throw new Error("Failed to fetch monitoring overview");
      const data = await response.json();
      return { success: true, data };
    } catch (error: unknown) {
      return { success: false, error: { code: "MONITORING_FETCH_ERROR", message: error instanceof Error ? error.message : "Unknown error" } };
    }
  }
};
