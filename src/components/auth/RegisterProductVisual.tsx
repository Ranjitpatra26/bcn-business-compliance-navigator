"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Building2, Scale, FileText, Milestone, Sparkles } from "lucide-react";

export function RegisterProductVisual() {
  const shouldReduceMotion = useReducedMotion();

  const nodes = [
    {
      num: "01",
      title: "Business",
      sub: "Profile",
      icon: Building2,
      delay: 0.2,
    },
    {
      num: "02",
      title: "Rules",
      sub: "Regulations",
      icon: Scale,
      delay: 0.6,
    },
    {
      num: "03",
      title: "Requirements",
      sub: "Action Plan",
      icon: FileText,
      delay: 1.0,
    },
    {
      num: "04",
      title: "Roadmap",
      sub: "Execution",
      icon: Milestone,
      delay: 1.4,
    },
  ];

  return (
    <div className="w-full max-w-lg">
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : 0.1 }}
        className="w-full bg-white/90 backdrop-blur-md rounded-[2rem] p-5 sm:p-6 border border-black/10 shadow-2xl shadow-black/5 relative overflow-hidden group"
      >
        {/* Decorative subtle ambient glows */}
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-bcn-red/10 blur-2xl pointer-events-none group-hover:bg-bcn-red/15 transition-colors duration-500" />
        <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-bcn-yellow/15 blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between mb-5 relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-bcn-red" />
            <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
              What BCN Delivers
            </h3>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground/80 bg-muted/60 px-2.5 py-0.5 rounded-full border border-black/5">
            <Sparkles className="w-2.5 h-2.5 text-bcn-red" />
            Compliance Architecture
          </span>
        </div>

        {/* 4 Connected Nodes Pipeline */}
        <div className="relative mb-5 z-10">
          {/* Background track line */}
          <div className="absolute top-4 sm:top-5 left-6 right-6 h-[2px] bg-black/5 -z-0">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{
                duration: shouldReduceMotion ? 0 : 1.4,
                delay: shouldReduceMotion ? 0 : 0.35,
                ease: "easeInOut",
              }}
              className="h-full bg-gradient-to-r from-bcn-yellow via-bcn-red to-bcn-red rounded-full"
            />
          </div>

          {/* 4 Node Badges */}
          <div className="grid grid-cols-4 gap-1 sm:gap-3 relative z-10">
            {nodes.map((node) => {
              const Icon = node.icon;
              return (
                <motion.div
                  key={node.num}
                  initial={{
                    opacity: 0,
                    y: shouldReduceMotion ? 0 : 14,
                    scale: shouldReduceMotion ? 1 : 0.88,
                  }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.45,
                    delay: shouldReduceMotion ? 0 : node.delay,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{ y: -3, scale: 1.05 }}
                  className="flex flex-col items-center text-center cursor-default group/node"
                >
                  {/* Circular Node Badge */}
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-white border border-black/10 shadow-sm flex items-center justify-center text-xs font-mono font-bold text-bcn-black group-hover/node:border-bcn-red group-hover/node:text-bcn-red group-hover/node:shadow-md transition-all duration-200">
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-bcn-black group-hover/node:text-bcn-red transition-colors" />
                  </div>

                  {/* Node Index */}
                  <span className="text-[9px] font-mono font-semibold text-muted-foreground mt-1.5 block">
                    {node.num}
                  </span>

                  {/* Node Label */}
                  <span className="text-[11px] sm:text-xs font-bold text-bcn-black uppercase tracking-tight block leading-tight">
                    {node.title}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Secondary Mini Data / Status Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.5,
            delay: shouldReduceMotion ? 0 : 1.6,
          }}
          className="grid grid-cols-3 gap-2 pt-3 border-t border-black/5 relative z-10"
        >
          <div className="p-1.5 sm:p-2 rounded-xl bg-muted/40 text-center">
            <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold text-muted-foreground block mb-0.5">
              Workspace
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Streamlined
            </span>
          </div>

          <div className="p-1.5 sm:p-2 rounded-xl bg-muted/40 text-center">
            <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold text-muted-foreground block mb-0.5">
              Rule Mapping
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-bcn-black">
              <span className="w-1.5 h-1.5 rounded-full bg-bcn-black/70" />
              Automated
            </span>
          </div>

          <div className="p-1.5 sm:p-2 rounded-xl bg-muted/40 text-center">
            <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold text-muted-foreground block mb-0.5">
              Action Plan
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-bcn-red">
              <span className="w-1.5 h-1.5 rounded-full bg-bcn-red animate-pulse" />
              Instant
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Small Editorial Philosophy Quote Underneath Card */}
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.5,
          delay: shouldReduceMotion ? 0 : 1.8,
        }}
        className="mt-4 pl-3.5 border-l-2 border-bcn-red/40"
      >
        <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed italic">
          &ldquo;Transform complex regulations into clear, actionable roadmaps.&rdquo;
        </p>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-semibold block mt-0.5">
          BCN Commitment
        </span>
      </motion.div>
    </div>
  );
}
