"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Briefcase, 
  ShieldCheck, 
  AlertTriangle, 
  BookOpen, 
  FileText, 
  Bot, 
  Bell, 
  Settings,
  Link2,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";

import { BusinessSelector } from "./BusinessSelector";

const sidebarGroups = [
  {
    label: null,
    items: [
      { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    ]
  },
  {
    label: "BUSINESS",
    items: [
      { name: "My Business", href: "/business", icon: Briefcase },
    ]
  },
  {
    label: "COMPLIANCE",
    items: [
      { name: "Compliance", href: "/compliance", icon: ShieldCheck },
      { name: "Risk", href: "/compliance/risk", icon: AlertTriangle },
    ]
  },
  {
    label: "KNOWLEDGE",
    items: [
      { name: "Search", href: "/search", icon: Search },
      { name: "Regulations", href: "/regulations", icon: BookOpen },
      { name: "Documents", href: "/documents", icon: FileText },
      { name: "Ask BCN", href: "/assistant", icon: Bot },
    ]
  }
];

const systemItems = [
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  // Find the most specific matching route to prevent multiple active items (e.g. /compliance and /compliance/risk)
  const allItems = [...sidebarGroups.flatMap(g => g.items), ...systemItems];
  const activeItem = allItems.reduce((bestMatch, current) => {
    if (pathname === current.href || pathname.startsWith(current.href + "/")) {
      if (!bestMatch || current.href.length > bestMatch.href.length) {
        return current;
      }
    }
    return bestMatch;
  }, null as typeof allItems[0] | null);

  return (
    <aside className="w-64 flex-shrink-0 hidden md:flex flex-col border-r bg-muted/10 h-screen sticky top-0 overflow-y-auto select-none">
      <div className="p-6 pb-2">
        <Link href="/" className="flex items-center gap-2 group mb-6">
          <div className="w-8 h-8 rounded-full bg-bcn-red flex items-center justify-center text-white shadow-sm transform group-hover:scale-105 transition-all">
            <Link2 className="w-5 h-5 transform rotate-45 group-hover:rotate-90 transition-transform duration-300" />
          </div>
          <span className="text-xl font-bold tracking-tight">BCN</span>
        </Link>
        <BusinessSelector />
      </div>
        
      <div className="px-6 py-4 flex-1">
        <nav className="space-y-8">
          {sidebarGroups.map((group, i) => (
            <div key={i}>
              {group.label && (
                <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.15em] mb-4 px-3">
                  {group.label}
                </h4>
              )}
              <div className="space-y-1.5">
                {group.items.map((item) => {
                  const isActive = activeItem?.href === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-semibold tracking-wide transition-all",
                        isActive 
                          ? "bg-bcn-red text-white shadow-md" 
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-muted-foreground")} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t bg-muted/5">
        <nav className="space-y-1.5">
          {systemItems.map((item) => {
            const isActive = activeItem?.href === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-semibold tracking-wide transition-all",
                  isActive 
                    ? "bg-bcn-red text-white shadow-md" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-muted-foreground")} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
