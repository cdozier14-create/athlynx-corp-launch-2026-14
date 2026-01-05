import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "athlete", "parent", "coach", "brand"]).default("user").notNull(),
  avatarUrl: text("avatarUrl"),
  bio: text("bio"),
  isVip: boolean("isVip").default(false).notNull(),
  vipCodeUsed: varchar("vipCodeUsed", { length: 32 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ==================== VIP CODES ====================

export const vipCodes = mysqlTable("vip_codes", {
  id: int("id").autoincrement().primaryKey(),
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

export const athleteProfiles = mysqlTable("athlete_profiles", {
  id: int("id").autoincrement().primaryKey(),
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
  transferStatus: mysqlEnum("transferStatus", ["not_in_portal", "exploring", "in_portal", "committed"]).default("not_in_portal"),
  nilStatus: mysqlEnum("nilStatus", ["not_available", "available", "active_deals"]).default("not_available"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AthleteProfile = typeof athleteProfiles.$inferSelect;
export type InsertAthleteProfile = typeof athleteProfiles.$inferInsert;

// ==================== NIL DEALS ====================

export const nilDeals = mysqlTable("nil_deals", {
  id: int("id").autoincrement().primaryKey(),
  athleteId: int("athleteId").notNull(),
  brandId: int("brandId"),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  value: decimal("value", { precision: 12, scale: 2 }),
  status: mysqlEnum("status", ["pending", "active", "completed", "cancelled"]).default("pending").notNull(),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  terms: text("terms"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type NilDeal = typeof nilDeals.$inferSelect;
export type InsertNilDeal = typeof nilDeals.$inferInsert;

// ==================== POSTS / SOCIAL FEED ====================

export const posts = mysqlTable("posts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  content: text("content"),
  mediaUrls: json("mediaUrls"),
  postType: mysqlEnum("postType", ["text", "image", "video", "highlight", "deal", "announcement"]).default("text").notNull(),
  visibility: mysqlEnum("visibility", ["public", "followers", "private"]).default("public").notNull(),
  likesCount: int("likesCount").default(0).notNull(),
  commentsCount: int("commentsCount").default(0).notNull(),
  sharesCount: int("sharesCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Post = typeof posts.$inferSelect;
export type InsertPost = typeof posts.$inferInsert;

// ==================== COMMENTS ====================

export const comments = mysqlTable("comments", {
  id: int("id").autoincrement().primaryKey(),
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

export const likes = mysqlTable("likes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  postId: int("postId"),
  commentId: int("commentId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Like = typeof likes.$inferSelect;
export type InsertLike = typeof likes.$inferInsert;

// ==================== FOLLOWS ====================

export const follows = mysqlTable("follows", {
  id: int("id").autoincrement().primaryKey(),
  followerId: int("followerId").notNull(),
  followingId: int("followingId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Follow = typeof follows.$inferSelect;
export type InsertFollow = typeof follows.$inferInsert;

// ==================== MESSAGES ====================

export const conversations = mysqlTable("conversations", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", ["direct", "group"]).default("direct").notNull(),
  name: varchar("name", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = typeof conversations.$inferInsert;

export const conversationParticipants = mysqlTable("conversation_participants", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversationId").notNull(),
  userId: int("userId").notNull(),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
  lastReadAt: timestamp("lastReadAt"),
});

export type ConversationParticipant = typeof conversationParticipants.$inferSelect;

export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversationId").notNull(),
  senderId: int("senderId").notNull(),
  content: text("content"),
  mediaUrl: text("mediaUrl"),
  messageType: mysqlEnum("messageType", ["text", "image", "video", "file", "system"]).default("text").notNull(),
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

// ==================== WAITLIST / EARLY ACCESS ====================

export const waitlist = mysqlTable("waitlist", {
  id: int("id").autoincrement().primaryKey(),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }),
  role: mysqlEnum("waitlistRole", ["athlete", "parent", "coach", "brand"]).notNull(),
  sport: varchar("sport", { length: 64 }),
  referralCode: varchar("referralCode", { length: 32 }),
  status: mysqlEnum("waitlistStatus", ["pending", "approved", "invited"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WaitlistEntry = typeof waitlist.$inferSelect;
export type InsertWaitlistEntry = typeof waitlist.$inferInsert;

// ==================== NOTIFICATIONS ====================

export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
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

export const workouts = mysqlTable("workouts", {
  id: int("id").autoincrement().primaryKey(),
  athleteId: int("athleteId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  sport: varchar("sport", { length: 64 }),
  duration: int("duration"),
  intensity: mysqlEnum("intensity", ["low", "medium", "high", "extreme"]).default("medium"),
  exercises: json("exercises"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Workout = typeof workouts.$inferSelect;
export type InsertWorkout = typeof workouts.$inferInsert;

// ==================== PLAYBOOKS / STRATEGIES ====================

export const playbooks = mysqlTable("playbooks", {
  id: int("id").autoincrement().primaryKey(),
  creatorId: int("creatorId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  sport: varchar("sport", { length: 64 }),
  category: varchar("category", { length: 64 }),
  content: json("content"),
  isPublic: boolean("isPublic").default(false).notNull(),
  viewsCount: int("viewsCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Playbook = typeof playbooks.$inferSelect;
export type InsertPlaybook = typeof playbooks.$inferInsert;

// ==================== TRANSFER PORTAL ====================

export const transferEntries = mysqlTable("transfer_entries", {
  id: int("id").autoincrement().primaryKey(),
  athleteId: int("athleteId").notNull(),
  currentSchool: varchar("currentSchool", { length: 255 }),
  desiredSchools: json("desiredSchools"),
  enteredPortalAt: timestamp("enteredPortalAt"),
  status: mysqlEnum("transferStatus2", ["exploring", "in_portal", "committed", "withdrawn"]).default("exploring").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TransferEntry = typeof transferEntries.$inferSelect;
export type InsertTransferEntry = typeof transferEntries.$inferInsert;

// ==================== RECRUITER INTERESTS ====================

export const recruiterInterests = mysqlTable("recruiter_interests", {
  id: int("id").autoincrement().primaryKey(),
  recruiterId: int("recruiterId").notNull(),
  athleteId: int("athleteId").notNull(),
  school: varchar("school", { length: 255 }),
  interestLevel: mysqlEnum("interestLevel", ["watching", "interested", "offering", "committed"]).default("watching").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type RecruiterInterest = typeof recruiterInterests.$inferSelect;
export type InsertRecruiterInterest = typeof recruiterInterests.$inferInsert;