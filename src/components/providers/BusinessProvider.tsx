"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface BusinessContextType {
  activeBusinessId: string | null;
  setActiveBusinessId: (id: string | null) => void;
  isLoading: boolean;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const [activeBusinessId, setActiveBusinessIdState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load from local storage on mount
    const saved = localStorage.getItem("bcn_active_business");
    setTimeout(() => {
      if (saved) {
        setActiveBusinessIdState(saved);
      } else if (process.env.NEXT_PUBLIC_API_MODE === "true" || process.env.NEXT_PUBLIC_API_MODE === "mock") {
        setActiveBusinessIdState("b1");
        localStorage.setItem("bcn_active_business", "b1");
      }
      setIsLoading(false);
    }, 0);
  }, []);

  const setActiveBusinessId = (id: string | null) => {
    setActiveBusinessIdState(id);
    if (id) {
      localStorage.setItem("bcn_active_business", id);
    } else {
      localStorage.removeItem("bcn_active_business");
    }
  };

  return (
    <BusinessContext.Provider value={{ activeBusinessId, setActiveBusinessId, isLoading }}>
      {children}
    </BusinessContext.Provider>
  );
}

export function useActiveBusiness() {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error("useActiveBusiness must be used within a BusinessProvider");
  }
  return context;
}
