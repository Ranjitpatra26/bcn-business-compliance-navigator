"use client";

import Link from "next/link";
import { Link2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { AnimatePresence, motion } from "framer-motion";
import { ProfileDropdown } from "./ProfileDropdown";
import { type RefObject, useRef, useState } from "react";

function SuccessParticles({
  buttonRef,
}: {
  buttonRef: React.RefObject<HTMLElement>;
}) {
  const rect = buttonRef.current?.getBoundingClientRect();
  if (!rect) return null;

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  return (
    <AnimatePresence>
      {[...Array(8)].map((_, i) => (
        <motion.div
          animate={{
            scale: [0, 1, 0],
            x: [0, (i % 2 ? 1 : -1) * (Math.random() * 50 + 20)],
            y: [0, -Math.random() * 50 - 20],
          }}
          className="fixed h-1.5 w-1.5 rounded-full bg-primary z-50 pointer-events-none"
          initial={{
            scale: 0,
            x: 0,
            y: 0,
          }}
          key={i}
          style={{ left: centerX, top: centerY }}
          transition={{
            duration: 0.6,
            delay: i * 0.1,
            ease: "easeOut",
          }}
        />
      ))}
    </AnimatePresence>
  );
}

function ParticleLink({
  children,
  href,
  className,
  ...props
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
}) {
  const [showParticles, setShowParticles] = useState(false);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setShowParticles(true);

    setTimeout(() => {
      setShowParticles(false);
      router.push(href);
    }, 400);
  };

  return (
    <>
      {showParticles && (
        <SuccessParticles buttonRef={buttonRef as RefObject<HTMLElement>} />
      )}
      <Link
        href={href}
        className={cn(
          className,
          "transition-transform duration-100",
          showParticles && "scale-95"
        )}
        onClick={handleClick}
        ref={buttonRef}
        {...props}
      >
        {children}
      </Link>
    </>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const publicLinks = [
    { name: "Product", href: "#product" },
    { name: "How it works", href: "#how-it-works" },
    { name: "Features", href: "#features" },
  ];

  const authLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Business", href: "/business" },
    { name: "Compliance", href: "/compliance" },
    { name: "Regulations", href: "/regulations" },
    { name: "Documents", href: "/documents" },
    { name: "Search", href: "/search" },
    { name: "Ask BCN", href: "/assistant" },
  ];

  const navLinks = user ? authLinks : publicLinks;

  return (
    <nav className="fixed top-6 left-0 right-0 z-50 px-4 sm:px-6 transition-all duration-300">
      <div className="max-w-5xl mx-auto bg-bcn-black rounded-[2.5rem] shadow-2xl py-3 px-4 sm:px-6 border border-white/10">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group mr-4">
              <Link2 className="w-6 h-6 text-white transform rotate-45 group-hover:rotate-90 transition-transform duration-300" />
              <span className="text-xl font-bold tracking-tight text-white">BCN</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              // Highlight active link, including sub-routes (e.g. /documents/123 highlights Documents)
              const isActive = link.href.startsWith('/') && link.href !== '/' 
                ? pathname?.startsWith(link.href) 
                : pathname === link.href;

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`group relative px-4 py-2 text-sm font-bold tracking-wide transition-colors rounded-full ${
                    isActive ? "text-black" : "text-white/70 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active-pill"
                      className="absolute inset-0 bg-white rounded-full z-0"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 inline-block">
                    {link.name}
                    {!isActive && (
                      <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center rounded-full" />
                    )}
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <ProfileDropdown />
            ) : (
              <>
                <Link 
                  href="/login"
                  className="group relative hidden sm:block text-sm font-bold tracking-wide text-white/80 hover:text-white transition-colors"
                >
                  <span className="relative z-10 inline-block">
                    Login
                    <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center rounded-full" />
                  </span>
                </Link>
                <ParticleLink 
                  href="/register"
                  className="inline-flex shrink-0 items-center justify-center rounded-full border border-transparent bg-white text-black hover:bg-white/90 text-sm font-bold tracking-wide transition-all h-10 px-6 shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)]"
                >
                  Get Started
                </ParticleLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
