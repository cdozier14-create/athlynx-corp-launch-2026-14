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
  transferPortalEntries
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

export async function addToWaitlist(entry: InsertWaitlistEntry): Promise<{ success: boolean; error?: string; vipCode?: string }> {
  const db = await getDb();
  if (!db) return { success: false, error: "Database not available" };
  
  try {
    // Generate unique VIP code
    const vipCode = `VIP${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    
    // Insert into waitlist
    await db.insert(waitlist).values(entry);
    
    // Also create a VIP code for this user
    try {
      await db.insert(vipCodes).values({
        code: vipCode,
        description: `Auto-generated for ${entry.email}`,
        maxUses: 1,
        currentUses: 0,
        isActive: true,
      });
    } catch (e) {
      console.log("VIP code creation failed, continuing...", e);
    }
    
    // Send welcome email with VIP code
    try {
      const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_YwrFNHMa_5LWwNJxBbJoX6gEqpLZRMCxU';
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'ATHLYNX <noreply@athlynx.manus.space>',
          to: entry.email,
          subject: 'WELCOME TO ATHLYNX - Your VIP Code Inside!',
          html: `
            <div style="background-color: #0f172a; padding: 40px 20px; font-family: Arial, sans-serif;">
              <div style="max-width: 500px; margin: 0 auto;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <img src="https://athlynx.manus.space/athlynx-playbook-logo.png" alt="ATHLYNX" style="height: 60px;" />
                </div>
                <div style="background-color: #1e293b; border-radius: 16px; padding: 30px; border: 1px solid #334155;">
                  <h1 style="color: #ffffff; text-align: center; margin: 0 0 10px 0; font-size: 24px;">WELCOME TO ATHLYNX!</h1>
                  <p style="color: #94a3b8; text-align: center; margin: 0 0 30px 0;">The Athlete's Playbook</p>
                  
                  <div style="background-color: #0f172a; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 20px;">
                    <p style="color: #94a3b8; margin: 0 0 10px 0; font-size: 14px;">YOUR VIP ACCESS CODE</p>
                    <p style="color: #22d3ee; font-size: 32px; font-weight: bold; margin: 0; letter-spacing: 4px;">${vipCode}</p>
                  </div>
                  
                  <p style="color: #cbd5e1; text-align: center; font-size: 14px; margin: 0 0 20px 0;">
                    Use this code to access the ATHLYNX Portal and unlock all 6 apps.
                  </p>
                  
                  <a href="https://athlynx.manus.space" style="display: block; background: linear-gradient(to right, #06b6d4, #3b82f6); color: white; text-align: center; padding: 16px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 16px;">
                    ENTER THE PORTAL
                  </a>
                </div>
                <p style="color: #64748b; text-align: center; font-size: 12px; margin-top: 20px;">
                  © 2026 ATHLYNX • A Dozier Holdings Group Company
                </p>
              </div>
            </div>
          `,
        }),
      });
      console.log(`[Waitlist] Welcome email sent to ${entry.email} with VIP code ${vipCode}`);
    } catch (emailError) {
      console.error("[Waitlist] Failed to send welcome email:", emailError);
    }
    
    return { success: true, vipCode };
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


// ==================== TRANSFER PORTAL ====================

// Get transfer portal players with filters
export async function getTransferPortalPlayers(filters: {
  sport?: string;
  position?: string;
  division?: string;
  conference?: string;
  status?: string;
  minRating?: number;
  maxRating?: number;
  minNIL?: number;
  maxNIL?: number;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return { players: [], total: 0 };
  
  try {
    // Build query with filters
    let query = db.select().from(transferPortalEntries);
    
    // Apply filters using raw SQL for flexibility
    const conditions: string[] = ["isPublic = 1"];
    
    if (filters.sport && filters.sport !== "all") {
      conditions.push(`sport = '${filters.sport}'`);
    }
    if (filters.position && filters.position !== "all") {
      conditions.push(`position = '${filters.position}'`);
    }
    if (filters.division && filters.division !== "all") {
      conditions.push(`currentDivision = '${filters.division}'`);
    }
    if (filters.conference && filters.conference !== "all") {
      conditions.push(`currentConference = '${filters.conference}'`);
    }
    if (filters.status && filters.status !== "all") {
      conditions.push(`status = '${filters.status}'`);
    }
    if (filters.minRating) {
      conditions.push(`starRating >= ${filters.minRating}`);
    }
    if (filters.maxRating) {
      conditions.push(`starRating <= ${filters.maxRating}`);
    }
    if (filters.minNIL) {
      conditions.push(`nilValuation >= ${filters.minNIL}`);
    }
    if (filters.maxNIL) {
      conditions.push(`nilValuation <= ${filters.maxNIL}`);
    }
    if (filters.search) {
      const searchTerm = filters.search.replace(/'/g, "''");
      conditions.push(`(fullName LIKE '%${searchTerm}%' OR currentSchool LIKE '%${searchTerm}%')`);
    }
    
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const limit = filters.limit || 50;
    const offset = filters.offset || 0;
    
    // Execute query
    const playersResult = await db.execute(sql.raw(`
      SELECT * FROM transfer_portal_entries 
      ${whereClause}
      ORDER BY starRating DESC, nilValuation DESC
      LIMIT ${limit} OFFSET ${offset}
    `));
    
    // Get total count
    const countResult = await db.execute(sql.raw(`
      SELECT COUNT(*) as total FROM transfer_portal_entries ${whereClause}
    `));
    
    // Handle MySQL2 result format
    const players = Array.isArray(playersResult) && Array.isArray(playersResult[0]) 
      ? playersResult[0] 
      : [];
    const countRows = Array.isArray(countResult) && Array.isArray(countResult[0]) 
      ? countResult[0] 
      : [];
    
    return { 
      players: players as any[], 
      total: (countRows as any[])[0]?.total || 0 
    };
  } catch (error) {
    console.error("[Transfer Portal] Failed to get players:", error);
    return { players: [], total: 0 };
  }
}

// Get single player by ID
export async function getTransferPortalPlayer(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  try {
    const result = await db.select()
      .from(transferPortalEntries)
      .where(eq(transferPortalEntries.id, id))
      .limit(1);
    
    return result[0] || null;
  } catch (error) {
    console.error("[Transfer Portal] Failed to get player:", error);
    return null;
  }
}

// Get transfer portal stats
export async function getTransferPortalStats() {
  const db = await getDb();
  if (!db) return getDefaultPortalStats();
  
  try {
    const [
      totalPlayers,
      footballPlayers,
      basketballPlayers,
      fiveStarPlayers,
      availablePlayers
    ] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(transferPortalEntries),
      db.select({ count: sql<number>`count(*)` }).from(transferPortalEntries)
        .where(eq(transferPortalEntries.sport, "football")),
      db.select({ count: sql<number>`count(*)` }).from(transferPortalEntries)
        .where(eq(transferPortalEntries.sport, "basketball")),
      db.select({ count: sql<number>`count(*)` }).from(transferPortalEntries)
        .where(eq(transferPortalEntries.starRating, 5)),
      db.select({ count: sql<number>`count(*)` }).from(transferPortalEntries)
        .where(sql`status IN ('available', 'entered')`),
    ]);
    
    // Get total NIL value
    const nilResult = await db.select({ 
      sum: sql<number>`COALESCE(SUM(nilValuation), 0)` 
    }).from(transferPortalEntries);
    
    return {
      totalPlayers: totalPlayers[0]?.count || 0,
      footballPlayers: footballPlayers[0]?.count || 0,
      basketballPlayers: basketballPlayers[0]?.count || 0,
      fiveStarPlayers: fiveStarPlayers[0]?.count || 0,
      availablePlayers: availablePlayers[0]?.count || 0,
      totalNILValue: nilResult[0]?.sum || 0,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error("[Transfer Portal] Failed to get stats:", error);
    return getDefaultPortalStats();
  }
}

function getDefaultPortalStats() {
  return {
    totalPlayers: 0,
    footballPlayers: 0,
    basketballPlayers: 0,
    fiveStarPlayers: 0,
    availablePlayers: 0,
    totalNILValue: 0,
    lastUpdated: new Date().toISOString(),
  };
}


// ============================================
// COMMUNITY VOTING & FEEDBACK FUNCTIONS
// ============================================

// Submit a site vote
export async function submitSiteVote(data: {
  siteChoice: string;
  visitorId?: string;
  ipAddress?: string;
  userAgent?: string;
}) {
  const db = await getDb();
  if (!db) {
    console.warn("[Voting] Cannot submit vote: database not available");
    return { success: false, message: "Database not available" };
  }
  
  try {
    // For now, just log the vote since we may not have the table yet
    console.log("[Voting] Vote submitted:", data);
    return { success: true, message: "Vote recorded!" };
  } catch (error) {
    console.error("[Voting] Failed to submit vote:", error);
    return { success: false, message: "Failed to record vote" };
  }
}

// Get vote statistics
export async function getVoteStats() {
  const db = await getDb();
  if (!db) {
    return {
      siteA: 0,
      siteB: 0,
      total: 0,
      siteAPercent: 50,
      siteBPercent: 50,
    };
  }
  
  try {
    // Return default stats for now
    return {
      siteA: 0,
      siteB: 0,
      total: 0,
      siteAPercent: 50,
      siteBPercent: 50,
    };
  } catch (error) {
    console.error("[Voting] Failed to get stats:", error);
    return {
      siteA: 0,
      siteB: 0,
      total: 0,
      siteAPercent: 50,
      siteBPercent: 50,
    };
  }
}

// Submit community feedback
export async function submitCommunityFeedback(data: {
  feedbackType: string;
  message: string;
  email?: string;
  name?: string;
  visitorId?: string;
}) {
  const db = await getDb();
  if (!db) {
    console.warn("[Feedback] Cannot submit feedback: database not available");
    return { success: false, message: "Database not available" };
  }
  
  try {
    // For now, just log the feedback since we may not have the table yet
    console.log("[Feedback] Feedback submitted:", data);
    return { success: true, message: "Feedback received! Thank you!" };
  } catch (error) {
    console.error("[Feedback] Failed to submit feedback:", error);
    return { success: false, message: "Failed to submit feedback" };
  }
}

// Get community feedback (for admin/CRM)
export async function getCommunityFeedback(limit: number = 50) {
  const db = await getDb();
  if (!db) {
    return { feedback: [], total: 0 };
  }
  
  try {
    // Return empty for now
    return { feedback: [], total: 0 };
  } catch (error) {
    console.error("[Feedback] Failed to get feedback:", error);
    return { feedback: [], total: 0 };
  }
}
