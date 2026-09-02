"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play, ArrowRight, ShieldCheck, Search, CheckSquare, Target } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function AppPreviewSection() {
  const sectionRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end center"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 0.8], ["0%", "100%"]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {

      // Animate the workflow items
      gsap.fromTo(".workflow-item", 
        { opacity: 0, x: -20 },
        {
          opacity: 1, 
          x: 0,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top center",
            end: "bottom center",
            scrub: 1,
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const workflowSteps = [
    { icon: Search, title: "1. Business Analysis", desc: "Scan operations and models." },
    { icon: Target, title: "2. Trigger Detection", desc: "Identify regulatory thresholds." },
    { icon: ShieldCheck, title: "3. Rule Mapping", desc: "Apply exact legal frameworks." },
    { icon: CheckSquare, title: "4. Strategic Roadmap", desc: "Actionable step-by-step plan." },
    { icon: Play, title: "5. Continuous Monitoring", desc: "Stay compliant automatically." },
  ];

  return (
    <section ref={sectionRef} className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 overflow-hidden relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left: Workflow Drawing Column */}
        <div className="relative">
          <h2 className="text-5xl md:text-6xl font-bold max-w-md mb-16 leading-tight tracking-tighter">
            The BCN Workflow
          </h2>
          
          <div className="relative pl-12 space-y-16 workflow-container">
            {/* Animated Connecting Line */}
            <div className="absolute left-[1.35rem] top-6 bottom-10 w-1 bg-muted rounded-full overflow-hidden z-0">
              <motion.div 
                style={{ height: lineHeight }} 
                className="w-full bg-bcn-red origin-top"
              />
            </div>

            {workflowSteps.map((step, i) => (
              <div 
                key={i}
                className="relative z-10 workflow-item"
              >
                <div className="absolute -left-12 top-0 w-10 h-10 bg-white rounded-full border-4 border-bcn-red flex items-center justify-center shadow-md">
                  <step.icon className="w-4 h-4 text-bcn-red" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-lg">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-bcn-red font-bold text-[8rem] leading-none tracking-tighter opacity-5 absolute -z-10 -bottom-20 -left-10 select-none pointer-events-none">
            BCN
          </div>
        </div>

        {/* Right: Mock UI Layering */}
        <div className="relative h-[600px] w-full flex items-center justify-center perspective-1000">
          
          {/* Main Dashboard Card */}
          <motion.div 
            initial={{ opacity: 0, rotateY: 15, x: 50 }}
            whileInView={{ opacity: 1, rotateY: 0, x: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 1, type: "spring", bounce: 0.2 }}
            className="absolute right-0 top-10 w-full md:w-4/5 h-[450px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-black/5 z-10"
          >
            <div className="flex justify-between items-center p-4 border-b bg-gray-50/50">
              <div className="flex gap-4">
                <div className="font-bold tracking-tighter flex items-center">
                  <span className="w-2 h-2 rounded-full bg-bcn-red mr-2" />
                  bcn
                </div>
              </div>
              <div className="flex gap-4 text-xs font-medium text-muted-foreground hidden sm:flex">
                <span className="text-foreground border-b border-foreground pb-1">Map</span>
                <span>Rules</span>
                <span>Docs</span>
              </div>
            </div>
            
            <div className="p-8">
              <div className="flex justify-between items-end mb-12">
                <div>
                  <p className="text-sm font-bold tracking-widest uppercase text-muted-foreground mb-2">Mapped Obligations</p>
                  <p className="text-5xl font-bold">24 <span className="text-green-600 text-lg bg-green-50 px-3 py-1 rounded-full ml-2 font-medium">↑ +3 New</span></p>
                </div>
                <div className="w-12 h-12 rounded-full bg-bcn-black text-white flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-lg shadow-black/20">
                  <Play className="w-5 h-5 ml-1 fill-current" />
                </div>
              </div>
              
              <div className="h-40 w-full flex items-end gap-3 opacity-80">
                {[30, 45, 60, 40, 80, 50, 90, 70].map((h, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ height: "0%" }}
                    whileInView={{ height: `${h}%` }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.8, delay: 0.3 + (i * 0.05), type: "spring" }}
                    className={`w-full rounded-t-md transition-colors ${i === 6 ? 'bg-bcn-red shadow-lg shadow-bcn-red/20' : 'bg-bcn-gray'}`} 
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Floating Mobile Card */}
          <motion.div
            initial={{ opacity: 0, y: 100, x: -30 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.4, type: "spring", bounce: 0.3 }}
            className="absolute left-0 lg:-left-10 bottom-10 w-[300px] bg-bcn-black text-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col z-20 border border-white/10"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <p className="font-bold text-sm tracking-widest text-white/50 uppercase">Next Action</p>
              </div>
              
              <h4 className="text-2xl font-bold mb-4 leading-tight">File FinCEN BOI Report</h4>
              
              <div className="bg-white/10 rounded-xl p-4 mb-6 backdrop-blur-md">
                <p className="text-xs text-white/60 uppercase tracking-widest font-bold mb-1">Deadline</p>
                <p className="text-lg font-bold text-bcn-red">Jan 1, 2025</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <Search className="w-5 h-5" />
                </div>
                <div className="flex-1 bg-white text-black font-bold text-center py-3 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                  Start Filing
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
