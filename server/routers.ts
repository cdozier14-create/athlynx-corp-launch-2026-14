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

  // ==================== TRANSFER PORTAL ====================
  transferPortal: router({
    // Get players with filters
    players: publicProcedure
      .input(z.object({
        sport: z.string().optional(),
        position: z.string().optional(),
        division: z.string().optional(),
        conference: z.string().optional(),
        status: z.string().optional(),
        minRating: z.number().optional(),
        maxRating: z.number().optional(),
        minNIL: z.number().optional(),
        maxNIL: z.number().optional(),
        search: z.string().optional(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      }).optional())
      .query(async ({ input }) => {
        return db.getTransferPortalPlayers(input || {});
      }),
    
    // Get single player
    player: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getTransferPortalPlayer(input.id);
      }),
    
    // Get portal stats
    stats: publicProcedure.query(async () => {
      return db.getTransferPortalStats();
    }),
  }),

  // ==================== CRM & ANALYTICS (FAILPROOF) ====================
  crm: router({
    // Track signup with full analytics
    trackSignup: publicProcedure
      .input(z.object({
        fullName: z.string(),
        email: z.string().email(),
        phone: z.string().optional(),
        role: z.string().optional(),
        sport: z.string().optional(),
        referralSource: z.string().optional(),
        utmSource: z.string().optional(),
        utmMedium: z.string().optional(),
        utmCampaign: z.string().optional(),
        signupType: z.enum(["waitlist", "vip", "direct", "referral"]).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Get IP from request headers
        const ipAddress = ctx.req.headers["x-forwarded-for"]?.toString().split(",")[0] || 
                          ctx.req.headers["x-real-ip"]?.toString() || 
                          ctx.req.socket?.remoteAddress || "unknown";
        const userAgent = ctx.req.headers["user-agent"] || "";
        
        return db.trackSignup({
          ...input,
          ipAddress,
          userAgent,
        });
      }),
    
    // Get real-time stats for dashboard
    stats: publicProcedure.query(async () => {
      return db.getCRMStats();
    }),
    
    // Get signup list with pagination
    signups: publicProcedure
      .input(z.object({ 
        limit: z.number().default(100), 
        offset: z.number().default(0),
        accessCode: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        // Validate partner access if code provided
        if (input?.accessCode) {
          const partner = await db.validatePartnerAccess(input.accessCode);
          if (!partner) {
            return { signups: [], total: 0, error: "Invalid access code" };
          }
        }
        return db.getSignupAnalytics(input?.limit || 100, input?.offset || 0);
      }),
    
    // Export to CSV for Excel/Copilot
    exportCSV: publicProcedure
      .input(z.object({ accessCode: z.string() }))
      .query(async ({ input }) => {
        const partner = await db.validatePartnerAccess(input.accessCode);
        if (!partner) {
          return { csv: "", error: "Invalid access code" };
        }
        const csv = await db.exportSignupsToCSV();
        return { csv };
      }),
    
    // Track customer event
    trackEvent: publicProcedure
      .input(z.object({
        userId: z.number().optional(),
        waitlistId: z.number().optional(),
        eventType: z.string(),
        eventName: z.string(),
        eventData: z.any().optional(),
        pageUrl: z.string().optional(),
        referrer: z.string().optional(),
        sessionId: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const ipAddress = ctx.req.headers["x-forwarded-for"]?.toString().split(",")[0] || "unknown";
        const userAgent = ctx.req.headers["user-agent"] || "";
        
        return db.trackCustomerEvent({
          ...input,
          ipAddress,
          userAgent,
        });
      }),
    
    // Get milestones
    milestones: publicProcedure.query(async () => {
      return db.getMilestones();
    }),
    
    // Validate partner access
    validateAccess: publicProcedure
      .input(z.object({ accessCode: z.string() }))
      .query(async ({ input }) => {
        const partner = await db.validatePartnerAccess(input.accessCode);
        return { valid: !!partner, partner };
      }),
  }),

  // ==================== COMMUNITY VOTING & FEEDBACK ====================
  community: router({
    // Submit a vote for Site A or Site B
    vote: publicProcedure
      .input(z.object({
        votedFor: z.enum(["site_a", "site_b"]),
        email: z.string().email().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const ipAddress = ctx.req.headers["x-forwarded-for"]?.toString().split(",")[0] || ctx.req.socket.remoteAddress || "";
        const userAgent = ctx.req.headers["user-agent"] || "";
        
        await db.submitSiteVote({
          siteChoice: input.votedFor,
          visitorId: input.email,
          ipAddress,
          userAgent,
        });
        return { success: true };
      }),
    
    // Get vote counts
    voteStats: publicProcedure.query(async () => {
      return db.getVoteStats();
    }),
    
    // Submit community feedback
    submitFeedback: publicProcedure
      .input(z.object({
        email: z.string().email().optional(),
        name: z.string().optional(),
        whatTheyLove: z.string().optional(),
        whatCouldBeBetter: z.string().optional(),
        siteVersion: z.enum(["site_a", "site_b", "both", "general"]).optional(),
        overallRating: z.number().min(1).max(5).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const ipAddress = ctx.req.headers["x-forwarded-for"]?.toString().split(",")[0] || ctx.req.socket.remoteAddress || "";
        const userAgent = ctx.req.headers["user-agent"] || "";
        const pageUrl = ctx.req.headers.referer || "";
        
        await db.submitCommunityFeedback({
          feedbackType: input.siteVersion || 'general',
          message: `Love: ${input.whatTheyLove || 'N/A'} | Better: ${input.whatCouldBeBetter || 'N/A'} | Rating: ${input.overallRating || 'N/A'}`,
          email: input.email,
          name: input.name,
          visitorId: userAgent,
        });
        return { success: true };
      }),
    
    // Get all feedback (for admin/CRM)
    feedback: publicProcedure
      .input(z.object({
        accessCode: z.string(),
        limit: z.number().default(100),
        offset: z.number().default(0),
      }))
      .query(async ({ input }) => {
        const partner = await db.validatePartnerAccess(input.accessCode);
        if (!partner) {
          return { feedback: [], total: 0, error: "Invalid access code" };
        }
        return db.getCommunityFeedback(input.limit);
      }),
  }),
});

export type AppRouter = typeof appRouter;

