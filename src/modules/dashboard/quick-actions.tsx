"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  Clock,
  DollarSign,
  Calendar,
  FileText,
  UserPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAbility } from "@/providers/ability-context";

export function QuickActions() {
  const router = useRouter();
  const ability = useAbility();

  const handleActionClick = (route: string) => {
    router.push(route);
  };

  const actions = [
    ...(ability.can("manage", "Employee")
      ? [
          {
            icon: UserPlus,
            title: "Invite Employee",
            description: "Onboard new team member",
            onClick: () =>
              handleActionClick("/dashboard/employees/invitations"),
          },
          {
            icon: Users,
            title: "Manage Employees",
            description: "View and manage staff",
            onClick: () => handleActionClick("/dashboard/employees"),
          },
        ]
      : []),

    ...(ability.can("manage", "Payroll") || ability.can("create", "Payroll")
      ? [
          {
            icon: DollarSign,
            title: "Process Payroll",
            description: "Generate monthly payroll",
            onClick: () => handleActionClick("/dashboard/payroll"),
          },
        ]
      : []),

    ...(ability.can("manage", "LeaveRequests") ||
    ability.can("update", "LeaveRequests")
      ? [
          {
            icon: Calendar,
            title: "Approve Leaves",
            description: "Review pending requests",
            onClick: () => handleActionClick("/dashboard/leaves/requests"),
          },
        ]
      : []),

    ...(ability.can("create", "Attendance") || ability.can("read", "Attendance")
      ? [
          {
            icon: Clock,
            title: "Mark Attendance",
            description: "Record daily attendance",
            onClick: () => handleActionClick("/dashboard/attendance"),
          },
        ]
      : []),

    ...(!ability.can("manage", "Employee") && !ability.can("update", "Employee")
      ? [
          {
            icon: FileText,
            title: "Request Leave",
            description: "Apply for time off",
            onClick: () => handleActionClick("/dashboard/leaves"),
          },
          {
            icon: Clock,
            title: "My Attendance",
            description: "View your attendance",
            onClick: () => handleActionClick("/dashboard/attendance"),
          },
          {
            icon: DollarSign,
            title: "My Payslips",
            description: "View salary details",
            onClick: () => handleActionClick("/dashboard/payroll/payslips"),
          },
        ]
      : []),
  ];

  // Show only first 4 actions to maintain layout
  const displayedActions = actions.slice(0, 4);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          {ability.can("manage", "Employee")
            ? "HR management tasks"
            : ability.can("update", "Employee")
              ? "Team management tasks"
              : "Your personal tasks"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {displayedActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <div
                key={index}
                onClick={action.onClick}
                className="hover:bg-muted/50 flex cursor-pointer items-center space-x-3 rounded-lg border p-3 transition-colors"
              >
                <IconComponent className="text-primary h-8 w-8" />
                <div>
                  <p className="font-medium">{action.title}</p>
                  <p className="text-muted-foreground text-sm">
                    {action.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        {actions.length === 0 && (
          <div className="text-muted-foreground py-8 text-center">
            <p>No quick actions available</p>
            <p className="text-sm">Contact your administrator for access</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
