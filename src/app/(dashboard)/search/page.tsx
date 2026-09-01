"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSearch } from "@/hooks/useSearch";
import { useActiveBusiness } from "@/components/providers/BusinessProvider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/common/EmptyState";
import { 
  Search as SearchIcon, 
  X, 
  BookOpen, 
  ShieldCheck, 
  FileText, 
  ArrowRight, 
  ExternalLink 
} from "lucide-react";
import Link from "next/link";
import { SearchResult } from "@/types/search";
import { Suspense } from "react";

// Let's implement a simple debounce hook locally if it doesn't exist, but since it's just a UI component we'll use a local timeout.
function useDebounceValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  const [inputValue, setInputValue] = useState(initialQuery);
  const debouncedQuery = useDebounceValue(inputValue, 500); // 500ms debounce
  const { activeBusinessId } = useActiveBusiness();

  const { data, isLoading, isError, refetch, isFetching } = useSearch({
    query: debouncedQuery,
    businessId: activeBusinessId || undefined,
  }, debouncedQuery.length >= 2); // Only enable if query is long enough

  // Update URL when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      const params = new URLSearchParams(window.location.search);
      params.set("q", debouncedQuery.trim());
      router.replace(`?${params.toString()}`, { scroll: false });
    } else if (!debouncedQuery && searchParams.has("q")) {
      const params = new URLSearchParams(window.location.search);
      params.delete("q");
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [debouncedQuery, router, searchParams]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Regulation": return <BookOpen className="w-4 h-4 text-bcn-red" />;
      case "Requirement": return <ShieldCheck className="w-4 h-4 text-blue-500" />;
      case "Document": return <FileText className="w-4 h-4 text-green-500" />;
      default: return <SearchIcon className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getDestinationUrl = (result: SearchResult) => {
    if (result.relatedRegulationId) return `/regulations/${result.relatedRegulationId}`;
    if (result.relatedRequirementId) return `/compliance/${result.relatedRequirementId}`;
    if (result.relatedDocumentId) return `/documents/${result.relatedDocumentId}`;
    if (result.sourceUrl) return result.sourceUrl;
    return "#";
  };

  const isExternalUrl = (url: string) => url.startsWith("http");

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 min-h-[80vh]">
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-4">
        <div className="w-16 h-16 bg-bcn-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <SearchIcon className="w-8 h-8 text-bcn-red" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Semantic Search</h1>
        <p className="text-muted-foreground text-lg">
          Search regulations, requirements, and compliance documents for your business.
        </p>
      </div>

      <div className="relative max-w-2xl mx-auto">
        <div className="relative flex items-center">
          <SearchIcon className={`absolute left-4 w-5 h-5 ${isFetching ? "text-bcn-red animate-pulse" : "text-muted-foreground"}`} />
          <Input 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="e.g., Do I need an FSSAI license for a cafe?"
            className="pl-12 pr-12 h-14 rounded-full border-muted-foreground/20 bg-card shadow-sm text-lg focus-visible:ring-1 focus-visible:ring-bcn-red"
          />
          {inputValue && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 rounded-full text-muted-foreground hover:text-foreground"
              onClick={() => {
                setInputValue("");
              }}
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      <div className="pt-6">
        {inputValue.length > 0 && inputValue.length < 2 ? (
          <p className="text-center text-muted-foreground">Type at least 2 characters to search...</p>
        ) : isLoading && isFetching ? (
          <div className="space-y-4 max-w-3xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted/20 animate-pulse rounded-2xl border border-muted/10"></div>
            ))}
          </div>
        ) : isError ? (
          <EmptyState
            title="Search Error"
            description="We couldn't complete your search right now. Please try again."
            action={{ label: "Retry Search", onClick: () => refetch() }}
            icon={<X className="w-10 h-10 text-bcn-red" />}
          />
        ) : data?.results && data.results.length === 0 && debouncedQuery.length >= 2 ? (
          <EmptyState
            title="No results found"
            description={`We couldn't find anything matching "${debouncedQuery}".`}
            action={{ label: "Clear Search", onClick: () => setInputValue("") }}
          />
        ) : data?.results && data.results.length > 0 ? (
          <div className="space-y-4 max-w-3xl mx-auto">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">
              {data.total} Results found
            </h3>
            {data.results.map((result) => {
              const url = getDestinationUrl(result);
              const isExternal = isExternalUrl(url);

              return (
                <Link key={result.id} href={url} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noreferrer" : undefined} className="block group">
                  <Card className="rounded-2xl border-muted/40 shadow-sm hover:shadow-md hover:border-bcn-red/30 transition-all bg-card">
                    <CardContent className="p-5 flex gap-4">
                      <div className="shrink-0 mt-1">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-bcn-red/10 transition-colors">
                          {getCategoryIcon(result.category)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            <span>{result.category}</span>
                            {result.authority && (
                              <>
                                <span>•</span>
                                <span>{result.authority}</span>
                              </>
                            )}
                          </div>
                          {result.relevanceScore && (
                            <span className="text-xs bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full font-medium">
                              {(result.relevanceScore * 100).toFixed(0)}% Match
                            </span>
                          )}
                        </div>
                        <h4 className="font-semibold text-lg group-hover:text-bcn-red transition-colors mb-2 truncate">
                          {result.title}
                        </h4>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                          {result.summary}
                        </p>
                        <div className="flex items-center text-sm font-medium text-bcn-red">
                          {isExternal ? (
                            <>View Source <ExternalLink className="w-4 h-4 ml-1.5" /></>
                          ) : (
                            <>View Details <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" /></>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-muted-foreground pt-12">
            <p>Start typing to search your compliance knowledge base.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8 min-h-[80vh] flex items-center justify-center">
        <div className="space-y-4 w-full max-w-3xl">
           <div className="h-14 bg-muted/20 animate-pulse rounded-full border border-muted/10 mx-auto max-w-2xl"></div>
           <div className="h-32 bg-muted/20 animate-pulse rounded-2xl border border-muted/10"></div>
           <div className="h-32 bg-muted/20 animate-pulse rounded-2xl border border-muted/10"></div>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
