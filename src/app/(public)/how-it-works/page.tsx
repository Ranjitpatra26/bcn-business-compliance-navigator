"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { CtaSection } from "@/components/sections/CtaSection";
import { SmoothScrollProvider } from "@/components/common/SmoothScrollProvider";

const steps = [
  {
    number: "01",
    title: "Setup Your Business Profile",
    description: "Input your basic company details, industry, and operating jurisdictions. Our AI instantly maps out your regulatory requirements.",
  },
  {
    number: "02",
    title: "Connect Your Data",
    description: "Securely link your existing platforms and upload relevant documents. BCN automatically scans for compliance gaps.",
  },
  {
    number: "03",
    title: "Monitor & Resolve",
    description: "Get real-time alerts on regulatory changes and actionable steps to resolve any issues before they become penalties.",
  }
];

export default function HowItWorksPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const lineHeight = useTransform(scrollYProgress, [0.2, 0.8], ["0%", "100%"]);

  return (
    <SmoothScrollProvider>
      <main className="flex-1 flex flex-col items-center w-full bg-background overflow-hidden pt-40 pb-16">
        {/* Hero Section */}
        <section className="w-full max-w-7xl mx-auto px-6 lg:px-8 mb-24 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 text-balance"
          >
            From Chaos to <span className="text-bcn-red italic">Compliance</span> in 3 Steps
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance"
          >
            See how the Business Compliance Navigator streamlines your workflow.
          </motion.p>
        </section>

        {/* Timeline Section */}
        <section ref={containerRef} className="w-full max-w-4xl mx-auto px-6 lg:px-8 mb-32 relative">
          {/* Animated Line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-muted rounded-full overflow-hidden transform md:-translate-x-1/2">
            <motion.div 
              style={{ height: lineHeight }} 
              className="w-full bg-bcn-red origin-top"
            />
          </div>

          <div className="space-y-24 relative z-10 py-12">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div 
                  key={step.number}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className={`flex flex-col md:flex-row items-center justify-between w-full ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className={`w-full md:w-5/12 pl-12 md:pl-0 ${isEven ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
                    <div className="text-bcn-red font-bold text-6xl mb-4 opacity-20">{step.number}</div>
                    <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                  
                  {/* Timeline Dot */}
                  <div className="absolute left-6 md:left-1/2 w-4 h-4 bg-bcn-red rounded-full transform -translate-x-1/2 mt-6 md:mt-0 shadow-[0_0_15px_rgba(254,74,35,0.5)] border-4 border-background box-content" />

                  <div className="hidden md:block w-5/12" />
                </motion.div>
              );
            })}
          </div>
        </section>

        <CtaSection />
      </main>
    </SmoothScrollProvider>
  );
}
