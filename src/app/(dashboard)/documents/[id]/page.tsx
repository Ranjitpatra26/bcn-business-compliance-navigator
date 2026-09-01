/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useDocument, useProcessDocument, useDeleteDocument } from "@/hooks/useDocuments";
import { useComplianceItem } from "@/hooks/useCompliance";
import { useActiveBusiness } from "@/components/providers/BusinessProvider";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/common/EmptyState";
import { 
  ArrowLeft, FileText, CheckCircle2, Clock, AlertCircle, 
  FileX, Download, RefreshCw, Eye, ShieldCheck, ChevronRight, Trash2, Loader2, SearchCode, Database, Cpu
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function DocumentDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { activeBusinessId } = useActiveBusiness();
  
  const { data: document, isLoading, isError } = useDocument(activeBusinessId, id);
  const { mutate: processDocument, isPending: isProcessing } = useProcessDocument();
  const { mutate: deleteDocument, isPending: isDeleting } = useDeleteDocument();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: relatedCompliance, isLoading: complianceLoading } = useComplianceItem(
    activeBusinessId, 
    document?.relatedRequirementId || null
  );

  if (!mounted) return null;

  const getStatusIcon = (status: string, className = "w-5 h-5") => {
    switch (status) {
      case "processed": return <CheckCircle2 className={`${className} text-green-500`} />;
      case "processing": return <Clock className={`${className} text-bcn-yellow`} />;
      case "needs_attention": return <AlertCircle className={`${className} text-bcn-red`} />;
      case "failed": return <FileX className={`${className} text-bcn-red`} />;
      default: return <FileText className={`${className} text-muted-foreground`} />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "processed": return "Verified & Compliant";
      case "processing": return "Processing Document...";
      case "processed": return "Processed (Awaiting Verification)";
      case "needs_attention": return "Action Needed";
      case "failed": return "Processing Failed";
      case "uploaded": return "Uploaded (Awaiting Processing)";
      default: return status;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "processed": return "bg-green-500/10";
      case "processing": return "bg-amber-500/10";
      case "needs_attention": return "bg-bcn-red/10";
      case "failed": return "bg-bcn-red/10";
      default: return "bg-blue-500/10";
    }
  };

  const handleProcess = () => {
    if (activeBusinessId) {
      processDocument({ businessId: activeBusinessId, id });
    }
  };

  const handleDelete = () => {
    if (activeBusinessId && confirm("Are you sure you want to delete this document?")) {
      deleteDocument(
        { businessId: activeBusinessId, id }, 
        { onSuccess: () => router.push("/documents") }
      );
    }
  };

  if (!activeBusinessId) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <EmptyState
          title="Select a Business"
          description="Select an active business to view its documents."
          icon={<FileText className="w-16 h-16 text-muted-foreground/30" />}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[80vh]">
        <div className="w-16 h-16 border-4 border-bcn-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || !document) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[80vh] text-center max-w-2xl mx-auto">
        <FileX className="w-16 h-16 text-bcn-red mb-6" />
        <h2 className="text-4xl font-bold mb-4 tracking-tight">Document not found</h2>
        <p className="text-xl text-muted-foreground mb-8">The document you are looking for doesn't exist or could not be loaded.</p>
        <Button onClick={() => router.back()} className="rounded-full px-8 py-6 text-lg bg-bcn-black text-white hover:bg-black/90">
          Back to Documents
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white min-h-screen">
      
      <div className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <Button variant="ghost" onClick={() => router.back()} className="rounded-full text-muted-foreground hover:text-foreground pl-0 group mb-4 hover:bg-transparent">
            <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
            <span className="text-lg">Back to Documents</span>
          </Button>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest bg-muted text-muted-foreground shadow-sm">
              {document.type}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-[1.1] max-w-4xl truncate break-words">
            {document.name}
          </h1>
          <p className="text-xl text-muted-foreground mt-4">
            Uploaded on {new Date(document.uploadedAt).toLocaleString()}
            {document.sizeBytes && ` • ${(document.sizeBytes / 1024 / 1024).toFixed(2)} MB`}
          </p>
        </div>
        
        <Button 
          variant="outline" 
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-bcn-red border-bcn-red/20 hover:bg-bcn-red hover:text-white rounded-full px-8 py-6 font-medium shadow-sm transition-colors"
        >
          {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
          Delete Document
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto pb-24">
        
        {/* Left Column */}
        <motion.div 
          className="lg:col-span-2 space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Main Status & Processing Card */}
          <Card className={`rounded-[2.5rem] border-none shadow-sm relative overflow-hidden ${getStatusBg(document.status)}`}>
            {document.status === 'processing' && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[100%] animate-[shimmer_2s_infinite]" />
            )}
            
            <CardContent className="p-8 md:p-12 relative z-10 flex flex-col md:flex-row gap-8 items-center">
              <div className="w-24 h-24 bg-white rounded-[2rem] shadow-sm flex items-center justify-center shrink-0">
                {getStatusIcon(document.status, "w-12 h-12")}
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-3xl font-bold mb-2 tracking-tight">
                  {getStatusLabel(document.status)}
                </h3>
                <p className="text-lg text-foreground/70 mb-8">
                  {document.status === "processed" ? "Document meets all compliance requirements and metadata is verified." :
                   document.status === "processing" ? "BCN AI is extracting metadata and analyzing the document contents..." :
                   document.status === "failed" ? "The analysis engine couldn't process this document automatically." :
                   "Document is ready to be processed by the BCN intelligence engine."}
                </p>
                
                <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
                  {(document.status === "failed" || document.status === "needs_attention" || document.status === "uploaded") && (
                    <Button 
                      className="rounded-full px-8 py-6 text-lg font-bold bg-bcn-black text-white hover:bg-black/90 shadow-xl"
                      onClick={handleProcess}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...</>
                      ) : (
                        <><RefreshCw className="w-5 h-5 mr-2" /> {document.status === "failed" ? "Retry Processing" : "Process Now"}</>
                      )}
                    </Button>
                  )}
                  
                  <Button variant="outline" className="rounded-full px-8 py-6 text-lg font-bold bg-white text-black hover:bg-white/90 shadow-sm border-none" onClick={() => alert("Document preview would open here.")}>
                    <Eye className="w-5 h-5 mr-2" /> Preview
                  </Button>
                  <Button variant="outline" className="w-14 h-14 rounded-full bg-white text-black hover:bg-white/90 shadow-sm border-none p-0 flex items-center justify-center shrink-0" onClick={() => alert("Download started.")}>
                    <Download className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Connection Block */}
          <div className="pt-8">
            <h2 className="text-4xl font-bold tracking-tight mb-8">Requirement Context</h2>
            
            {!document.relatedRequirementId ? (
              <Card className="rounded-[2.5rem] border-dashed border-2 shadow-none bg-white">
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShieldCheck className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">No Related Requirement</h3>
                  <p className="text-lg text-muted-foreground">This document is not currently attached to any specific compliance roadmap item.</p>
                </CardContent>
              </Card>
            ) : complianceLoading ? (
              <div className="h-32 bg-muted/20 animate-pulse rounded-[2rem]"></div>
            ) : !relatedCompliance ? (
              <Card className="rounded-[2.5rem] border-none shadow-sm bg-muted/10">
                <CardContent className="p-12 text-center">
                  <h3 className="text-2xl font-bold mb-4">Requirement Not Found</h3>
                  <p className="text-lg text-muted-foreground">The related compliance requirement could not be loaded.</p>
                </CardContent>
              </Card>
            ) : (
              <Link href={`/compliance/${relatedCompliance.id}`} className="block group">
                <Card className="rounded-[2.5rem] border-none shadow-sm hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1 bg-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-bcn-red/5 blur-3xl rounded-full -mr-32 -mt-32 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardContent className="p-8 md:p-10 flex items-center justify-between relative z-10">
                    <div className="flex-1 pr-8">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-xs font-bold uppercase tracking-widest text-bcn-red border border-bcn-red/20 bg-bcn-red/5 px-3 py-1 rounded-full">
                          Compliance Roadmap
                        </span>
                      </div>
                      <h4 className="text-3xl font-bold group-hover:text-bcn-red transition-colors mb-3 tracking-tight">{relatedCompliance.name}</h4>
                      <p className="text-lg text-muted-foreground line-clamp-2">{relatedCompliance.description}</p>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-muted/50 group-hover:bg-bcn-red flex items-center justify-center transition-colors shrink-0">
                      <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-white transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )}
          </div>
        </motion.div>

        {/* Right Column: Processing Pipeline Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="rounded-[2.5rem] border-none bg-bcn-black text-white shadow-xl sticky top-24 overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
            <CardContent className="p-10 space-y-8 relative z-10">
              
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-[1.5rem] bg-white/10 flex items-center justify-center backdrop-blur-md">
                  <Cpu className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">Processing Pipeline</h3>
              </div>
              
              <div className="space-y-6 pt-4">
                <div>
                  <div className="text-white/50 text-sm font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                    <SearchCode className="w-4 h-4" /> Verification State
                  </div>
                  <div className="font-bold text-xl capitalize">
                    {document.verificationState}
                  </div>
                </div>
                
                <div>
                  <div className="text-white/50 text-sm font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Database className="w-4 h-4" /> Pipeline State
                  </div>
                  <div className="font-bold text-xl capitalize">
                    {document.processingState?.replace("_", " ") || "Pending OCR"}
                  </div>
                </div>
                
                <div className="pt-6 border-t border-white/10">
                  <div className="text-white/50 text-sm font-bold uppercase tracking-widest mb-2">Technical Format</div>
                  <div className="font-mono text-lg bg-white/5 px-4 py-2 rounded-xl border border-white/10 inline-block truncate max-w-full">
                    {document.format || "Unknown"}
                  </div>
                </div>

                <div>
                  <div className="text-white/50 text-sm font-bold uppercase tracking-widest mb-2">System ID</div>
                  <div className="font-mono text-xs bg-white/5 px-4 py-3 rounded-xl border border-white/10 truncate">
                    {document.id}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  );
}
