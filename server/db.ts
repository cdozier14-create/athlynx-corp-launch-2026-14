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
  nilDeals, workouts, playbooks, transferEntries, notifications
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
