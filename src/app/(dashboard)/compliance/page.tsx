/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCompliance } from "@/hooks/useCompliance";
import { useActiveBusiness } from "@/components/providers/BusinessProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/common/EmptyState";
import { StatusBadge } from "@/components/compliance/StatusBadge";
import { RiskBadge } from "@/components/compliance/RiskBadge";
import { Search, Filter, AlertCircle, ArrowRight, ShieldCheck, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { ComplianceStatus, ComplianceRisk } from "@/types/compliance";
import { motion } from "framer-motion";

export default function CompliancePage() {
  const { activeBusinessId } = useActiveBusiness();
  const { data: complianceItems, isLoading, error, refetch } = useCompliance(activeBusinessId);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ComplianceStatus | "all">("all");
  const [riskFilter, setRiskFilter] = useState<ComplianceRisk | "all">("all");

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredItems = useMemo(() => {
    if (!complianceItems) return [];
    return complianceItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.authority.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      const matchesRisk = riskFilter === "all" || item.risk === riskFilter;
      return matchesSearch && matchesStatus && matchesRisk;
    });
  }, [complianceItems, searchQuery, statusFilter, riskFilter]);

  if (!mounted) return null;

  if (isLoading) {
    return (
      <div className="p-8 space-y-6 animate-pulse max-w-7xl mx-auto">
        <div className="h-16 w-64 bg-muted rounded-xl mb-12"></div>
        <div className="h-20 w-full bg-muted rounded-full mb-12"></div>
        {[1, 2, 3].map(i => <div key={i} className="h-40 bg-muted rounded-[2rem]"></div>)}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertCircle className="w-12 h-12 text-bcn-red mb-4" />
        <h2 className="text-2xl font-bold mb-2">We couldn't load your compliance requirements.</h2>
        <p className="text-muted-foreground mb-6">{(error as Error).message}</p>
        <Button onClick={() => refetch()} variant="outline" className="rounded-full px-6">Retry</Button>
      </div>
    );
  }

  if (!complianceItems || complianceItems.length === 0) {
    return (
      <EmptyState
        title="Your business hasn't been analyzed yet."
        description="Run an analysis to build your personalized compliance roadmap."
        action={{ label: "Analyze Business Profile", href: "/compliance/analyze" }}
        icon={<ShieldCheck className="w-12 h-12 text-muted-foreground" />}
      />
    );
  }

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-muted/10 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 max-w-7xl mx-auto px-2">
        <div className="max-w-xl">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-4">
            Requirements
          </h1>
          <p className="text-xl text-muted-foreground">
            What applies to your business, and what you need to do.
          </p>
        </div>
        <Link href="/compliance/analyze" className="mt-6 md:mt-0">
          <Button variant="outline" className="rounded-full px-8 py-6 text-lg border-bcn-red/20 text-bcn-red hover:bg-bcn-red hover:text-white transition-all shadow-sm">
            <RefreshCw className="w-5 h-5 mr-2" /> Re-analyze Profile
          </Button>
        </Link>
      </div>

      {/* Pill-shaped sticky filter bar */}
      <div className="sticky top-20 z-30 max-w-7xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row gap-4 p-3 bg-white/80 backdrop-blur-xl border border-black/5 rounded-full shadow-lg items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search requirements or authorities..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-14 rounded-full h-14 border-none bg-muted/30 text-lg focus-visible:ring-1 focus-visible:ring-bcn-red"
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Select value={statusFilter} onValueChange={(val: any) => setStatusFilter(val)}>
              <SelectTrigger className="w-full md:w-[200px] h-14 rounded-full border-none bg-muted/30 px-6 font-medium">
                <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="rounded-[1.5rem] p-2 border-none shadow-xl">
                <SelectItem value="all" className="rounded-xl cursor-pointer">All Statuses</SelectItem>
                <SelectItem value="action_required" className="rounded-xl cursor-pointer">Action Required</SelectItem>
                <SelectItem value="upcoming" className="rounded-xl cursor-pointer">Upcoming</SelectItem>
                <SelectItem value="overdue" className="rounded-xl cursor-pointer">Overdue</SelectItem>
                <SelectItem value="in_progress" className="rounded-xl cursor-pointer">In Progress</SelectItem>
                <SelectItem value="completed" className="rounded-xl cursor-pointer">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={riskFilter} onValueChange={(val: any) => setRiskFilter(val)}>
              <SelectTrigger className="w-full md:w-[160px] h-14 rounded-full border-none bg-muted/30 px-6 font-medium">
                <AlertCircle className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Risk" />
              </SelectTrigger>
              <SelectContent className="rounded-[1.5rem] p-2 border-none shadow-xl">
                <SelectItem value="all" className="rounded-xl cursor-pointer">All Risks</SelectItem>
                <SelectItem value="critical" className="rounded-xl cursor-pointer">Critical</SelectItem>
                <SelectItem value="high" className="rounded-xl cursor-pointer">High</SelectItem>
                <SelectItem value="medium" className="rounded-xl cursor-pointer">Medium</SelectItem>
                <SelectItem value="low" className="rounded-xl cursor-pointer">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* List (ControlSection card style) */}
      <div className="space-y-6 max-w-7xl mx-auto px-2">
        {filteredItems.length === 0 ? (
          <div className="text-center p-16 bg-white rounded-[3rem] border border-dashed shadow-sm">
            <p className="text-xl text-muted-foreground font-medium mb-4">No requirements match your filters.</p>
            <Button variant="outline" className="rounded-full px-8 py-6 text-lg" onClick={() => { setSearchQuery(""); setStatusFilter("all"); setRiskFilter("all"); }}>
              Clear all filters
            </Button>
          </div>
        ) : (
          filteredItems.map((item: any, i: number) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link href={`/compliance/${item.id}`} className="block group">
                <Card 
                  className="rounded-[2.5rem] border-none bg-white shadow-sm hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1"
                >
                  <CardContent className="p-8 md:p-10 flex flex-col md:flex-row gap-8 md:items-center relative overflow-hidden">
                    {/* Hover indicator blur */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-bcn-red/5 blur-3xl rounded-full -mr-32 -mt-32 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="flex-1 space-y-4 relative z-10">
                      <div className="flex flex-wrap items-center gap-3">
                        <StatusBadge status={item.status} className="px-4 py-1.5 rounded-full text-sm font-semibold" />
                        <RiskBadge risk={item.risk} className="px-4 py-1.5 rounded-full text-sm font-semibold" />
                        <span className="text-xs font-bold text-muted-foreground border px-3 py-1.5 rounded-full uppercase tracking-wider">
                          {item.category}
                        </span>
                      </div>
                      
                      <div>
                        <h3 className="text-3xl font-bold group-hover:text-bcn-red transition-colors duration-300 leading-tight pr-12">{item.name}</h3>
                        <p className="text-lg text-muted-foreground mt-2 line-clamp-2 pr-12">{item.description}</p>
                      </div>

                      <div className="flex flex-wrap gap-x-12 gap-y-4 pt-4">
                        <div className="flex flex-col">
                          <span className="text-muted-foreground/50 text-xs uppercase tracking-wider font-bold mb-1">Authority</span>
                          <span className="font-semibold flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-bcn-red"/> {item.authority}</span>
                        </div>
                        {item.deadline && (
                          <div className="flex flex-col">
                            <span className="text-muted-foreground/50 text-xs uppercase tracking-wider font-bold mb-1">Deadline</span>
                            <span className="font-semibold flex items-center gap-2"><AlertCircle className="w-4 h-4 text-amber-500"/> {new Date(item.deadline).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center justify-end relative z-10">
                      <div className="w-16 h-16 rounded-full bg-muted/50 group-hover:bg-bcn-red flex items-center justify-center transition-colors duration-300">
                        <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-white transition-colors duration-300" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))
        )}
      </div>

    </div>
  );
}
