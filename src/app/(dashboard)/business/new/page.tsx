"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BusinessForm, BusinessFormData } from "@/components/business/BusinessForm";
import { useCreateBusiness } from "@/hooks/useBusiness";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NewBusinessPage() {
  const router = useRouter();
  const { mutateAsync: createBusiness } = useCreateBusiness();

  const handleComplete = async (data: BusinessFormData) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await createBusiness(data as any);
      toast.success("Business created successfully");
      router.push("/business");
    } catch (error) {
      toast.error("Failed to create business", { description: (error as Error).message });
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Link href="/business">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Business</h1>
          <p className="text-muted-foreground">Register another entity for compliance tracking.</p>
        </div>
      </div>

      <div className="bg-background rounded-[2rem] p-8 shadow-sm border border-muted/50">
        <BusinessForm 
          onSubmit={handleComplete} 
          isWizard={false}
          submitLabel="Create Business"
          onCancel={() => router.push("/business")}
        />
      </div>
    </div>
  );
}
