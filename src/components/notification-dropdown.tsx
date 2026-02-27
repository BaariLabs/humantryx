"use client";

import { Bell, CheckCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/trpc/react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const NOTIFICATION_ICONS: Record<string, string> = {
  leave_requested: "📋",
  leave_approved: "✅",
  leave_rejected: "❌",
  leave_balance_adjusted: "📊",
  payroll_generated: "💰",
  payment_status_updated: "💳",
  general: "🔔",
};

export function NotificationDropdown() {
  const router = useRouter();
  const utils = api.useUtils();

  const notificationsQuery = api.notification.list.useQuery(
    { limit: 20 },
    { refetchInterval: 30000 },
  );

  const unreadCountQuery = api.notification.unreadCount.useQuery(undefined, {
    refetchInterval: 30000,
  });

  const markAsReadMutation = api.notification.markAsRead.useMutation({
    onSuccess: () => {
      void utils.notification.list.invalidate();
      void utils.notification.unreadCount.invalidate();
    },
  });

  const markAllAsReadMutation = api.notification.markAllAsRead.useMutation({
    onSuccess: () => {
      void utils.notification.list.invalidate();
      void utils.notification.unreadCount.invalidate();
    },
  });

  const unreadCount = unreadCountQuery.data ?? 0;
  const notificationsList = notificationsQuery.data ?? [];

  const handleNotificationClick = (notification: {
    id: string;
    isRead: boolean;
    linkUrl: string | null;
  }) => {
    if (!notification.isRead) {
      markAsReadMutation.mutate({ id: notification.id });
    }
    if (notification.linkUrl) {
      router.push(notification.linkUrl);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full p-0 text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96">
        <div className="flex items-center justify-between px-2">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground h-auto px-2 py-1 text-xs"
              onClick={(e) => {
                e.preventDefault();
                markAllAsReadMutation.mutate();
              }}
              disabled={markAllAsReadMutation.isPending}
            >
              {markAllAsReadMutation.isPending ? (
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              ) : (
                <CheckCheck className="mr-1 h-3 w-3" />
              )}
              Mark all read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        <ScrollArea className="max-h-80">
          {notificationsQuery.isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
            </div>
          ) : notificationsList.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center text-sm">
              No notifications
            </div>
          ) : (
            notificationsList.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  "cursor-pointer px-3 py-3",
                  !notification.isRead && "bg-primary/5",
                )}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex w-full gap-3">
                  <span className="mt-0.5 text-base">
                    {NOTIFICATION_ICONS[notification.type] ?? "🔔"}
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={cn(
                          "text-sm",
                          !notification.isRead
                            ? "font-semibold"
                            : "font-medium",
                        )}
                      >
                        {notification.title}
                      </p>
                      {!notification.isRead && (
                        <div className="bg-primary mt-1.5 h-2 w-2 shrink-0 rounded-full" />
                      )}
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {notification.message}
                    </p>
                    <p className="text-muted-foreground/70 text-[10px]">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
