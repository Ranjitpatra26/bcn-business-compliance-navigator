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
                      <div className="bg-muted/50 p-3 rounded-2xl rounded-tl-none text-sm w-3/4 text-zinc-800 dark:text-zinc-200">Do we need SOC2 compliance for EU customers?</div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-black text-xs font-bold">AI</div>
                      <div className="bg-bcn-red/5 border border-bcn-red/20 p-3 rounded-2xl rounded-tl-none text-sm w-5/6 text-zinc-800 dark:text-zinc-200">
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
                      <span className="font-semibold text-sm text-zinc-800 dark:text-zinc-200">AWS S3 Encryption</span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">PASS</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-4">
                      <span className="font-semibold text-sm text-zinc-800 dark:text-zinc-200">MFA Enforced</span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">PASS</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-sm text-zinc-800 dark:text-zinc-200">Database Public Access</span>
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">FAIL</span>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Integration Grid */}
        <section className="w-full bg-zinc-50 dark:bg-zinc-900/50 py-32 mb-32 border-y border-muted/50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="text-bcn-red font-bold tracking-wider text-sm uppercase mb-4">Seamless Connectivity</div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">Integrate with your <span className="text-bcn-red">Stack</span></h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">BCN connects directly to the tools you already use, pulling in data to verify compliance without manual entry.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {['AWS', 'Google Cloud', 'Microsoft Azure', 'Stripe', 'Quickbooks', 'Salesforce', 'Jira', 'GitHub'].map((integration, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                  className="bg-white dark:bg-card border border-muted/50 rounded-2xl p-6 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow hover:border-bcn-red/30 cursor-pointer group"
                >
                  <span className="font-bold text-muted-foreground group-hover:text-foreground transition-colors">{integration}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Security & Privacy */}
        <section className="w-full max-w-7xl mx-auto px-6 lg:px-8 mb-32">
          <div className="bg-bcn-black text-white rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent bg-[length:20px_20px]" />
            
            <div className="relative z-10 flex flex-col lg:flex-row gap-16 items-center">
              <div className="w-full lg:w-1/2 space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">Enterprise-Grade <span className="text-bcn-red">Security</span></h2>
                <p className="text-white/70 text-lg leading-relaxed">
                  Compliance data is sensitive. That's why we've built BCN on a zero-trust architecture. Your data is encrypted at rest and in transit, and we never use your private information to train public AI models.
                </p>
                <div className="flex gap-4 pt-4">
                  <div className="px-4 py-2 rounded-full border border-white/20 bg-white/5 text-sm font-bold tracking-wide">SOC2 Type II</div>
                  <div className="px-4 py-2 rounded-full border border-white/20 bg-white/5 text-sm font-bold tracking-wide">GDPR Ready</div>
                </div>
              </div>
              
              <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { title: "End-to-End Encryption", desc: "AES-256 encryption for all data." },
                  { title: "Role-Based Access", desc: "Granular permission controls." },
                  { title: "Audit Logging", desc: "Immutable logs for all actions." },
                  { title: "Data Residency", desc: "Choose where your data lives." }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
                  >
                    <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                    <p className="text-white/60 text-sm">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <CtaSection />
      </main>
    </SmoothScrollProvider>
  );
}
