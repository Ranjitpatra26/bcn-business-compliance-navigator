/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useBusinesses } from "@/hooks/useBusiness";
import { useActiveBusiness } from "@/components/providers/BusinessProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, PlusCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function BusinessSelector() {
  const { data: businesses, isLoading } = useBusinesses();
  const { activeBusinessId, setActiveBusinessId } = useActiveBusiness();
  const router = useRouter();

  // Auto-select first business if none selected and data is available
  useEffect(() => {
    if (!activeBusinessId && businesses && businesses.length > 0) {
      setActiveBusinessId(businesses[0].id);
    }
  }, [activeBusinessId, businesses, setActiveBusinessId]);

  const handleValueChange = (val: string | null) => {
    if (!val) return;
    if (val === "create_new") {
      router.push("/business/new");
    } else {
      setActiveBusinessId(val);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 p-2 border rounded-lg bg-muted/50 text-muted-foreground w-full">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">Loading...</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Select value={activeBusinessId || undefined} onValueChange={handleValueChange}>
        <SelectTrigger className="w-full bg-background border-muted shadow-sm hover:bg-muted/30 transition-colors h-12 rounded-xl">
          <div className="flex items-center gap-2 overflow-hidden">
            <Building2 className="w-4 h-4 text-bcn-red shrink-0" />
            <SelectValue placeholder="Select Business" />
          </div>
        </SelectTrigger>
        <SelectContent className="rounded-xl shadow-xl bg-white z-[100] border-border">
          {businesses?.map((business: any) => (
            <SelectItem key={business.id} value={business.id} className="py-3 px-4 cursor-pointer focus:bg-muted">
              <div className="flex flex-col">
                <span className="font-medium text-sm">{business.name}</span>
                <span className="text-xs text-muted-foreground">{business.business_type} • {business.state || business.country}</span>
              </div>
            </SelectItem>
          ))}
          <SelectItem value="create_new" className="py-3 px-4 cursor-pointer text-bcn-red focus:bg-bcn-red/10 focus:text-bcn-red">
            <div className="flex items-center gap-2 font-medium">
              <PlusCircle className="w-4 h-4" />
              <span>Add New Business</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
