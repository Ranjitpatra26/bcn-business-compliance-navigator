import { FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: { label: string; href?: string; onClick?: () => void };
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-6">
        {icon || <FileText className="w-10 h-10 text-muted-foreground" />}
      </div>
      <h1 className="text-4xl font-bold tracking-tighter mb-4">{title}</h1>
      <p className="text-muted-foreground max-w-[400px] mb-8 text-lg">
        {description}
      </p>
      {action ? (
        action.onClick ? (
          <Button className="rounded-full px-8 bg-foreground text-background hover:bg-foreground/90" onClick={action.onClick}>
            {action.label}
          </Button>
        ) : (
          <Link href={action.href || "/"}>
            <Button className="rounded-full px-8 bg-foreground text-background hover:bg-foreground/90">
              {action.label}
            </Button>
          </Link>
        )
      ) : (
        <Link href="/">
          <Button className="rounded-full px-8 bg-foreground text-background hover:bg-foreground/90">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      )}
    </div>
  );
}
