"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarOff, CheckCircle, Clock } from "lucide-react";
import { api } from "@/trpc/react";
import { format } from "date-fns";

const LEAVE_TYPE_LABELS: Record<string, string> = {
  annual: "Annual",
  sick: "Sick",
  casual: "Casual",
  maternity: "Maternity",
  paternity: "Paternity",
  emergency: "Emergency",
};

const LEAVE_TYPE_COLORS: Record<string, string> = {
  annual: "bg-blue-100 text-blue-700",
  sick: "bg-red-100 text-red-700",
  casual: "bg-amber-100 text-amber-700",
  maternity: "bg-pink-100 text-pink-700",
  paternity: "bg-teal-100 text-teal-700",
  emergency: "bg-orange-100 text-orange-700",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function TeamAvailability() {
  const availabilityQuery = api.leave.getTeamAvailability.useQuery();

  if (availabilityQuery.isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarOff className="h-5 w-5" />
            Team Availability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="bg-muted h-12 animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (availabilityQuery.isError) return null;

  const { onLeaveToday, upcomingLeaves } = availabilityQuery.data ?? {
    onLeaveToday: [],
    upcomingLeaves: [],
  };

  const hasNoLeaves = onLeaveToday.length === 0 && upcomingLeaves.length === 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <CalendarOff className="h-5 w-5" />
          Team Availability
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasNoLeaves ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-sm font-medium text-green-700">
              Everyone&apos;s in today!
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              No upcoming leaves in the next 7 days
            </p>
          </div>
        ) : (
          <>
            {onLeaveToday.length > 0 && (
              <div>
                <h4 className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
                  Out Today ({onLeaveToday.length})
                </h4>
                <div className="space-y-2">
                  {onLeaveToday.map((leave) => (
                    <div
                      key={leave.id}
                      className="flex items-center gap-3 rounded-lg border p-2.5"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={leave.employee?.user?.image ?? undefined}
                        />
                        <AvatarFallback className="text-xs">
                          {getInitials(leave.employee?.user?.name ?? "Unknown")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {leave.employee?.user?.name ?? "Unknown"}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {format(new Date(leave.startDate), "MMM d")} —{" "}
                          {format(new Date(leave.endDate), "MMM d")}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${LEAVE_TYPE_COLORS[leave.leaveType] ?? ""}`}
                      >
                        {LEAVE_TYPE_LABELS[leave.leaveType] ?? leave.leaveType}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {upcomingLeaves.length > 0 && (
              <div>
                <h4 className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
                  <Clock className="mr-1 inline h-3 w-3" />
                  Upcoming (Next 7 Days)
                </h4>
                <div className="space-y-2">
                  {upcomingLeaves.map((leave) => (
                    <div
                      key={leave.id}
                      className="flex items-center gap-3 rounded-lg border border-dashed p-2.5"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={leave.employee?.user?.image ?? undefined}
                        />
                        <AvatarFallback className="text-xs">
                          {getInitials(leave.employee?.user?.name ?? "Unknown")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {leave.employee?.user?.name ?? "Unknown"}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {format(new Date(leave.startDate), "MMM d")} —{" "}
                          {format(new Date(leave.endDate), "MMM d")} (
                          {leave.totalDays}d)
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${LEAVE_TYPE_COLORS[leave.leaveType] ?? ""}`}
                      >
                        {LEAVE_TYPE_LABELS[leave.leaveType] ?? leave.leaveType}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
