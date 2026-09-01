import { APIResponse } from "@/types/api";
import { AssistantQueryRequest, AssistantQueryResponse, AssistantMessage } from "@/types/assistant";

const IS_MOCK = process.env.NEXT_PUBLIC_API_MODE === "mock" || !process.env.NEXT_PUBLIC_API_URL;

const mockAssistantResponses: Record<string, AssistantMessage> = {
  default: {
    id: `msg_${Date.now()}`,
    role: "assistant",
    content: "Based on the BCN knowledge base, I found some relevant information. However, could you provide more specific details about your business activities to give a precise compliance answer?",
    timestamp: new Date().toISOString(),
    uncertainty: true,
    followUpQuestions: ["What documents do I need?", "Are there specific state regulations?"]
  },
  restaurant: {
    id: `msg_${Date.now()}_rest`,
    role: "assistant",
    content: "If you are opening a restaurant, you are primarily governed by the **Food Safety and Standards Act, 2006**.\n\n### What applies\nYou will need an FSSAI License (State or Central depending on your revenue) and a Local Municipal Trade License.\n\n### Next Steps\n1. Ensure your premises meet hygiene standards.\n2. Submit your FSSAI application along with a floor plan.\n3. Keep water testing reports ready.",
    timestamp: new Date().toISOString(),
    sources: [
      {
        id: "src_1",
        title: "Food Safety and Standards Act, 2006",
        authority: "FSSAI",
        reference: "Section 31"
      }
    ],
    followUpQuestions: ["What documents do I need for FSSAI?", "What if my turnover is below 12 Lakhs?"]
  },
  gst: {
    id: `msg_${Date.now()}_gst`,
    role: "assistant",
    content: "Under the **Goods and Services Tax Act**, businesses supplying goods with an aggregate turnover exceeding ₹40 Lakhs (or ₹20 Lakhs for services) in a financial year must register for GST.\n\nSince your business profile indicates you supply both goods and services, the ₹20 Lakh threshold applies to you.",
    timestamp: new Date().toISOString(),
    sources: [
      {
        id: "src_2",
        title: "Central Goods and Services Tax Act, 2017",
        authority: "CBIC",
        reference: "Section 22"
      }
    ],
    followUpQuestions: ["How do I file GSTR-1?", "Am I eligible for the Composition Scheme?"]
  }
};

export const assistantApi = {
  ask: async (request: AssistantQueryRequest): Promise<APIResponse<AssistantQueryResponse>> => {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulating LLM processing time

      const query = request.message.toLowerCase();
      let responseMessage = mockAssistantResponses.default;

      if (query.includes("restaurant") || query.includes("food")) {
        responseMessage = mockAssistantResponses.restaurant;
      } else if (query.includes("gst") || query.includes("tax")) {
        responseMessage = mockAssistantResponses.gst;
      }
      
      // Generate a new ID for the message to avoid React key collisions in mock
      responseMessage = { ...responseMessage, id: `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`, timestamp: new Date().toISOString() };

      return {
        success: true,
        data: {
          conversationId: request.conversationId || `conv_${Date.now()}`,
          message: responseMessage
        }
      };
    }

    // Real API call (if backend is ready)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assistant/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(request)
      });
      
      if (!response.ok) {
        throw new Error("Failed to communicate with BCN Assistant");
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error: unknown) {
      return { success: false, error: { code: "ASSISTANT_FETCH_ERROR", message: error instanceof Error ? error.message : "Unknown error" } };
    }
  },
};
