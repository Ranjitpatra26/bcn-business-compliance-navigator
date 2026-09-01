import { apiClient } from "./client";
import { ComplianceItem, ComplianceAnalysisResult } from "@/types/compliance";
import { APIResponse } from "@/types/api";

const IS_MOCK = process.env.NEXT_PUBLIC_API_MODE === "mock";

const MOCK_COMPLIANCE_DATA: ComplianceItem[] = [
  {
    id: "comp_1",
    name: "FSSAI Food Safety License",
    description: "Mandatory central license for food business operators.",
    category: "Licenses & Registrations",
    status: "action_required",
    risk: "critical",
    deadline: "2024-06-30",
    authority: "Food Safety and Standards Authority of India (FSSAI)",
    renewalFrequency: "Annual",
    source: {
      name: "Food Safety and Standards Act, 2006",
      act: "FSS Act, 2006",
      section: "Section 31(1)",
      url: "https://www.fssai.gov.in/",
      lastVerified: "2024-03-15",
    },
    applicabilityReasons: [
      { condition: "Food Preparation", rule: "All entities preparing food for public consumption require licensing." },
      { condition: "Annual Turnover > ₹20 Crore", rule: "Central License mandatory for turnover exceeding ₹20 Cr." }
    ],
    actionSteps: [
      { id: "s1", description: "Submit Form B via FoSCoS portal", isCompleted: true },
      { id: "s2", description: "Upload water testing report from NABL lab", isCompleted: false },
      { id: "s3", description: "Pay licensing fee", isCompleted: false }
    ],
    requiredDocuments: [
      { id: "d1", name: "Water Testing Report", status: "missing" },
      { id: "d2", name: "List of Directors with ID Proof", status: "uploaded" }
    ]
  },
  {
    id: "comp_2",
    name: "GST Registration",
    description: "Goods and Services Tax registration for business operations.",
    category: "Taxation",
    status: "completed",
    risk: "high",
    authority: "Central Board of Indirect Taxes and Customs",
    source: {
      name: "CGST Act, 2017",
      act: "CGST Act",
      section: "Section 22",
      lastVerified: "2024-01-10",
    },
    applicabilityReasons: [
      { condition: "Inter-state supply", rule: "Mandatory registration for inter-state taxable supply." }
    ],
    actionSteps: [
      { id: "s4", description: "Submit REG-01", isCompleted: true }
    ],
    requiredDocuments: [
      { id: "d3", name: "PAN Card", status: "verified" },
      { id: "d4", name: "Address Proof", status: "verified" }
    ]
  },
  {
    id: "comp_3",
    name: "Shops and Establishments Act",
    description: "Registration for local municipal compliance.",
    category: "Labor & Employment",
    status: "upcoming",
    risk: "medium",
    deadline: "2024-12-31",
    authority: "State Labor Department",
    renewalFrequency: "Annual",
  }
];

export const complianceApi = {
  getComplianceList: async (businessId: string): Promise<APIResponse<ComplianceItem[]>> => {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
      // Store in memory or localStorage if we want true mock persistence, but static is fine.
      const hasAnalyzed = localStorage.getItem(`bcn_analyzed_${businessId}`);
      if (!hasAnalyzed) {
        return { success: true, data: [] }; // Simulate empty state before analysis
      }
      return { success: true, data: MOCK_COMPLIANCE_DATA };
    }
    return apiClient<APIResponse<ComplianceItem[]>>(`/api/v1/compliance?business_id=${businessId}`);
  },

  getComplianceItem: async (businessId: string, id: string): Promise<APIResponse<ComplianceItem>> => {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 600));
      const item = MOCK_COMPLIANCE_DATA.find(i => i.id === id);
      if (!item) return { success: false, error: { message: "Compliance requirement not found", code: "NOT_FOUND" } };
      return { success: true, data: item };
    }
    return apiClient<APIResponse<ComplianceItem>>(`/api/v1/compliance/${id}?business_id=${businessId}`);
  },

  analyzeCompliance: async (businessId: string): Promise<APIResponse<ComplianceAnalysisResult>> => {
    if (IS_MOCK) {
      // The progressive UI takes time on the frontend, but the API response simulates the final commit.
      await new Promise(resolve => setTimeout(resolve, 2000));
      localStorage.setItem(`bcn_analyzed_${businessId}`, "true");
      return {
        success: true,
        data: {
          businessId,
          analyzedAt: new Date().toISOString(),
          totalRequirements: MOCK_COMPLIANCE_DATA.length
        }
      };
    }
    return apiClient<APIResponse<ComplianceAnalysisResult>>(`/api/v1/compliance/analyze`, {
      method: "POST",
      body: JSON.stringify({ businessId })
    });
  }
};
