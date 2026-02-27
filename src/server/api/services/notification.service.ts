import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "@/server/db";
import { notifications, type Notification } from "@/server/db/notifications";
import { employees } from "@/server/db/schema";

type Session = {
  user: { id: string };
  session: { activeOrganizationId?: string | null | undefined };
};

type CreateNotificationInput = {
  userId: string;
  type: Notification["type"];
  title: string;
  message: string;
  linkUrl?: string;
  metadata?: string;
};

export class NotificationService {
  static async create(input: CreateNotificationInput) {
    const [notification] = await db
      .insert(notifications)
      .values(input)
      .returning();
    return notification;
  }

  static async createForMany(inputs: CreateNotificationInput[]) {
    if (inputs.length === 0) return [];
    const result = await db.insert(notifications).values(inputs).returning();
    return result;
  }

  static async getForUser(
    session: Session,
    options: { limit?: number; unreadOnly?: boolean } = {},
  ) {
    const { limit = 20, unreadOnly = false } = options;

    const whereConditions = [
      eq(notifications.userId, session.user.id),
      isNull(notifications.deletedAt),
    ];

    if (unreadOnly) {
      whereConditions.push(eq(notifications.isRead, false));
    }

    return db.query.notifications.findMany({
      where: and(...whereConditions),
      orderBy: [desc(notifications.createdAt)],
      limit,
    });
  }

  static async getUnreadCount(session: Session) {
    const unread = await db.query.notifications.findMany({
      where: and(
        eq(notifications.userId, session.user.id),
        eq(notifications.isRead, false),
        isNull(notifications.deletedAt),
      ),
      columns: { id: true },
    });
    return unread.length;
  }

  static async markAsRead(notificationId: string, session: Session) {
    const [updated] = await db
      .update(notifications)
      .set({ isRead: true })
      .where(
        and(
          eq(notifications.id, notificationId),
          eq(notifications.userId, session.user.id),
        ),
      )
      .returning();
    return updated;
  }

  static async markAllAsRead(session: Session) {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(
        and(
          eq(notifications.userId, session.user.id),
          eq(notifications.isRead, false),
        ),
      );
  }

  static async delete(notificationId: string, session: Session) {
    const [deleted] = await db
      .update(notifications)
      .set({ deletedAt: new Date() })
      .where(
        and(
          eq(notifications.id, notificationId),
          eq(notifications.userId, session.user.id),
        ),
      )
      .returning();
    return deleted;
  }

  // --- Event-specific notification creators ---

  static async notifyLeaveRequested({
    employeeId,
    employeeName,
    leaveType,
    totalDays,
    organizationId,
  }: {
    employeeId: string;
    employeeName: string;
    leaveType: string;
    totalDays: number;
    organizationId: string;
  }) {
    const hrEmployees = await db.query.employees.findMany({
      where: and(
        eq(employees.organizationId, organizationId),
        eq(employees.status, "active"),
      ),
      with: { user: true },
    });

    const hrUsers = hrEmployees.filter(
      (emp) =>
        ["hr", "founder"].includes(emp.designation) &&
        emp.userId &&
        emp.id !== employeeId,
    );

    if (hrUsers.length === 0) return;

    await this.createForMany(
      hrUsers.map((hr) => ({
        userId: hr.userId!,
        type: "leave_requested" as const,
        title: "New Leave Request",
        message: `${employeeName} requested ${totalDays} day(s) of ${leaveType} leave`,
        linkUrl: "/leaves",
      })),
    );
  }

  static async notifyLeaveStatusUpdated({
    employeeUserId,
    status,
    leaveType,
    approverName,
    rejectionReason,
  }: {
    employeeUserId: string;
    status: "approved" | "rejected";
    leaveType: string;
    approverName: string;
    rejectionReason?: string | null;
  }) {
    const type =
      status === "approved"
        ? ("leave_approved" as const)
        : ("leave_rejected" as const);
    const statusText = status === "approved" ? "approved" : "rejected";
    const reasonText =
      rejectionReason && status === "rejected"
        ? `. Reason: ${rejectionReason}`
        : "";

    await this.create({
      userId: employeeUserId,
      type,
      title: `Leave ${statusText.charAt(0).toUpperCase() + statusText.slice(1)}`,
      message: `Your ${leaveType} leave request was ${statusText} by ${approverName}${reasonText}`,
      linkUrl: "/leaves",
    });
  }

  static async notifyLeaveBalanceAdjusted({
    employeeUserId,
    leaveType,
    adjustment,
  }: {
    employeeUserId: string;
    leaveType: string;
    adjustment: number;
  }) {
    const direction = adjustment > 0 ? "increased" : "decreased";

    await this.create({
      userId: employeeUserId,
      type: "leave_balance_adjusted",
      title: "Leave Balance Updated",
      message: `Your ${leaveType} leave balance was ${direction} by ${Math.abs(adjustment)} day(s)`,
      linkUrl: "/leaves",
    });
  }

  static async notifyPayrollGenerated({
    employeeUserId,
    payrollMonth,
    netPay,
  }: {
    employeeUserId: string;
    payrollMonth: string;
    netPay: string;
  }) {
    await this.create({
      userId: employeeUserId,
      type: "payroll_generated",
      title: "Payslip Generated",
      message: `Your payslip for ${payrollMonth} has been generated. Net pay: ₹${Number.parseFloat(netPay).toLocaleString()}`,
      linkUrl: "/payroll",
    });
  }

  static async notifyPaymentStatusUpdated({
    employeeUserId,
    payrollMonth,
    status,
  }: {
    employeeUserId: string;
    payrollMonth: string;
    status: string;
  }) {
    await this.create({
      userId: employeeUserId,
      type: "payment_status_updated",
      title: "Payment Status Updated",
      message: `Payment for ${payrollMonth} has been marked as ${status}`,
      linkUrl: "/payroll",
    });
  }
}
