"use client";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-48 pb-32 min-h-[70vh]">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl mx-auto text-center"
      >
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">About BCN</h1>
        <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
          Founded on the principle that regulatory compliance shouldn't be a bottleneck, BCN (Business Compliance Navigator) is the intelligent engine built for modern enterprises. We transform complex, ever-changing legal requirements into clear, actionable workflows.
        </p>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Our team consists of industry veterans, legal experts, and top-tier engineers dedicated to providing a secure, automated platform that helps you stay ahead of the curve.
        </p>
      </motion.div>
    </main>
  );
}
