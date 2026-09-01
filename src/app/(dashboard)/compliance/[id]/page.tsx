/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useComplianceItem } from "@/hooks/useCompliance";
import { useActiveBusiness } from "@/components/providers/BusinessProvider";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/compliance/StatusBadge";
import { RiskBadge } from "@/components/compliance/RiskBadge";
import { ArrowLeft, Loader2, AlertCircle, CheckCircle2, FileText, ExternalLink, ShieldCheck, ChevronDown, ChevronUp, Briefcase, FileSignature, Upload } from "lucide-react";
import Link from "next/link";
import { use, useState, useEffect } from "react";
import { DocumentUploadModal } from "@/components/documents/DocumentUploadModal";
import { motion, AnimatePresence } from "framer-motion";

export default function ComplianceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { activeBusinessId } = useActiveBusiness();
  const { data: item, isLoading, error } = useComplianceItem(activeBusinessId, id);
  
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isApplicabilityOpen, setIsApplicabilityOpen] = useState(false);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[80vh]">
        <Loader2 className="w-16 h-16 animate-spin text-muted-foreground/30" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[80vh] text-center">
        <AlertCircle className="w-16 h-16 text-bcn-red mb-6" />
        <h2 className="text-4xl font-bold mb-4 tracking-tight">Requirement not found</h2>
        <p className="text-xl text-muted-foreground mb-8">We couldn't load details for this compliance requirement.</p>
        <Button onClick={() => router.push("/compliance")} className="rounded-full px-8 py-6 text-lg bg-bcn-black text-white hover:bg-black/90">
          Back to Compliance
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white min-h-screen">
      
      <div className="max-w-7xl mx-auto mb-16">
        <Button variant="ghost" onClick={() => router.push("/compliance")} className="rounded-full text-muted-foreground hover:text-foreground pl-0 group mb-8 hover:bg-transparent">
          <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
          <span className="text-lg">Back to Requirements</span>
        </Button>

        {/* Header Section (EfficiencySection style) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="flex flex-wrap items-center gap-4">
            <StatusBadge status={item.status} className="px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm" />
            <RiskBadge risk={item.risk} className="px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm" />
            <span className="text-sm font-bold text-muted-foreground border px-4 py-1.5 rounded-full uppercase tracking-wider">
              {item.category}
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1] max-w-5xl">
            {item.name}
          </h1>
          <p className="text-2xl text-muted-foreground leading-relaxed max-w-4xl">
            {item.description}
          </p>

          <div className="flex flex-wrap gap-12 pt-8 border-t border-muted">
            <div className="flex flex-col gap-2">
              <span className="text-muted-foreground/60 text-sm uppercase tracking-widest font-bold">Authority</span>
              <span className="font-semibold text-2xl flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-bcn-red" />
                {item.authority}
              </span>
            </div>
            {item.deadline && (
              <div className="flex flex-col gap-2">
                <span className="text-muted-foreground/60 text-sm uppercase tracking-widest font-bold">Deadline</span>
                <span className="font-semibold text-2xl flex items-center gap-3">
                  <AlertCircle className="w-8 h-8 text-amber-500" />
                  {new Date(item.deadline).toLocaleDateString()}
                </span>
              </div>
            )}
            {item.renewalFrequency && (
              <div className="flex flex-col gap-2">
                <span className="text-muted-foreground/60 text-sm uppercase tracking-widest font-bold">Renewal</span>
                <span className="font-semibold text-2xl">
                  {item.renewalFrequency}
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto space-y-12 pb-24">
        
        {/* Why Does This Apply (AppPreviewSection Accordion Style) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-muted/10 rounded-[3rem] border border-black/5 overflow-hidden">
            <div 
              className="flex items-center justify-between p-8 md:p-10 cursor-pointer hover:bg-muted/20 transition-colors"
              onClick={() => setIsApplicabilityOpen(!isApplicabilityOpen)}
            >
              <div>
                <h2 className="text-3xl font-bold">Why does this apply to me?</h2>
                <p className="text-lg text-muted-foreground mt-2">See the logic BCN used to determine this requirement.</p>
              </div>
              <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${isApplicabilityOpen ? 'bg-bcn-red text-white' : 'bg-muted'}`}>
                {isApplicabilityOpen ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
              </div>
            </div>
            
            <AnimatePresence>
              {isApplicabilityOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-8 md:p-10 pt-0 border-t border-black/5">
                    <div className="space-y-6 mt-8">
                      {item.applicabilityReasons?.map((reason: any, idx: number) => (
                        <div key={idx} className="flex flex-col md:flex-row items-center gap-6 p-8 bg-white rounded-3xl shadow-sm border border-black/5">
                          <div className="flex-1 space-y-2 text-center md:text-left">
                            <div className="w-12 h-12 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto md:mx-0 mb-4">
                              <Briefcase className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <div className="text-sm font-bold text-bcn-red uppercase tracking-widest">Your Business Profile</div>
                            <div className="text-2xl font-medium">{reason.condition}</div>
                          </div>
                          
                          <div className="flex items-center justify-center px-4">
                            <div className="w-12 h-12 rounded-full border-2 border-dashed border-muted-foreground flex items-center justify-center">
                              <ArrowLeft className="w-5 h-5 md:-rotate-180 -rotate-90 text-muted-foreground" />
                            </div>
                          </div>
                          
                          <div className="flex-1 space-y-2 text-center md:text-left">
                            <div className="w-12 h-12 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto md:mx-0 mb-4">
                              <FileSignature className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Triggers Rule</div>
                            <div className="text-2xl font-medium">{reason.rule}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Action Steps & Documents (ControlSection large cards style) */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          <motion.div 
            className="lg:col-span-2 space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* What you need to do */}
            <section className="space-y-6">
              <h2 className="text-4xl font-bold tracking-tight">Action Steps</h2>
              <Card className="rounded-[2.5rem] border-none shadow-sm bg-muted/10 overflow-hidden">
                <div className="divide-y divide-black/5">
                  {item.actionSteps?.map((step: any, idx: number) => (
                    <div key={step.id} className="p-8 flex items-start gap-6 hover:bg-white transition-colors group">
                      <div className="shrink-0 mt-1">
                        {step.isCompleted ? (
                          <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full border-2 border-muted-foreground/30 group-hover:border-bcn-red transition-colors flex items-center justify-center text-sm font-bold text-muted-foreground group-hover:text-bcn-red">
                            {idx + 1}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 pt-1.5 text-xl font-medium leading-relaxed">
                        {step.description}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </section>

            {/* Required Documents */}
            {item.requiredDocuments && item.requiredDocuments.length > 0 && (
              <section className="space-y-6 pt-8">
                <h2 className="text-4xl font-bold tracking-tight">Required Documents</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {item.requiredDocuments.map((doc: any) => {
                    const hasLink = doc.documentId && doc.status !== 'missing';
                    
                    const Content = (
                      <div className="p-8 border-none rounded-[2rem] bg-white shadow-sm h-full hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between">
                        {doc.status === 'missing' && <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none" />}
                        {doc.status === 'verified' && <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none" />}
                        
                        <div>
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${doc.status === 'missing' ? 'bg-orange-50' : 'bg-muted/50'}`}>
                            <FileText className={`w-6 h-6 ${doc.status === 'missing' ? 'text-orange-500' : 'text-muted-foreground'}`} />
                          </div>
                          <div className="text-xl font-bold leading-tight group-hover:text-bcn-red transition-colors mb-8">{doc.name}</div>
                        </div>

                        <div className="flex items-center justify-between gap-4 mt-auto">
                          <div className="flex items-center gap-2">
                            {doc.status === 'verified' && <span className="text-green-600 font-bold flex items-center gap-1 text-sm bg-green-50 px-3 py-1 rounded-full"><CheckCircle2 className="w-4 h-4"/> Verified</span>}
                            {doc.status === 'uploaded' && <span className="text-blue-600 font-bold text-sm bg-blue-50 px-3 py-1 rounded-full">Uploaded</span>}
                            {doc.status === 'missing' && <span className="text-orange-600 font-bold text-sm bg-orange-50 px-3 py-1 rounded-full">Missing</span>}
                          </div>
                          
                          {doc.status === 'missing' && (
                            <Button 
                              variant="default" 
                              className="rounded-full bg-bcn-black text-white hover:bg-bcn-red transition-colors px-6"
                              onClick={(e) => {
                                e.preventDefault();
                                setIsUploadModalOpen(true);
                              }}
                            >
                              <Upload className="w-4 h-4 mr-2" /> Upload
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                    
                    if (hasLink) {
                      return (
                        <Link key={doc.id} href={`/documents/${doc.documentId}`} className="block group h-full">
                          {Content}
                        </Link>
                      );
                    }
                    
                    return <div key={doc.id} className="block group h-full">{Content}</div>;
                  })}
                </div>
              </section>
            )}
            
            {activeBusinessId && (
              <DocumentUploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                businessId={activeBusinessId}
                relatedRequirementId={item.id}
              />
            )}
          </motion.div>

          {/* Right Column: Source Transparency (FeaturesGrid Dark Card) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {item.source && (
              <Card className="rounded-[2.5rem] border-none bg-bcn-black text-white shadow-xl sticky top-24">
                <CardContent className="p-10 space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-white/50">Regulatory Source</h3>
                  </div>
                  
                  <div>
                    <div className="text-2xl font-bold mb-4">{item.source.name}</div>
                    {item.source.act && <div className="text-lg text-white/70 mb-2">{item.source.act}</div>}
                    {item.source.section && <div className="text-lg text-bcn-red font-medium">{item.source.section}</div>}
                  </div>

                  <div className="pt-8 border-t border-white/10 text-sm text-white/50 flex flex-col gap-2">
                    <span>Verified: {item.source.lastVerified}</span>
                    <span>Data strictly sourced from authoritative bodies</span>
                  </div>

                  {item.source.url && (
                    <Link href={item.source.url} target="_blank" rel="noopener noreferrer" className="block w-full pt-4">
                      <Button variant="outline" className="w-full rounded-full py-6 text-lg bg-transparent border-white/20 text-white hover:bg-white hover:text-black transition-all">
                        View Official Text <ExternalLink className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
}
