import { integer, pgEnum, pgTable, text, timestamp, varchar, boolean, json, decimal, serial } from "drizzle-orm/pg-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: pgEnum("role", ["user", "admin", "athlete", "parent", "coach", "brand"]).default("user").notNull(),
  avatarUrl: text("avatarUrl"),
  bio: text("bio"),
  isVip: boolean("isVip").default(false).notNull(),
  vipCodeUsed: varchar("vipCodeUsed", { length: 32 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()).notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ==================== VIP CODES ====================

export const vipCodes = pgTable("vip_codes", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 32 }).notNull().unique(),
  description: text("description"),
  maxUses: int("maxUses").default(1),
  currentUses: int("currentUses").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  expiresAt: timestamp("expiresAt"),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type VipCode = typeof vipCodes.$inferSelect;
export type InsertVipCode = typeof vipCodes.$inferInsert;

// ==================== ATHLETE PROFILES ====================

export const athleteProfiles = pgTable("athlete_profiles", {
  id: serial("id").primaryKey(),
  userId: int("userId").notNull(),
  sport: varchar("sport", { length: 64 }),
  position: varchar("position", { length: 64 }),
  school: varchar("school", { length: 255 }),
  graduationYear: int("graduationYear"),
  gpa: decimal("gpa", { precision: 3, scale: 2 }),
  height: varchar("height", { length: 16 }),
  weight: varchar("weight", { length: 16 }),
  stats: json("stats"),
  highlights: json("highlights"),
  socialLinks: json("socialLinks"),
  transferStatus: pgEnum("transferStatus", ["not_in_portal", "exploring", "in_portal", "committed"]).default("not_in_portal"),
  nilStatus: pgEnum("nilStatus", ["not_available", "available", "active_deals"]).default("not_available"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export type AthleteProfile = typeof athleteProfiles.$inferSelect;
export type InsertAthleteProfile = typeof athleteProfiles.$inferInsert;

// ==================== NIL DEALS ====================

export const nilDeals = pgTable("nil_deals", {
  id: serial("id").primaryKey(),
  athleteId: int("athleteId").notNull(),
  brandId: int("brandId"),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  value: decimal("value", { precision: 12, scale: 2 }),
  status: pgEnum("status", ["pending", "active", "completed", "cancelled"]).default("pending").notNull(),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  terms: text("terms"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export type NilDeal = typeof nilDeals.$inferSelect;
export type InsertNilDeal = typeof nilDeals.$inferInsert;

// ==================== POSTS / SOCIAL FEED ====================

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  userId: int("userId").notNull(),
  content: text("content"),
  mediaUrls: json("mediaUrls"),
  postType: pgEnum("postType", ["text", "image", "video", "highlight", "deal", "announcement"]).default("text").notNull(),
  visibility: pgEnum("visibility", ["public", "followers", "private"]).default("public").notNull(),
  likesCount: int("likesCount").default(0).notNull(),
  commentsCount: int("commentsCount").default(0).notNull(),
  sharesCount: int("sharesCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export type Post = typeof posts.$inferSelect;
export type InsertPost = typeof posts.$inferInsert;

// ==================== COMMENTS ====================

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  postId: int("postId").notNull(),
  userId: int("userId").notNull(),
  content: text("content").notNull(),
  parentId: int("parentId"),
  likesCount: int("likesCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Comment = typeof comments.$inferSelect;
export type InsertComment = typeof comments.$inferInsert;

// ==================== LIKES ====================

export const likes = pgTable("likes", {
  id: serial("id").primaryKey(),
  userId: int("userId").notNull(),
  postId: int("postId"),
  commentId: int("commentId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Like = typeof likes.$inferSelect;
export type InsertLike = typeof likes.$inferInsert;

// ==================== FOLLOWS ====================

export const follows = pgTable("follows", {
  id: serial("id").primaryKey(),
  followerId: int("followerId").notNull(),
  followingId: int("followingId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Follow = typeof follows.$inferSelect;
export type InsertFollow = typeof follows.$inferInsert;

// ==================== MESSAGES ====================

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  type: pgEnum("type", ["direct", "group"]).default("direct").notNull(),
  name: varchar("name", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = typeof conversations.$inferInsert;

export const conversationParticipants = pgTable("conversation_participants", {
  id: serial("id").primaryKey(),
  conversationId: int("conversationId").notNull(),
  userId: int("userId").notNull(),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
  lastReadAt: timestamp("lastReadAt"),
});

export type ConversationParticipant = typeof conversationParticipants.$inferSelect;

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: int("conversationId").notNull(),
  senderId: int("senderId").notNull(),
  content: text("content"),
  mediaUrl: text("mediaUrl"),
  messageType: pgEnum("messageType", ["text", "image", "video", "file", "system"]).default("text").notNull(),
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

// ==================== VERIFICATION CODES ====================

export const verificationCodes = pgTable("verification_codes", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  code: varchar("code", { length: 10 }).notNull(),
  type: pgEnum("type", ["signup", "login", "password_reset"]).default("signup").notNull(),
  verified: boolean("verified").default(false).notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type VerificationCode = typeof verificationCodes.$inferSelect;
export type InsertVerificationCode = typeof verificationCodes.$inferInsert;

// ==================== WAITLIST / EARLY ACCESS ====================

export const waitlist = pgTable("waitlist", {
  id: serial("id").primaryKey(),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }),
  role: pgEnum("waitlistRole", ["athlete", "parent", "coach", "brand"]).notNull(),
  sport: varchar("sport", { length: 64 }),
  referralCode: varchar("referralCode", { length: 32 }),
  status: pgEnum("waitlistStatus", ["pending", "approved", "invited"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WaitlistEntry = typeof waitlist.$inferSelect;
export type InsertWaitlistEntry = typeof waitlist.$inferInsert;

// ==================== NOTIFICATIONS ====================

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: int("userId").notNull(),
  type: varchar("type", { length: 64 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),
  data: json("data"),
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

// ==================== TRAINING / DIAMOND GRIND ====================

export const workouts = pgTable("workouts", {
  id: serial("id").primaryKey(),
  athleteId: int("athleteId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  sport: varchar("sport", { length: 64 }),
  duration: int("duration"),
  intensity: pgEnum("intensity", ["low", "medium", "high", "extreme"]).default("medium"),
  exercises: json("exercises"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Workout = typeof workouts.$inferSelect;
export type InsertWorkout = typeof workouts.$inferInsert;

// ==================== PLAYBOOKS / STRATEGIES ====================

export const playbooks = pgTable("playbooks", {
  id: serial("id").primaryKey(),
  creatorId: int("creatorId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  sport: varchar("sport", { length: 64 }),
  category: varchar("category", { length: 64 }),
  content: json("content"),
  isPublic: boolean("isPublic").default(false).notNull(),
  viewsCount: int("viewsCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export type Playbook = typeof playbooks.$inferSelect;
export type InsertPlaybook = typeof playbooks.$inferInsert;

// ==================== TRANSFER PORTAL ====================

export const transferEntries = pgTable("transfer_entries", {
  id: serial("id").primaryKey(),
  athleteId: int("athleteId").notNull(),
  currentSchool: varchar("currentSchool", { length: 255 }),
  desiredSchools: json("desiredSchools"),
  enteredPortalAt: timestamp("enteredPortalAt"),
  status: pgEnum("transferStatus2", ["exploring", "in_portal", "committed", "withdrawn"]).default("exploring").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export type TransferEntry = typeof transferEntries.$inferSelect;
export type InsertTransferEntry = typeof transferEntries.$inferInsert;

// ==================== RECRUITER INTERESTS ====================

export const recruiterInterests = pgTable("recruiter_interests", {
  id: serial("id").primaryKey(),
  recruiterId: int("recruiterId").notNull(),
  athleteId: int("athleteId").notNull(),
  school: varchar("school", { length: 255 }),
  interestLevel: pgEnum("interestLevel", ["watching", "interested", "offering", "committed"]).default("watching").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export type RecruiterInterest = typeof recruiterInterests.$inferSelect;
export type InsertRecruiterInterest = typeof recruiterInterests.$inferInsert;

// ==================== CRM & ANALYTICS ====================

export const signupAnalytics = pgTable("signup_analytics", {
  id: serial("id").primaryKey(),
  signupNumber: int("signupNumber").notNull(), // 1st user, 2nd user, etc.
  userId: int("userId"),
  waitlistId: int("waitlistId"),
  fullName: varchar("fullName", { length: 255 }),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  browser: varchar("browser", { length: 64 }),
  device: varchar("device", { length: 64 }),
  os: varchar("os", { length: 64 }),
  country: varchar("country", { length: 64 }),
  city: varchar("city", { length: 128 }),
  region: varchar("region", { length: 128 }),
  timezone: varchar("timezone", { length: 64 }),
  referralSource: varchar("referralSource", { length: 255 }),
  utmSource: varchar("utmSource", { length: 128 }),
  utmMedium: varchar("utmMedium", { length: 128 }),
  utmCampaign: varchar("utmCampaign", { length: 128 }),
  role: varchar("role", { length: 64 }),
  sport: varchar("sport", { length: 64 }),
  signupType: pgEnum("signupType", ["waitlist", "vip", "direct", "referral"]).default("waitlist").notNull(),
  isConverted: boolean("isConverted").default(false).notNull(),
  convertedAt: timestamp("convertedAt"),
  isPaying: boolean("isPaying").default(false).notNull(),
  firstPaymentAt: timestamp("firstPaymentAt"),
  lifetimeValue: decimal("lifetimeValue", { precision: 12, scale: 2 }).default("0"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SignupAnalytic = typeof signupAnalytics.$inferSelect;
export type InsertSignupAnalytic = typeof signupAnalytics.$inferInsert;

// ==================== SOCIAL MEDIA CONNECTIONS ====================

export const socialConnections = pgTable("social_connections", {
  id: serial("id").primaryKey(),
  userId: int("userId").notNull(),
  platform: pgEnum("platform", ["instagram", "twitter", "tiktok", "youtube", "facebook", "linkedin", "snapchat", "threads"]).notNull(),
  username: varchar("username", { length: 255 }),
  profileUrl: text("profileUrl"),
  followersCount: int("followersCount").default(0),
  followingCount: int("followingCount").default(0),
  postsCount: int("postsCount").default(0),
  engagementRate: decimal("engagementRate", { precision: 5, scale: 2 }),
  isVerified: boolean("isVerified").default(false).notNull(),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  tokenExpiresAt: timestamp("tokenExpiresAt"),
  lastSyncedAt: timestamp("lastSyncedAt"),
  connectedAt: timestamp("connectedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export type SocialConnection = typeof socialConnections.$inferSelect;
export type InsertSocialConnection = typeof socialConnections.$inferInsert;

// ==================== AI ONBOARDING CHANNEL ====================

export const onboardingSteps = pgTable("onboarding_steps", {
  id: serial("id").primaryKey(),
  userId: int("userId").notNull(),
  stepName: varchar("stepName", { length: 64 }).notNull(),
  stepOrder: int("stepOrder").notNull(),
  status: pgEnum("onboardingStatus", ["pending", "in_progress", "completed", "skipped"]).default("pending").notNull(),
  completedAt: timestamp("completedAt"),
  aiAssisted: boolean("aiAssisted").default(false).notNull(),
  aiResponse: text("aiResponse"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OnboardingStep = typeof onboardingSteps.$inferSelect;
export type InsertOnboardingStep = typeof onboardingSteps.$inferInsert;

// ==================== CUSTOMER JOURNEY EVENTS ====================

export const customerEvents = pgTable("customer_events", {
  id: serial("id").primaryKey(),
  userId: int("userId"),
  waitlistId: int("waitlistId"),
  eventType: varchar("eventType", { length: 64 }).notNull(),
  eventName: varchar("eventName", { length: 255 }).notNull(),
  eventData: json("eventData"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  pageUrl: text("pageUrl"),
  referrer: text("referrer"),
  sessionId: varchar("sessionId", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CustomerEvent = typeof customerEvents.$inferSelect;
export type InsertCustomerEvent = typeof customerEvents.$inferInsert;

// ==================== REVENUE TRACKING ====================

export const revenueEvents = pgTable("revenue_events", {
  id: serial("id").primaryKey(),
  userId: int("userId").notNull(),
  eventType: pgEnum("revenueEventType", ["subscription_start", "subscription_renewal", "subscription_cancel", "one_time_purchase", "refund", "upgrade", "downgrade"]).notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("USD").notNull(),
  subscriptionTier: varchar("subscriptionTier", { length: 64 }),
  stripePaymentId: varchar("stripePaymentId", { length: 255 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type RevenueEvent = typeof revenueEvents.$inferSelect;
export type InsertRevenueEvent = typeof revenueEvents.$inferInsert;

// ==================== PARTNER ACCESS (CRM Dashboard) ====================

export const partnerAccess = pgTable("partner_access", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  role: pgEnum("partnerRole", ["founder", "partner", "investor", "advisor"]).default("partner").notNull(),
  accessLevel: pgEnum("accessLevel", ["view_only", "standard", "full", "admin"]).default("view_only").notNull(),
  accessCode: varchar("accessCode", { length: 64 }).notNull().unique(),
  isActive: boolean("isActive").default(true).notNull(),
  lastAccessAt: timestamp("lastAccessAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PartnerAccess = typeof partnerAccess.$inferSelect;
export type InsertPartnerAccess = typeof partnerAccess.$inferInsert;

// ==================== CRM MILESTONES ====================

export const milestones = pgTable("milestones", {
  id: serial("id").primaryKey(),
  milestoneName: varchar("milestoneName", { length: 255 }).notNull(),
  milestoneType: pgEnum("milestoneType", ["signup", "revenue", "user", "feature", "custom"]).notNull(),
  targetValue: int("targetValue").notNull(),
  currentValue: int("currentValue").default(0).notNull(),
  isAchieved: boolean("isAchieved").default(false).notNull(),
  achievedAt: timestamp("achievedAt"),
  celebrationMessage: text("celebrationMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Milestone = typeof milestones.$inferSelect;
export type InsertMilestone = typeof milestones.$inferInsert;


// ==================== AI CREDIT SYSTEM (Powered by Manus) ====================

export const userCredits = pgTable("user_credits", {
  id: serial("id").primaryKey(),
  userId: int("userId").notNull().unique(),
  balance: int("balance").default(0).notNull(),
  lifetimeEarned: int("lifetimeEarned").default(0).notNull(),
  lifetimeSpent: int("lifetimeSpent").default(0).notNull(),
  monthlyAllocation: int("monthlyAllocation").default(0).notNull(),
  lastMonthlyReset: timestamp("lastMonthlyReset"),
  subscriptionTier: varchar("subscriptionTier", { length: 32 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export type UserCredits = typeof userCredits.$inferSelect;
export type InsertUserCredits = typeof userCredits.$inferInsert;

export const creditTransactions = pgTable("credit_transactions", {
  id: serial("id").primaryKey(),
  userId: int("userId").notNull(),
  amount: int("amount").notNull(), // Positive = earned, Negative = spent
  balanceAfter: int("balanceAfter").notNull(),
  transactionType: pgEnum("transactionType", [
    "purchase",      // Bought credits
    "subscription",  // Monthly allocation from subscription
    "bonus",         // Bonus credits (signup, referral, etc.)
    "usage",         // Used credits for AI feature
    "refund",        // Refunded credits
    "gift",          // Gifted credits
    "admin",         // Admin adjustment
  ]).notNull(),
  description: varchar("description", { length: 255 }),
  featureUsed: varchar("featureUsed", { length: 64 }), // For usage transactions
  referenceId: varchar("referenceId", { length: 64 }), // Stripe payment ID, etc.
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CreditTransaction = typeof creditTransactions.$inferSelect;
export type InsertCreditTransaction = typeof creditTransactions.$inferInsert;

export const creditPackagePurchases = pgTable("credit_package_purchases", {
  id: serial("id").primaryKey(),
  userId: int("userId").notNull(),
  packageId: varchar("packageId", { length: 32 }).notNull(),
  credits: int("credits").notNull(),
  amountPaid: decimal("amountPaid", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("USD").notNull(),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 64 }),
  status: pgEnum("status", ["pending", "completed", "failed", "refunded"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CreditPackagePurchase = typeof creditPackagePurchases.$inferSelect;
export type InsertCreditPackagePurchase = typeof creditPackagePurchases.$inferInsert;

// ==================== STRIPE INTEGRATION ====================

export const stripeCustomers = pgTable("stripe_customers", {
  id: serial("id").primaryKey(),
  userId: int("userId").notNull().unique(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 64 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type StripeCustomer = typeof stripeCustomers.$inferSelect;
export type InsertStripeCustomer = typeof stripeCustomers.$inferInsert;

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: int("userId").notNull(),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 64 }).notNull().unique(),
  tierId: varchar("tierId", { length: 32 }).notNull(),
  tierName: varchar("tierName", { length: 64 }),
  status: pgEnum("status", ["active", "canceled", "past_due", "unpaid", "trialing"]).default("active").notNull(),
  billingCycle: pgEnum("billingCycle", ["monthly", "yearly"]).default("monthly").notNull(),
  currentPeriodStart: timestamp("currentPeriodStart"),
  currentPeriodEnd: timestamp("currentPeriodEnd"),
  cancelAtPeriodEnd: boolean("cancelAtPeriodEnd").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: int("userId").notNull(),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 64 }).notNull().unique(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("USD").notNull(),
  status: pgEnum("status", ["pending", "succeeded", "failed", "refunded"]).default("pending").notNull(),
  paymentType: pgEnum("paymentType", ["subscription", "one_time", "credits"]).notNull(),
  description: varchar("description", { length: 255 }),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;


// ==================== TRANSFER PORTAL ====================

// Football positions
export const footballPositions = [
  "QB", "RB", "FB", "WR", "TE", "OT", "OG", "C", "IOL", "OL",
  "DE", "DT", "NT", "DL", "Edge", "ILB", "OLB", "LB", "CB", "FS", "SS", "S", "DB",
  "K", "P", "LS", "ATH"
] as const;

// Basketball positions
export const basketballPositions = [
  "PG", "SG", "SF", "PF", "C", "G", "F", "G/F", "F/C"
] as const;

// Transfer status
export const transferStatuses = [
  "available", "entered", "committed", "withdrawn", "signed"
] as const;

// Sports enum
export const portalSports = [
  "football", "basketball", "baseball", "softball", "soccer", 
  "volleyball", "track", "swimming", "golf", "tennis", "wrestling",
  "lacrosse", "hockey", "gymnastics", "other"
] as const;

// Divisions
export const divisions = [
  "D1-FBS", "D1-FCS", "D1", "D2", "D3", "NAIA", "JUCO"
] as const;

// Transfer Portal Entries
export const transferPortalEntries = pgTable("transfer_portal_entries", {
  id: serial("id").primaryKey(),
  
  // Player info
  athleteProfileId: int("athleteProfileId"),
  userId: int("userId"),
  fullName: varchar("fullName", { length: 128 }).notNull(),
  
  // Sport & Position
  sport: varchar("sport", { length: 32 }).notNull(),
  position: varchar("position", { length: 16 }).notNull(),
  secondaryPosition: varchar("secondaryPosition", { length: 16 }),
  
  // Physical attributes
  height: varchar("height", { length: 10 }), // "6-2"
  weight: int("weight"), // in lbs
  
  // Academic
  graduationYear: int("graduationYear"),
  eligibilityRemaining: int("eligibilityRemaining"), // years
  gpa: decimal("gpa", { precision: 3, scale: 2 }),
  major: varchar("major", { length: 128 }),
  
  // Current/Previous School
  currentSchool: varchar("currentSchool", { length: 128 }).notNull(),
  currentConference: varchar("currentConference", { length: 64 }),
  currentDivision: varchar("currentDivision", { length: 16 }),
  
  // Transfer Status
  status: pgEnum("status", ["available", "entered", "committed", "withdrawn", "signed"]).default("entered").notNull(),
  newSchool: varchar("newSchool", { length: 128 }),
  newConference: varchar("newConference", { length: 64 }),
  
  // Ratings & Valuations
  playerRating: decimal("playerRating", { precision: 4, scale: 4 }), // 0.8500 format
  nilValuation: int("nilValuation"), // estimated annual NIL value
  starRating: int("starRating"), // 1-5 stars
  
  // Stats & Highlights
  statsJson: text("statsJson"), // JSON of career stats
  highlightVideoUrl: text("highlightVideoUrl"),
  hudlProfileUrl: text("hudlProfileUrl"),
  
  // Contact & Social
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  instagramHandle: varchar("instagramHandle", { length: 64 }),
  twitterHandle: varchar("twitterHandle", { length: 64 }),
  tiktokHandle: varchar("tiktokHandle", { length: 64 }),
  
  // Social metrics
  totalFollowers: int("totalFollowers"),
  engagementRate: decimal("engagementRate", { precision: 4, scale: 2 }),
  
  // Agent/Rep
  hasAgent: boolean("hasAgent").default(false),
  agentName: varchar("agentName", { length: 128 }),
  agentContact: varchar("agentContact", { length: 320 }),
  
  // Preferences
  preferredRegions: text("preferredRegions"), // JSON array
  preferredDivisions: text("preferredDivisions"), // JSON array
  openToAllOffers: boolean("openToAllOffers").default(true),
  
  // Timestamps
  enteredPortalAt: timestamp("enteredPortalAt").defaultNow(),
  committedAt: timestamp("committedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()).notNull(),
  
  // Visibility
  isPublic: boolean("isPublic").default(true).notNull(),
  isVerified: boolean("isVerified").default(false).notNull(),
});

export type TransferPortalEntry = typeof transferPortalEntries.$inferSelect;
export type InsertTransferPortalEntry = typeof transferPortalEntries.$inferInsert;

// Coach Profiles (for schools searching)
export const coachProfiles = pgTable("coach_profiles", {
  id: serial("id").primaryKey(),
  userId: int("userId").notNull(),
  
  // School info
  schoolName: varchar("schoolName", { length: 128 }).notNull(),
  conference: varchar("conference", { length: 64 }),
  division: varchar("division", { length: 16 }),
  sport: varchar("sport", { length: 32 }).notNull(),
  
  // Coach info
  title: varchar("title", { length: 128 }), // "Head Coach", "Recruiting Coordinator"
  positionCoached: varchar("positionCoached", { length: 32 }), // Position they recruit for
  
  // Contact
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  
  // Verification
  isVerified: boolean("isVerified").default(false).notNull(),
  verifiedAt: timestamp("verifiedAt"),
  
  // Subscription
  subscriptionTier: pgEnum("subscriptionTier", ["free", "basic", "pro", "enterprise"]).default("free"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export type CoachProfile = typeof coachProfiles.$inferSelect;
export type InsertCoachProfile = typeof coachProfiles.$inferInsert;

// Coach Watchlists
export const coachWatchlists = pgTable("coach_watchlists", {
  id: serial("id").primaryKey(),
  coachProfileId: int("coachProfileId").notNull(),
  transferPortalEntryId: int("transferPortalEntryId").notNull(),
  notes: text("notes"),
  priority: pgEnum("priority", ["low", "medium", "high", "top"]).default("medium"),
  status: pgEnum("status", ["watching", "contacted", "visited", "offered", "committed", "passed"]).default("watching"),
  addedAt: timestamp("addedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export type CoachWatchlist = typeof coachWatchlists.$inferSelect;
export type InsertCoachWatchlist = typeof coachWatchlists.$inferInsert;

// Saved Searches for Coaches
export const savedSearches = pgTable("saved_searches", {
  id: serial("id").primaryKey(),
  coachProfileId: int("coachProfileId").notNull(),
  name: varchar("name", { length: 128 }).notNull(),
  filtersJson: text("filtersJson").notNull(), // JSON of search filters
  alertsEnabled: boolean("alertsEnabled").default(false),
  lastRunAt: timestamp("lastRunAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SavedSearch = typeof savedSearches.$inferSelect;
export type InsertSavedSearch = typeof savedSearches.$inferInsert;

// Transfer Portal Messages
export const portalMessages = pgTable("portal_messages", {
  id: serial("id").primaryKey(),
  fromUserId: int("fromUserId").notNull(),
  toUserId: int("toUserId").notNull(),
  transferPortalEntryId: int("transferPortalEntryId"),
  subject: varchar("subject", { length: 256 }),
  message: text("message").notNull(),
  isRead: boolean("isRead").default(false).notNull(),
  readAt: timestamp("readAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PortalMessage = typeof portalMessages.$inferSelect;
export type InsertPortalMessage = typeof portalMessages.$inferInsert;

// Transfer Offers
export const transferOffers = pgTable("transfer_offers", {
  id: serial("id").primaryKey(),
  transferPortalEntryId: int("transferPortalEntryId").notNull(),
  coachProfileId: int("coachProfileId").notNull(),
  
  // Offer details
  schoolName: varchar("schoolName", { length: 128 }).notNull(),
  scholarshipType: pgEnum("scholarshipType", ["full", "partial", "walk-on", "preferred-walk-on"]),
  nilOffered: int("nilOffered"), // Annual NIL amount
  
  // Status
  status: pgEnum("status", ["pending", "accepted", "declined", "expired", "withdrawn"]).default("pending"),
  
  // Notes
  offerDetails: text("offerDetails"),
  playerNotes: text("playerNotes"),
  
  // Timestamps
  offeredAt: timestamp("offeredAt").defaultNow().notNull(),
  respondedAt: timestamp("respondedAt"),
  expiresAt: timestamp("expiresAt"),
});

export type TransferOffer = typeof transferOffers.$inferSelect;
export type InsertTransferOffer = typeof transferOffers.$inferInsert;


// ==================== COMMUNITY VOTING & FEEDBACK ====================

// Site Votes - Track which site users prefer
export const siteVotes = pgTable("site_votes", {
  id: serial("id").primaryKey(),
  
  // Voter info (can be anonymous)
  email: varchar("email", { length: 320 }),
  userId: int("userId"),
  
  // Vote
  votedFor: pgEnum("votedFor", ["site_a", "site_b"]).notNull(), // site_a = athlynx.manus.space, site_b = athlynx.ai
  
  // Context
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  referralSource: varchar("referralSource", { length: 255 }),
  
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SiteVote = typeof siteVotes.$inferSelect;
export type InsertSiteVote = typeof siteVotes.$inferInsert;

// Community Feedback - What users love/want improved
export const communityFeedback = pgTable("community_feedback", {
  id: serial("id").primaryKey(),
  
  // Submitter info
  email: varchar("email", { length: 320 }),
  userId: int("userId"),
  name: varchar("name", { length: 128 }),
  
  // Feedback content
  whatTheyLove: text("whatTheyLove"),
  whatCouldBeBetter: text("whatCouldBeBetter"),
  featureRequests: text("featureRequests"),
  generalComments: text("generalComments"),
  
  // Which site they're commenting on
  siteVersion: pgEnum("siteVersion", ["site_a", "site_b", "both", "general"]).default("general"),
  
  // Rating (optional)
  overallRating: int("overallRating"), // 1-5 stars
  
  // Categorization
  feedbackType: pgEnum("feedbackType", ["design", "features", "usability", "performance", "content", "other"]).default("other"),
  priority: pgEnum("priority", ["low", "medium", "high", "critical"]).default("medium"),
  
  // Status tracking
  status: pgEnum("status", ["new", "reviewed", "in_progress", "implemented", "wont_do"]).default("new"),
  adminNotes: text("adminNotes"),
  
  // Context
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  pageUrl: varchar("pageUrl", { length: 500 }),
  
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  reviewedAt: timestamp("reviewedAt"),
});

export type CommunityFeedback = typeof communityFeedback.$inferSelect;
export type InsertCommunityFeedback = typeof communityFeedback.$inferInsert;

// Feature Requests - Specific feature voting
export const featureRequests = pgTable("feature_requests", {
  id: serial("id").primaryKey(),
  
  // Request details
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 64 }),
  
  // Voting
  upvotes: int("upvotes").default(0).notNull(),
  downvotes: int("downvotes").default(0).notNull(),
  
  // Status
  status: pgEnum("status", ["submitted", "under_review", "planned", "in_progress", "completed", "declined"]).default("submitted"),
  
  // Submitter
  submittedByEmail: varchar("submittedByEmail", { length: 320 }),
  submittedByUserId: int("submittedByUserId"),
  
  // Admin response
  adminResponse: text("adminResponse"),
  estimatedRelease: varchar("estimatedRelease", { length: 64 }),
  
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export type FeatureRequest = typeof featureRequests.$inferSelect;
export type InsertFeatureRequest = typeof featureRequests.$inferInsert;

// Feature Request Votes - Track who voted for what
export const featureRequestVotes = pgTable("feature_request_votes", {
  id: serial("id").primaryKey(),
  featureRequestId: int("featureRequestId").notNull(),
  
  // Voter
  email: varchar("email", { length: 320 }),
  userId: int("userId"),
  
  // Vote type
  voteType: pgEnum("voteType", ["upvote", "downvote"]).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type FeatureRequestVote = typeof featureRequestVotes.$inferSelect;
export type InsertFeatureRequestVote = typeof featureRequestVotes.$inferInsert;
