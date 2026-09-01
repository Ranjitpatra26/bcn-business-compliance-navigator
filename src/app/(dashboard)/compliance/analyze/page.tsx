/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useActiveBusiness } from "@/components/providers/BusinessProvider";
import { useAnalyzeCompliance } from "@/hooks/useCompliance";
import { Loader2, CheckCircle2, AlertCircle, Play, ShieldAlert, FileSearch, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";

const STEPS = [
  "Understanding your business...",
  "Checking location requirements...",
  "Evaluating business activities...",
  "Checking applicable regulations...",
  "Building your compliance roadmap..."
];

export default function AnalyzePage() {
  const router = useRouter();
  const { activeBusinessId } = useActiveBusiness();
  const { mutateAsync: analyze, isPending, isError, error, isSuccess } = useAnalyzeCompliance();
  
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [progress, setProgress] = useState(0);

  const startAnalysis = async () => {
    if (!activeBusinessId) return;
    
    setCurrentStepIndex(0);
    setProgress(0);
    
    // Simulate progression UI
    const totalTime = STEPS.length * 800; // Total 4 seconds
    const intervalTime = 50;
    const steps = totalTime / intervalTime;
    let currentStep = 0;

    const progressInterval = setInterval(() => {
      currentStep++;
      const currentProgress = Math.min(Math.floor((currentStep / steps) * 100), 99);
      setProgress(currentProgress);
      
      const stepIdx = Math.min(Math.floor((currentProgress / 100) * STEPS.length), STEPS.length - 1);
      setCurrentStepIndex(stepIdx);
      
      if (currentStep >= steps) {
        clearInterval(progressInterval);
      }
    }, intervalTime);

    try {
      await analyze(activeBusinessId);
      // Let the progress bar jump to 100% on success
      clearInterval(progressInterval);
      setProgress(100);
      setCurrentStepIndex(STEPS.length);
      // Success is handled by useMutation state (isSuccess), which triggers redirect
    } catch (err) {
      clearInterval(progressInterval);
      console.error(err);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        router.push("/compliance");
      }, 1500); // give a brief moment to show success state before redirecting
    }
  }, [isSuccess, router]);

  if (!activeBusinessId) {
    return (
      <div className="w-full min-h-screen bg-muted/10 flex items-center justify-center p-6">
        <Card className="max-w-lg w-full p-12 rounded-[3rem] border-none shadow-xl text-center flex flex-col items-center bg-white">
          <AlertCircle className="w-16 h-16 text-bcn-red mb-6" />
          <h2 className="text-3xl font-bold mb-4">No Business Selected</h2>
          <p className="text-lg text-muted-foreground mb-8">Please select or create a business before running an analysis.</p>
          <Button onClick={() => router.push("/business")} className="rounded-full px-8 py-6 text-lg bg-bcn-black text-white hover:bg-bcn-black/90 w-full">
            Go to Business Settings
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-bcn-black flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Graphic Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-bcn-red/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-4xl mx-auto relative z-10 flex flex-col items-center">
        <AnimatePresence mode="wait">
          
          {/* STATE 1: Ready */}
          {!isPending && !isSuccess && !isError && (
            <motion.div 
              key="ready"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="text-center flex flex-col items-center max-w-2xl"
            >
              <div className="w-24 h-24 bg-white/10 rounded-[2rem] flex items-center justify-center mb-10 shadow-2xl backdrop-blur-sm border border-white/10">
                <FileSearch className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 leading-tight">
                Analyze My Business
              </h1>
              <p className="text-xl text-white/60 mb-12 px-4">
                BCN will evaluate your business profile against current regulatory databases to build a personalized, actionable compliance roadmap.
              </p>
              <Button 
                onClick={startAnalysis} 
                className="rounded-full px-12 py-8 text-xl font-bold bg-bcn-red text-white hover:bg-bcn-red hover:shadow-[0_0_40px_rgba(255,0,0,0.5)] transition-all duration-300"
              >
                <Zap className="w-6 h-6 mr-3" /> Start Analysis
              </Button>
            </motion.div>
          )}

          {/* STATE 2: Analyzing (Pending) */}
          {isPending && !isError && (
            <motion.div 
              key="analyzing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full flex flex-col items-center justify-center min-h-[50vh]"
            >
              {/* Massive Animated Percentage */}
              <div className="text-[12rem] md:text-[18rem] font-bold text-white leading-none tracking-tighter tabular-nums mb-8 opacity-90 drop-shadow-2xl">
                {progress}%
              </div>
              
              {/* Staggered Text Reveals for Steps */}
              <div className="h-16 relative w-full max-w-xl text-center overflow-hidden mb-12">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={currentStepIndex}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                    transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <p className="text-2xl md:text-3xl font-medium text-white/80">
                      {STEPS[currentStepIndex] || "Finalizing..."}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Progress Bar Container */}
              <div className="w-full max-w-md h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-bcn-red rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "linear", duration: 0.1 }}
                />
              </div>
            </motion.div>
          )}

          {/* STATE 3: Success */}
          {isSuccess && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
              className="text-center flex flex-col items-center"
            >
              <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mb-10 shadow-[0_0_60px_rgba(34,197,94,0.4)]">
                <CheckCircle2 className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-6">Complete!</h2>
              <p className="text-2xl text-white/60">Redirecting to your roadmap...</p>
            </motion.div>
          )}

          {/* STATE 4: Error */}
          {isError && (
            <motion.div 
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center flex flex-col items-center max-w-lg bg-white/10 backdrop-blur-xl border border-white/20 p-12 rounded-[3rem]"
            >
              <ShieldAlert className="w-20 h-20 text-bcn-red mb-8" />
              <h2 className="text-4xl font-bold text-white mb-4">Analysis Failed</h2>
              <p className="text-xl text-white/60 mb-10">We encountered an issue while analyzing your business profile. {(error as Error).message}</p>
              <Button onClick={startAnalysis} variant="outline" className="rounded-full px-10 py-6 text-lg border-white/30 text-white hover:bg-white hover:text-black w-full">
                Try Again
              </Button>
            </motion.div>
          )}
          
        </AnimatePresence>
      </div>
    </div>
  );
}
