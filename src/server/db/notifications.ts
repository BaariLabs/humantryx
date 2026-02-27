import { pgTable, text, uuid, boolean, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { timestamps } from "./columns";
import { users } from "./users";

export const notificationTypeEnum = pgEnum("notification_type", [
  "leave_requested",
  "leave_approved",
  "leave_rejected",
  "leave_balance_adjusted",
  "payroll_generated",
  "payment_status_updated",
  "general",
]);

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: notificationTypeEnum("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  linkUrl: text("link_url"),
  metadata: text("metadata"),
  ...timestamps,
});

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export type Notification = typeof notifications.$inferSelect;
