"use client";

import { motion } from "framer-motion";
import { FeaturesGrid } from "@/components/sections/FeaturesGrid";
import { CtaSection } from "@/components/sections/CtaSection";
import { SmoothScrollProvider } from "@/components/common/SmoothScrollProvider";

export default function FeaturesPage() {
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
            Powerful Features for <br/> <span className="text-bcn-red italic">Modern Compliance</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance"
          >
            Explore the tools and capabilities that make BCN the most advanced regulatory platform on the market.
          </motion.p>
        </section>

        {/* Existing Features Grid */}
        <div className="w-full mb-24">
          <FeaturesGrid />
        </div>

        {/* Deep Dive Feature Sections */}
        <section className="w-full max-w-7xl mx-auto px-6 lg:px-8 mb-32 space-y-32">
          {/* Feature 1 */}
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="w-full lg:w-1/2 space-y-6"
            >
              <div className="text-bcn-red font-bold tracking-wider text-sm uppercase">AI-Powered Insights</div>
              <h2 className="text-3xl md:text-4xl font-bold">Ask BCN Anything</h2>
              <p className="text-lg text-muted-foreground">
                Our proprietary AI model is trained on thousands of global regulations. Simply type your question in plain English, and get actionable, legally-sound compliance guidance in seconds.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="w-full lg:w-1/2 relative"
            >
              <div className="aspect-[4/3] rounded-3xl bg-zinc-100 dark:bg-zinc-900 border border-muted/50 shadow-2xl overflow-hidden flex items-center justify-center p-8">
                 {/* Mock UI */}
                 <div className="w-full bg-white dark:bg-zinc-950 rounded-xl shadow-sm border border-muted p-4 space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-bcn-red/10 flex items-center justify-center text-bcn-red text-xs font-bold">You</div>
                      <div className="bg-muted/50 p-3 rounded-2xl rounded-tl-none text-sm w-3/4">Do we need SOC2 compliance for EU customers?</div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-white text-xs font-bold">AI</div>
                      <div className="bg-bcn-red/5 border border-bcn-red/20 p-3 rounded-2xl rounded-tl-none text-sm w-5/6">
                        While SOC2 is highly recognized, EU customers typically prioritize GDPR compliance. However, achieving SOC2 Type II demonstrates strong data security controls...
                      </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="w-full lg:w-1/2 space-y-6"
            >
              <div className="text-bcn-red font-bold tracking-wider text-sm uppercase">Automated Audits</div>
              <h2 className="text-3xl md:text-4xl font-bold">Continuous Monitoring</h2>
              <p className="text-lg text-muted-foreground">
                Stop running manual audits. Connect your cloud infrastructure and let BCN automatically verify your configurations against hundreds of compliance frameworks continuously.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="w-full lg:w-1/2 relative"
            >
              <div className="aspect-[4/3] rounded-3xl bg-zinc-100 dark:bg-zinc-900 border border-muted/50 shadow-2xl overflow-hidden flex items-center justify-center p-8">
                 {/* Mock UI */}
                 <div className="w-full bg-white dark:bg-zinc-950 rounded-xl shadow-sm border border-muted p-6 space-y-6">
                    <div className="flex justify-between items-center border-b pb-4">
                      <span className="font-semibold text-sm">AWS S3 Encryption</span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">PASS</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-4">
                      <span className="font-semibold text-sm">MFA Enforced</span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">PASS</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-sm">Database Public Access</span>
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">FAIL</span>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        </section>

        <CtaSection />
      </main>
    </SmoothScrollProvider>
  );
}
