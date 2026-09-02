"use client";

import { LogOut, Settings, LayoutDashboard, Building2, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/AuthProvider";

interface ProfileDropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function ProfileDropdown({ className, ...props }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user, signOut } = useAuth();

  if (!user) return null;

  // Extract user info
  const name = user.user_metadata?.full_name || user.user_metadata?.first_name || "User";
  const email = user.email || "";
  // In a real app we'd get the user's real avatar, falling back to a generated initial avatar
  const avatar = user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

  const menuItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      label: "My Business",
      href: "/business",
      icon: <Building2 className="h-4 w-4" />,
    },
    {
      label: "Profile Settings",
      href: "/settings",
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  return (
    <div className={cn("relative", className)} {...props}>
      <DropdownMenu onOpenChange={setIsOpen}>
        <div className="group relative">
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 p-1 pr-4 transition-all duration-200 hover:border-white/20 hover:bg-white/10 focus:outline-none h-10"
              type="button"
            >
              <div className="relative h-8 w-8 overflow-hidden rounded-full border border-white/20 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400">
                <Image
                  alt={name}
                  className="h-full w-full object-cover"
                  height={32}
                  src={avatar}
                  width={32}
                />
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="font-medium text-sm text-white leading-tight">
                  {name}
                </span>
              </div>
              
              <svg
                aria-hidden="true"
                className={cn(
                  "ml-1 h-4 w-4 transition-transform duration-200 text-white/50",
                  isOpen ? "rotate-180 text-white" : ""
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-64 rounded-2xl border border-zinc-200/60 bg-white/95 p-2 shadow-xl backdrop-blur-sm dark:border-zinc-800/60 dark:bg-zinc-900/95"
            sideOffset={8}
          >
            <div className="mb-2 px-3 py-2 flex flex-col items-start">
               <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                 {name}
               </div>
               <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate w-full">
                 {email}
               </div>
            </div>
            
            <DropdownMenuSeparator className="bg-zinc-200 dark:bg-zinc-800" />
            
            <div className="space-y-1 py-1">
              {menuItems.map((item) => (
                <DropdownMenuItem asChild key={item.label}>
                  <Link
                    className="flex cursor-pointer items-center rounded-xl p-2.5 transition-all duration-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                    href={item.href}
                  >
                    <div className="flex flex-1 items-center gap-3">
                      {React.cloneElement(item.icon as React.ReactElement, { className: "h-4 w-4 text-zinc-500 dark:text-zinc-400" })}
                      <span className="font-medium text-sm text-zinc-700 dark:text-zinc-300">
                        {item.label}
                      </span>
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))}
            </div>

            <DropdownMenuSeparator className="my-1 bg-zinc-200 dark:bg-zinc-800" />

            <DropdownMenuItem asChild>
              <button
                onClick={() => signOut()}
                className="group flex w-full cursor-pointer items-center gap-3 rounded-xl p-2.5 transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-500/10"
                type="button"
              >
                <LogOut className="h-4 w-4 text-red-500 group-hover:text-red-600" />
                <span className="font-medium text-red-500 text-sm group-hover:text-red-600">
                  Sign Out
                </span>
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </div>
      </DropdownMenu>
    </div>
  );
}
