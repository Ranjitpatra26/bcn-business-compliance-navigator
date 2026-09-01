export interface AssistantSource {
  id: string;
  title: string;
  authority?: string;
  reference?: string;
  url?: string;
  lastVerified?: string;
}

export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: AssistantSource[];
  uncertainty?: boolean;
  followUpQuestions?: string[];
}

export interface AssistantQueryRequest {
  businessId: string;
  conversationId?: string;
  message: string;
}

export interface AssistantQueryResponse {
  conversationId: string;
  message: AssistantMessage;
}
