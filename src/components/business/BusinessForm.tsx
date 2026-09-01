"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react";

export const businessSchema = z.object({
  name: z.string().min(2, { message: "Business name is required" }),
  business_type: z.string().min(2, { message: "Business type is required" }),
  industry: z.string().min(2, { message: "Industry is required" }),
  country: z.string().min(2, { message: "Country is required" }),
  state: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  details: z.string().optional(),
});

export type BusinessFormData = z.infer<typeof businessSchema>;

interface BusinessFormProps {
  initialData?: Partial<BusinessFormData>;
  onSubmit: (data: BusinessFormData) => Promise<void>;
  onCancel?: () => void;
  isWizard?: boolean; // If true, shows progressive steps
  submitLabel?: string;
}

const STEPS = [
  { id: "name", title: "What's the name of your business?" },
  { id: "type", title: "Tell us about your industry" },
  { id: "location", title: "Where are you located?" },
  { id: "address", title: "What's your primary address?" },
  { id: "details", title: "Any additional details we should know?" },
];

export function BusinessForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isWizard = false,
  submitLabel = "Save Business"
}: BusinessFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: initialData?.name || "",
      business_type: initialData?.business_type || "",
      industry: initialData?.industry || "",
      country: initialData?.country || "",
      state: initialData?.state || "",
      city: initialData?.city || "",
      address: initialData?.address || "",
      details: initialData?.details || "",
    },
    mode: "onChange",
  });

  const { register, trigger, formState: { errors }, handleSubmit } = form;

  const nextStep = async () => {
    let isValid = false;
    
    if (currentStep === 0) isValid = await trigger("name");
    else if (currentStep === 1) isValid = await trigger(["business_type", "industry"]);
    else if (currentStep === 2) isValid = await trigger(["country", "state", "city"]);
    else if (currentStep === 3) isValid = await trigger("address");

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleFormSubmit = async (data: BusinessFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isWizard) {
    return (
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 animate-in fade-in duration-500 max-w-2xl">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-muted-foreground">Legal Business Name</label>
            <Input {...register("name")} placeholder="Acme Corp LLC" className="text-base py-5 rounded-xl" />
            {errors.name && <p className="text-bcn-red text-sm">{errors.name.message}</p>}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Business Type</label>
            <Input {...register("business_type")} placeholder="LLC, C-Corp" className="text-base py-5 rounded-xl" />
            {errors.business_type && <p className="text-bcn-red text-sm">{errors.business_type.message}</p>}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Industry</label>
            <Input {...register("industry")} placeholder="Software Development" className="text-base py-5 rounded-xl" />
            {errors.industry && <p className="text-bcn-red text-sm">{errors.industry.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Country</label>
            <Input {...register("country")} placeholder="United States" className="text-base py-5 rounded-xl" />
            {errors.country && <p className="text-bcn-red text-sm">{errors.country.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">State / Province</label>
            <Input {...register("state")} placeholder="CA" className="text-base py-5 rounded-xl" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">City</label>
            <Input {...register("city")} placeholder="San Francisco" className="text-base py-5 rounded-xl" />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-muted-foreground">Street Address</label>
            <Input {...register("address")} placeholder="123 Main St, Suite 400" className="text-base py-5 rounded-xl" />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-muted-foreground">Relevant business details</label>
            <Textarea {...register("details")} placeholder="Specific operations, employee count..." className="text-base min-h-[100px] rounded-xl resize-none" />
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t">
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel} className="rounded-full px-6">
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting} className="rounded-full px-8 bg-bcn-black text-white hover:bg-bcn-black/90 ml-auto">
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {submitLabel}
          </Button>
        </div>
      </form>
    );
  }

  // WIZARD MODE
  return (
    <div className="w-full">
      <div className="flex gap-2 mb-12">
        {STEPS.map((_, idx) => (
          <div 
            key={idx} 
            className={`h-2 flex-1 rounded-full transition-all duration-300 ${idx <= currentStep ? "bg-bcn-red" : "bg-muted"}`}
          />
        ))}
      </div>

      <div className="min-h-[250px]">
        <h2 className="text-3xl font-bold mb-8 transition-all">{STEPS[currentStep].title}</h2>
        {/* Step contents here - same as before, condensed for brevity */}
        {currentStep === 0 && (
          <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <label className="text-sm font-medium text-muted-foreground">Legal Business Name</label>
            <Input {...register("name")} placeholder="Acme Corp LLC" className="text-lg py-6 rounded-2xl" autoFocus />
            {errors.name && <p className="text-bcn-red text-sm">{errors.name.message}</p>}
          </div>
        )}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Business Type</label>
              <Input {...register("business_type")} placeholder="LLC, C-Corp" className="text-lg py-6 rounded-2xl" autoFocus />
              {errors.business_type && <p className="text-bcn-red text-sm">{errors.business_type.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Primary Industry</label>
              <Input {...register("industry")} placeholder="Software Development" className="text-lg py-6 rounded-2xl" />
              {errors.industry && <p className="text-bcn-red text-sm">{errors.industry.message}</p>}
            </div>
          </div>
        )}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Country</label>
              <Input {...register("country")} placeholder="United States" className="text-lg py-6 rounded-2xl" autoFocus />
              {errors.country && <p className="text-bcn-red text-sm">{errors.country.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">State</label>
                <Input {...register("state")} placeholder="CA" className="text-lg py-6 rounded-2xl" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">City</label>
                <Input {...register("city")} placeholder="San Francisco" className="text-lg py-6 rounded-2xl" />
              </div>
            </div>
          </div>
        )}
        {currentStep === 3 && (
          <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <label className="text-sm font-medium text-muted-foreground">Street Address</label>
            <Input {...register("address")} placeholder="123 Main St, Suite 400" className="text-lg py-6 rounded-2xl" autoFocus />
          </div>
        )}
        {currentStep === 4 && (
          <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <label className="text-sm font-medium text-muted-foreground">Relevant business details (Optional)</label>
            <Textarea {...register("details")} placeholder="Tell us a bit about your operations..." className="text-base min-h-[120px] rounded-2xl resize-none" autoFocus />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-12 pt-6 border-t border-muted">
        <Button variant="ghost" onClick={currentStep === 0 ? onCancel : prevStep} disabled={isSubmitting} className="rounded-full px-6 text-muted-foreground">
          {currentStep === 0 ? "Cancel" : <><ArrowLeft className="w-4 h-4 mr-2" /> Back</>}
        </Button>

        {currentStep < STEPS.length - 1 ? (
          <Button onClick={nextStep} className="rounded-full px-8 bg-bcn-black text-white hover:bg-bcn-black/90">
            Continue <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit(handleFormSubmit)} disabled={isSubmitting} className="rounded-full px-8 bg-bcn-red text-white hover:bg-bcn-red/90">
            {isSubmitting && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
            {submitLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
