/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRegulation } from "@/hooks/useRegulations";
import { useCompliance } from "@/hooks/useCompliance";
import { useActiveBusiness } from "@/components/providers/BusinessProvider";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/common/EmptyState";
import { ArrowLeft, BookOpen, ExternalLink, ShieldCheck, CheckCircle2, ChevronRight, Calendar, Scale, Link2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function RegulationDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { activeBusinessId } = useActiveBusiness();
  
  const { data: regulation, isLoading, isError } = useRegulation(id);
  const { data: allComplianceItems, isLoading: complianceLoading } = useCompliance(activeBusinessId);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const relatedComplianceItems = useMemo(() => {
    if (!regulation || !allComplianceItems) return [];
    return allComplianceItems.filter(item => 
      regulation.relatedComplianceIds?.includes(item.id)
    );
  }, [regulation, allComplianceItems]);

  if (!mounted) return null;

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[80vh]">
        <div className="w-16 h-16 border-4 border-bcn-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || !regulation) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[80vh] text-center max-w-2xl mx-auto">
        <Scale className="w-16 h-16 text-bcn-red mb-6" />
        <h2 className="text-4xl font-bold mb-4 tracking-tight">Regulation not found</h2>
        <p className="text-xl text-muted-foreground mb-8">The regulation you are looking for doesn't exist or could not be loaded.</p>
        <Button onClick={() => router.back()} className="rounded-full px-8 py-6 text-lg bg-bcn-black text-white hover:bg-black/90">
          Back to Library
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white min-h-screen">
      
      <div className="max-w-7xl mx-auto mb-16">
        <Button variant="ghost" onClick={() => router.back()} className="rounded-full text-muted-foreground hover:text-foreground pl-0 group mb-8 hover:bg-transparent">
          <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
          <span className="text-lg">Back to Regulations</span>
        </Button>

        {/* Header Section (EfficiencySection style) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest bg-muted text-muted-foreground shadow-sm">
              {regulation.jurisdiction}
            </span>
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest bg-muted text-muted-foreground shadow-sm">
              {regulation.category}
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1] max-w-5xl">
            {regulation.title}
          </h1>
          <p className="text-2xl text-muted-foreground leading-relaxed max-w-4xl">
            {regulation.description}
          </p>
        </motion.div>
      </div>

      {/* Asymmetrical Bento Grid */}
      <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto pb-24">
        
        {/* Left Column: Summary and Core Info */}
        <motion.div 
          className="lg:col-span-2 space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="rounded-[2.5rem] border-none shadow-sm bg-muted/10 overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                  <Scale className="w-6 h-6 text-bcn-red" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight">Regulatory Summary</h2>
              </div>
              <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed">
                <p>{regulation.summary}</p>
              </div>
            </CardContent>
          </Card>

          {/* Connection Block */}
          <div className="pt-8 border-t border-black/5">
            <h2 className="text-4xl font-bold tracking-tight mb-8">Business Applicability</h2>
            
            {!activeBusinessId ? (
              <Card className="rounded-[2.5rem] border-dashed border-2 shadow-none bg-white">
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Link2 className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">No Business Context</h3>
                  <p className="text-lg text-muted-foreground mb-8">Select an active business to see how this regulation maps to your compliance profile.</p>
                </CardContent>
              </Card>
            ) : complianceLoading ? (
              <div className="space-y-4">
                <div className="h-24 bg-muted/20 animate-pulse rounded-[2rem]"></div>
                <div className="h-24 bg-muted/20 animate-pulse rounded-[2rem]"></div>
              </div>
            ) : relatedComplianceItems.length === 0 ? (
              <Card className="rounded-[2.5rem] border-none shadow-sm bg-muted/10">
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <CheckCircle2 className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">No Related Requirements</h3>
                  <p className="text-lg text-muted-foreground">This regulation currently has no mapped compliance requirements for your active business profile.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {relatedComplianceItems.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + (i * 0.1) }}
                  >
                    <Link href={`/compliance/${item.id}`} className="block group">
                      <Card className="rounded-[2rem] border-none shadow-sm hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1 bg-white relative overflow-hidden">
                        {/* Hover glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-bcn-red/5 blur-3xl rounded-full -mr-32 -mt-32 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <CardContent className="p-8 flex items-center justify-between relative z-10">
                          <div className="flex-1 pr-8">
                            <div className="flex items-center gap-3 mb-3">
                              <span className="text-xs font-bold uppercase tracking-widest text-bcn-red border border-bcn-red/20 bg-bcn-red/5 px-3 py-1 rounded-full">
                                Compliance Requirement
                              </span>
                            </div>
                            <h4 className="text-2xl font-bold group-hover:text-bcn-red transition-colors mb-2">{item.name}</h4>
                            <p className="text-lg text-muted-foreground line-clamp-2">{item.description}</p>
                          </div>
                          
                          <div className="w-16 h-16 rounded-full bg-muted/50 group-hover:bg-bcn-red flex items-center justify-center transition-colors shrink-0">
                            <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-white transition-colors" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Right Column: Source Transparency (FeaturesGrid Dark Card) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="rounded-[2.5rem] border-none bg-bcn-black text-white shadow-xl sticky top-24">
            <CardContent className="p-10 space-y-10">
              
              <div>
                <div className="text-white/50 text-sm font-bold uppercase tracking-widest mb-3">Authority</div>
                <div className="flex items-center gap-3 font-medium text-2xl">
                  <ShieldCheck className="w-8 h-8 text-bcn-red shrink-0" />
                  <span className="leading-tight">{regulation.authority}</span>
                </div>
              </div>
              
              <div className="grid gap-8 pt-8 border-t border-white/10">
                {regulation.effectiveDate && (
                  <div>
                    <div className="text-white/50 text-sm font-bold uppercase tracking-widest mb-3">Effective Date</div>
                    <div className="flex items-center gap-3 font-medium text-xl">
                      <Calendar className="w-6 h-6 text-amber-500 shrink-0" />
                      {new Date(regulation.effectiveDate).toLocaleDateString()}
                    </div>
                  </div>
                )}
                
                {regulation.lastVerified && (
                  <div>
                    <div className="text-white/50 text-sm font-bold uppercase tracking-widest mb-3">Last Verified</div>
                    <div className="flex items-center gap-3 font-medium text-xl">
                      <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                      {new Date(regulation.lastVerified).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>

              {regulation.sourceUrl && (
                <div className="pt-8">
                  <a href={regulation.sourceUrl} target="_blank" rel="noreferrer" className="block w-full">
                    <Button variant="outline" className="w-full rounded-full py-8 text-xl font-bold bg-white text-black hover:bg-white/90 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                      View Official Text <ExternalLink className="w-5 h-5 ml-3" />
                    </Button>
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  );
}
