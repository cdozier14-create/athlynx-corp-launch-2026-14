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


// ==================== CRM & ANALYTICS (FAILPROOF SYSTEM) ====================

import { 
  signupAnalytics, InsertSignupAnalytic,
  socialConnections, InsertSocialConnection,
  onboardingSteps, InsertOnboardingStep,
  customerEvents, InsertCustomerEvent,
  revenueEvents, InsertRevenueEvent,
  partnerAccess, InsertPartnerAccess,
  milestones, InsertMilestone
} from "../drizzle/schema";

// Get next signup number (failsafe with fallback)
export async function getNextSignupNumber(): Promise<number> {
  const db = await getDb();
  if (!db) return 1;
  
  try {
    const result = await db.select({ maxNum: sql<number>`COALESCE(MAX(signupNumber), 0)` })
      .from(signupAnalytics);
    return (result[0]?.maxNum || 0) + 1;
  } catch (error) {
    console.error("[CRM] Failed to get signup number, using timestamp fallback:", error);
    return Date.now(); // Failsafe: use timestamp if query fails
  }
}

// Track signup with full analytics (FAILPROOF - logs to console as backup)
export async function trackSignup(data: {
  fullName: string;
  email: string;
  phone?: string;
  role?: string;
  sport?: string;
  ipAddress?: string;
  userAgent?: string;
  referralSource?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  signupType?: "waitlist" | "vip" | "direct" | "referral";
}): Promise<{ success: boolean; signupNumber: number; error?: string }> {
  // FAILSAFE: Always log to console first
  const timestamp = new Date().toISOString();
  console.log(`[CRM BACKUP] ${timestamp} | SIGNUP | ${data.email} | ${data.fullName} | ${data.role} | ${data.sport}`);
  
  const db = await getDb();
  if (!db) {
    console.error("[CRM] Database not available - data logged to console backup");
    return { success: false, signupNumber: 0, error: "Database not available - logged to backup" };
  }
  
  try {
    const signupNumber = await getNextSignupNumber();
    
    // Parse user agent for device info
    const browser = parseUserAgent(data.userAgent || "").browser;
    const device = parseUserAgent(data.userAgent || "").device;
    const os = parseUserAgent(data.userAgent || "").os;
    
    await db.insert(signupAnalytics).values({
      signupNumber,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      browser,
      device,
      os,
      role: data.role,
      sport: data.sport,
      referralSource: data.referralSource,
      utmSource: data.utmSource,
      utmMedium: data.utmMedium,
      utmCampaign: data.utmCampaign,
      signupType: data.signupType || "waitlist",
    });
    
    // Check and update milestones
    await checkMilestones("signup", signupNumber);
    
    console.log(`[CRM] SUCCESS | Signup #${signupNumber} | ${data.email}`);
    return { success: true, signupNumber };
  } catch (error: any) {
    console.error("[CRM] Failed to track signup:", error);
    // FAILSAFE: Return partial success since we logged to console
    return { success: false, signupNumber: 0, error: error.message };
  }
}

// Parse user agent string (failsafe)
function parseUserAgent(ua: string): { browser: string; device: string; os: string } {
  try {
    let browser = "Unknown";
    let device = "Desktop";
    let os = "Unknown";
    
    // Browser detection
    if (ua.includes("Chrome")) browser = "Chrome";
    else if (ua.includes("Firefox")) browser = "Firefox";
    else if (ua.includes("Safari")) browser = "Safari";
    else if (ua.includes("Edge")) browser = "Edge";
    else if (ua.includes("Opera")) browser = "Opera";
    
    // Device detection
    if (ua.includes("Mobile") || ua.includes("Android")) device = "Mobile";
    else if (ua.includes("Tablet") || ua.includes("iPad")) device = "Tablet";
    
    // OS detection
    if (ua.includes("Windows")) os = "Windows";
    else if (ua.includes("Mac")) os = "macOS";
    else if (ua.includes("Linux")) os = "Linux";
    else if (ua.includes("Android")) os = "Android";
    else if (ua.includes("iOS") || ua.includes("iPhone")) os = "iOS";
    
    return { browser, device, os };
  } catch {
    return { browser: "Unknown", device: "Unknown", os: "Unknown" };
  }
}

// Get all signups for CRM dashboard (with pagination)
export async function getSignupAnalytics(limit = 100, offset = 0) {
  const db = await getDb();
  if (!db) return { signups: [], total: 0 };
  
  try {
    const signups = await db.select()
      .from(signupAnalytics)
      .orderBy(desc(signupAnalytics.createdAt))
      .limit(limit)
      .offset(offset);
    
    const totalResult = await db.select({ count: sql<number>`count(*)` }).from(signupAnalytics);
    const total = totalResult[0]?.count || 0;
    
    return { signups, total };
  } catch (error) {
    console.error("[CRM] Failed to get signup analytics:", error);
    return { signups: [], total: 0 };
  }
}

// Get real-time stats for dashboard
export async function getCRMStats() {
  const db = await getDb();
  if (!db) return getDefaultStats();
  
  try {
    const [
      totalSignups,
      todaySignups,
      convertedUsers,
      payingUsers,
      totalRevenue,
      waitlistCount
    ] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(signupAnalytics),
      db.select({ count: sql<number>`count(*)` }).from(signupAnalytics)
        .where(sql`DATE(createdAt) = CURDATE()`),
      db.select({ count: sql<number>`count(*)` }).from(signupAnalytics)
        .where(eq(signupAnalytics.isConverted, true)),
      db.select({ count: sql<number>`count(*)` }).from(signupAnalytics)
        .where(eq(signupAnalytics.isPaying, true)),
      db.select({ sum: sql<number>`COALESCE(SUM(lifetimeValue), 0)` }).from(signupAnalytics),
      db.select({ count: sql<number>`count(*)` }).from(waitlist),
    ]);
    
    return {
      totalSignups: totalSignups[0]?.count || 0,
      todaySignups: todaySignups[0]?.count || 0,
      convertedUsers: convertedUsers[0]?.count || 0,
      payingUsers: payingUsers[0]?.count || 0,
      totalRevenue: totalRevenue[0]?.sum || 0,
      waitlistCount: waitlistCount[0]?.count || 0,
      conversionRate: totalSignups[0]?.count ? 
        ((convertedUsers[0]?.count || 0) / totalSignups[0].count * 100).toFixed(2) : "0.00",
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error("[CRM] Failed to get stats:", error);
    return getDefaultStats();
  }
}

function getDefaultStats() {
  return {
    totalSignups: 0,
    todaySignups: 0,
    convertedUsers: 0,
    payingUsers: 0,
    totalRevenue: 0,
    waitlistCount: 0,
    conversionRate: "0.00",
    lastUpdated: new Date().toISOString(),
  };
}

// Track customer event (for journey tracking)
export async function trackCustomerEvent(data: InsertCustomerEvent): Promise<boolean> {
  // FAILSAFE: Always log
  console.log(`[CRM EVENT] ${data.eventType} | ${data.eventName} | User: ${data.userId || data.waitlistId}`);
  
  const db = await getDb();
  if (!db) return false;
  
  try {
    await db.insert(customerEvents).values(data);
    return true;
  } catch (error) {
    console.error("[CRM] Failed to track event:", error);
    return false;
  }
}

// Track revenue event
export async function trackRevenueEvent(data: InsertRevenueEvent): Promise<boolean> {
  // FAILSAFE: Always log revenue
  console.log(`[CRM REVENUE] ${data.eventType} | $${data.amount} | User: ${data.userId}`);
  
  const db = await getDb();
  if (!db) return false;
  
  try {
    await db.insert(revenueEvents).values(data);
    
    // Update user's lifetime value
    await db.update(signupAnalytics)
      .set({ 
        isPaying: true,
        firstPaymentAt: sql`COALESCE(firstPaymentAt, NOW())`,
        lifetimeValue: sql`lifetimeValue + ${data.amount}`
      })
      .where(eq(signupAnalytics.userId, data.userId));
    
    // Check revenue milestones
    const totalRevenue = await db.select({ sum: sql<number>`SUM(amount)` }).from(revenueEvents);
    await checkMilestones("revenue", totalRevenue[0]?.sum || 0);
    
    return true;
  } catch (error) {
    console.error("[CRM] Failed to track revenue:", error);
    return false;
  }
}

// Check and update milestones
async function checkMilestones(type: string, currentValue: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  try {
    // Get unachieved milestones of this type
    const unachieved = await db.select()
      .from(milestones)
      .where(and(
        eq(milestones.milestoneType, type as any),
        eq(milestones.isAchieved, false)
      ));
    
    for (const milestone of unachieved) {
      if (currentValue >= milestone.targetValue) {
        await db.update(milestones)
          .set({ 
            isAchieved: true, 
            achievedAt: new Date(),
            currentValue 
          })
          .where(eq(milestones.id, milestone.id));
        
        console.log(`[CRM MILESTONE] 🎉 ACHIEVED: ${milestone.milestoneName}!`);
      } else {
        await db.update(milestones)
          .set({ currentValue })
          .where(eq(milestones.id, milestone.id));
      }
    }
  } catch (error) {
    console.error("[CRM] Failed to check milestones:", error);
  }
}

// Validate partner access code
export async function validatePartnerAccess(accessCode: string) {
  const db = await getDb();
  if (!db) return null;
  
  try {
    const result = await db.select()
      .from(partnerAccess)
      .where(and(
        eq(partnerAccess.accessCode, accessCode),
        eq(partnerAccess.isActive, true)
      ))
      .limit(1);
    
    if (result.length > 0) {
      // Update last access time
      await db.update(partnerAccess)
        .set({ lastAccessAt: new Date() })
        .where(eq(partnerAccess.id, result[0].id));
    }
    
    return result[0] || null;
  } catch (error) {
    console.error("[CRM] Failed to validate partner access:", error);
    return null;
  }
}

// Create partner access
export async function createPartnerAccess(data: InsertPartnerAccess): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  try {
    await db.insert(partnerAccess).values(data);
    return true;
  } catch (error) {
    console.error("[CRM] Failed to create partner access:", error);
    return false;
  }
}

// Export data for Excel/Copilot (CSV format)
export async function exportSignupsToCSV(): Promise<string> {
  const db = await getDb();
  if (!db) return "Error: Database not available";
  
  try {
    const signups = await db.select().from(signupAnalytics).orderBy(signupAnalytics.signupNumber);
    
    const headers = [
      "Signup #", "Timestamp", "Full Name", "Email", "Phone", "Role", "Sport",
      "IP Address", "Browser", "Device", "OS", "Country", "City",
      "Referral Source", "UTM Source", "UTM Medium", "UTM Campaign",
      "Signup Type", "Converted", "Paying", "Lifetime Value"
    ];
    
    const rows = signups.map(s => [
      s.signupNumber,
      s.createdAt?.toISOString() || "",
      s.fullName || "",
      s.email,
      s.phone || "",
      s.role || "",
      s.sport || "",
      s.ipAddress || "",
      s.browser || "",
      s.device || "",
      s.os || "",
      s.country || "",
      s.city || "",
      s.referralSource || "",
      s.utmSource || "",
      s.utmMedium || "",
      s.utmCampaign || "",
      s.signupType,
      s.isConverted ? "Yes" : "No",
      s.isPaying ? "Yes" : "No",
      s.lifetimeValue || "0"
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(","));
    
    return [headers.join(","), ...rows].join("\n");
  } catch (error) {
    console.error("[CRM] Failed to export CSV:", error);
    return "Error: Failed to export data";
  }
}

// Get milestones for dashboard
export async function getMilestones() {
  const db = await getDb();
  if (!db) return [];
  
  try {
    return db.select().from(milestones).orderBy(milestones.targetValue);
  } catch (error) {
    console.error("[CRM] Failed to get milestones:", error);
    return [];
  }
}

// Create milestone
export async function createMilestone(data: InsertMilestone): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  try {
    await db.insert(milestones).values(data);
    return true;
  } catch (error) {
    console.error("[CRM] Failed to create milestone:", error);
    return false;
  }
}
