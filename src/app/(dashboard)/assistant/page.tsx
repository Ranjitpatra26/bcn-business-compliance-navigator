"use client";

import { useState, useRef, useEffect } from "react";
import { useAssistantChat } from "@/hooks/useAssistant";
import { useActiveBusiness } from "@/components/providers/BusinessProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/common/EmptyState";
import { 
  Bot, 
  Send, 
  RefreshCcw, 
  Trash2, 
  AlertTriangle, 
  BookOpen, 
  ExternalLink,
  ChevronRight,
  ShieldAlert
} from "lucide-react";
import Link from "next/link";
import ReactMarkdown from 'react-markdown';
import { AssistantSource } from "@/types/assistant";

export default function AssistantPage() {
  const { activeBusinessId } = useActiveBusiness();
  const { messages, sendMessage, isProcessing, error, clearChat, retry } = useAssistantChat(activeBusinessId);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isProcessing]);

  const handleSend = () => {
    if (inputValue.trim() && !isProcessing) {
      sendMessage(inputValue);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderSources = (sources: AssistantSource[]) => {
    return (
      <div className="mt-4 pt-4 border-t border-muted/30">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4" /> Supporting Sources
        </h4>
        <div className="grid gap-2">
          {sources.map((src) => (
            <div key={src.id} className="text-sm bg-background p-3 rounded-xl border border-muted/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="font-medium">{src.title}</div>
                <div className="text-muted-foreground text-xs flex items-center gap-2 mt-1">
                  {src.authority && <span>{src.authority}</span>}
                  {src.authority && src.reference && <span>•</span>}
                  {src.reference && <span>{src.reference}</span>}
                </div>
              </div>
              {src.url ? (
                <a href={src.url} target="_blank" rel="noreferrer" className="shrink-0 text-bcn-red hover:text-bcn-red/80 flex items-center text-xs font-medium bg-bcn-red/5 px-3 py-1.5 rounded-full transition-colors">
                  View Source <ExternalLink className="w-3 h-3 ml-1.5" />
                </a>
              ) : (
                <span className="shrink-0 text-muted-foreground text-xs font-medium bg-muted px-3 py-1.5 rounded-full">
                  Internal Reference
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderFollowUps = (questions: string[]) => {
    return (
      <div className="mt-4 flex flex-wrap gap-2">
        {questions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => sendMessage(q)}
            disabled={isProcessing}
            className="text-xs font-medium bg-card border border-muted-foreground/20 hover:border-bcn-red hover:text-bcn-red px-4 py-2 rounded-full transition-all text-left disabled:opacity-50 disabled:pointer-events-none"
          >
            {q}
          </button>
        ))}
      </div>
    );
  };

  if (!activeBusinessId) {
    return (
      <div className="p-6 md:p-8 max-w-4xl mx-auto h-[80vh] flex items-center justify-center">
        <EmptyState
          title="Select a Business"
          description="Ask BCN requires an active business context to provide accurate compliance answers."
          icon={<Bot className="w-12 h-12 text-muted-foreground" />}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col animate-in fade-in duration-500 bg-card rounded-3xl border shadow-sm overflow-hidden mt-2">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-bcn-red text-white flex items-center justify-center shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Ask BCN</h1>
            <p className="text-xs text-muted-foreground">Compliance Assistant</p>
          </div>
        </div>
        
        {messages.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearChat}
            className="text-muted-foreground hover:text-bcn-red"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Chat
          </Button>
        )}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-muted/5">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-75">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <ShieldAlert className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="max-w-md">
              <h2 className="text-xl font-bold mb-2">How can BCN help your business today?</h2>
              <p className="text-muted-foreground text-sm">
                Ask about regulations, upcoming deadlines, or the documents you need to stay compliant.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 max-w-lg">
              {["What licenses do I need to start a restaurant?", "Explain my GST requirements", "How do I renew my trade license?"].map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(q)}
                  className="text-sm bg-background border rounded-full px-4 py-2 hover:border-bcn-red hover:text-bcn-red transition-colors shadow-sm"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'order-1' : 'order-2'}`}>
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2 ml-1 text-xs font-medium text-muted-foreground">
                    <Bot className="w-3 h-3" /> BCN Assistant
                  </div>
                )}
                
                <Card className={`rounded-2xl border-none shadow-sm overflow-hidden ${
                  msg.role === 'user' 
                    ? 'bg-bcn-black text-white rounded-tr-sm' 
                    : 'bg-background rounded-tl-sm border border-muted/50'
                }`}>
                  <CardContent className="p-4 md:p-5">
                    {msg.role === 'user' ? (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <div className="space-y-4">
                        <div className="prose prose-sm max-w-none text-foreground prose-p:leading-relaxed prose-a:text-bcn-red prose-strong:text-foreground">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                        
                        {msg.uncertainty && (
                          <div className="flex items-start gap-3 p-3 bg-bcn-yellow/10 border border-bcn-yellow/20 rounded-xl text-sm">
                            <AlertTriangle className="w-5 h-5 text-bcn-yellow shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium text-bcn-yellow mb-1">More information needed</p>
                              <p className="text-muted-foreground">To provide a definitive answer, BCN needs more details about your operations.</p>
                              <Link href="/business" className="inline-flex items-center text-bcn-red font-medium mt-2 hover:underline">
                                Update Business Profile <ChevronRight className="w-4 h-4 ml-1" />
                              </Link>
                            </div>
                          </div>
                        )}
                        
                        {msg.sources && msg.sources.length > 0 && renderSources(msg.sources)}
                        {msg.followUpQuestions && msg.followUpQuestions.length > 0 && renderFollowUps(msg.followUpQuestions)}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          ))
        )}
        
        {isProcessing && (
          <div className="flex justify-start">
            <div className="max-w-[85%] md:max-w-[75%]">
              <div className="flex items-center gap-2 mb-2 ml-1 text-xs font-medium text-muted-foreground">
                <Bot className="w-3 h-3" /> BCN Assistant
              </div>
              <Card className="rounded-2xl rounded-tl-sm border-none shadow-sm bg-background border border-muted/50">
                <CardContent className="p-5 flex gap-1.5 items-center">
                  <div className="w-2 h-2 rounded-full bg-bcn-red/50 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-bcn-red/50 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-bcn-red/50 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  <span className="text-sm text-muted-foreground ml-2">Analyzing compliance logic...</span>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center my-4">
            <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-xl border border-destructive/20 flex flex-col items-center text-center gap-2 max-w-sm">
              <AlertTriangle className="w-5 h-5" />
              <p>{error.message || "Something went wrong communicating with BCN."}</p>
              <Button size="sm" variant="outline" className="mt-2 rounded-full" onClick={retry}>
                <RefreshCcw className="w-4 h-4 mr-2" /> Retry
              </Button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-background border-t">
        <div className="relative flex items-end gap-2 max-w-4xl mx-auto">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about regulations, deadlines, or compliance requirements..."
            className="w-full min-h-[56px] max-h-32 resize-none rounded-2xl border-muted-foreground/30 bg-muted/5 p-4 pr-12 focus:outline-none focus:ring-1 focus:ring-bcn-red shadow-inner transition-all text-sm leading-relaxed"
            rows={1}
            disabled={isProcessing}
          />
          <Button 
            className="absolute right-2 bottom-2 rounded-xl w-10 h-10 p-0 bg-bcn-red hover:bg-bcn-red/90 text-white disabled:opacity-50"
            onClick={handleSend}
            disabled={!inputValue.trim() || isProcessing}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="text-center mt-3">
          <p className="text-[10px] text-muted-foreground">
            BCN provides compliance guidance based on available regulatory sources. Always verify critical decisions with legal counsel.
          </p>
        </div>
      </div>
    </div>
  );
}
