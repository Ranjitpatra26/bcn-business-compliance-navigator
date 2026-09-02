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

  const textRevealVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };
  
  const textRevealItem = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const statement = "Compliance isn't just about avoiding fines. It's about building trust, operating faster, and scaling globally without friction.";

  return (
    <SmoothScrollProvider>
      <main className="flex-1 flex flex-col items-center w-full bg-background overflow-hidden pt-40 pb-16">
        {/* Hero Section */}
        <section className="w-full max-w-7xl mx-auto px-6 lg:px-8 mb-16 text-center">
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
            See how the Business Compliance Navigator streamlines your workflow from weeks to minutes.
          </motion.p>
        </section>

        {/* Scroll Text Reveal */}
        <section className="w-full max-w-4xl mx-auto px-6 lg:px-8 mb-32 text-center">
          <motion.div 
            variants={textRevealVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="text-2xl md:text-4xl font-semibold leading-relaxed tracking-tight"
          >
            {statement.split(" ").map((word, i) => (
              <motion.span key={i} variants={textRevealItem} className="inline-block mr-2">
                {word}
              </motion.span>
            ))}
          </motion.div>
        </section>

        {/* Timeline Section */}
        <section ref={containerRef} className="w-full max-w-6xl mx-auto px-6 lg:px-8 mb-32 relative">
          {/* Animated Line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-muted rounded-full overflow-hidden transform md:-translate-x-1/2">
            <motion.div 
              style={{ height: lineHeight }} 
              className="w-full bg-bcn-red origin-top"
            />
          </div>

          <div className="space-y-32 relative z-10 py-12">
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
                    <h3 className="text-3xl font-bold mb-4">{step.title}</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">{step.description}</p>
                  </div>
                  
                  {/* Timeline Dot */}
                  <div className="absolute left-6 md:left-1/2 w-4 h-4 bg-bcn-red rounded-full transform -translate-x-1/2 mt-6 md:mt-0 shadow-[0_0_15px_rgba(254,74,35,0.5)] border-4 border-background box-content" />

                  {/* Mock UI Visuals */}
                  <div className={`hidden md:block w-5/12 ${isEven ? 'pl-12' : 'pr-12'}`}>
                    <div className="bg-card border border-muted/50 rounded-3xl p-6 shadow-xl aspect-video flex items-center justify-center relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-tr from-bcn-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      {index === 0 && (
                        <div className="w-full space-y-4 text-left">
                          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Company Profile</div>
                          <div className="space-y-1">
                            <label className="text-[10px] text-muted-foreground font-semibold">Company Name</label>
                            <div className="h-8 bg-muted/30 rounded border border-muted/50 flex items-center px-3 text-xs text-foreground font-medium">Acme Corp</div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] text-muted-foreground font-semibold">Industry</label>
                            <div className="h-8 bg-muted/30 rounded border border-muted/50 flex items-center px-3 text-xs text-foreground font-medium">Financial Technology</div>
                          </div>
                          <div className="mt-2 pt-2 border-t border-muted/50 flex justify-end">
                            <div className="bg-bcn-red text-white text-[10px] font-bold px-3 py-1.5 rounded-md">Save Profile</div>
                          </div>
                        </div>
                      )}
                      {index === 1 && (
                        <div className="grid grid-cols-2 gap-4 w-full">
                          {["AWS Cloud", "Google Workspace", "QuickBooks", "Stripe"].map((name, i) => (
                            <div key={i} className="h-12 bg-muted/50 rounded-xl border border-muted flex items-center justify-center font-bold text-muted-foreground text-xs tracking-widest uppercase">
                              {name}
                            </div>
                          ))}
                        </div>
                      )}
                      {index === 2 && (
                        <div className="w-full space-y-3">
                           <div className="flex justify-between items-center bg-green-500/10 p-3 rounded-lg border border-green-500/20 text-green-700 text-sm font-semibold"><span>ISO 27001 Status</span> <span>100%</span></div>
                           <div className="flex justify-between items-center bg-red-500/10 p-3 rounded-lg border border-red-500/20 text-red-700 text-sm font-semibold"><span>GDPR Gap Detected</span> <span>Action Req</span></div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full max-w-3xl mx-auto px-6 lg:px-8 mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">Frequently Asked <span className="text-bcn-red">Questions</span></h2>
          </div>
          <div className="space-y-6">
            {[
              { q: "How long does onboarding take?", a: "Most companies complete their initial profile setup and data integration within 48 hours. BCN then instantly generates your compliance roadmap." },
              { q: "Do you support multiple jurisdictions?", a: "Yes. BCN's engine maps regulations across all 50 US states, the EU (GDPR, AI Act), and major APAC regions dynamically based on your operations." },
              { q: "Is my company data secure?", a: "Absolute security is our baseline. We use bank-level encryption, SOC2 Type II certified infrastructure, and zero-trust architecture. We never train public AI models on your private data." }
            ].map((faq, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-muted/50 p-6 rounded-2xl shadow-sm"
              >
                <h4 className="text-lg font-bold mb-2">{faq.q}</h4>
                <p className="text-muted-foreground">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <CtaSection />
      </main>
    </SmoothScrollProvider>
  );
}
