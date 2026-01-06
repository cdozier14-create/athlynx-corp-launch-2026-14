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

// ==================== SUBSCRIPTIONS ====================

export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  plan: mysqlEnum("plan", ["free", "rookie", "starter", "allstar", "elite", "legend"]).default("free").notNull(),
  status: mysqlEnum("subStatus", ["active", "cancelled", "past_due", "trialing"]).default("trialing").notNull(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  currentPeriodStart: timestamp("currentPeriodStart"),
  currentPeriodEnd: timestamp("currentPeriodEnd"),
  trialEndsAt: timestamp("trialEndsAt"),
  cancelledAt: timestamp("cancelledAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

// ==================== À LA CARTE SERVICES ====================

export const userServices = mysqlTable("user_services", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  service: mysqlEnum("service", ["music", "media", "ai_trainer", "ai_recruiter", "content_suite", "messenger_pro", "marketplace"]).notNull(),
  status: mysqlEnum("serviceStatus", ["active", "cancelled", "expired"]).default("active").notNull(),
  stripeSubscriptionId: varchar("stripeSubId", { length: 255 }),
  expiresAt: timestamp("expiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UserService = typeof userServices.$inferSelect;
export type InsertUserService = typeof userServices.$inferInsert;

// ==================== CREDITS SYSTEM ====================

export const userCredits = mysqlTable("user_credits", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  balance: int("balance").default(0).notNull(),
  totalPurchased: int("totalPurchased").default(0).notNull(),
  totalSpent: int("totalSpent").default(0).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserCredits = typeof userCredits.$inferSelect;

export const creditTransactions = mysqlTable("credit_transactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  amount: int("amount").notNull(),
  type: mysqlEnum("txType", ["purchase", "spend", "bonus", "refund"]).notNull(),
  description: varchar("description", { length: 255 }),
  relatedId: int("relatedId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CreditTransaction = typeof creditTransactions.$inferSelect;

// ==================== MEDIA / MUSIC ====================

export const playlists = mysqlTable("playlists", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  coverUrl: text("coverUrl"),
  isPublic: boolean("isPublic").default(true).notNull(),
  category: mysqlEnum("playlistCategory", ["workout", "warmup", "cooldown", "hype", "focus", "custom"]).default("custom"),
  tracksCount: int("tracksCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Playlist = typeof playlists.$inferSelect;

export const tracks = mysqlTable("tracks", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  artist: varchar("artist", { length: 255 }),
  album: varchar("album", { length: 255 }),
  duration: int("duration"),
  audioUrl: text("audioUrl"),
  coverUrl: text("coverUrl"),
  genre: varchar("genre", { length: 64 }),
  bpm: int("bpm"),
  isLicensed: boolean("isLicensed").default(false).notNull(),
  playsCount: int("playsCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Track = typeof tracks.$inferSelect;

export const playlistTracks = mysqlTable("playlist_tracks", {
  id: int("id").autoincrement().primaryKey(),
  playlistId: int("playlistId").notNull(),
  trackId: int("trackId").notNull(),
  position: int("position").notNull(),
  addedAt: timestamp("addedAt").defaultNow().notNull(),
});

// ==================== PODCASTS ====================

export const podcasts = mysqlTable("podcasts", {
  id: int("id").autoincrement().primaryKey(),
  hostId: int("hostId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  coverUrl: text("coverUrl"),
  category: varchar("category", { length: 64 }),
  subscribersCount: int("subscribersCount").default(0).notNull(),
  episodesCount: int("episodesCount").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Podcast = typeof podcasts.$inferSelect;

export const podcastEpisodes = mysqlTable("podcast_episodes", {
  id: int("id").autoincrement().primaryKey(),
  podcastId: int("podcastId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  audioUrl: text("audioUrl"),
  duration: int("duration"),
  episodeNumber: int("episodeNumber"),
  playsCount: int("playsCount").default(0).notNull(),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PodcastEpisode = typeof podcastEpisodes.$inferSelect;

// ==================== STORIES (24-hour content) ====================

export const stories = mysqlTable("stories", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  mediaUrl: text("mediaUrl").notNull(),
  mediaType: mysqlEnum("storyMediaType", ["image", "video"]).default("image").notNull(),
  caption: text("caption"),
  viewsCount: int("viewsCount").default(0).notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Story = typeof stories.$inferSelect;

export const storyViews = mysqlTable("story_views", {
  id: int("id").autoincrement().primaryKey(),
  storyId: int("storyId").notNull(),
  viewerId: int("viewerId").notNull(),
  viewedAt: timestamp("viewedAt").defaultNow().notNull(),
});

// ==================== REELS / HIGHLIGHTS ====================

export const reels = mysqlTable("reels", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  videoUrl: text("videoUrl").notNull(),
  thumbnailUrl: text("thumbnailUrl"),
  duration: int("duration"),
  musicTrackId: int("musicTrackId"),
  viewsCount: int("viewsCount").default(0).notNull(),
  likesCount: int("likesCount").default(0).notNull(),
  commentsCount: int("commentsCount").default(0).notNull(),
  sharesCount: int("sharesCount").default(0).notNull(),
  tags: json("tags"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Reel = typeof reels.$inferSelect;

// ==================== HIGHLIGHT TAPES ====================

export const highlightTapes = mysqlTable("highlight_tapes", {
  id: int("id").autoincrement().primaryKey(),
  athleteId: int("athleteId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  videoUrl: text("videoUrl"),
  thumbnailUrl: text("thumbnailUrl"),
  duration: int("duration"),
  sport: varchar("sport", { length: 64 }),
  season: varchar("season", { length: 32 }),
  viewsCount: int("viewsCount").default(0).notNull(),
  isPublic: boolean("isPublic").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type HighlightTape = typeof highlightTapes.$inferSelect;

// ==================== NEWSLETTERS ====================

export const newsletters = mysqlTable("newsletters", {
  id: int("id").autoincrement().primaryKey(),
  authorId: int("authorId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  coverUrl: text("coverUrl"),
  status: mysqlEnum("newsletterStatus", ["draft", "scheduled", "sent"]).default("draft").notNull(),
  subscribersCount: int("subscribersCount").default(0).notNull(),
  opensCount: int("opensCount").default(0).notNull(),
  scheduledFor: timestamp("scheduledFor"),
  sentAt: timestamp("sentAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Newsletter = typeof newsletters.$inferSelect;

export const newsletterSubscribers = mysqlTable("newsletter_subscribers", {
  id: int("id").autoincrement().primaryKey(),
  newsletterId: int("newsletterId").notNull(),
  userId: int("userId").notNull(),
  subscribedAt: timestamp("subscribedAt").defaultNow().notNull(),
});

// ==================== MARKETPLACE ====================

export const marketplaceListings = mysqlTable("marketplace_listings", {
  id: int("id").autoincrement().primaryKey(),
  sellerId: int("sellerId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: mysqlEnum("listingCategory", ["nil_deal", "merch", "service", "training", "coaching", "appearance"]).notNull(),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("USD").notNull(),
  imageUrls: json("imageUrls"),
  status: mysqlEnum("listingStatus", ["active", "sold", "expired", "cancelled"]).default("active").notNull(),
  viewsCount: int("viewsCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MarketplaceListing = typeof marketplaceListings.$inferSelect;

export const marketplaceOrders = mysqlTable("marketplace_orders", {
  id: int("id").autoincrement().primaryKey(),
  listingId: int("listingId").notNull(),
  buyerId: int("buyerId").notNull(),
  sellerId: int("sellerId").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  platformFee: decimal("platformFee", { precision: 12, scale: 2 }).notNull(),
  status: mysqlEnum("orderStatus", ["pending", "paid", "completed", "refunded", "disputed"]).default("pending").notNull(),
  stripePaymentId: varchar("stripePaymentId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MarketplaceOrder = typeof marketplaceOrders.$inferSelect;

// ==================== AI AGENTS ====================

export const aiAgentSessions = mysqlTable("ai_agent_sessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  agentType: mysqlEnum("agentType", ["wizard", "trainer", "recruiter", "content", "sales", "coach", "manager"]).notNull(),
  status: mysqlEnum("sessionStatus", ["active", "completed", "cancelled"]).default("active").notNull(),
  context: json("context"),
  messagesCount: int("messagesCount").default(0).notNull(),
  creditsUsed: int("creditsUsed").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AiAgentSession = typeof aiAgentSessions.$inferSelect;

export const aiAgentMessages = mysqlTable("ai_agent_messages", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: int("sessionId").notNull(),
  role: mysqlEnum("msgRole", ["user", "assistant", "system"]).notNull(),
  content: text("content").notNull(),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AiAgentMessage = typeof aiAgentMessages.$inferSelect;

// ==================== SOCIAL CONNECTIONS ====================

export const socialConnections = mysqlTable("social_connections", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  platform: mysqlEnum("platform", ["instagram", "facebook", "twitter", "linkedin", "tiktok", "youtube"]).notNull(),
  platformUserId: varchar("platformUserId", { length: 255 }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  username: varchar("username", { length: 255 }),
  followersCount: int("followersCount").default(0),
  isConnected: boolean("isConnected").default(true).notNull(),
  connectedAt: timestamp("connectedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SocialConnection = typeof socialConnections.$inferSelect;

// ==================== CONTENT CREATION ====================

export const contentProjects = mysqlTable("content_projects", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  type: mysqlEnum("projectType", ["reel", "highlight", "post", "story", "podcast"]).notNull(),
  status: mysqlEnum("projectStatus", ["draft", "editing", "rendering", "completed"]).default("draft").notNull(),
  assets: json("assets"),
  settings: json("settings"),
  outputUrl: text("outputUrl"),
  creditsUsed: int("creditsUsed").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ContentProject = typeof contentProjects.$inferSelect;
