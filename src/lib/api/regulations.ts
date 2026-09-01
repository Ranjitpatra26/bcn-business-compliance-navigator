import { apiClient } from "./client";
import { Regulation } from "@/types/regulation";
import { APIResponse } from "@/types/api";

const IS_MOCK = process.env.NEXT_PUBLIC_API_MODE === "mock";

const MOCK_REGULATIONS: Regulation[] = [
  {
    id: "reg_1",
    title: "Food Safety and Standards Act, 2006",
    description: "An Act to consolidate the laws relating to food and to establish the Food Safety and Standards Authority of India.",
    authority: "FSSAI",
    jurisdiction: "Central",
    category: "Food Safety",
    effectiveDate: "2006-08-23",
    lastVerified: "2024-03-15",
    sourceUrl: "https://www.fssai.gov.in/",
    summary: "Consolidates various acts & orders that have hitherto handled food related issues in various Ministries and Departments. It mandates FSSAI license for food business operators.",
    relatedComplianceIds: ["comp_1"]
  },
  {
    id: "reg_2",
    title: "Central Goods and Services Tax Act, 2017",
    description: "An Act to make a provision for levy and collection of tax on intra-State supply of goods or services or both by the Central Government.",
    authority: "CBIC",
    jurisdiction: "Central",
    category: "Taxation",
    effectiveDate: "2017-07-01",
    lastVerified: "2024-01-10",
    sourceUrl: "https://cbic-gst.gov.in/",
    summary: "Mandates businesses with turnover above a specific threshold to register for GST and file regular returns.",
    relatedComplianceIds: ["comp_2"]
  },
  {
    id: "reg_3",
    title: "Shops and Establishments Act",
    description: "State-level legislation governing the working conditions and rights of workers in unorganized sectors.",
    authority: "State Labor Department",
    jurisdiction: "State",
    category: "Labor & Employment",
    lastVerified: "2023-11-20",
    summary: "Regulates conditions of work, provides for statutory obligations of the employers and rights of the employees in un-organized sector.",
    relatedComplianceIds: ["comp_3"]
  },
  {
    id: "reg_4",
    title: "Companies Act, 2013",
    description: "An Act to consolidate and amend the law relating to companies.",
    authority: "Ministry of Corporate Affairs",
    jurisdiction: "Central",
    category: "Corporate",
    effectiveDate: "2013-08-30",
    lastVerified: "2024-04-01",
    sourceUrl: "https://www.mca.gov.in/",
    summary: "Primary legislation governing the formation, operation, and dissolution of companies in India.",
    relatedComplianceIds: []
  }
];

export const regulationsApi = {
  getRegulations: async (): Promise<APIResponse<Regulation[]>> => {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 600));
      return { success: true, data: MOCK_REGULATIONS };
    }
    return apiClient<APIResponse<Regulation[]>>("/api/v1/regulations");
  },

  getRegulation: async (id: string): Promise<APIResponse<Regulation>> => {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const reg = MOCK_REGULATIONS.find(r => r.id === id);
      if (!reg) return { success: false, error: { message: "Regulation not found", code: "NOT_FOUND" } };
      return { success: true, data: reg };
    }
    return apiClient<APIResponse<Regulation>>(`/api/v1/regulations/${id}`);
  }
};
