"use client";
import { motion } from "framer-motion";
import { Shield, Zap, TrendingUp } from "lucide-react";

export default function WhyUsPage() {
  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-48 pb-32 min-h-[70vh]">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl mx-auto text-center mb-16"
      >
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">Why Choose BCN?</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          We don't just tell you what the rules are. We build the roadmap for you to follow them effortlessly. 
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: Shield, title: "Unmatched Security", desc: "Enterprise-grade encryption and strict data privacy protocols protect your sensitive information." },
          { icon: Zap, title: "Automated Workflows", desc: "Eliminate manual spreadsheets. BCN instantly maps your business profile to active requirements." },
          { icon: TrendingUp, title: "Strategic Advantage", desc: "Turn compliance from a cost center into a competitive edge that builds trust with your partners." }
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.2 + 0.4 }}
            className="p-8 rounded-[2rem] bg-white shadow-sm border border-black/5 flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 rounded-full bg-bcn-red/10 flex items-center justify-center text-bcn-red mb-6">
              <feature.icon className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
