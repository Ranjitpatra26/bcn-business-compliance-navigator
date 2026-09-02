"use client";
import { motion } from "framer-motion";

export default function PrivacyPolicyPage() {
  return (
    <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-48 pb-32 min-h-[70vh]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-12">Last updated: September 2026</p>
        
        <div className="space-y-8 text-lg text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Introduction</h2>
            <p>At BCN, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our platform and use our services.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Data Collection</h2>
            <p>We may collect information about you in a variety of ways. The information we may collect via the platform includes personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. Use of Your Information</h2>
            <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you to create and manage your account, process transactions, and send you related information.</p>
          </section>
        </div>
      </motion.div>
    </main>
  );
}
