/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useBusinesses } from "@/hooks/useBusiness";
import { useActiveBusiness } from "@/components/providers/BusinessProvider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Building2, MapPin, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/common/EmptyState";
import { motion } from "framer-motion";

export default function BusinessListPage() {
  const { data: businesses, isLoading, error, refetch } = useBusinesses();
  const { activeBusinessId, setActiveBusinessId } = useActiveBusiness();

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-bold mb-2">Failed to load businesses</h2>
        <Button onClick={() => refetch()} variant="outline" className="rounded-full">Retry</Button>
      </div>
    );
  }

  if (!businesses || businesses.length === 0) {
    return (
      <EmptyState
        title="No businesses found"
        description="Get started by creating your first business profile."
        action={{ label: "Add Business", href: "/business/new" }}
      />
    );
  }

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-muted/10 min-h-screen">
      
      {/* Header (FeaturesGrid style) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 px-4 max-w-7xl mx-auto">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            My Businesses
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage your business profiles and compliance contexts across multiple entities.
          </p>
        </div>
        <Link href="/business/new" className="mt-6 md:mt-0">
          <Button className="rounded-full px-8 py-6 text-lg bg-bcn-red hover:bg-bcn-red/90 text-white font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <Plus className="w-5 h-5 mr-2" /> Add Business
          </Button>
        </Link>
      </div>

      {/* Grid (FeaturesGrid style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto pb-24">
        {businesses.map((business: any, i: number) => {
          const isActive = activeBusinessId === business.id;
          
          return (
            <motion.div
              key={business.id}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card 
                className={`h-full p-8 rounded-[2rem] shadow-sm flex flex-col justify-between overflow-hidden relative group transition-all duration-300 ${isActive ? 'bg-bcn-black text-white border-transparent' : 'bg-white border-none hover:shadow-xl'}`}
              >
                {/* Active Indicator Background effect (Optional, similar to landing page floating elements) */}
                {isActive && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-bcn-red/20 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none" />
                )}

                <div className="z-10">
                  <div className="flex justify-between items-start mb-10">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${isActive ? 'bg-zinc-800' : 'bg-muted'}`}>
                      <Building2 className={`w-6 h-6 ${isActive ? 'text-white' : 'text-muted-foreground'}`} />
                    </div>
                    {isActive ? (
                      <Badge className="bg-bcn-red text-white hover:bg-bcn-red px-3 py-1 rounded-full border-none font-medium flex items-center gap-1.5 shadow-sm">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Active
                      </Badge>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="rounded-full hover:bg-bcn-red hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                        onClick={() => setActiveBusinessId(business.id)}
                      >
                        Set Active
                      </Button>
                    )}
                  </div>
                  
                  <h3 className="text-3xl font-bold mb-3 leading-tight line-clamp-2 group-hover:text-bcn-red transition-colors duration-300">
                    {business.name}
                  </h3>
                  
                  <div className={`flex items-center text-sm gap-2 mb-8 ${isActive ? 'text-zinc-400' : 'text-muted-foreground'}`}>
                    <MapPin className="w-4 h-4" />
                    <span>{business.city ? `${business.city}, ` : ''}{business.state || business.country}</span>
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-dashed z-10 flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isActive ? 'text-zinc-500' : 'text-muted-foreground/70'}`}>Type</p>
                      <p className="font-medium truncate">{business.business_type}</p>
                    </div>
                    <div>
                      <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isActive ? 'text-zinc-500' : 'text-muted-foreground/70'}`}>Industry</p>
                      <p className="font-medium truncate">{business.industry}</p>
                    </div>
                  </div>

                  <Link href={`/business/${business.id}`} className="block mt-4">
                    <Button 
                      variant={isActive ? "secondary" : "outline"} 
                      className={`w-full rounded-full font-semibold h-12 transition-all ${!isActive && 'group-hover:bg-black group-hover:text-white'}`}
                    >
                      Manage Business <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
