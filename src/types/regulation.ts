export interface Regulation {
  id: string;
  title: string;
  description: string;
  authority: string;
  jurisdiction: string;
  category: string;
  effectiveDate?: string;
  lastVerified?: string;
  sourceUrl?: string;
  summary: string;
  relatedComplianceIds?: string[];
}
