export interface SearchResult {
  id: string;
  title: string;
  summary: string;
  category: 'Regulation' | 'Requirement' | 'Document';
  authority?: string;
  sourceUrl?: string;
  relevanceScore?: number;
  relatedRequirementId?: string;
  relatedRegulationId?: string;
  relatedDocumentId?: string;
  lastVerified?: string;
}

export interface SearchRequest {
  query: string;
  businessId?: string;
  filters?: {
    category?: string;
    authority?: string;
  };
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
}
