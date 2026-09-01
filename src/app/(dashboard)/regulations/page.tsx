/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useEffect } from "react";
import { useRegulations } from "@/hooks/useRegulations";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Search, Filter, ShieldCheck, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/common/EmptyState";
import { motion } from "framer-motion";

export default function RegulationsPage() {
  const { data: regulations, isLoading, isError } = useRegulations();
  const [searchQuery, setSearchQuery] = useState("");
  const [authorityFilter, setAuthorityFilter] = useState("all");
  const [jurisdictionFilter, setJurisdictionFilter] = useState("all");

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredRegulations = useMemo(() => {
    if (!regulations) return [];
    
    return regulations.filter(reg => {
      const matchesSearch = reg.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            reg.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesAuthority = authorityFilter === "all" || reg.authority === authorityFilter;
      const matchesJurisdiction = jurisdictionFilter === "all" || reg.jurisdiction === jurisdictionFilter;
      
      return matchesSearch && matchesAuthority && matchesJurisdiction;
    });
  }, [regulations, searchQuery, authorityFilter, jurisdictionFilter]);

  const uniqueAuthorities = useMemo(() => {
    if (!regulations) return [];
    return Array.from(new Set(regulations.map(r => r.authority)));
  }, [regulations]);

  const uniqueJurisdictions = useMemo(() => {
    if (!regulations) return [];
    return Array.from(new Set(regulations.map(r => r.jurisdiction)));
  }, [regulations]);

  if (!mounted) return null;

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-muted/10 min-h-screen">
      
      {/* Massive Header */}
      <div className="flex flex-col mb-12 max-w-7xl mx-auto px-2">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
          Regulatory Knowledge
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl leading-relaxed">
          Explore the fundamental regulations and legislative frameworks supporting BCN's compliance intelligence engine.
        </p>
      </div>

      {/* Pill-shaped Sticky Filter Bar */}
      <div className="sticky top-20 z-30 max-w-7xl mx-auto mb-16">
        <div className="flex flex-col md:flex-row gap-4 p-3 bg-white/80 backdrop-blur-xl border border-black/5 rounded-full shadow-lg items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search regulatory knowledge base..." 
              className="pl-14 rounded-full h-14 border-none bg-muted/30 text-lg focus-visible:ring-1 focus-visible:ring-bcn-red"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <Select value={authorityFilter} onValueChange={(val) => setAuthorityFilter(val || "all")}>
              <SelectTrigger className="w-full md:w-[220px] h-14 rounded-full border-none bg-muted/30 px-6 font-medium text-base">
                <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Authority" />
              </SelectTrigger>
              <SelectContent className="rounded-[1.5rem] p-2 border-none shadow-xl">
                <SelectItem value="all" className="rounded-xl cursor-pointer">All Authorities</SelectItem>
                {uniqueAuthorities.map(auth => (
                  <SelectItem key={auth} value={auth} className="rounded-xl cursor-pointer">{auth}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={jurisdictionFilter} onValueChange={(val) => setJurisdictionFilter(val || "all")}>
              <SelectTrigger className="w-full md:w-[200px] h-14 rounded-full border-none bg-muted/30 px-6 font-medium text-base">
                <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Jurisdiction" />
              </SelectTrigger>
              <SelectContent className="rounded-[1.5rem] p-2 border-none shadow-xl">
                <SelectItem value="all" className="rounded-xl cursor-pointer">All Jurisdictions</SelectItem>
                {uniqueJurisdictions.map(jur => (
                  <SelectItem key={jur} value={jur} className="rounded-xl cursor-pointer">{jur}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto px-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-[28rem] rounded-[2.5rem] bg-white border border-muted/20 shadow-sm animate-pulse"></div>
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          title="Couldn't load regulations"
          description="There was a problem loading the regulatory library. Please try again."
          action={{ label: "Retry", onClick: () => window.location.reload() }}
        />
      ) : filteredRegulations.length === 0 ? (
        <div className="max-w-7xl mx-auto px-2">
          <EmptyState
            title="No regulations found"
            description={searchQuery || authorityFilter !== "all" || jurisdictionFilter !== "all" 
              ? "Try adjusting your filters or search query." 
              : "No regulatory data is available right now."}
            action={(searchQuery || authorityFilter !== "all" || jurisdictionFilter !== "all") ? {
              label: "Clear Filters",
              onClick: () => {
                setSearchQuery("");
                setAuthorityFilter("all");
                setJurisdictionFilter("all");
              }
            } : undefined}
            icon={<BookOpen className="w-16 h-16 text-muted-foreground/30" />}
          />
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto px-2 pb-24">
          {filteredRegulations.map((reg, i) => (
            <motion.div
              key={reg.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <Link href={`/regulations/${reg.id}`} className="block group h-full">
                <Card className="rounded-[2.5rem] h-full flex flex-col border-none shadow-sm hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2 bg-white relative overflow-hidden">
                  
                  {/* Floating abstract element */}
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-all duration-500 transform group-hover:scale-125 group-hover:-translate-y-4 group-hover:translate-x-4">
                    <BookOpen className="w-32 h-32 text-bcn-red" />
                  </div>
                  
                  <CardContent className="p-8 md:p-10 flex flex-col h-full z-10 relative">
                    
                    {/* Tags */}
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                      <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-muted text-muted-foreground group-hover:bg-bcn-red/10 group-hover:text-bcn-red transition-colors">
                        {reg.jurisdiction}
                      </span>
                      <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-muted text-muted-foreground group-hover:bg-bcn-red/10 group-hover:text-bcn-red transition-colors">
                        {reg.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="mb-8">
                      <h3 className="text-2xl md:text-3xl font-bold group-hover:text-bcn-red transition-colors duration-300 leading-tight mb-4">
                        {reg.title}
                      </h3>
                      <p className="text-lg text-muted-foreground line-clamp-3 leading-relaxed">
                        {reg.description}
                      </p>
                    </div>
                    
                    {/* Meta & Footer (Pushed to bottom) */}
                    <div className="mt-auto pt-8 border-t border-dashed border-muted flex flex-col gap-6">
                      <div className="flex flex-col gap-4 text-sm font-medium">
                        <div className="flex items-start gap-3">
                          <ShieldCheck className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                          <span className="text-base text-foreground leading-tight">{reg.authority}</span>
                        </div>
                        {reg.effectiveDate && (
                          <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-amber-500 shrink-0" />
                            <span className="text-base text-foreground leading-tight">Effective {new Date(reg.effectiveDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between w-full pt-4">
                        <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground group-hover:text-bcn-red transition-colors">
                          {reg.relatedComplianceIds && reg.relatedComplianceIds.length > 0 
                            ? `${reg.relatedComplianceIds.length} Connected Requirement${reg.relatedComplianceIds.length > 1 ? 's' : ''}`
                            : "Explore Source"}
                        </span>
                        <div className="w-10 h-10 rounded-full bg-muted/50 group-hover:bg-bcn-red flex items-center justify-center transition-colors">
                          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-white transition-colors" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
