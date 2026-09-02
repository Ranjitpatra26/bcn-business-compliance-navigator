"use client";
import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-48 pb-32 min-h-[70vh]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl mx-auto text-center bg-bcn-black text-white rounded-[3rem] p-16 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-bcn-red/20 blur-[100px] pointer-events-none rounded-full" />
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 relative z-10">Get in Touch</h1>
        <p className="text-xl text-white/70 max-w-2xl mx-auto mb-12 relative z-10">
          Whether you have a question about our platform, need a custom enterprise solution, or just want to say hi, our team is ready to help.
        </p>
        
        <motion.a 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          href="mailto:hello@bcn.com" 
          className="inline-block text-4xl md:text-6xl font-bold text-bcn-red hover:text-white transition-colors relative z-10"
        >
          hello@bcn.com
        </motion.a>
      </motion.div>
    </main>
  );
}
