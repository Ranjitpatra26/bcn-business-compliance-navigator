import { APIResponse } from "@/types/api";
import { SearchRequest, SearchResponse, SearchResult } from "@/types/search";

const IS_MOCK = process.env.NEXT_PUBLIC_API_MODE === "mock" || !process.env.NEXT_PUBLIC_API_URL;

// Mock database for search
const mockSearchResults: SearchResult[] = [
  {
    id: "res_1",
    title: "Food Safety and Standards Act, 2006",
    summary: "Comprehensive legislation governing food safety, licensing, and standards for food businesses in India.",
    category: "Regulation",
    authority: "FSSAI",
    relatedRegulationId: "reg_1",
    relevanceScore: 0.98,
  },
  {
    id: "res_2",
    title: "Obtain FSSAI Central License",
    summary: "Required for food businesses operating in multiple states or exceeding specified turnover limits.",
    category: "Requirement",
    authority: "FSSAI",
    relatedRequirementId: "comp_1",
    relevanceScore: 0.95,
  },
  {
    id: "res_3",
    title: "FSSAI Registration Certificate",
    summary: "Your uploaded food safety registration certificate. Status: Verified.",
    category: "Document",
    authority: "FSSAI",
    relatedDocumentId: "doc_1",
    relevanceScore: 0.85,
  },
  {
    id: "res_4",
    title: "Goods and Services Tax (GST) Act",
    summary: "Mandatory registration for businesses crossing the aggregate turnover threshold prescribed by the GST Council.",
    category: "Regulation",
    authority: "CBIC",
    relatedRegulationId: "reg_3",
    relevanceScore: 0.9,
  },
];

export const searchApi = {
  search: async (request: SearchRequest): Promise<APIResponse<SearchResponse>> => {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800)); // Network delay

      const q = request.query.toLowerCase();
      let results = mockSearchResults;

      // Basic semantic-ish mock filtering based on keywords
      if (q) {
        results = results.filter(r => 
          r.title.toLowerCase().includes(q) || 
          r.summary.toLowerCase().includes(q) ||
          r.authority?.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q)
        );
      }

      if (request.filters?.category && request.filters.category !== "all") {
        results = results.filter(r => r.category.toLowerCase() === request.filters?.category?.toLowerCase());
      }
      
      if (request.filters?.authority && request.filters.authority !== "all") {
        results = results.filter(r => r.authority === request.filters?.authority);
      }

      return {
        success: true,
        data: {
          results: results,
          total: results.length
        }
      };
    }

    // Real API call (if backend is ready)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(request)
      });
      
      if (!response.ok) {
        throw new Error("Failed to execute search");
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error: unknown) {
      return { success: false, error: { code: "SEARCH_FETCH_ERROR", message: error instanceof Error ? error.message : "Unknown error" } };
    }
  },
};
