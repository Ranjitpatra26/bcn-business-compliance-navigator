"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BusinessForm, BusinessFormData } from "@/components/business/BusinessForm";
import { businessApi } from "@/lib/api/business";
import { useActiveBusiness } from "@/components/providers/BusinessProvider";
import { useQueryClient } from "@tanstack/react-query";

export default function OnboardingPage() {
  const router = useRouter();
  const { setActiveBusinessId } = useActiveBusiness();
  const queryClient = useQueryClient();

  const handleComplete = async (data: BusinessFormData) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await businessApi.createBusiness(data as unknown as any);
      
      if (response.error) {
        toast.error("Failed to set up business", { description: response.error.message });
        return;
      }
      
      if (response.data) {
        setActiveBusinessId(response.data.id);
        queryClient.invalidateQueries({ queryKey: ["businesses"] });
      }
      
      toast.success("Welcome to BCN!", { description: "Your business profile is ready." });
      router.push("/dashboard");
    } catch (error) {
      toast.error("An unexpected error occurred.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl bg-background rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-muted/50">
        <BusinessForm 
          onSubmit={handleComplete} 
          isWizard={true}
          submitLabel="Complete Setup"
        />
      </div>
    </div>
  );
}
