export type DocumentStatus = 'uploaded' | 'processing' | 'processed' | 'needs_attention' | 'failed';
export type VerificationState = 'pending' | 'verified' | 'rejected' | 'unverified';

export interface BusinessDocument {
  id: string;
  businessId: string;
  name: string;
  type: string; // e.g. "License", "Tax Return", "Identification", "Report"
  status: DocumentStatus;
  uploadedAt: string;
  processingState?: string;
  relatedRequirementId?: string;
  verificationState: VerificationState;
  url?: string; // Preview/Download URL if applicable
  sizeBytes?: number;
  format?: string; // e.g. "application/pdf"
}

export interface UploadDocumentRequest {
  businessId: string;
  file: File;
  type?: string;
  relatedRequirementId?: string;
}
