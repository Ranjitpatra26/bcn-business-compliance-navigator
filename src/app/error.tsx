"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error("Application error boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-muted/20 p-4">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-3xl shadow-xl">
        <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Something went wrong!</h1>
          <p className="text-muted-foreground text-sm">
            An unexpected error occurred while processing your request. Please try again.
          </p>
        </div>

        <div className="pt-4 flex flex-col gap-3">
          <Button 
            onClick={() => reset()} 
            className="w-full bg-bcn-red hover:bg-bcn-red/90 text-white rounded-xl py-6"
          >
            Try Again
          </Button>
          <Button 
            variant="outline" 
            className="w-full rounded-xl py-6 border-border"
            onClick={() => {
              window.location.href = "/dashboard";
            }}
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
