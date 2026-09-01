/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useDashboard } from "@/hooks/useDashboard";
import { useBusiness } from "@/hooks/useBusiness";
import { useActiveBusiness } from "@/components/providers/BusinessProvider";
import { useMonitoring } from "@/hooks/useMonitoring";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/EmptyState";
import { Loader2, TrendingUp, ArrowUpRight, Plus, PieChart, LineChart, AlertCircle, ShieldCheck, ArrowRight, BellRing, Activity, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { activeBusinessId, isLoading: isBusinessContextLoading } = useActiveBusiness();
  const { data: business, isLoading: isBusinessLoading } = useBusiness(activeBusinessId);
  const { data: dashboard, isLoading: isDashboardLoading, error, refetch } = useDashboard(activeBusinessId);
  const { data: monitoring, isLoading: isMonitoringLoading } = useMonitoring(activeBusinessId);
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 0);
  }, []);

  if (!mounted || isBusinessContextLoading) {
    return <div className="p-8 flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;
  }

  if (!activeBusinessId) {
    return (
      <EmptyState
        title="No business selected"
        description="Select a business from the sidebar or create a new one to view your dashboard."
      />
    );
  }

  if (isBusinessLoading || isDashboardLoading) {
    return (
      <div className="p-8 space-y-8 animate-pulse max-w-7xl mx-auto">
        <div className="h-12 w-64 bg-muted rounded-xl"></div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-24">
          {[1, 2, 3].map(i => <div key={i} className="h-96 bg-muted rounded-[2rem]"></div>)}
        </div>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertCircle className="w-12 h-12 text-bcn-red mb-4" />
        <h2 className="text-2xl font-bold mb-2">Failed to load dashboard</h2>
        <p className="text-muted-foreground mb-6">There was an error loading your compliance data.</p>
        <Button onClick={() => refetch()} variant="outline" className="rounded-full px-6">Retry</Button>
      </div>
    );
  }

  const { metrics, nextActions, riskDistribution } = dashboard;
  const isHealthy = metrics.healthScore > 80;

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-muted/10 min-h-screen">
      
      {/* Header (Mapped from FeaturesGrid Header) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 px-4 max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold max-w-xl leading-tight">
          Good morning 👋
        </h1>
        <p className="text-lg text-muted-foreground max-w-xs mt-4 md:mt-0">
          Here's where <span className="font-semibold text-foreground">{business?.name || "your business"}</span> stands today.
        </p>
      </div>

      {/* 1. FeaturesGrid Mapped to KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-32 max-w-7xl mx-auto">
        {/* Left Card: Action Required */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Card className="h-full p-8 rounded-[2rem] border-none shadow-sm flex flex-col bg-white">
            <Badge className={`${metrics.overdueItems > 0 ? 'bg-bcn-red' : 'bg-green-500'} text-white px-4 py-1.5 rounded-full border-none font-medium text-sm mb-8 w-fit`}>
              Action Required
            </Badge>
            <h3 className="text-3xl font-bold mb-6 leading-tight">
              {metrics.overdueItems > 0 ? `${metrics.overdueItems} items need attention` : "All clear, no overdue items"}
            </h3>
            <div className="space-y-4 mt-auto">
              {nextActions.slice(0,2).map((action: any) => (
                <div key={action.id} className="flex items-start gap-3 p-4 rounded-xl border border-muted bg-muted/20">
                  <AlertCircle className={`w-5 h-5 shrink-0 mt-0.5 ${action.urgency === 'high' ? 'text-bcn-red' : 'text-bcn-yellow'}`} />
                  <div>
                    <p className="text-sm font-semibold line-clamp-1">{action.title}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3" /> {new Date(action.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {nextActions.length === 0 && (
                <p className="text-sm text-muted-foreground">You have no pending actions. Great job!</p>
              )}
            </div>
            <Link href="/compliance" className="mt-6 inline-block text-sm font-semibold text-bcn-red hover:underline">
              View all actions →
            </Link>
          </Card>
        </motion.div>

        {/* Middle Card: Compliance Health */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="h-full p-8 rounded-[2rem] border-none shadow-sm flex flex-col justify-between bg-white overflow-hidden relative">
            <h4 className="font-semibold text-lg mb-6">Compliance Health</h4>
            <div className="flex items-center gap-4 mb-8">
              <div className={`w-12 h-12 rounded-full text-white flex items-center justify-center ${isHealthy ? 'bg-green-500' : 'bg-bcn-yellow'}`}>
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overall score</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">{metrics.healthScore}<span className="text-2xl text-muted-foreground/50">/100</span></span>
                </div>
              </div>
            </div>
            
            <div className="mt-auto pt-6 border-t z-10">
              <p className="text-sm text-muted-foreground mb-4">Risk trajectory</p>
              <div className="h-24 w-full flex items-end justify-between gap-2 opacity-30">
                {[40, 60, 45, 80, 55, 90, metrics.healthScore].map((h, i) => (
                  <div key={i} className={`w-full rounded-t-sm ${isHealthy ? 'bg-green-500' : 'bg-bcn-yellow'}`} style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>

            <div className={`absolute bottom-6 right-6 text-white p-4 rounded-2xl shadow-lg z-20 ${isHealthy ? 'bg-green-500' : 'bg-bcn-yellow'}`}>
              <p className="text-xs opacity-90 mb-1">Status</p>
              <p className="text-2xl font-bold">{isHealthy ? 'Safe' : 'Monitor'}</p>
            </div>
          </Card>
        </motion.div>

        {/* Right Card: Requirements Completed */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="h-full p-8 rounded-[2rem] border-none shadow-sm flex flex-col bg-bcn-black text-white">
            <div className="flex justify-between items-start mb-16">
              <div className="flex -space-x-4">
                <div className="w-12 h-12 rounded-full bg-zinc-800 border-2 border-bcn-black z-20 flex items-center justify-center"><ShieldCheck className="w-5 h-5 text-green-500" /></div>
                <div className="w-12 h-12 rounded-full bg-zinc-700 border-2 border-bcn-black z-10 flex items-center justify-center"><Activity className="w-5 h-5 text-bcn-yellow" /></div>
              </div>
              <div className="text-right">
                <p className="text-sm text-white/60 mb-1">Requirements</p>
                <div className="flex items-center justify-end gap-2">
                  <span className="text-green-500 flex items-center bg-green-500/10 px-2 py-0.5 rounded-full text-xs">
                    <ArrowUpRight className="w-3 h-3 mr-1" /> Active
                  </span>
                </div>
                <p className="text-4xl font-bold mt-2">{metrics.totalRequirements}</p>
              </div>
            </div>

            <div className="mt-auto text-center">
              <h3 className="text-3xl font-bold mb-4">{metrics.completedRequirements} Completed</h3>
              <p className="text-white/60 text-sm">
                Track all aspects of your regulatory obligations in one place.
              </p>
              <Link href="/compliance">
                <Button className="mt-6 w-full rounded-full bg-white text-black hover:bg-white/90 font-semibold h-10">
                  View Compliance List
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* 2. ControlSection Mapped to Risk/Activity */}
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center max-w-4xl leading-[1.1] mb-20 tracking-tighter mx-auto">
          Deep dive into your progress
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl mx-auto mb-32">
          {/* Left Card: Risk Distribution */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="h-full p-8 rounded-[2rem] border shadow-sm bg-white flex flex-col items-center text-center">
              <div className="w-full flex justify-center mb-8 relative h-40">
                <div className="absolute top-0 w-64 bg-bcn-gray rounded-2xl p-4 shadow-sm border border-black/5 transform -rotate-2">
                  <p className="text-sm font-semibold text-left mb-4">Risk Distribution</p>
                  <div className="flex items-center justify-between bg-bcn-red/10 p-4 rounded-xl">
                    <div>
                      <p className="text-3xl font-bold text-bcn-red">{riskDistribution?.critical || 0}</p>
                      <p className="text-xs font-semibold text-bcn-red">Critical</p>
                    </div>
                    <PieChart className="w-8 h-8 text-bcn-red opacity-50" />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <div className="flex-1 bg-orange-500/10 p-2 rounded-lg text-center">
                      <p className="text-sm font-bold text-orange-500">{riskDistribution?.high || 0}</p>
                    </div>
                    <div className="flex-1 bg-bcn-yellow/20 p-2 rounded-lg text-center">
                      <p className="text-sm font-bold text-bcn-yellow">{riskDistribution?.medium || 0}</p>
                    </div>
                    <div className="flex-1 bg-blue-500/10 p-2 rounded-lg text-center">
                      <p className="text-sm font-bold text-blue-500">{riskDistribution?.low || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-4 mt-6">Risk Profile</h3>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                See where your compliance risks are concentrated across your business.
              </p>
            </Card>
          </motion.div>

          {/* Right Card: Recent Activity / Alerts */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-full p-8 rounded-[2rem] border shadow-sm bg-white flex flex-col items-center text-center">
              <div className="w-full flex justify-center mb-8 relative h-40">
                <div className="absolute top-0 w-64 bg-bcn-gray rounded-2xl p-4 shadow-sm border border-black/5 transform rotate-2">
                  <div className="flex items-center gap-2 mb-4 text-bcn-red">
                    <Activity className="w-4 h-4" />
                    <p className="text-sm font-semibold">Monitoring Alerts</p>
                  </div>
                  
                  {(!isMonitoringLoading && monitoring && monitoring.items.filter((i:any) => i.changeDetected).length > 0) ? (
                    <div className="bg-white p-4 rounded-xl border border-black/5 text-left shadow-sm space-y-2">
                      <p className="text-sm text-muted-foreground">New detected changes</p>
                      <p className="text-3xl font-bold">{monitoring.items.filter((i:any) => i.changeDetected).length}</p>
                      <Link href="/notifications" className="block mt-4">
                        <Button className="w-full bg-bcn-yellow hover:bg-bcn-yellow/90 text-bcn-black rounded-full font-medium h-8 text-xs">
                          View Alerts
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="bg-white p-4 rounded-xl border border-black/5 text-left shadow-sm space-y-2">
                      <ShieldCheck className="w-8 h-8 text-green-500 mb-2" />
                      <p className="text-sm font-medium">No new alerts</p>
                      <p className="text-xs text-muted-foreground">Your monitoring is active.</p>
                    </div>
                  )}
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-4 mt-6">Monitoring Changes</h3>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                BCN's monitoring system keeps you ahead of regulatory changes and audits.
              </p>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* 3. AppPreview Timeline Mapped to Roadmap */}
      <div className="w-full max-w-3xl mx-auto mb-24">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 leading-tight text-center">
          Compliance Roadmap
        </h2>
        <div className="space-y-4">
          {dashboard.roadmap?.map((phase: any, i: number) => (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`flex flex-col p-6 bg-white rounded-3xl shadow-sm border-2 ${phase.status === 'current' ? 'border-bcn-red' : 'border-transparent'}`}
            >
              <div className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                    phase.status === 'completed' ? 'bg-green-500/10 text-green-500' : 
                    phase.status === 'current' ? 'bg-bcn-red text-white' : 
                    phase.status === 'attention' ? 'bg-bcn-yellow/20 text-bcn-yellow' : 
                    'bg-muted text-muted-foreground'
                  }`}>
                    {phase.status === 'completed' ? <ShieldCheck className="w-6 h-6" /> : 
                     phase.status === 'attention' ? <AlertCircle className="w-6 h-6" /> : 
                     <span className="font-bold">{i + 1}</span>}
                  </div>
                  <div>
                    <span className="text-xl font-medium">{phase.title}</span>
                    <p className="text-sm text-muted-foreground mt-1 capitalize">{phase.status.replace('_', ' ')} Phase</p>
                  </div>
                </div>
              </div>
              
              {/* Phase Items */}
              <div className="mt-6 ml-16 space-y-3">
                {phase.items.map((item: any) => (
                  <Link key={item.id} href={item.id.startsWith('comp_') ? `/compliance/${item.id}` : '#'}>
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl hover:bg-muted/60 transition-colors group">
                      <span className={`text-sm font-medium ${item.status === 'missing' || item.status === 'action_required' ? 'text-bcn-red' : 'text-foreground'}`}>
                        {item.requirement}
                      </span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
