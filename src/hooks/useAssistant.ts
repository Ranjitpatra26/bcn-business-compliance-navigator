import { useState, useCallback, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { assistantApi } from "@/lib/api/assistant";
import { AssistantMessage, AssistantQueryRequest } from "@/types/assistant";

export function useAssistantChat(businessId: string | null) {
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  
  // Track active business to clear chat on switch
  const activeBusinessRef = useRef(businessId);
  
  useEffect(() => {
    if (activeBusinessRef.current !== businessId) {
      // Clear conversation when business context changes
      setMessages([]);
      setConversationId(undefined);
      activeBusinessRef.current = businessId;
    }
  }, [businessId]);

  const mutation = useMutation({
    mutationFn: async (request: AssistantQueryRequest) => {
      const response = await assistantApi.ask(request);
      if (!response.success) {
        throw new Error(response.error?.message || "Failed to get an answer from BCN.");
      }
      return response.data;
    },
    onSuccess: (data) => {
      if (!conversationId && data?.conversationId) {
        setConversationId(data.conversationId);
      }
      if (data?.message) {
        setMessages((prev) => [...prev, data.message]);
      }
    }
  });

  const sendMessage = useCallback((content: string) => {
    if (!businessId || !content.trim()) return;

    // Optimistically add user message
    const userMessage: AssistantMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMessage]);

    // Send query to backend
    mutation.mutate({
      businessId,
      conversationId,
      message: content.trim()
    });
  }, [businessId, conversationId, mutation]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setConversationId(undefined);
    mutation.reset();
  }, [mutation]);

  return {
    messages,
    sendMessage,
    isProcessing: mutation.isPending,
    error: mutation.error,
    clearChat,
    retry: () => {
      // Retry the last user message if the last message was from user and we have an error
      if (messages.length > 0 && messages[messages.length - 1].role === 'user') {
        const lastContent = messages[messages.length - 1].content;
        mutation.mutate({
          businessId: businessId!,
          conversationId,
          message: lastContent
        });
      }
    }
  };
}
