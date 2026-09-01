import { EmptyState } from "@/components/common/EmptyState";
import { BarChart3 } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="w-full max-w-7xl mx-auto py-24">
      <EmptyState
        title="Reports"
        description="Detailed analytics and finance reports will be available here."
        icon={<BarChart3 className="w-10 h-10 text-muted-foreground" />}
      />
    </div>
  );
}
