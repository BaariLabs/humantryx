import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { NotificationService } from "../services/notification.service";

export const notificationRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(50).optional(),
          unreadOnly: z.boolean().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      return NotificationService.getForUser(ctx.session, {
        limit: input?.limit,
        unreadOnly: input?.unreadOnly,
      });
    }),

  unreadCount: protectedProcedure.query(async ({ ctx }) => {
    return NotificationService.getUnreadCount(ctx.session);
  }),

  markAsRead: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      return NotificationService.markAsRead(input.id, ctx.session);
    }),

  markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    return NotificationService.markAllAsRead(ctx.session);
  }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      return NotificationService.delete(input.id, ctx.session);
    }),
});
