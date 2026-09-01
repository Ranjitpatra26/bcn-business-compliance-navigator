/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useActiveBusiness } from "@/components/providers/BusinessProvider";
import { 
  useNotifications, 
  useMarkNotificationRead, 
  useMarkAllNotificationsRead 
} from "@/hooks/useNotifications";
import { NotificationFilters } from "@/types/notification";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";
import { formatDistanceToNow } from "date-fns";
import { 
  Bell, 
  Check, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  ShieldCheck, 
  Info,
  Clock,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
  const { activeBusinessId } = useActiveBusiness();
  const [filters, setFilters] = useState<NotificationFilters>({ status: "all", type: "all" });

  const { data: notifications = [], isLoading, isError, refetch } = useNotifications(activeBusinessId, filters);
  const { mutate: markAsRead } = useMarkNotificationRead();
  const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllNotificationsRead();

  const getIcon = (type: string, priority: string) => {
    switch (type) {
      case 'compliance': return <ShieldCheck className={cn("w-5 h-5", priority === 'critical' ? 'text-bcn-red' : 'text-blue-500')} />;
      case 'document': return <FileText className="w-5 h-5 text-green-500" />;
      case 'deadline': return <Clock className={cn("w-5 h-5", priority === 'critical' || priority === 'high' ? 'text-bcn-yellow' : 'text-orange-500')} />;
      case 'system':
      default: return <Info className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getLink = (notif: any) => {
    if (notif.relatedRequirementId) return `/compliance/${notif.relatedRequirementId}`;
    if (notif.relatedDocumentId) return `/documents/${notif.relatedDocumentId}`;
    if (notif.businessId) return `/business`;
    return null;
  };

  if (!activeBusinessId) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[70vh]">
        <EmptyState 
          title="Select a Business" 
          description="Please select an active business to view notifications." 
          icon={<Bell className="w-10 h-10 text-muted-foreground" />}
        />
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground mt-1">Stay updated on compliance changes and deadlines.</p>
        </div>
        
        {unreadCount > 0 && (
          <Button 
            variant="outline" 
            onClick={() => markAllAsRead(activeBusinessId)}
            disabled={isMarkingAll}
            className="shrink-0"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Button 
          variant={filters.status === 'all' && filters.type === 'all' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => setFilters({ status: 'all', type: 'all' })}
          className={filters.status === 'all' && filters.type === 'all' ? "bg-bcn-red text-white hover:bg-bcn-red/90" : ""}
        >
          All
        </Button>
        <Button 
          variant={filters.status === 'unread' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => setFilters({ ...filters, status: 'unread' })}
          className={filters.status === 'unread' ? "bg-bcn-red text-white hover:bg-bcn-red/90" : ""}
        >
          Unread
        </Button>
        <Button 
          variant={filters.type === 'compliance' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => setFilters({ ...filters, type: 'compliance' })}
          className={filters.type === 'compliance' ? "bg-bcn-red text-white hover:bg-bcn-red/90" : ""}
        >
          Compliance
        </Button>
        <Button 
          variant={filters.type === 'deadline' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => setFilters({ ...filters, type: 'deadline' })}
          className={filters.type === 'deadline' ? "bg-bcn-red text-white hover:bg-bcn-red/90" : ""}
        >
          Deadlines
        </Button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-24 bg-muted/20 animate-pulse rounded-2xl border border-muted/10"></div>
          ))
        ) : isError ? (
          <EmptyState
            title="Failed to load notifications"
            description="We couldn't retrieve your notifications at this time."
            action={{ label: "Retry", onClick: () => refetch() }}
            icon={<AlertTriangle className="w-10 h-10 text-bcn-red" />}
          />
        ) : notifications.length === 0 ? (
          <EmptyState
            title="You're all caught up"
            description="There are no notifications matching your filters."
            icon={<CheckCircle2 className="w-12 h-12 text-green-500/80" />}
          />
        ) : (
          notifications.map((notif) => {
            const link = getLink(notif);
            
            return (
              <Card key={notif.id} className={cn("overflow-hidden rounded-2xl transition-colors", notif.isRead ? "bg-card border-muted/40" : "bg-card border-bcn-red/20 shadow-sm")}>
                <CardContent className="p-5 flex gap-4">
                  <div className="shrink-0 mt-1">
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", notif.isRead ? "bg-muted text-muted-foreground" : "bg-bcn-red/10")}>
                      {getIcon(notif.type, notif.priority)}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <h4 className={cn("font-semibold text-base", notif.isRead ? "text-muted-foreground" : "text-foreground")}>
                        {notif.title}
                      </h4>
                      <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                        {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    
                    <p className={cn("text-sm mb-3", notif.isRead ? "text-muted-foreground" : "text-foreground/90")}>
                      {notif.message}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-3">
                      {link && (
                        <Link href={link} className="inline-flex items-center text-xs font-medium text-bcn-red hover:text-bcn-red/80">
                          View details <ArrowRight className="w-3 h-3 ml-1" />
                        </Link>
                      )}
                      
                      {!notif.isRead && (
                        <button 
                          onClick={() => markAsRead(notif.id)}
                          className="inline-flex items-center text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Check className="w-3 h-3 ml-1 mr-1" /> Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {!notif.isRead && (
                    <div className="shrink-0 flex items-center">
                      <div className="w-2 h-2 rounded-full bg-bcn-red"></div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
