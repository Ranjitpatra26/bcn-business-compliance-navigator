"use client";

import { ComplianceStatus } from "@/types/compliance";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, AlertCircle, CalendarClock, ShieldAlert } from "lucide-react";

interface StatusBadgeProps {
  status: ComplianceStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config: Record<ComplianceStatus, { bg: string; text: string; icon: React.ElementType; label: string }> = {
    completed: { bg: "bg-green-500/10", text: "text-green-600", icon: CheckCircle2, label: "Completed" },
    in_progress: { bg: "bg-blue-500/10", text: "text-blue-600", icon: Clock, label: "In Progress" },
    action_required: { bg: "bg-orange-500/10", text: "text-orange-600", icon: ShieldAlert, label: "Action Required" },
    upcoming: { bg: "bg-bcn-yellow/10", text: "text-amber-600", icon: CalendarClock, label: "Upcoming" },
    overdue: { bg: "bg-bcn-red/10", text: "text-bcn-red", icon: AlertCircle, label: "Overdue" },
  };

  const style = config[status];
  const Icon = style.icon;

  return (
    <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-transparent shadow-sm", style.bg, style.text, className)}>
      <Icon className="w-3.5 h-3.5" />
      {style.label}
    </div>
  );
}
