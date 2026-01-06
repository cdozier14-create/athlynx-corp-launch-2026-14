import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { invokeLLM } from "./_core/llm";
import Stripe from "stripe";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-12-15.clover",
});

// Pricing configuration
const PLANS = {
  free: { price: 0, credits: 0, features: ["basic_feed", "limited_messages"] },
  rookie: { price: 999, credits: 100, features: ["full_feed", "unlimited_messages", "basic_analytics"] },
  starter: { price: 1999, credits: 250, features: ["all_rookie", "ai_trainer", "highlight_tapes"] },
  allstar: { price: 4999, credits: 500, features: ["all_starter", "ai_recruiter", "content_suite", "marketplace"] },
  elite: { price: 9999, credits: 1000, features: ["all_allstar", "ai_team", "priority_support", "verified_badge"] },
  legend: { price: 24999, credits: 5000, features: ["all_elite", "dedicated_manager", "custom_branding", "white_glove"] },
};

const SERVICES = {
  music: { price: 499, name: "ATHLYNX Music" },
  media: { price: 799, name: "Media Suite" },
  ai_trainer: { price: 999, name: "AI Trainer" },
  ai_recruiter: { price: 1499, name: "AI Recruiter" },
  content_suite: { price: 1999, name: "Content Creation Suite" },
  messenger_pro: { price: 299, name: "Messenger Pro" },
  marketplace: { price: 999, name: "Marketplace Access" },
};

const CREDIT_PACKS = {
  small: { amount: 100, price: 999 },
  medium: { amount: 300, price: 2499 },
  large: { amount: 750, price: 4999 },
  mega: { amount: 2000, price: 9999 },
};

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
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

  // ==================== SUBSCRIPTIONS ====================
  subscription: router({
    current: protectedProcedure.query(async ({ ctx }) => {
      const sub = await db.getUserSubscription(ctx.user.id);
      return sub || { plan: "free", status: "active" };
    }),

    plans: publicProcedure.query(() => PLANS),

    subscribe: protectedProcedure
      .input(z.object({ plan: z.enum(["rookie", "starter", "allstar", "elite", "legend"]) }))
      .mutation(async ({ input, ctx }) => {
        const planConfig = PLANS[input.plan];
        
        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
          mode: "subscription",
          payment_method_types: ["card"],
          line_items: [{
            price_data: {
              currency: "usd",
              product_data: {
                name: `ATHLYNX ${input.plan.charAt(0).toUpperCase() + input.plan.slice(1)} Plan`,
                description: `Monthly subscription with ${planConfig.credits} credits`,
              },
              unit_amount: planConfig.price,
              recurring: { interval: "month" },
            },
            quantity: 1,
          }],
          success_url: `${process.env.VITE_FRONTEND_FORGE_API_URL || ""}/portal?subscription=success`,
          cancel_url: `${process.env.VITE_FRONTEND_FORGE_API_URL || ""}/pricing?cancelled=true`,
          metadata: {
            userId: ctx.user.id.toString(),
            plan: input.plan,
          },
        });

        return { checkoutUrl: session.url };
      }),

    cancel: protectedProcedure.mutation(async ({ ctx }) => {
      const sub = await db.getUserSubscription(ctx.user.id);
      if (sub?.stripeSubscriptionId) {
        await stripe.subscriptions.cancel(sub.stripeSubscriptionId);
      }
      await db.updateSubscription(ctx.user.id, { status: "cancelled", cancelledAt: new Date() });
      return { success: true };
    }),
  }),

  // ==================== À LA CARTE SERVICES ====================
  services: router({
    list: publicProcedure.query(() => SERVICES),

    myServices: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserServices(ctx.user.id);
    }),

    purchase: protectedProcedure
      .input(z.object({ service: z.enum(["music", "media", "ai_trainer", "ai_recruiter", "content_suite", "messenger_pro", "marketplace"]) }))
      .mutation(async ({ input, ctx }) => {
        const serviceConfig = SERVICES[input.service];
        
        const session = await stripe.checkout.sessions.create({
          mode: "subscription",
          payment_method_types: ["card"],
          line_items: [{
            price_data: {
              currency: "usd",
              product_data: { name: serviceConfig.name },
              unit_amount: serviceConfig.price,
              recurring: { interval: "month" },
            },
            quantity: 1,
          }],
          success_url: `${process.env.VITE_FRONTEND_FORGE_API_URL || ""}/portal?service=success`,
          cancel_url: `${process.env.VITE_FRONTEND_FORGE_API_URL || ""}/pricing?cancelled=true`,
          metadata: {
            userId: ctx.user.id.toString(),
            service: input.service,
          },
        });

        return { checkoutUrl: session.url };
      }),

    cancel: protectedProcedure
      .input(z.object({ service: z.string() }))
      .mutation(async ({ input, ctx }) => {
        await db.cancelUserService(ctx.user.id, input.service);
        return { success: true };
      }),
  }),

  // ==================== CREDITS ====================
  credits: router({
    packs: publicProcedure.query(() => CREDIT_PACKS),

    balance: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserCredits(ctx.user.id);
    }),

    history: protectedProcedure
      .input(z.object({ limit: z.number().default(50) }).optional())
      .query(async ({ ctx, input }) => {
        return db.getCreditHistory(ctx.user.id, input?.limit || 50);
      }),

    purchase: protectedProcedure
      .input(z.object({ pack: z.enum(["small", "medium", "large", "mega"]) }))
      .mutation(async ({ input, ctx }) => {
        const packConfig = CREDIT_PACKS[input.pack];
        
        const session = await stripe.checkout.sessions.create({
          mode: "payment",
          payment_method_types: ["card"],
          line_items: [{
            price_data: {
              currency: "usd",
              product_data: {
                name: `${packConfig.amount} ATHLYNX Credits`,
                description: "Use credits for AI services, content creation, and more",
              },
              unit_amount: packConfig.price,
            },
            quantity: 1,
          }],
          success_url: `${process.env.VITE_FRONTEND_FORGE_API_URL || ""}/portal?credits=success`,
          cancel_url: `${process.env.VITE_FRONTEND_FORGE_API_URL || ""}/pricing?cancelled=true`,
          metadata: {
            userId: ctx.user.id.toString(),
            creditAmount: packConfig.amount.toString(),
          },
        });

        return { checkoutUrl: session.url };
      }),

    spend: protectedProcedure
      .input(z.object({ amount: z.number(), description: z.string().optional() }))
      .mutation(async ({ input, ctx }) => {
        const success = await db.spendCredits(ctx.user.id, input.amount, input.description);
        if (!success) {
          return { success: false, error: "Insufficient credits" };
        }
        return { success: true };
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

  // ==================== STORIES ====================
  stories: router({
    list: publicProcedure
      .input(z.object({ limit: z.number().default(50) }).optional())
      .query(async ({ input }) => {
        return db.getActiveStories(input?.limit || 50);
      }),

    myStories: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserStories(ctx.user.id);
    }),

    create: protectedProcedure
      .input(z.object({
        mediaUrl: z.string(),
        mediaType: z.enum(["image", "video"]).default("image"),
        caption: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const storyId = await db.createStory({
          userId: ctx.user.id,
          ...input,
        });
        return { success: true, storyId };
      }),

    view: protectedProcedure
      .input(z.object({ storyId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        await db.viewStory(input.storyId, ctx.user.id);
        return { success: true };
      }),
  }),

  // ==================== REELS ====================
  reels: router({
    list: publicProcedure
      .input(z.object({ limit: z.number().default(20), offset: z.number().default(0) }).optional())
      .query(async ({ input }) => {
        return db.getReels(input?.limit || 20, input?.offset || 0);
      }),

    myReels: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserReels(ctx.user.id);
    }),

    create: protectedProcedure
      .input(z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        videoUrl: z.string(),
        thumbnailUrl: z.string().optional(),
        duration: z.number().optional(),
        musicTrackId: z.number().optional(),
        tags: z.array(z.string()).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const reelId = await db.createReel({
          userId: ctx.user.id,
          ...input,
        });
        return { success: true, reelId };
      }),
  }),

  // ==================== HIGHLIGHTS ====================
  highlights: router({
    list: protectedProcedure
      .input(z.object({ athleteId: z.number() }))
      .query(async ({ input }) => {
        return db.getAthleteHighlights(input.athleteId);
      }),

    myHighlights: protectedProcedure.query(async ({ ctx }) => {
      return db.getAthleteHighlights(ctx.user.id);
    }),

    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        description: z.string().optional(),
        videoUrl: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        duration: z.number().optional(),
        sport: z.string().optional(),
        season: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const tapeId = await db.createHighlightTape({
          athleteId: ctx.user.id,
          ...input,
        });
        return { success: true, tapeId };
      }),
  }),

  // ==================== MUSIC / PLAYLISTS ====================
  music: router({
    tracks: publicProcedure
      .input(z.object({ limit: z.number().default(50), genre: z.string().optional() }).optional())
      .query(async ({ input }) => {
        return db.getTracks(input?.limit || 50, input?.genre);
      }),

    myPlaylists: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserPlaylists(ctx.user.id);
    }),

    createPlaylist: protectedProcedure
      .input(z.object({
        title: z.string(),
        description: z.string().optional(),
        coverUrl: z.string().optional(),
        isPublic: z.boolean().default(true),
        category: z.enum(["workout", "warmup", "cooldown", "hype", "focus", "custom"]).default("custom"),
      }))
      .mutation(async ({ input, ctx }) => {
        const playlistId = await db.createPlaylist({
          userId: ctx.user.id,
          ...input,
        });
        return { success: true, playlistId };
      }),

    playlistTracks: publicProcedure
      .input(z.object({ playlistId: z.number() }))
      .query(async ({ input }) => {
        return db.getPlaylistTracks(input.playlistId);
      }),

    addToPlaylist: protectedProcedure
      .input(z.object({ playlistId: z.number(), trackId: z.number() }))
      .mutation(async ({ input }) => {
        await db.addTrackToPlaylist(input.playlistId, input.trackId);
        return { success: true };
      }),
  }),

  // ==================== MARKETPLACE ====================
  marketplace: router({
    listings: publicProcedure
      .input(z.object({ 
        category: z.string().optional(), 
        limit: z.number().default(20), 
        offset: z.number().default(0) 
      }).optional())
      .query(async ({ input }) => {
        return db.getListings(input?.category, input?.limit || 20, input?.offset || 0);
      }),

    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        description: z.string().optional(),
        category: z.enum(["nil_deal", "merch", "service", "training", "coaching", "appearance"]),
        price: z.string(),
        imageUrls: z.array(z.string()).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const listingId = await db.createListing({
          sellerId: ctx.user.id,
          ...input,
        });
        return { success: true, listingId };
      }),

    purchase: protectedProcedure
      .input(z.object({ listingId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        // Create Stripe payment intent for marketplace purchase
        // This would be implemented with proper escrow/split payments
        return { success: true, message: "Marketplace purchase flow - implement with Stripe Connect" };
      }),
  }),

  // ==================== AI AGENTS ====================
  ai: router({
    agents: publicProcedure.query(() => ({
      wizard: { name: "AI Wizard", description: "Your personal AI guide to ATHLYNX", creditCost: 0 },
      trainer: { name: "AI Trainer", description: "Personalized workout plans and progress tracking", creditCost: 5 },
      recruiter: { name: "AI Recruiter", description: "College recruitment strategy and outreach", creditCost: 10 },
      content: { name: "AI Content Creator", description: "Generate posts, captions, and highlight reels", creditCost: 5 },
      sales: { name: "AI Sales Agent", description: "NIL deal negotiation and brand outreach", creditCost: 10 },
      coach: { name: "AI Coach", description: "Game strategy and performance analysis", creditCost: 5 },
      manager: { name: "AI Manager", description: "Schedule, calendar, and career management", creditCost: 5 },
    })),

    sessions: protectedProcedure
      .input(z.object({ agentType: z.string().optional() }).optional())
      .query(async ({ ctx, input }) => {
        return db.getUserAiSessions(ctx.user.id, input?.agentType);
      }),

    startSession: protectedProcedure
      .input(z.object({
        agentType: z.enum(["wizard", "trainer", "recruiter", "content", "sales", "coach", "manager"]),
        context: z.any().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const sessionId = await db.createAiSession({
          userId: ctx.user.id,
          agentType: input.agentType,
          context: input.context,
        });
        return { success: true, sessionId };
      }),

    getMessages: protectedProcedure
      .input(z.object({ sessionId: z.number() }))
      .query(async ({ input }) => {
        return db.getAiMessages(input.sessionId);
      }),

    chat: protectedProcedure
      .input(z.object({
        sessionId: z.number(),
        message: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        const session = await db.getAiSession(input.sessionId);
        if (!session || session.userId !== ctx.user.id) {
          return { success: false, error: "Session not found" };
        }

        // Save user message
        await db.addAiMessage({
          sessionId: input.sessionId,
          role: "user",
          content: input.message,
        });

        // Get AI response
        const systemPrompts: Record<string, string> = {
          wizard: "You are the ATHLYNX AI Wizard, a friendly guide helping athletes navigate the platform. Be encouraging and helpful.",
          trainer: "You are an elite sports trainer AI. Create personalized workout plans, track progress, and motivate athletes. Focus on baseball training.",
          recruiter: "You are a college recruiting expert AI. Help athletes with recruitment strategy, school research, and communication with coaches.",
          content: "You are a social media content expert AI. Help athletes create engaging posts, captions, and content strategies for their brand.",
          sales: "You are an NIL deal expert AI. Help athletes understand their value, negotiate deals, and connect with brands professionally.",
          coach: "You are a strategic sports coach AI. Analyze performance, suggest game strategies, and help athletes improve their mental game.",
          manager: "You are a professional athlete manager AI. Help with scheduling, career planning, and managing their athletic journey.",
        };

        const messages = await db.getAiMessages(input.sessionId);
        const chatHistory = messages.map(m => ({
          role: m.role as "user" | "assistant" | "system",
          content: m.content,
        }));

        try {
          const response = await invokeLLM({
            messages: [
              { role: "system", content: systemPrompts[session.agentType] || systemPrompts.wizard },
              ...chatHistory,
              { role: "user", content: input.message },
            ],
          });

          const messageContent = response.choices[0]?.message?.content;
          const aiResponse = typeof messageContent === 'string' ? messageContent : "I apologize, I couldn't generate a response. Please try again.";

          // Save AI response
          await db.addAiMessage({
            sessionId: input.sessionId,
            role: "assistant",
            content: aiResponse,
          });

          return { success: true, response: aiResponse };
        } catch (error) {
          console.error("AI chat error:", error);
          return { success: false, error: "Failed to get AI response" };
        }
      }),
  }),

  // ==================== CONTENT PROJECTS ====================
  projects: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserProjects(ctx.user.id);
    }),

    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        type: z.enum(["reel", "highlight", "post", "story", "podcast"]),
        assets: z.any().optional(),
        settings: z.any().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const projectId = await db.createContentProject({
          userId: ctx.user.id,
          ...input,
        });
        return { success: true, projectId };
      }),

    update: protectedProcedure
      .input(z.object({
        projectId: z.number(),
        status: z.enum(["draft", "editing", "rendering", "completed"]).optional(),
        assets: z.any().optional(),
        settings: z.any().optional(),
        outputUrl: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.updateProject(input.projectId, input);
        return { success: true };
      }),
  }),

  // ==================== SOCIAL CONNECTIONS ====================
  socialConnections: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserSocialConnections(ctx.user.id);
    }),

    connect: protectedProcedure
      .input(z.object({
        platform: z.enum(["instagram", "facebook", "twitter", "linkedin", "tiktok", "youtube"]),
        username: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.addSocialConnection({
          userId: ctx.user.id,
          platform: input.platform,
          username: input.username,
        });
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
