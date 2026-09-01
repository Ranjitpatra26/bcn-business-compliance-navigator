import { apiClient } from "./client";
import { Business, CreateBusinessRequest } from "@/types/business";
import { APIResponse } from "@/types/api";

const IS_MOCK = process.env.NEXT_PUBLIC_API_MODE === "mock";

export const businessApi = {
  createBusiness: async (data: CreateBusinessRequest): Promise<APIResponse<Business>> => {
    if (IS_MOCK) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        data: {
          id: `biz_${Math.random().toString(36).substr(2, 9)}`,
          user_id: `usr_${Math.random().toString(36).substr(2, 9)}`,
          name: data.name,
          business_type: data.business_type,
          industry: data.industry,
          country: data.country,
          state: data.state || "",
          city: data.city || "",
          address: data.address || "",
          details: data.details || "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      };
    }
    
    return apiClient<APIResponse<Business>>("/api/v1/businesses", {
      method: "POST",
      body: JSON.stringify(data)
    });
  },

  getBusiness: async (id: string): Promise<APIResponse<Business>> => {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        data: {
          id,
          user_id: "usr_mock",
          name: "Mock Business",
          business_type: "LLC",
          industry: "Technology",
          country: "US",
          state: "CA",
          city: "San Francisco",
          address: "123 Main St",
          details: "A mock tech company",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      };
    }

    return apiClient<APIResponse<Business>>(`/api/v1/businesses/${id}`);
  },

  getBusinesses: async (): Promise<APIResponse<Business[]>> => {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 600));
      return {
        success: true,
        data: [
          {
            id: "biz_1",
            user_id: "usr_mock",
            name: "Acme Corp LLC",
            business_type: "LLC",
            industry: "Software",
            country: "US",
            state: "CA",
            city: "San Francisco",
            address: "123 Main St",
            details: "Primary business",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ]
      };
    }
    return apiClient<APIResponse<Business[]>>("/api/v1/businesses");
  },

  updateBusiness: async (id: string, data: Partial<CreateBusinessRequest>): Promise<APIResponse<Business>> => {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        success: true,
        data: {
          id,
          user_id: "usr_mock",
          name: data.name || "Updated Business",
          business_type: data.business_type || "LLC",
          industry: data.industry || "Software",
          country: data.country || "US",
          state: data.state || "CA",
          city: data.city || "SF",
          address: data.address || "",
          details: data.details || "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      };
    }
    return apiClient<APIResponse<Business>>(`/api/v1/businesses/${id}`, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  },

  deleteBusiness: async (id: string): Promise<APIResponse<{ success: boolean }>> => {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return { success: true, data: { success: true } };
    }
    return apiClient<APIResponse<{ success: boolean }>>(`/api/v1/businesses/${id}`, {
      method: "DELETE",
    });
  }
};
