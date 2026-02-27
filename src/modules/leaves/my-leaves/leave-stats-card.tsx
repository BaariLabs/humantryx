"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react";
import { Clock } from "lucide-react";

export const MyLeaveStatsCard = ({ employeeId }: { employeeId?: string }) => {
  const leaveQuery = api.leave.list.useQuery({
    page: 1,
    limit: 100,
    employeeId,
  });

  const requests = leaveQuery.data?.data ?? [];
  const totalRequests = requests.length;
  const approved = requests.filter((r) => r.status === "approved").length;
  const pending = requests.filter((r) => r.status === "pending").length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Quick Stats
        </CardTitle>
      </CardHeader>
      <CardContent>
        {leaveQuery.isLoading ? (
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <Skeleton className="h-8 w-10" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {totalRequests}
              </div>
              <div className="text-muted-foreground text-sm">
                Total Requests
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {approved}
              </div>
              <div className="text-muted-foreground text-sm">Approved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {pending}
              </div>
              <div className="text-muted-foreground text-sm">Pending</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
