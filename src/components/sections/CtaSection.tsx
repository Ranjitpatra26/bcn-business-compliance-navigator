"use client";

import { motion } from "framer-motion";
import { Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CtaSection() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 flex flex-col items-center justify-center text-center bg-white rounded-[3rem] shadow-sm mb-32 border border-black/5 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-bcn-red/5 blur-[100px] pointer-events-none rounded-full" />
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        whileInView={{ scale: 1, opacity: 1, y: 0 }}
        whileHover={{ rotate: 180, scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
        className="w-24 h-24 rounded-[1.75rem] bg-bcn-red flex items-center justify-center text-white mb-12 shadow-[0_15px_40px_rgba(220,38,38,0.4)] cursor-pointer relative z-10 hover:shadow-[0_25px_50px_rgba(220,38,38,0.6)] transition-shadow"
      >
        <Link2 className="w-10 h-10 -rotate-45 stroke-[3]" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 relative z-10"
      >
        Get Started
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-xl md:text-2xl text-muted-foreground max-w-2xl font-medium mb-12 relative z-10 leading-relaxed"
      >
        Turn regulatory complexity into strategic advantage! Start using BCN today. Sign up for a free trial.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4 relative z-10"
      >
        <Link href="/register">
          <Button variant="secondary" className="rounded-full px-12 py-8 text-lg font-bold bg-muted hover:bg-muted/80 text-foreground transition-all">
            Request a demo
          </Button>
        </Link>
        <Link href="/register">
          <Button className="rounded-full px-12 py-8 text-lg font-bold bg-bcn-red hover:bg-bcn-red/90 text-white shadow-xl shadow-bcn-red/20 transition-all hover:-translate-y-1 hover:shadow-2xl">
            Start for free
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}
