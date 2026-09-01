"use client";

import { useState, useRef } from "react";
import { useUploadDocument } from "@/hooks/useDocuments";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, X, FileText, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessId: string;
  relatedRequirementId?: string;
}

export function DocumentUploadModal({ isOpen, onClose, businessId, relatedRequirementId }: DocumentUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: uploadDocument, isPending, isSuccess } = useUploadDocument();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateFile = (selectedFile: File) => {
    setError(null);
    // Basic validation
    if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
      setError("File size must be less than 10MB");
      return false;
    }
    
    // Accept common document types
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(selectedFile.type)) {
      setError("Only PDF, JPG, and PNG files are accepted");
      return false;
    }
    
    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const handleUpload = () => {
    if (!file) return;
    
    uploadDocument(
      { businessId, file, relatedRequirementId },
      {
        onSuccess: () => {
          setTimeout(() => {
            handleClose();
          }, 1500); // Close shortly after success
        },
        onError: (err) => {
          setError(err.message || "Upload failed. Please try again.");
        }
      }
    );
  };

  const handleClose = () => {
    if (!isPending) {
      setFile(null);
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md rounded-[2rem] border-muted/50 p-6 sm:p-8">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Upload className="w-5 h-5 text-bcn-red" />
            Upload Document
          </DialogTitle>
          <DialogDescription>
            Upload your compliance proofs, licenses, or identification documents.
          </DialogDescription>
        </DialogHeader>

        {!isSuccess ? (
          <div className="space-y-6">
            {!file ? (
              <div 
                className={cn(
                  "border-2 border-dashed rounded-[1.5rem] p-10 flex flex-col items-center justify-center text-center transition-colors cursor-pointer",
                  isDragging ? "border-bcn-red bg-bcn-red/5" : "border-muted-foreground/25 hover:border-bcn-red/50 hover:bg-muted/30"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Upload className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-1">Click to upload or drag and drop</h3>
                <p className="text-sm text-muted-foreground mb-4">PDF, JPG, or PNG (max. 10MB)</p>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept=".pdf,image/jpeg,image/png,image/jpg"
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              <div className="border rounded-[1.5rem] p-4 flex items-center justify-between bg-muted/20">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-full bg-bcn-red/10 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-bcn-red" />
                  </div>
                  <div className="truncate">
                    <p className="font-medium truncate text-sm">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                {!isPending && (
                  <Button variant="ghost" size="icon" onClick={() => setFile(null)} className="shrink-0 text-muted-foreground hover:text-bcn-red">
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            )}

            {error && (
              <div className="p-3 rounded-lg bg-bcn-red/10 border border-bcn-red/20 text-sm text-bcn-red flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={handleClose} disabled={isPending} className="rounded-full">
                Cancel
              </Button>
              <Button 
                className="bg-bcn-black text-white hover:bg-bcn-black/90 rounded-full px-6" 
                onClick={handleUpload}
                disabled={!file || isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-2 animate-in zoom-in duration-300">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold">Upload Successful</h3>
            <p className="text-muted-foreground">Your document has been securely uploaded and is being processed.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
