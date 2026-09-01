/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useEffect } from "react";
import { useDocuments, useDeleteDocument } from "@/hooks/useDocuments";
import { useActiveBusiness } from "@/components/providers/BusinessProvider";
import { EmptyState } from "@/components/common/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileStack, Search, Filter, Upload, FileText, CheckCircle2, Clock, AlertCircle, FileX, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { DocumentUploadModal } from "@/components/documents/DocumentUploadModal";
import { motion } from "framer-motion";

export default function DocumentsPage() {
  const { activeBusinessId } = useActiveBusiness();
  const { data: documents, isLoading, isError } = useDocuments(activeBusinessId);
  const { mutate: deleteDocument } = useDeleteDocument();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredDocuments = useMemo(() => {
    if (!documents) return [];
    
    return documents.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            doc.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [documents, searchQuery, statusFilter]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault(); // prevent navigating to link
    if (confirm("Are you sure you want to delete this document?")) {
      deleteDocument({ businessId: activeBusinessId as string, id });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified": return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "processing": return <Clock className="w-5 h-5 text-bcn-yellow" />;
      case "needs_attention": return <AlertCircle className="w-5 h-5 text-bcn-red" />;
      case "failed": return <FileX className="w-5 h-5 text-bcn-red" />;
      default: return <FileText className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "verified": return "bg-green-500/10 text-green-600 border-green-500/20";
      case "processing": return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "needs_attention": return "bg-bcn-red/10 text-bcn-red border-bcn-red/20";
      case "failed": return "bg-bcn-red/10 text-bcn-red border-bcn-red/20";
      default: return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "verified": return "Verified";
      case "processing": return "Processing";
      case "processed": return "Processed";
      case "needs_attention": return "Needs Attention";
      case "failed": return "Failed";
      case "uploaded": return "Uploaded";
      default: return status;
    }
  };

  if (!mounted) return null;

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-muted/10 min-h-screen">
      
      {/* Massive Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 max-w-7xl mx-auto px-2">
        <div className="max-w-xl">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4">
            Documents
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
            Manage your compliance proofs, licenses, and required entity documentation.
          </p>
        </div>
        <Button 
          className="mt-6 md:mt-0 rounded-full px-8 py-6 text-lg font-bold bg-bcn-red text-white hover:bg-bcn-red/90 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
          onClick={() => setIsUploadModalOpen(true)}
          disabled={!activeBusinessId}
        >
          <Upload className="w-5 h-5 mr-3" /> Upload Document
        </Button>
      </div>

      {/* Pill-shaped Sticky Filter Bar */}
      <div className="sticky top-20 z-30 max-w-7xl mx-auto mb-16">
        <div className="flex flex-col md:flex-row gap-4 p-3 bg-white/80 backdrop-blur-xl border border-black/5 rounded-full shadow-lg items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search documents by name or type..." 
              className="pl-14 rounded-full h-14 border-none bg-muted/30 text-lg focus-visible:ring-1 focus-visible:ring-bcn-red"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "all")}>
              <SelectTrigger className="w-full md:w-[220px] h-14 rounded-full border-none bg-muted/30 px-6 font-medium text-base">
                <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="rounded-[1.5rem] p-2 border-none shadow-xl">
                <SelectItem value="all" className="rounded-xl cursor-pointer">All Statuses</SelectItem>
                <SelectItem value="verified" className="rounded-xl cursor-pointer">Verified</SelectItem>
                <SelectItem value="processing" className="rounded-xl cursor-pointer">Processing</SelectItem>
                <SelectItem value="needs_attention" className="rounded-xl cursor-pointer">Needs Attention</SelectItem>
                <SelectItem value="failed" className="rounded-xl cursor-pointer">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {!activeBusinessId ? (
        <div className="max-w-7xl mx-auto px-2">
          <EmptyState
            title="Select a Business"
            description="Select an active business to view its documents."
            icon={<FileStack className="w-16 h-16 text-muted-foreground/30" />}
          />
        </div>
      ) : isLoading ? (
        <div className="space-y-6 max-w-7xl mx-auto px-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-[2.5rem] bg-white border border-muted/20 shadow-sm animate-pulse"></div>
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          title="Couldn't load documents"
          description="There was a problem loading your documents. Please try again."
          action={{ label: "Retry", onClick: () => window.location.reload() }}
        />
      ) : filteredDocuments.length === 0 ? (
        <div className="max-w-7xl mx-auto px-2">
          <EmptyState
            title="No documents found"
            description={searchQuery || statusFilter !== "all" 
              ? "Try adjusting your filters or search query." 
              : "You haven't uploaded any compliance documents yet."}
            action={(searchQuery || statusFilter !== "all") ? {
              label: "Clear Filters",
              onClick: () => {
                setSearchQuery("");
                setStatusFilter("all");
              }
            } : {
              label: "Upload First Document",
              onClick: () => setIsUploadModalOpen(true)
            }}
            icon={<FileStack className="w-16 h-16 text-muted-foreground/30" />}
          />
        </div>
      ) : (
        <div className="space-y-6 max-w-7xl mx-auto px-2 pb-24">
          {filteredDocuments.map((doc, i) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link href={`/documents/${doc.id}`} className="block group">
                <Card className="rounded-[2.5rem] border-none shadow-sm hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1 bg-white overflow-hidden relative">
                  
                  {/* Floating status background blur */}
                  {(doc.status as string) === 'needs_attention' || (doc.status as string) === 'failed' ? (
                    <div className="absolute top-0 right-0 w-64 h-64 bg-bcn-red/5 blur-3xl rounded-full -mr-32 -mt-32 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  ) : (doc.status as string) === 'verified' ? (
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 blur-3xl rounded-full -mr-32 -mt-32 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  ) : (
                    <div className="absolute top-0 right-0 w-64 h-64 bg-black/5 blur-3xl rounded-full -mr-32 -mt-32 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  )}

                  <CardContent className="p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6 md:gap-8 relative z-10">
                    
                    {/* Document Icon & Status Indicator */}
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-muted/50 rounded-[1.5rem] flex items-center justify-center shrink-0">
                        {getStatusIcon(doc.status)}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${getStatusStyles(doc.status)}`}>
                          {getStatusLabel(doc.status)}
                        </span>
                        <span className="text-sm font-semibold text-muted-foreground border px-3 py-1 rounded-full uppercase tracking-wider">
                          {doc.type}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold truncate group-hover:text-bcn-red transition-colors mb-2">
                        {doc.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground font-medium">
                        <span>Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                        {doc.sizeBytes && (
                          <span>{(doc.sizeBytes / 1024 / 1024).toFixed(2)} MB</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <Button 
                        variant="ghost" 
                        className="w-12 h-12 rounded-full text-muted-foreground hover:bg-bcn-red/10 hover:text-bcn-red transition-colors z-20"
                        onClick={(e) => handleDelete(doc.id, e)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                      <div className="w-16 h-16 rounded-full bg-muted/50 group-hover:bg-black group-hover:text-white flex items-center justify-center transition-colors">
                        <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {activeBusinessId && (
        <DocumentUploadModal 
          isOpen={isUploadModalOpen} 
          onClose={() => setIsUploadModalOpen(false)} 
          businessId={activeBusinessId} 
        />
      )}
    </div>
  );
}
