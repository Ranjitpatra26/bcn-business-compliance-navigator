"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useMotionValue, useMotionValueEvent } from "framer-motion";
import { Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
      className="text-7xl md:text-9xl font-bold tracking-tighter"
    >
      {mounted ? display : 0}{suffix}
    </motion.span>
  );
};

const TypewriterText = ({ text, delay = 0 }: { text: string, delay?: number }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!inView) {
      setDisplayedText("");
      return;
    }
    
    let i = 0;
    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;
    
    timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        setDisplayedText(text.substring(0, i + 1));
        i++;
        if (i === text.length) {
          clearInterval(intervalId);
        }
      }, 20); // Increased typing speed (from 40 to 20)
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [text, inView, delay]);

  return (
    <motion.span 
      onViewportEnter={() => setInView(true)}
      onViewportLeave={() => setInView(false)}
      viewport={{ once: false, margin: "-100px" }}
      className="inline-block relative"
    >
      {/* Invisible text to maintain fixed width for the yellow background */}
      <span className="opacity-0 pointer-events-none">{text}</span>
      
      {/* The actual typing text overlay */}
      <span className="absolute inset-0 left-0 top-0 whitespace-nowrap overflow-hidden flex items-center justify-start">
        <span>{displayedText}</span>
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
          className="inline-block w-[0.05em] h-[0.8em] bg-current ml-1 align-baseline"
        />
      </span>
    </motion.span>
  );
};

export function EfficiencySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  
  useEffect(() => {
    if (!sectionRef.current || !textRef.current) return;

    const ctx = gsap.context(() => {
      // Blur to sharp reveal for the main heading
      gsap.fromTo(textRef.current, 
        { filter: "blur(20px)", opacity: 0, scale: 1.1 },
        { 
          filter: "blur(0px)", 
          opacity: 1, 
          scale: 1,
          duration: 1.5, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            toggleActions: "play none none reset"
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 overflow-hidden">
      <div className="flex flex-col md:flex-row items-start md:items-end mb-32 justify-between gap-8">
        <div className="flex items-baseline gap-4">
          <span className="text-2xl font-bold uppercase tracking-widest text-muted-foreground">Up to</span>
          <SpringCounter value={45} suffix="%" />
        </div>
        <motion.p 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-muted-foreground max-w-lg leading-relaxed font-medium"
        >
          Reduce your compliance research time by up to 45%. Unique mapping systems provide immediate insights from regulations, turning months of reading into minutes of action.
        </motion.p>
      </div>

      <div className="text-center relative max-w-6xl mx-auto">
        <h2 ref={textRef} className="text-6xl md:text-8xl lg:text-[7rem] font-bold tracking-tighter leading-[1.1] mb-16 px-4">
          Maximize <span className="text-muted-foreground">certainty</span><br />
          with our intuitive<br />
          <span className="inline-block relative z-10 mt-2">
            <span className="absolute inset-0 bg-bcn-yellow rounded-[3rem] -z-10 -mx-8 my-[-0.5rem] rotate-2 scale-105 shadow-xl"></span>
            <TypewriterText text="compliance navigator" delay={1000} />
          </span>
        </h2>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-16 border-t border-black/10"
        >
          <div className="flex items-center gap-4 bg-white p-3 rounded-full absolute left-0 bottom-4 hidden lg:flex shadow-xl shadow-black/5 border border-black/5">
            <div className="w-14 h-14 rounded-full bg-bcn-red text-white flex items-center justify-center shadow-lg">
              <Activity className="w-7 h-7" />
            </div>
            <div className="text-left pr-6">
              <p className="text-lg font-bold leading-none mb-1">+30%</p>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Compliance coverage</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Link href="/register">
              <Button variant="outline" className="rounded-full px-10 py-7 text-lg hover:bg-muted font-bold border-2 border-black/10 bg-transparent transition-all hover:border-black">
                Request a demo
              </Button>
            </Link>
            <Link href="/register">
              <Button className="rounded-full px-10 py-7 text-lg bg-bcn-red hover:bg-bcn-red/90 text-white font-bold shadow-xl shadow-bcn-red/20 transition-all hover:-translate-y-1 hover:shadow-2xl">
                Start for free
              </Button>
            </Link>
          </div>
          
          <div className="absolute right-0 bottom-8 text-sm text-muted-foreground text-right hidden lg:block max-w-[280px] font-medium leading-relaxed">
            Explore rule triggers, regulatory documents, deadlines, and more to gain deep insight into your requirements. With us, your business doesn&apos;t just adapt - it evolves.
          </div>
        </motion.div>
      </div>
    </section>
  );
}
