import { eq, desc, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  vipCodes, InsertVipCode, VipCode,
  waitlist, InsertWaitlistEntry,
  posts, InsertPost,
  athleteProfiles, InsertAthleteProfile,
  follows, likes, comments,
  conversations, conversationParticipants, messages, InsertMessage,
  nilDeals, workouts, playbooks, transferEntries, notifications,
  subscriptions, userServices, userCredits, creditTransactions,
  playlists, tracks, playlistTracks, podcasts, podcastEpisodes,
  stories, storyViews, reels, highlightTapes,
  newsletters, newsletterSubscribers,
  marketplaceListings, marketplaceOrders,
  aiAgentSessions, aiAgentMessages,
  socialConnections, contentProjects, recruiterInterests
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ==================== VIP CODES ====================

export async function validateVipCode(code: string): Promise<VipCode | null> {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(vipCodes)
    .where(and(
      eq(vipCodes.code, code.toUpperCase()),
      eq(vipCodes.isActive, true)
    ))
    .limit(1);
  
  if (result.length === 0) return null;
  const vipCode = result[0];
  
  // Check if code has uses remaining
  if (vipCode.maxUses && vipCode.currentUses >= vipCode.maxUses) return null;
  
  // Check if code is expired
  if (vipCode.expiresAt && new Date(vipCode.expiresAt) < new Date()) return null;
  
  return vipCode;
}

export async function useVipCode(code: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  await db.update(vipCodes)
    .set({ currentUses: sql`${vipCodes.currentUses} + 1` })
    .where(eq(vipCodes.code, code.toUpperCase()));
  
  return true;
}

export async function createVipCode(data: InsertVipCode): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  await db.insert(vipCodes).values({
    ...data,
    code: data.code.toUpperCase(),
  });
}

// ==================== WAITLIST ====================

export async function addToWaitlist(entry: InsertWaitlistEntry): Promise<{ success: boolean; error?: string }> {
  const db = await getDb();
  if (!db) return { success: false, error: "Database not available" };
  
  try {
    await db.insert(waitlist).values(entry);
    return { success: true };
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return { success: false, error: "Email already registered" };
    }
    throw error;
  }
}

export async function getWaitlistCount(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  
  const result = await db.select({ count: sql<number>`count(*)` }).from(waitlist);
  return result[0]?.count || 0;
}

// ==================== POSTS / FEED ====================

export async function createPost(post: InsertPost): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(posts).values(post);
  return Number(result[0].insertId);
}

export async function getFeed(limit = 20, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(posts)
    .orderBy(desc(posts.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getUserPosts(userId: number, limit = 20, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(posts)
    .where(eq(posts.userId, userId))
    .orderBy(desc(posts.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function likePost(userId: number, postId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  await db.insert(likes).values({ userId, postId });
  await db.update(posts)
    .set({ likesCount: sql`${posts.likesCount} + 1` })
    .where(eq(posts.id, postId));
}

export async function unlikePost(userId: number, postId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  await db.delete(likes).where(and(eq(likes.userId, userId), eq(likes.postId, postId)));
  await db.update(posts)
    .set({ likesCount: sql`${posts.likesCount} - 1` })
    .where(eq(posts.id, postId));
}

// ==================== ATHLETE PROFILES ====================

export async function getAthleteProfile(userId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(athleteProfiles).where(eq(athleteProfiles.userId, userId)).limit(1);
  return result[0] || null;
}

export async function upsertAthleteProfile(profile: InsertAthleteProfile): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  await db.insert(athleteProfiles).values(profile).onDuplicateKeyUpdate({
    set: {
      sport: profile.sport,
      position: profile.position,
      school: profile.school,
      graduationYear: profile.graduationYear,
      gpa: profile.gpa,
      height: profile.height,
      weight: profile.weight,
      stats: profile.stats,
      highlights: profile.highlights,
      socialLinks: profile.socialLinks,
      transferStatus: profile.transferStatus,
      nilStatus: profile.nilStatus,
    },
  });
}

// ==================== FOLLOWS ====================

export async function followUser(followerId: number, followingId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  await db.insert(follows).values({ followerId, followingId });
}

export async function unfollowUser(followerId: number, followingId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  await db.delete(follows).where(and(
    eq(follows.followerId, followerId),
    eq(follows.followingId, followingId)
  ));
}

export async function getFollowers(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(follows).where(eq(follows.followingId, userId));
}

export async function getFollowing(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(follows).where(eq(follows.followerId, userId));
}

// ==================== MESSAGES ====================

export async function getConversations(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const participations = await db.select()
    .from(conversationParticipants)
    .where(eq(conversationParticipants.userId, userId));
  
  if (participations.length === 0) return [];
  
  const conversationIds = participations.map(p => p.conversationId);
  return db.select().from(conversations)
    .where(sql`${conversations.id} IN (${sql.join(conversationIds.map(id => sql`${id}`), sql`, `)})`)
    .orderBy(desc(conversations.updatedAt));
}

export async function getMessages(conversationId: number, limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(desc(messages.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function sendMessage(message: InsertMessage): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(messages).values(message);
  
  // Update conversation timestamp
  await db.update(conversations)
    .set({ updatedAt: new Date() })
    .where(eq(conversations.id, message.conversationId));
  
  return Number(result[0].insertId);
}

// ==================== NOTIFICATIONS ====================

export async function getUserNotifications(userId: number, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(limit);
}

export async function markNotificationRead(notificationId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  await db.update(notifications)
    .set({ isRead: true })
    .where(eq(notifications.id, notificationId));
}


// ==================== SUBSCRIPTIONS ====================

// Additional schema imports already included at top of file

export async function getUserSubscription(userId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1);
  return result[0] || null;
}

export async function createSubscription(data: {
  userId: number;
  plan: "free" | "rookie" | "starter" | "allstar" | "elite" | "legend";
  status?: "active" | "cancelled" | "past_due" | "trialing";
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  trialEndsAt?: Date;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(subscriptions).values({
    userId: data.userId,
    plan: data.plan,
    status: data.status || "trialing",
    stripeCustomerId: data.stripeCustomerId,
    stripeSubscriptionId: data.stripeSubscriptionId,
    trialEndsAt: data.trialEndsAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });
  return Number(result[0].insertId);
}

export async function updateSubscription(userId: number, updates: {
  plan?: "free" | "rookie" | "starter" | "allstar" | "elite" | "legend";
  status?: "active" | "cancelled" | "past_due" | "trialing";
  stripeSubscriptionId?: string;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelledAt?: Date;
}) {
  const db = await getDb();
  if (!db) return;
  
  await db.update(subscriptions).set(updates).where(eq(subscriptions.userId, userId));
}

// ==================== À LA CARTE SERVICES ====================

export async function getUserServices(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(userServices).where(eq(userServices.userId, userId));
}

export async function addUserService(data: {
  userId: number;
  service: "music" | "media" | "ai_trainer" | "ai_recruiter" | "content_suite" | "messenger_pro" | "marketplace";
  stripeSubscriptionId?: string;
  expiresAt?: Date;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(userServices).values(data);
  return Number(result[0].insertId);
}

export async function cancelUserService(userId: number, service: string) {
  const db = await getDb();
  if (!db) return;
  
  await db.update(userServices)
    .set({ status: "cancelled" })
    .where(and(eq(userServices.userId, userId), eq(userServices.service, service as any)));
}

// ==================== CREDITS SYSTEM ====================

export async function getUserCredits(userId: number) {
  const db = await getDb();
  if (!db) return { balance: 0, totalPurchased: 0, totalSpent: 0 };
  
  const result = await db.select().from(userCredits).where(eq(userCredits.userId, userId)).limit(1);
  if (result.length === 0) {
    // Create initial credits record
    await db.insert(userCredits).values({ userId, balance: 0, totalPurchased: 0, totalSpent: 0 });
    return { balance: 0, totalPurchased: 0, totalSpent: 0 };
  }
  return result[0];
}

export async function addCredits(userId: number, amount: number, type: "purchase" | "bonus" | "refund", description?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Update balance
  const updateSet: Record<string, any> = {
    balance: sql`${userCredits.balance} + ${amount}`,
  };
  if (type === "purchase") {
    updateSet.totalPurchased = sql`${userCredits.totalPurchased} + ${amount}`;
  }
  
  await db.insert(userCredits).values({ 
    userId, 
    balance: amount, 
    totalPurchased: type === "purchase" ? amount : 0 
  }).onDuplicateKeyUpdate({
    set: updateSet
  });
  
  // Record transaction
  await db.insert(creditTransactions).values({
    userId,
    amount,
    type,
    description,
  });
}

export async function spendCredits(userId: number, amount: number, description?: string, relatedId?: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  const credits = await getUserCredits(userId);
  if (credits.balance < amount) return false;
  
  await db.update(userCredits)
    .set({
      balance: sql`${userCredits.balance} - ${amount}`,
      totalSpent: sql`${userCredits.totalSpent} + ${amount}`,
    })
    .where(eq(userCredits.userId, userId));
  
  await db.insert(creditTransactions).values({
    userId,
    amount: -amount,
    type: "spend",
    description,
    relatedId,
  });
  
  return true;
}

export async function getCreditHistory(userId: number, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(creditTransactions)
    .where(eq(creditTransactions.userId, userId))
    .orderBy(desc(creditTransactions.createdAt))
    .limit(limit);
}

// ==================== PLAYLISTS & MUSIC ====================

export async function getUserPlaylists(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(playlists).where(eq(playlists.userId, userId)).orderBy(desc(playlists.createdAt));
}

export async function createPlaylist(data: {
  userId: number;
  title: string;
  description?: string;
  coverUrl?: string;
  isPublic?: boolean;
  category?: "workout" | "warmup" | "cooldown" | "hype" | "focus" | "custom";
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(playlists).values(data);
  return Number(result[0].insertId);
}

export async function getPlaylistTracks(playlistId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(playlistTracks)
    .innerJoin(tracks, eq(playlistTracks.trackId, tracks.id))
    .where(eq(playlistTracks.playlistId, playlistId))
    .orderBy(playlistTracks.position);
}

export async function addTrackToPlaylist(playlistId: number, trackId: number) {
  const db = await getDb();
  if (!db) return;
  
  const existing = await db.select().from(playlistTracks).where(eq(playlistTracks.playlistId, playlistId));
  const position = existing.length + 1;
  
  await db.insert(playlistTracks).values({ playlistId, trackId, position });
  await db.update(playlists)
    .set({ tracksCount: sql`${playlists.tracksCount} + 1` })
    .where(eq(playlists.id, playlistId));
}

export async function getTracks(limit = 50, genre?: string) {
  const db = await getDb();
  if (!db) return [];
  
  if (genre) {
    return db.select().from(tracks).where(eq(tracks.genre, genre)).limit(limit);
  }
  return db.select().from(tracks).limit(limit);
}

// ==================== STORIES ====================

export async function createStory(data: {
  userId: number;
  mediaUrl: string;
  mediaType?: "image" | "video";
  caption?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  const result = await db.insert(stories).values({ ...data, expiresAt });
  return Number(result[0].insertId);
}

export async function getActiveStories(limit = 50) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(stories)
    .where(sql`${stories.expiresAt} > NOW()`)
    .orderBy(desc(stories.createdAt))
    .limit(limit);
}

export async function getUserStories(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(stories)
    .where(and(eq(stories.userId, userId), sql`${stories.expiresAt} > NOW()`))
    .orderBy(desc(stories.createdAt));
}

export async function viewStory(storyId: number, viewerId: number) {
  const db = await getDb();
  if (!db) return;
  
  await db.insert(storyViews).values({ storyId, viewerId }).onDuplicateKeyUpdate({ set: { viewedAt: new Date() } });
  await db.update(stories).set({ viewsCount: sql`${stories.viewsCount} + 1` }).where(eq(stories.id, storyId));
}

// ==================== REELS ====================

export async function createReel(data: {
  userId: number;
  title?: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: number;
  musicTrackId?: number;
  tags?: string[];
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(reels).values(data);
  return Number(result[0].insertId);
}

export async function getReels(limit = 20, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(reels)
    .orderBy(desc(reels.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getUserReels(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(reels).where(eq(reels.userId, userId)).orderBy(desc(reels.createdAt));
}

// ==================== HIGHLIGHT TAPES ====================

export async function createHighlightTape(data: {
  athleteId: number;
  title: string;
  description?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
  sport?: string;
  season?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(highlightTapes).values(data);
  return Number(result[0].insertId);
}

export async function getAthleteHighlights(athleteId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(highlightTapes).where(eq(highlightTapes.athleteId, athleteId)).orderBy(desc(highlightTapes.createdAt));
}

// ==================== MARKETPLACE ====================

export async function createListing(data: {
  sellerId: number;
  title: string;
  description?: string;
  category: "nil_deal" | "merch" | "service" | "training" | "coaching" | "appearance";
  price: string;
  imageUrls?: string[];
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(marketplaceListings).values(data);
  return Number(result[0].insertId);
}

export async function getListings(category?: string, limit = 20, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  
  if (category) {
    return db.select()
      .from(marketplaceListings)
      .where(and(eq(marketplaceListings.category, category as any), eq(marketplaceListings.status, "active")))
      .orderBy(desc(marketplaceListings.createdAt))
      .limit(limit)
      .offset(offset);
  }
  
  return db.select()
    .from(marketplaceListings)
    .where(eq(marketplaceListings.status, "active"))
    .orderBy(desc(marketplaceListings.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function createOrder(data: {
  listingId: number;
  buyerId: number;
  sellerId: number;
  amount: string;
  platformFee: string;
  stripePaymentId?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(marketplaceOrders).values(data);
  return Number(result[0].insertId);
}

// ==================== AI AGENTS ====================

export async function createAiSession(data: {
  userId: number;
  agentType: "wizard" | "trainer" | "recruiter" | "content" | "sales" | "coach" | "manager";
  context?: any;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(aiAgentSessions).values(data);
  return Number(result[0].insertId);
}

export async function getAiSession(sessionId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(aiAgentSessions).where(eq(aiAgentSessions.id, sessionId)).limit(1);
  return result[0] || null;
}

export async function getUserAiSessions(userId: number, agentType?: string) {
  const db = await getDb();
  if (!db) return [];
  
  if (agentType) {
    return db.select()
      .from(aiAgentSessions)
      .where(and(eq(aiAgentSessions.userId, userId), eq(aiAgentSessions.agentType, agentType as any)))
      .orderBy(desc(aiAgentSessions.updatedAt));
  }
  
  return db.select()
    .from(aiAgentSessions)
    .where(eq(aiAgentSessions.userId, userId))
    .orderBy(desc(aiAgentSessions.updatedAt));
}

export async function addAiMessage(data: {
  sessionId: number;
  role: "user" | "assistant" | "system";
  content: string;
  metadata?: any;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(aiAgentMessages).values(data);
  await db.update(aiAgentSessions)
    .set({ messagesCount: sql`${aiAgentSessions.messagesCount} + 1` })
    .where(eq(aiAgentSessions.id, data.sessionId));
}

export async function getAiMessages(sessionId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(aiAgentMessages)
    .where(eq(aiAgentMessages.sessionId, sessionId))
    .orderBy(aiAgentMessages.createdAt);
}

// ==================== SOCIAL CONNECTIONS ====================

export async function getUserSocialConnections(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(socialConnections).where(eq(socialConnections.userId, userId));
}

export async function addSocialConnection(data: {
  userId: number;
  platform: "instagram" | "facebook" | "twitter" | "linkedin" | "tiktok" | "youtube";
  platformUserId?: string;
  accessToken?: string;
  refreshToken?: string;
  username?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(socialConnections).values(data).onDuplicateKeyUpdate({
    set: {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      username: data.username,
      isConnected: true,
    }
  });
}

// ==================== CONTENT PROJECTS ====================

export async function createContentProject(data: {
  userId: number;
  title: string;
  type: "reel" | "highlight" | "post" | "story" | "podcast";
  assets?: any;
  settings?: any;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(contentProjects).values(data);
  return Number(result[0].insertId);
}

export async function getUserProjects(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(contentProjects)
    .where(eq(contentProjects.userId, userId))
    .orderBy(desc(contentProjects.updatedAt));
}

export async function updateProject(projectId: number, updates: {
  status?: "draft" | "editing" | "rendering" | "completed";
  assets?: any;
  settings?: any;
  outputUrl?: string;
}) {
  const db = await getDb();
  if (!db) return;
  
  await db.update(contentProjects).set(updates).where(eq(contentProjects.id, projectId));
}
