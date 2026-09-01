"use client";

import Link from "next/link";
import { Link2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { motion } from "framer-motion";

export function Navbar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

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
                  className={`relative px-4 py-2 text-sm font-bold tracking-wide transition-colors rounded-full ${
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
                  <span className="relative z-10">{link.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <button 
                onClick={signOut}
                className="inline-flex shrink-0 items-center justify-center rounded-full border border-transparent bg-white/10 text-white hover:bg-white/20 text-sm font-bold tracking-wide transition-all h-10 px-6"
              >
                Logout
              </button>
            ) : (
              <>
                <Link 
                  href="/login"
                  className="hidden sm:block text-sm font-bold tracking-wide text-white/80 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link 
                  href="/register"
                  className="inline-flex shrink-0 items-center justify-center rounded-full border border-transparent bg-white text-black hover:bg-white/90 text-sm font-bold tracking-wide transition-all h-10 px-6 shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)]"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
