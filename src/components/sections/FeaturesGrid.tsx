"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useMotionValue, useMotionValueEvent } from "framer-motion";
import { ArrowUpRight, TrendingUp, Shield, Lock, FileCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SpringCounter = ({ value, delay = 0, suffix = "" }: { value: number, delay?: number, suffix?: string }) => {
  const [mounted, setMounted] = useState(false);
  const [display, setDisplay] = useState(0);
  const count = useMotionValue(0);
  const springCount = useSpring(count, { stiffness: 50, damping: 20, mass: 1 });
  
  useMotionValueEvent(springCount, "change", (latest) => {
    setDisplay(Math.round(latest));
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.span 
      onViewportEnter={() => { count.set(value) }}
      viewport={{ once: false, margin: "-100px" }}
      className="text-4xl md:text-5xl font-bold tracking-tighter"
    >
      {mounted ? display : 0}{suffix}
    </motion.span>
  );
};

export function FeaturesGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLHeadingElement>(null);
  const text2Ref = useRef<HTMLHeadingElement>(null);
  const text3Ref = useRef<HTMLHeadingElement>(null);
  
  useEffect(() => {
    if (!sectionRef.current || !text1Ref.current || !text2Ref.current || !text3Ref.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "top 15%",
          scrub: 1,
        }
      });

      // Storytelling text transitions
      tl.to(text1Ref.current, { opacity: 0, y: -20, duration: 1 })
        .to(text2Ref.current, { opacity: 1, y: 0, duration: 1 }, "-=0.5")
        .to(text2Ref.current, { opacity: 0, y: -20, duration: 1 }, "+=0.8")
        .to(text3Ref.current, { opacity: 1, y: 0, duration: 1 }, "-=0.5")
        .to({}, { duration: 1.5 }); // Hold the 3rd text on screen
        
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
      
      {/* Scroll Storytelling Header */}
      <div ref={textContainerRef} className="relative h-[250px] mb-20 flex items-center justify-center text-center">
        <h2 ref={text1Ref} className="absolute inset-0 flex flex-col items-center justify-center text-6xl md:text-8xl font-bold tracking-[-0.04em] text-muted-foreground leading-[0.9]">
          COMPLIANCE IS <span className="font-serif italic text-bcn-black font-medium mt-2">COMPLEX.</span>
        </h2>
        <h2 ref={text2Ref} className="absolute inset-0 flex flex-col items-center justify-center text-6xl md:text-8xl font-bold tracking-[-0.04em] opacity-0 translate-y-10 leading-[0.9]">
          YOUR BUSINESS IS <span className="font-serif italic text-bcn-red font-medium mt-2">UNIQUE.</span>
        </h2>
        <h2 ref={text3Ref} className="absolute inset-0 flex flex-col items-center justify-center text-6xl md:text-8xl font-bold tracking-[-0.04em] text-bcn-red opacity-0 translate-y-10 leading-[0.9]">
          BCN CONNECTS <span className="font-serif italic text-bcn-black font-medium mt-2">THE TWO.</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Card: Info */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="group"
        >
          <Card className="h-[400px] p-10 rounded-[2.5rem] border-none shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between bg-white relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-bcn-yellow/10 rounded-full blur-3xl group-hover:bg-bcn-yellow/30 transition-colors duration-500" />
            <div className="relative z-10">
              <Badge className="bg-bcn-yellow text-bcn-black hover:bg-bcn-yellow/90 px-4 py-1.5 rounded-full border-none font-bold tracking-widest uppercase text-xs mb-10 shadow-sm">
                Identify Requirements
              </Badge>
              <h3 className="text-4xl font-bold mb-4 leading-tight tracking-tight">
                Contextual Analysis
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We map your specific business activities directly to the regulatory framework, instantly identifying what applies.
              </p>
            </div>
            
            <div className="flex items-center gap-2 mt-4">
              <Shield className="w-5 h-5 text-bcn-red" />
              <Lock className="w-5 h-5 text-bcn-red opacity-60" />
              <FileCheck className="w-5 h-5 text-bcn-red opacity-30" />
            </div>
          </Card>
        </motion.div>

        {/* Middle Card: Kinetic KPI */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="group"
        >
          <Card className="h-[400px] p-10 rounded-[2.5rem] border-none shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between bg-white overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <h4 className="font-bold text-xl mb-8 tracking-tight text-muted-foreground uppercase">Compliance Health</h4>
              <div className="flex items-center gap-6 mb-8">
                <div className="w-16 h-16 rounded-full bg-bcn-red text-white flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-bcn-red/20">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <SpringCounter value={92} />
                    <span className="text-xl font-medium text-muted-foreground">/100</span>
                  </div>
                  <span className="text-sm text-green-600 flex items-center font-bold mt-1">
                    <ArrowUpRight className="w-4 h-4 mr-1" /> Excellent Standing
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-auto pt-6 border-t relative z-10">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Risk trajectory</p>
              {/* Animated mock chart */}
              <div className="h-24 w-full flex items-end justify-between gap-2 opacity-50">
                {[40, 60, 45, 80, 55, 90, 70].map((h, i) => (
                  <motion.div 
                    key={i} 
                    className="w-full bg-bcn-red rounded-t-md" 
                    initial={{ height: "0%" }}
                    whileInView={{ height: `${h}%` }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.6, delay: 0.2 + (i * 0.1), ease: "easeOut" }}
                  />
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Right Card: Black Widget Control */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="group"
        >
          <Card className="h-[400px] p-10 rounded-[2.5rem] border-none shadow-xl flex flex-col bg-bcn-black text-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
            <div className="absolute -left-24 -bottom-24 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-500 pointer-events-none" />
            
            <div className="flex justify-between items-start mb-12 relative z-10">
              <div className="text-left">
                <p className="text-sm font-bold uppercase tracking-widest text-white/50 mb-2">Mapped Requirements</p>
                <div className="flex items-center gap-1">
                  <SpringCounter value={24} />
                </div>
              </div>
            </div>

            <div className="mt-auto relative z-10">
              <h3 className="text-3xl font-bold mb-4 tracking-tight leading-tight">Your Strategic Roadmap</h3>
              <p className="text-white/60 text-lg leading-relaxed">
                Step-by-step guidance to satisfy every applicable regulation. Turn obligations into action.
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
