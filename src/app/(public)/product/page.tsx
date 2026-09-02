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

        {/* Product Modules Grid */}
        <section className="w-full max-w-7xl mx-auto px-6 lg:px-8 mb-32">
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
              },
              {
                title: "Document Automation",
                desc: "Generate and store compliant policies instantly.",
                icon: <Shield className="w-8 h-8 text-bcn-red mb-6" />,
              },
              {
                title: "Risk Analytics",
                desc: "Identify potential compliance gaps before they become issues.",
                icon: <TrendingUp className="w-8 h-8 text-bcn-red mb-6" />,
              },
            ].map((feature, i) => (
              <motion.div 
                key={i} 
                variants={itemVariants}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="bg-white dark:bg-card border border-muted/50 rounded-[2rem] p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)]"
              >
                {feature.icon}
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
                <ul className="mt-6 space-y-3">
                  {[1, 2, 3].map((_, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Feature detail {j + 1}
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
