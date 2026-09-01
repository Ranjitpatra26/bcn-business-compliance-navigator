export type ComplianceStatus = 'completed' | 'in_progress' | 'action_required' | 'upcoming' | 'overdue';
export type ComplianceRisk = 'low' | 'medium' | 'high' | 'critical';

export interface ComplianceSource {
  name: string;
  url?: string;
  act?: string;
  rule?: string;
  section?: string;
  lastVerified: string;
}

export interface ApplicabilityReason {
  condition: string;
  rule: string;
}

export interface ActionStep {
  id: string;
  description: string;
  isCompleted?: boolean;
}

export interface RequiredDocument {
  id: string;
  name: string;
  status: 'missing' | 'uploaded' | 'verified';
  documentId?: string;
}

export interface ComplianceItem {
  id: string;
  name: string;
  description: string;
  category: string;
  status: ComplianceStatus;
  risk: ComplianceRisk;
  deadline?: string;
  authority: string;
  
  // Detailed fields
  renewalFrequency?: string;
  source?: ComplianceSource;
  applicabilityReasons?: ApplicabilityReason[];
  actionSteps?: ActionStep[];
  requiredDocuments?: RequiredDocument[];
}

export interface ComplianceAnalysisResult {
  businessId: string;
  analyzedAt: string;
  totalRequirements: number;
}
