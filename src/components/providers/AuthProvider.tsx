"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (process.env.NEXT_PUBLIC_API_MODE === "true" || process.env.NEXT_PUBLIC_API_MODE === "mock") {
          // Bypass auth in mock mode
          setSession({ access_token: "mock-token" } as Session);
          setUser({ id: "mock-user", email: "demo@bcn.com" } as User);
          setIsLoading(false);
          return;
        }

        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    if (process.env.NEXT_PUBLIC_API_MODE === "true" || process.env.NEXT_PUBLIC_API_MODE === "mock") {
      return; // Do not subscribe to Supabase events in mock mode
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signOut = async () => {
    setIsLoggingOut(true);
    if (process.env.NEXT_PUBLIC_API_MODE !== "true" && process.env.NEXT_PUBLIC_API_MODE !== "mock") {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    router.push("/");
  };

  // Listen for unauthorized API errors
  useEffect(() => {
    const handleUnauthorized = () => {
      supabase.auth.signOut().then(() => {
        router.push("/login");
      });
    };
    
    window.addEventListener("bcn:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("bcn:unauthorized", handleUnauthorized);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]); // supabase.auth is stable from createClient

  // Protect routes
  useEffect(() => {
    if (isLoading || isLoggingOut) return;
    
    const isPublicRoute = ["/", "/login", "/register"].includes(pathname);
    
    if (!user && !isPublicRoute) {
      router.push("/login");
    } else if (user && ["/login", "/register"].includes(pathname)) {
      router.push("/");
    }
  }, [user, isLoading, isLoggingOut, pathname, router]);

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
