"use client";

import { motion } from "framer-motion";
import { CtaSection } from "@/components/sections/CtaSection";
import { SmoothScrollProvider } from "@/components/common/SmoothScrollProvider";
import { CheckCircle2, Shield, Zap, TrendingUp } from "lucide-react";

export default function ProductPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <SmoothScrollProvider>
      <main className="flex-1 flex flex-col items-center w-full bg-background overflow-hidden pt-40 pb-16">
        {/* Hero Section */}
        <section className="w-full max-w-7xl mx-auto px-6 lg:px-8 mb-24 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bcn-red/10 text-bcn-red font-medium text-sm mb-8"
          >
            <Shield className="w-4 h-4" /> BCN Product Ecosystem
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 text-balance"
          >
            The Ultimate <span className="text-bcn-red italic">Compliance Engine</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance"
          >
            Everything your business needs to stay compliant, reduce risk, and focus on growth without the regulatory headaches.
          </motion.p>
        </section>

        {/* KPI Flip Boxes */}
        <section className="w-full max-w-7xl mx-auto px-6 lg:px-8 mb-32">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Hours Saved", value: "40+", back: "Average hours saved per week on manual compliance audits.", icon: <Zap className="w-6 h-6 text-bcn-red mb-2" /> },
              { label: "Compliance Score", value: "99%", back: "Achieve near-perfect compliance with automated real-time tracking.", icon: <Shield className="w-6 h-6 text-bcn-red mb-2" /> },
              { label: "Fines Avoided", value: "$2M+", back: "Total regulatory fines avoided by BCN enterprise customers in 2024.", icon: <TrendingUp className="w-6 h-6 text-bcn-red mb-2" /> },
              { label: "Jurisdictions", value: "50+", back: "Pre-mapped regulatory frameworks across all 50 states and the EU.", icon: <CheckCircle2 className="w-6 h-6 text-bcn-red mb-2" /> },
            ].map((kpi, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group h-48 [perspective:1000px]"
              >
                <div className="relative h-full w-full rounded-3xl shadow-lg transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  {/* Front */}
                  <div className="absolute inset-0 bg-card border border-muted/50 rounded-3xl p-6 flex flex-col items-center justify-center text-center [backface-visibility:hidden]">
                    {kpi.icon}
                    <div className="text-4xl font-bold tracking-tighter mb-2">{kpi.value}</div>
                    <div className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">{kpi.label}</div>
                  </div>
                  {/* Back */}
                  <div className="absolute inset-0 bg-bcn-red text-white rounded-3xl p-6 flex flex-col items-center justify-center text-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <p className="font-medium text-white/90 leading-relaxed">{kpi.back}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Enhanced Product Modules Grid */}
        <section className="w-full max-w-7xl mx-auto px-6 lg:px-8 mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">A Modular approach to <span className="text-bcn-red">Compliance</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Pick the modules you need, or use the full suite for total peace of mind.</p>
          </div>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                title: "Real-time Monitoring",
                desc: "Stay ahead with automated tracking of regulatory changes.",
                icon: <Zap className="w-8 h-8 text-bcn-red mb-6" />,
                details: ["Daily regulatory updates", "Jurisdiction-specific alerts", "Impact assessment AI"]
              },
              {
                title: "Document Automation",
                desc: "Generate and store compliant policies instantly.",
                icon: <Shield className="w-8 h-8 text-bcn-red mb-6" />,
                details: ["Policy template library", "Version control", "E-signature integration"]
              },
              {
                title: "Risk Analytics",
                desc: "Identify potential compliance gaps before they become issues.",
                icon: <TrendingUp className="w-8 h-8 text-bcn-red mb-6" />,
                details: ["Vulnerability scanning", "Custom risk weighting", "Executive dashboards"]
              },
            ].map((feature, i) => (
              <motion.div 
                key={i} 
                variants={itemVariants}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="bg-white dark:bg-card border border-muted/50 rounded-[2rem] p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] flex flex-col h-full"
              >
                {feature.icon}
                <h3 className="text-2xl font-bold mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-muted-foreground mb-6 flex-grow">{feature.desc}</p>
                <ul className="mt-auto space-y-3 pt-6 border-t border-muted/30">
                  {feature.details.map((detail, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <CheckCircle2 className="w-4 h-4 text-bcn-red shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <CtaSection />
      </main>
    </SmoothScrollProvider>
  );
}
