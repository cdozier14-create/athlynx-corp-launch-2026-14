import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ==================== VIP CODES ====================
  vip: router({
    validate: publicProcedure
      .input(z.object({ code: z.string() }))
      .mutation(async ({ input }) => {
        const vipCode = await db.validateVipCode(input.code);
        if (!vipCode) {
          return { valid: false, error: "Invalid or expired VIP code" };
        }
        return { valid: true, code: vipCode };
      }),
    
    redeem: protectedProcedure
      .input(z.object({ code: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const vipCode = await db.validateVipCode(input.code);
        if (!vipCode) {
          return { success: false, error: "Invalid or expired VIP code" };
        }
        await db.useVipCode(input.code);
        return { success: true };
      }),
  }),

  // ==================== WAITLIST ====================
  waitlist: router({
    join: publicProcedure
      .input(z.object({
        fullName: z.string().min(2),
        email: z.string().email(),
        phone: z.string().optional(),
        role: z.enum(["athlete", "parent", "coach", "brand"]),
        sport: z.string().optional(),
        referralCode: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.addToWaitlist(input);
      }),
    
    count: publicProcedure.query(async () => {
      return db.getWaitlistCount();
    }),
  }),

  // ==================== SOCIAL FEED ====================
  feed: router({
    list: publicProcedure
      .input(z.object({ limit: z.number().default(20), offset: z.number().default(0) }).optional())
      .query(async ({ input }) => {
        return db.getFeed(input?.limit || 20, input?.offset || 0);
      }),
    
    userPosts: publicProcedure
      .input(z.object({ userId: z.number(), limit: z.number().default(20), offset: z.number().default(0) }))
      .query(async ({ input }) => {
        return db.getUserPosts(input.userId, input.limit, input.offset);
      }),
    
    create: protectedProcedure
      .input(z.object({
        content: z.string().optional(),
        mediaUrls: z.array(z.string()).optional(),
        postType: z.enum(["text", "image", "video", "highlight", "deal", "announcement"]).default("text"),
        visibility: z.enum(["public", "followers", "private"]).default("public"),
      }))
      .mutation(async ({ input, ctx }) => {
        const postId = await db.createPost({
          userId: ctx.user.id,
          content: input.content,
          mediaUrls: input.mediaUrls,
          postType: input.postType,
          visibility: input.visibility,
        });
        return { success: true, postId };
      }),
    
    like: protectedProcedure
      .input(z.object({ postId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        await db.likePost(ctx.user.id, input.postId);
        return { success: true };
      }),
    
    unlike: protectedProcedure
      .input(z.object({ postId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        await db.unlikePost(ctx.user.id, input.postId);
        return { success: true };
      }),
  }),

  // ==================== ATHLETE PROFILE ====================
  athlete: router({
    profile: publicProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input }) => {
        return db.getAthleteProfile(input.userId);
      }),
    
    myProfile: protectedProcedure.query(async ({ ctx }) => {
      return db.getAthleteProfile(ctx.user.id);
    }),
    
    updateProfile: protectedProcedure
      .input(z.object({
        sport: z.string().optional(),
        position: z.string().optional(),
        school: z.string().optional(),
        graduationYear: z.number().optional(),
        gpa: z.string().optional(),
        height: z.string().optional(),
        weight: z.string().optional(),
        stats: z.any().optional(),
        highlights: z.array(z.string()).optional(),
        socialLinks: z.any().optional(),
        transferStatus: z.enum(["not_in_portal", "exploring", "in_portal", "committed"]).optional(),
        nilStatus: z.enum(["not_available", "available", "active_deals"]).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.upsertAthleteProfile({
          userId: ctx.user.id,
          ...input,
        });
        return { success: true };
      }),
  }),

  // ==================== FOLLOWS ====================
  social: router({
    follow: protectedProcedure
      .input(z.object({ userId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        await db.followUser(ctx.user.id, input.userId);
        return { success: true };
      }),
    
    unfollow: protectedProcedure
      .input(z.object({ userId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        await db.unfollowUser(ctx.user.id, input.userId);
        return { success: true };
      }),
    
    followers: publicProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input }) => {
        return db.getFollowers(input.userId);
      }),
    
    following: publicProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input }) => {
        return db.getFollowing(input.userId);
      }),
  }),

  // ==================== MESSAGES ====================
  messages: router({
    conversations: protectedProcedure.query(async ({ ctx }) => {
      return db.getConversations(ctx.user.id);
    }),
    
    list: protectedProcedure
      .input(z.object({ conversationId: z.number(), limit: z.number().default(50), offset: z.number().default(0) }))
      .query(async ({ input }) => {
        return db.getMessages(input.conversationId, input.limit, input.offset);
      }),
    
    send: protectedProcedure
      .input(z.object({
        conversationId: z.number(),
        content: z.string().optional(),
        mediaUrl: z.string().optional(),
        messageType: z.enum(["text", "image", "video", "file", "system"]).default("text"),
      }))
      .mutation(async ({ input, ctx }) => {
        const messageId = await db.sendMessage({
          conversationId: input.conversationId,
          senderId: ctx.user.id,
          content: input.content,
          mediaUrl: input.mediaUrl,
          messageType: input.messageType,
        });
        return { success: true, messageId };
      }),
  }),

  // ==================== NOTIFICATIONS ====================
  notifications: router({
    list: protectedProcedure
      .input(z.object({ limit: z.number().default(20) }).optional())
      .query(async ({ input, ctx }) => {
        return db.getUserNotifications(ctx.user.id, input?.limit || 20);
      }),
    
    markRead: protectedProcedure
      .input(z.object({ notificationId: z.number() }))
      .mutation(async ({ input }) => {
        await db.markNotificationRead(input.notificationId);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
