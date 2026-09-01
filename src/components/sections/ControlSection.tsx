"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ControlSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  
  useEffect(() => {
    if (!sectionRef.current || !pathRef.current) return;

    // Draw the radial gauge on scroll
    const length = pathRef.current.getTotalLength();
    gsap.set(pathRef.current, { strokeDasharray: length, strokeDashoffset: length });

    const ctx = gsap.context(() => {
      gsap.to(pathRef.current, {
        strokeDashoffset: length * 0.1, // Draw 90%
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          toggleActions: "play none none reset"
        }
      });
      
      // Animate main title
      gsap.from(".control-header", {
        y: 50,
        opacity: 0,
        filter: "blur(10px)",
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reset"
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 flex flex-col items-center overflow-hidden relative">
      
      {/* Background ambient image */}
      <div className="absolute inset-0 w-full h-full -z-20 overflow-hidden opacity-20 pointer-events-none mix-blend-multiply">
        <img 
          src="/dashboard_abstract_1788220526414.jpg" 
          alt="Abstract dashboard theme" 
          className="w-full h-full object-cover blur-3xl scale-150 opacity-30" 
        />
      </div>

      <h2 className="control-header text-6xl md:text-8xl font-bold text-center max-w-5xl leading-[1] mb-24 tracking-tighter relative z-10">
        Control your compliance <span className="text-muted-foreground">landscape.</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl mb-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8 }}
        >
          <Card className="p-10 rounded-[2.5rem] border-none shadow-xl bg-white h-full flex flex-col justify-between group hover:-translate-y-2 transition-transform duration-500">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-8">Overall Risk Level</p>
              
              <div className="relative w-40 h-40 mx-auto mb-8">
                {/* SVG Radial Gauge */}
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#f3f4f6" strokeWidth="8" />
                  <path 
                    ref={pathRef}
                    d="M 50,5 A 45,45 0 1 1 49.9,5" 
                    fill="none" 
                    stroke="#16a34a" 
                    strokeWidth="8" 
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-green-600">Low</span>
                </div>
              </div>
            </div>
            
            <div className="pt-8 border-t">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest mb-1">Open Issues</p>
                  <p className="text-4xl font-bold">3</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-bcn-yellow transition-colors cursor-pointer">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="p-10 rounded-[2.5rem] border-none shadow-xl bg-bcn-black text-white h-full flex flex-col justify-between group hover:-translate-y-2 transition-transform duration-500 relative overflow-hidden">
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-bcn-red/20 blur-3xl rounded-full group-hover:bg-bcn-red/30 transition-colors duration-500" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <p className="text-sm font-bold uppercase tracking-widest text-white/50 mb-2">Team Activity</p>
                  <p className="text-5xl font-bold">128</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {[
                  { name: 'Document verified', time: '2m ago' },
                  { name: 'Rule assigned', time: '1h ago' },
                  { name: 'Report generated', time: '3h ago' }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/5">
                    <span className="font-medium text-white/90">{item.name}</span>
                    <span className="text-xs text-white/40 uppercase tracking-widest font-bold">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="w-full max-w-4xl bg-bcn-red rounded-[3rem] p-16 text-center text-white shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-white/10" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 40%, 0 80%)' }} />
        
        <h3 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter relative z-10">
          Ready to map your business?
        </h3>
        <Link href="/register" className="relative z-10 inline-block">
          <Button className="rounded-full px-12 py-8 text-xl bg-white text-bcn-red hover:bg-gray-100 font-bold shadow-xl transition-transform hover:scale-105">
            Start Your Journey
          </Button>
        </Link>
      </motion.div>

    </section>
  );
}
