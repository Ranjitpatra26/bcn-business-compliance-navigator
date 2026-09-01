import { apiClient } from "./client";
import { BusinessDocument } from "@/types/document";
import { APIResponse } from "@/types/api";

const IS_MOCK = process.env.NEXT_PUBLIC_API_MODE === "mock";

// In-memory mock storage for session
let mockDocuments: BusinessDocument[] = [
  {
    id: "doc_1",
    businessId: "biz_1",
    name: "PAN_Card.pdf",
    type: "Identification",
    status: "processed",
    uploadedAt: "2024-04-10T10:30:00Z",
    processingState: "completed",
    relatedRequirementId: "comp_2",
    verificationState: "verified",
    sizeBytes: 1024 * 1024 * 1.5,
    format: "application/pdf"
  },
  {
    id: "doc_2",
    businessId: "biz_1",
    name: "Address_Proof_Utility_Bill.png",
    type: "Identification",
    status: "processed",
    uploadedAt: "2024-04-12T14:20:00Z",
    relatedRequirementId: "comp_2",
    verificationState: "verified",
    sizeBytes: 1024 * 500,
    format: "image/png"
  },
  {
    id: "doc_3",
    businessId: "biz_1",
    name: "Water_Testing_Report_Pending.pdf",
    type: "Report",
    status: "processing",
    uploadedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
    processingState: "extracting_text",
    relatedRequirementId: "comp_1",
    verificationState: "pending",
    sizeBytes: 1024 * 1024 * 2.1,
    format: "application/pdf"
  }
];

export const documentsApi = {
  getDocuments: async (businessId: string): Promise<APIResponse<BusinessDocument[]>> => {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return { 
        success: true, 
        data: mockDocuments.filter(d => d.businessId === businessId) 
      };
    }
    return apiClient<APIResponse<BusinessDocument[]>>(`/api/v1/documents?business_id=${businessId}`);
  },

  getDocument: async (businessId: string, id: string): Promise<APIResponse<BusinessDocument>> => {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const doc = mockDocuments.find(d => d.id === id && d.businessId === businessId);
      if (!doc) return { success: false, error: { message: "Document not found", code: "NOT_FOUND" } };
      return { success: true, data: doc };
    }
    return apiClient<APIResponse<BusinessDocument>>(`/api/v1/documents/${id}?business_id=${businessId}`);
  },

  uploadDocument: async (businessId: string, file: File, type?: string, relatedRequirementId?: string): Promise<APIResponse<BusinessDocument>> => {
    if (IS_MOCK) {
      // Simulate network upload time based on file size
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newDoc: BusinessDocument = {
        id: `doc_${Math.random().toString(36).substr(2, 9)}`,
        businessId,
        name: file.name,
        type: type || "General",
        status: "processing",
        uploadedAt: new Date().toISOString(),
        processingState: "queued",
        relatedRequirementId,
        verificationState: "pending",
        sizeBytes: file.size,
        format: file.type
      };
      
      mockDocuments.push(newDoc);
      return { success: true, data: newDoc };
    }

    const formData = new FormData();
    formData.append("file", file);
    if (type) formData.append("type", type);
    if (relatedRequirementId) formData.append("relatedRequirementId", relatedRequirementId);

    return apiClient<APIResponse<BusinessDocument>>(`/api/v1/documents?business_id=${businessId}`, {
      method: "POST",
      body: formData // Using FormData changes Content-Type to multipart/form-data
    });
  },

  processDocument: async (businessId: string, id: string): Promise<APIResponse<BusinessDocument>> => {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const docIndex = mockDocuments.findIndex(d => d.id === id && d.businessId === businessId);
      if (docIndex === -1) return { success: false, error: { message: "Document not found", code: "NOT_FOUND" } };
      
      // Update mock document state
      mockDocuments[docIndex] = {
        ...mockDocuments[docIndex],
        status: "processed",
        processingState: "completed",
        verificationState: "verified"
      };
      
      return { success: true, data: mockDocuments[docIndex] };
    }
    
    return apiClient<APIResponse<BusinessDocument>>(`/api/v1/documents/${id}/process?business_id=${businessId}`, {
      method: "POST"
    });
  },
  
  deleteDocument: async (businessId: string, id: string): Promise<APIResponse<{success: boolean}>> => {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 600));
      mockDocuments = mockDocuments.filter(d => d.id !== id);
      return { success: true, data: { success: true } };
    }
    return apiClient<APIResponse<{success: boolean}>>(`/api/v1/documents/${id}?business_id=${businessId}`, {
      method: "DELETE"
    });
  }
};
