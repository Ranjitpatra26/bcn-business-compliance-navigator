/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { BusinessForm, BusinessFormData } from "@/components/business/BusinessForm";
import { useBusiness, useUpdateBusiness, useDeleteBusiness } from "@/hooks/useBusiness";
import { ArrowLeft, Loader2, Trash2, Building2, MapPin, Users, Activity, BarChart3 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useActiveBusiness } from "@/components/providers/BusinessProvider";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

export default function EditBusinessPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const { data: business, isLoading } = useBusiness(id);
  const { mutateAsync: updateBusiness } = useUpdateBusiness();
  const { mutateAsync: deleteBusiness } = useDeleteBusiness();
  const { activeBusinessId, setActiveBusinessId } = useActiveBusiness();
  
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpdate = async (data: BusinessFormData) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await updateBusiness({ id, data: data as any });
      toast.success("Business updated successfully");
      router.push("/business");
    } catch (error) {
      toast.error("Failed to update business", { description: (error as Error).message });
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteBusiness(id);
      if (activeBusinessId === id) {
        setActiveBusinessId(null);
      }
      toast.success("Business deleted successfully");
      router.push("/business");
    } catch (error) {
      toast.error("Failed to delete business", { description: (error as Error).message });
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;
  }

  if (!business) {
    return <div className="p-8 text-center text-muted-foreground">Business not found.</div>;
  }

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-muted/10 min-h-screen">
      
      <div className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <Button variant="ghost" onClick={() => router.push("/business")} className="rounded-full text-muted-foreground hover:text-foreground pl-0 group mb-4">
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Businesses
          </Button>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Manage Business</h1>
          <p className="text-lg text-muted-foreground">Update profile and compliance settings for {business.name}.</p>
        </div>

        <AlertDialog>
          <AlertDialogTrigger render={<Button variant="outline" className="text-bcn-red border-bcn-red/20 hover:bg-bcn-red/10 rounded-full px-8 py-6 font-medium shadow-sm" />}>
              <Trash2 className="w-4 h-4 mr-2" /> Delete Entity
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-[2rem]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-bold">Are you sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-lg">
                This will permanently delete <strong>{business.name}</strong> and remove all associated compliance data. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-6">
              <AlertDialogCancel className="rounded-full px-6 py-6 font-semibold">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-bcn-red hover:bg-bcn-red/90 text-white rounded-full px-6 py-6 font-semibold">
                {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Delete Permanently
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        
        {/* Left Column: Form */}
        <motion.div 
          className="lg:col-span-2"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="rounded-[2.5rem] p-8 md:p-10 shadow-sm border-none bg-white">
            <BusinessForm 
              initialData={business}
              onSubmit={handleUpdate} 
              isWizard={false}
              submitLabel="Save Changes"
              onCancel={() => router.push("/business")}
            />
          </Card>
        </motion.div>

        {/* Right Column: Insights & Actions (Mapped to Bento Grid style) */}
        <div className="space-y-6">
          
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="rounded-[2rem] p-8 shadow-sm border-none bg-bcn-black text-white flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6 backdrop-blur-md">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Re-analyze Compliance</h3>
              <p className="text-white/60 text-sm mb-8 px-4">
                Did you change your employee count or activities? Run a new analysis to update your requirements.
              </p>
              <Link href="/compliance/analyze" className="w-full">
                <Button className="w-full rounded-full bg-white text-black hover:bg-white/90 font-bold py-6">
                  Analyze Business Profile
                </Button>
              </Link>
            </Card>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="rounded-[2rem] p-8 shadow-sm border-none bg-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-bcn-yellow/20 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none" />
              <h3 className="text-xl font-bold mb-6 relative z-10">Entity Snapshot</h3>
              
              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted/50 rounded-2xl flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Type</p>
                    <p className="font-medium text-lg">{business.business_type}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted/50 rounded-2xl flex items-center justify-center shrink-0">
                    <Activity className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Industry</p>
                    <p className="font-medium text-lg truncate pr-4">{business.industry}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted/50 rounded-2xl flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Employees</p>
                    <p className="font-medium text-lg">{(business as any).number_of_employees || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
