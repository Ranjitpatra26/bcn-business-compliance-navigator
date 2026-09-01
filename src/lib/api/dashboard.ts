import { apiClient } from "./client";
import { APIResponse } from "@/types/api";

const IS_MOCK = process.env.NEXT_PUBLIC_API_MODE === "mock";

export interface DashboardMetrics {
  healthScore: number;
  totalRequirements: number;
  completedRequirements: number;
  overdueItems: number;
}

export interface NextAction {
  id: string;
  title: string;
  type: string;
  urgency: "high" | "medium" | "low";
  dueDate: string;
}

export interface RiskDistribution {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface RoadmapItem {
  id: string;
  phase: "setup" | "registration" | "licensing" | "documents" | "recurring";
  title: string;
  status: "completed" | "current" | "attention" | "upcoming";
  items: { id: string; requirement: string; status: string }[];
}

export interface DashboardData {
  businessId: string;
  metrics: DashboardMetrics;
  nextActions: NextAction[];
  riskDistribution: RiskDistribution;
  roadmap: RoadmapItem[];
  recentActivity: { id: string; action: string; date: string }[];
}

export const dashboardApi = {
  getDashboard: async (businessId: string): Promise<APIResponse<DashboardData>> => {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        success: true,
        data: {
          businessId,
          metrics: {
            healthScore: 82,
            totalRequirements: 24,
            completedRequirements: 18,
            overdueItems: 1,
          },
          nextActions: [
            { id: "1", title: "Renew State License", type: "compliance", urgency: "high", dueDate: "2024-05-15" },
            { id: "2", title: "Submit Annual Report", type: "filing", urgency: "medium", dueDate: "2024-06-01" },
            { id: "3", title: "Update Employee Handbook", type: "document", urgency: "low", dueDate: "2024-07-30" },
          ],
          riskDistribution: {
            critical: 1,
            high: 2,
            medium: 5,
            low: 16,
          },
          roadmap: [
            {
              id: "r1",
              phase: "setup",
              title: "Business Setup",
              status: "completed",
              items: [
                { id: "ri1", requirement: "Entity Registration", status: "completed" },
                { id: "ri2", requirement: "PAN/TAN Issuance", status: "completed" }
              ]
            },
            {
              id: "r2",
              phase: "registration",
              title: "Registration & Licensing",
              status: "current",
              items: [
                { id: "comp_1", requirement: "FSSAI Food Safety License", status: "action_required" },
                { id: "comp_2", requirement: "GST Registration", status: "completed" }
              ]
            },
            {
              id: "r3",
              phase: "documents",
              title: "Document Verification",
              status: "attention",
              items: [
                { id: "d1", requirement: "Water Testing Report", status: "missing" }
              ]
            },
            {
              id: "r4",
              phase: "recurring",
              title: "Recurring Compliance",
              status: "upcoming",
              items: [
                { id: "comp_3", requirement: "Shops and Establishments Act", status: "upcoming" }
              ]
            }
          ],
          recentActivity: [
            { id: "a1", action: "Completed Q1 Tax Filing", date: "2024-04-15" },
            { id: "a2", action: "Updated OSHA Guidelines", date: "2024-03-22" },
          ]
        }
      };
    }

    return apiClient<APIResponse<DashboardData>>(`/api/v1/dashboard/${businessId}`);
  }
};
