"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useMotionValue, useMotionValueEvent } from "framer-motion";
import { Play, Zap, BarChart2, ArrowRight, Activity, ShieldAlert, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const KineticCounter = ({ value, label, icon: Icon, delay = 0, colorClass = "text-bcn-red" }: { value: number, label: string, icon: any, delay?: number, colorClass?: string }) => {
  const [mounted, setMounted] = useState(false);
  const [display, setDisplay] = useState(0);
  const count = useMotionValue(0);
  const springCount = useSpring(count, { stiffness: 40, damping: 15, mass: 1 });
  
  useMotionValueEvent(springCount, "change", (latest) => {
    setDisplay(Math.round(latest));
  });
  
  useEffect(() => {
    setMounted(true);
    const timeout = setTimeout(() => {
      count.set(value);
    }, 500 + (delay * 1000));
    return () => clearTimeout(timeout);
  }, [value, delay, count]);

  if (!mounted) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: delay + 0.5 }}
      whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.2 } }}
      className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl shadow-xl shadow-black/5 border border-black/5 relative group overflow-hidden"
    >
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 ${colorClass.replace('text-', 'bg-')}`} />
      
      <div className="flex items-center gap-3 mb-2">
        <Icon className={`w-5 h-5 ${colorClass}`} />
        <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <motion.span className={`text-5xl font-bold tracking-tighter ${colorClass}`}>
          {display}
        </motion.span>
        {label === "Compliance Health" && <span className="text-xl font-medium text-muted-foreground">/100</span>}
      </div>
    </motion.div>
  );
};

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // GSAP ScrollTrigger to fade and translate hero on scroll
    const ctx = gsap.context(() => {
      gsap.to(containerRef.current, {
        y: 150,
        opacity: 0,
        scale: 0.95,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        }
      });
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full pt-32 pb-36 lg:pb-40 flex flex-col items-center text-center overflow-hidden min-h-[90vh] justify-center">
      
      {/* High-End Cinematic BCN Trust & Regulatory Shield Background */}
      <div className="absolute inset-0 w-full h-full -z-20 overflow-hidden select-none pointer-events-none" aria-hidden="true">
        <Image 
          src="/images/auth/bcn_trust_bg.jpg" 
          alt="BCN Enterprise Trust Architecture" 
          fill
          priority
          quality={90}
          className="object-cover object-center opacity-65 sm:opacity-75"
          sizes="100vw"
        />
        {/* Subtle gentle wash to preserve text contrast without obscuring the artwork */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-white/15 to-white/70" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-bcn-red/5 blur-[120px] rounded-full pointer-events-none" />
        {/* Seamless bottom fade into the next section */}
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white via-white/80 to-transparent" />
        {/* Seamless horizontal fades for ultra-wide screens */}
        <div className="absolute top-0 left-0 w-24 md:w-48 lg:w-64 h-full bg-gradient-to-r from-white via-white/80 to-transparent" />
        <div className="absolute top-0 right-0 w-24 md:w-48 lg:w-64 h-full bg-gradient-to-l from-white via-white/80 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-5xl flex flex-col items-center"
      >
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-bcn-red/20 bg-bcn-red/5 text-bcn-red font-bold tracking-widest text-sm uppercase bg-white/50 backdrop-blur-sm"
        >
          <Zap className="w-4 h-4" />
          Business Compliance Navigator
        </motion.div>

        <h1 ref={headlineRef} className="text-7xl md:text-8xl lg:text-[10rem] font-bold tracking-[-0.04em] leading-[0.9] mb-8 flex flex-wrap justify-center gap-x-6 gap-y-2 max-w-[1200px] text-center text-bcn-black">
          <motion.span
            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block"
          >
            KNOW
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block"
          >
            WHAT
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block font-serif italic text-bcn-red font-medium"
          >
            APPLIES.
          </motion.span>
        </h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-xl md:text-2xl text-muted-foreground max-w-2xl text-center mb-16 leading-relaxed font-medium"
        >
          Navigate complex regulations with absolute confidence. The intelligent compliance engine built for modern businesses.
        </motion.p>

        {/* Kinetic KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mx-auto mb-16 relative z-20">
          <KineticCounter value={92} label="Compliance Health" icon={Activity} delay={0.1} colorClass="text-bcn-red" />
          <KineticCounter value={18} label="Requirements" icon={CheckCircle2} delay={0.2} colorClass="text-green-600" />
          <KineticCounter value={3} label="Action Required" icon={ShieldAlert} delay={0.3} colorClass="text-amber-500" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-20"
        >
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-full bg-bcn-black px-10 py-5 text-lg font-bold text-white hover:bg-black/80 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 group overflow-hidden relative"
          >
            <span className="relative z-10 flex items-center">
              Analyze My Business
              <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-bcn-red translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
          </Link>
          <Link
            href="/how-it-works"
            className="inline-flex items-center justify-center rounded-full bg-white/80 backdrop-blur-md px-10 py-5 text-lg font-bold text-black border-2 border-muted hover:border-black transition-colors shadow-sm"
          >
            See How BCN Works
          </Link>
        </motion.div>
      </motion.div>
      </div>
    </section>
  );
}
