"use client";
import { motion } from "framer-motion";

export default function LicenseAgreementPage() {
  return (
    <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-48 pb-32 min-h-[70vh]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">License Agreement</h1>
        <p className="text-sm text-muted-foreground mb-12">Last updated: September 2026</p>
        
        <div className="space-y-8 text-lg text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p>By accessing and using the BCN platform, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. License Grant</h2>
            <p>Subject to your compliance with these Terms, BCN grants you a limited, non-exclusive, non-transferable, non-sublicensable license to access and make personal and non-commercial use of the BCN platform.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. Restrictions</h2>
            <p>You may not: (i) remove any copyright, trademark or other proprietary notices from any portion of the Services; (ii) reproduce, modify, prepare derivative works based upon, distribute, license, lease, sell, resell, transfer, publicly display, publicly perform, transmit, stream, broadcast or otherwise exploit the Services.</p>
          </section>
        </div>
      </motion.div>
    </main>
  );
}
