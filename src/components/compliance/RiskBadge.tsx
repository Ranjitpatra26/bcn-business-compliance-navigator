"use client";

import { ComplianceRisk } from "@/types/compliance";
import { cn } from "@/lib/utils";

interface RiskBadgeProps {
  risk: ComplianceRisk;
  className?: string;
}

export function RiskBadge({ risk, className }: RiskBadgeProps) {
  const styles: Record<ComplianceRisk, { bg: string; text: string; dot: string; label: string }> = {
    low: { bg: "bg-blue-500/10", text: "text-blue-600", dot: "bg-blue-500", label: "Low Risk" },
    medium: { bg: "bg-bcn-yellow/10", text: "text-amber-600", dot: "bg-bcn-yellow", label: "Medium Risk" },
    high: { bg: "bg-orange-500/10", text: "text-orange-600", dot: "bg-orange-500", label: "High Risk" },
    critical: { bg: "bg-bcn-red/10", text: "text-bcn-red", dot: "bg-bcn-red", label: "Critical" },
  };

  const style = styles[risk];

  return (
    <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium", style.bg, style.text, className)}>
      <div className={cn("w-1.5 h-1.5 rounded-full", style.dot)} />
      {style.label}
    </div>
  );
}
