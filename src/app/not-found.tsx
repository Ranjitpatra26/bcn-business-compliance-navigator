"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-muted/20 p-4">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-3xl shadow-xl">
        <div className="w-16 h-16 bg-bcn-red/10 text-bcn-red rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">404</h1>
          <h2 className="text-xl font-semibold text-foreground">Page Not Found</h2>
          <p className="text-muted-foreground text-sm">
            We couldn&apos;t find the page you&apos;re looking for. It might have been moved or doesn&apos;t exist.
          </p>
        </div>

        <div className="pt-4 flex flex-col gap-3">
          <Button 
            className="w-full bg-bcn-red hover:bg-bcn-red/90 text-white rounded-xl py-6"
            onClick={() => {
              window.location.href = "/dashboard";
            }}
          >
            Return to Dashboard
          </Button>
          <Button 
            variant="outline" 
            className="w-full rounded-xl py-6 border-border"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            Go to Homepage
          </Button>
        </div>
      </div>
    </div>
  );
}
