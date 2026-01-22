/**
 * ATHLYNX VIRAL GROWTH ALGORITHM
 * A DOZIER HOLDINGS GROUP COMPANY
 * Powered by Manus AI
 * 
 * THE FACEBOOK/META PLAYBOOK:
 * 1. Make it FREE to join
 * 2. Make sharing REWARDING
 * 3. Create FOMO (Fear of Missing Out)
 * 4. Gamify EVERYTHING
 * 5. DATA is the real product
 */

// ==================== REFERRAL SYSTEM ====================
// Every user becomes a growth engine

export interface ReferralReward {
  action: string;
  creditReward: number;
  cashReward: number;
  description: string;
}

export const REFERRAL_REWARDS: ReferralReward[] = [
  {
    action: "signup",
    creditReward: 50,
    cashReward: 0,
    description: "Friend creates an account",
  },
  {
    action: "profile_complete",
    creditReward: 25,
    cashReward: 0,
    description: "Friend completes their profile",
  },
  {
    action: "first_subscription",
    creditReward: 100,
    cashReward: 10,
    description: "Friend subscribes to any paid plan",
  },
  {
    action: "recurring_subscription",
    creditReward: 0,
    cashReward: 0, // 10% recurring commission
    description: "10% of friend's subscription forever",
  },
  {
    action: "first_deal",
    creditReward: 200,
    cashReward: 25,
    description: "Friend closes their first NIL deal",
  },
];

export interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  totalCreditsEarned: number;
  totalCashEarned: number;
  pendingCash: number;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond";
  nextTierAt: number;
  bonusMultiplier: number;
}

export function calculateReferralTier(totalReferrals: number): ReferralStats["tier"] {
  if (totalReferrals >= 100) return "Diamond";
  if (totalReferrals >= 50) return "Platinum";
  if (totalReferrals >= 25) return "Gold";
  if (totalReferrals >= 10) return "Silver";
  return "Bronze";
}

export function getReferralBonusMultiplier(tier: ReferralStats["tier"]): number {
  const multipliers = {
    Bronze: 1.0,
    Silver: 1.25,
    Gold: 1.5,
    Platinum: 2.0,
    Diamond: 3.0,
  };
  return multipliers[tier];
}

// ==================== GAMIFICATION SYSTEM ====================
// Make users addicted to progress

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  creditReward: number;
  xpReward: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  condition: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  // Onboarding
  { id: "first_steps", name: "First Steps", description: "Complete your profile", icon: "👣", creditReward: 15, xpReward: 100, rarity: "common", condition: "profile_complete" },
  { id: "social_butterfly", name: "Social Butterfly", description: "Connect all social accounts", icon: "🦋", creditReward: 25, xpReward: 200, rarity: "common", condition: "all_socials_connected" },
  { id: "highlight_reel", name: "Highlight Reel", description: "Upload your first highlight video", icon: "🎬", creditReward: 10, xpReward: 150, rarity: "common", condition: "first_highlight" },
  
  // Engagement
  { id: "networker", name: "Networker", description: "Connect with 10 athletes", icon: "🤝", creditReward: 20, xpReward: 300, rarity: "rare", condition: "10_connections" },
  { id: "influencer", name: "Influencer", description: "Get 100 profile views", icon: "👀", creditReward: 30, xpReward: 400, rarity: "rare", condition: "100_views" },
  { id: "trendsetter", name: "Trendsetter", description: "Appear on trending list", icon: "📈", creditReward: 50, xpReward: 500, rarity: "epic", condition: "trending" },
  
  // Deals
  { id: "first_deal", name: "First Deal", description: "Close your first NIL deal", icon: "💰", creditReward: 100, xpReward: 1000, rarity: "epic", condition: "first_deal" },
  { id: "deal_maker", name: "Deal Maker", description: "Close 5 NIL deals", icon: "🤑", creditReward: 200, xpReward: 2000, rarity: "legendary", condition: "5_deals" },
  { id: "six_figure", name: "Six Figure Club", description: "Earn $100K+ in NIL deals", icon: "💎", creditReward: 500, xpReward: 5000, rarity: "legendary", condition: "100k_earned" },
  
  // Referrals
  { id: "recruiter", name: "Recruiter", description: "Refer 5 friends", icon: "📢", creditReward: 75, xpReward: 500, rarity: "rare", condition: "5_referrals" },
  { id: "ambassador", name: "Ambassador", description: "Refer 25 friends", icon: "🏆", creditReward: 250, xpReward: 2500, rarity: "legendary", condition: "25_referrals" },
  
  // Streaks
  { id: "week_warrior", name: "Week Warrior", description: "7-day login streak", icon: "🔥", creditReward: 15, xpReward: 200, rarity: "common", condition: "7_day_streak" },
  { id: "month_master", name: "Month Master", description: "30-day login streak", icon: "⚡", creditReward: 50, xpReward: 1000, rarity: "epic", condition: "30_day_streak" },
];

export interface UserLevel {
  level: number;
  title: string;
  xpRequired: number;
  perks: string[];
}

export const LEVELS: UserLevel[] = [
  { level: 1, title: "Rookie", xpRequired: 0, perks: ["Basic profile"] },
  { level: 2, title: "Prospect", xpRequired: 500, perks: ["+5 credits/month"] },
  { level: 3, title: "Rising Star", xpRequired: 1500, perks: ["+10 credits/month", "Priority support"] },
  { level: 4, title: "All-Star", xpRequired: 3500, perks: ["+20 credits/month", "Verified badge"] },
  { level: 5, title: "Elite", xpRequired: 7500, perks: ["+35 credits/month", "Featured profile"] },
  { level: 6, title: "Pro", xpRequired: 15000, perks: ["+50 credits/month", "Brand priority"] },
  { level: 7, title: "Legend", xpRequired: 30000, perks: ["+75 credits/month", "VIP access"] },
  { level: 8, title: "Hall of Fame", xpRequired: 60000, perks: ["+100 credits/month", "Lifetime benefits"] },
  { level: 9, title: "GOAT", xpRequired: 100000, perks: ["Unlimited credits", "Advisory board invite"] },
];

export function calculateLevel(xp: number): UserLevel {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xpRequired) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

// ==================== FOMO ENGINE ====================
// Create urgency and scarcity

export interface FOMOTrigger {
  type: "limited_time" | "limited_spots" | "social_proof" | "price_increase" | "exclusive";
  message: string;
  urgency: number; // 1-10
  expiresAt?: Date;
}

export function generateFOMOTriggers(userContext: {
  isNewUser: boolean;
  daysOnPlatform: number;
  hasSubscription: boolean;
  profileViews: number;
  brandInterest: number;
}): FOMOTrigger[] {
  const triggers: FOMOTrigger[] = [];
  
  // New user urgency
  if (userContext.isNewUser) {
    triggers.push({
      type: "limited_time",
      message: "🎁 Welcome bonus: Get 50% off your first month! Expires in 24 hours",
      urgency: 9,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
  }
  
  // Social proof
  if (userContext.profileViews > 10) {
    triggers.push({
      type: "social_proof",
      message: `👀 ${userContext.profileViews} brands viewed your profile this week!`,
      urgency: 7,
    });
  }
  
  // Brand interest
  if (userContext.brandInterest > 0) {
    triggers.push({
      type: "exclusive",
      message: `🔥 ${userContext.brandInterest} brands are interested in partnering with you!`,
      urgency: 8,
    });
  }
  
  // Upgrade urgency
  if (!userContext.hasSubscription && userContext.daysOnPlatform > 3) {
    triggers.push({
      type: "price_increase",
      message: "⚠️ Prices increasing soon! Lock in current rates now",
      urgency: 6,
    });
  }
  
  // Limited spots
  triggers.push({
    type: "limited_spots",
    message: "🏆 Only 100 MVP spots remaining this month!",
    urgency: 7,
  });
  
  return triggers.sort((a, b) => b.urgency - a.urgency);
}

// ==================== SOCIAL SHARING OPTIMIZER ====================
// Maximize viral spread

export interface ShareContent {
  platform: "twitter" | "instagram" | "tiktok" | "facebook" | "linkedin";
  text: string;
  hashtags: string[];
  bestTimeToPost: string;
  expectedReach: number;
}

export function generateShareContent(
  athleteName: string,
  achievement: string,
  nilValue?: number
): ShareContent[] {
  const contents: ShareContent[] = [];
  
  // Twitter/X
  contents.push({
    platform: "twitter",
    text: `Just ${achievement} on @ATHLYNX! 🚀 ${nilValue ? `My NIL value: $${nilValue.toLocaleString()}` : ""} Join me and discover YOUR value! #NIL #ATHLYNX`,
    hashtags: ["#NIL", "#ATHLYNX", "#StudentAthlete", "#DreamsComeTrue"],
    bestTimeToPost: "12:00 PM - 3:00 PM EST",
    expectedReach: 500,
  });
  
  // Instagram
  contents.push({
    platform: "instagram",
    text: `${achievement} 🏆\n\nMy journey on @ATHLYNX is just getting started. Ready to see what you're worth? Link in bio!\n\n#NIL #StudentAthlete #ATHLYNX #CollegeAthlete #NILDeals`,
    hashtags: ["#NIL", "#StudentAthlete", "#ATHLYNX", "#CollegeAthlete", "#NILDeals", "#AthleteLife"],
    bestTimeToPost: "11:00 AM or 7:00 PM EST",
    expectedReach: 1000,
  });
  
  // TikTok
  contents.push({
    platform: "tiktok",
    text: `POV: You just found out your NIL is worth ${nilValue ? `$${nilValue.toLocaleString()}` : "more than you thought"} 🤯 #NIL #CollegeAthlete #ATHLYNX`,
    hashtags: ["#NIL", "#CollegeAthlete", "#ATHLYNX", "#StudentAthlete", "#fyp"],
    bestTimeToPost: "7:00 PM - 9:00 PM EST",
    expectedReach: 5000,
  });
  
  // LinkedIn
  contents.push({
    platform: "linkedin",
    text: `Excited to share that I've ${achievement} through ATHLYNX! The platform is revolutionizing how student-athletes build their personal brand and secure NIL opportunities. If you're an athlete looking to maximize your potential, I highly recommend checking it out. #NIL #StudentAthlete #PersonalBrand`,
    hashtags: ["#NIL", "#StudentAthlete", "#PersonalBrand", "#SportsBusiness"],
    bestTimeToPost: "8:00 AM - 10:00 AM EST",
    expectedReach: 300,
  });
  
  return contents;
}

// ==================== A/B TESTING FRAMEWORK ====================
// Optimize everything

export interface ABTest {
  id: string;
  name: string;
  variants: {
    id: string;
    name: string;
    weight: number; // 0-1
  }[];
  metric: string;
  status: "running" | "completed" | "paused";
}

export const ACTIVE_TESTS: ABTest[] = [
  {
    id: "pricing_page_cta",
    name: "Pricing Page CTA Button",
    variants: [
      { id: "a", name: "Get Started Free", weight: 0.5 },
      { id: "b", name: "Start Your Journey", weight: 0.5 },
    ],
    metric: "conversion_rate",
    status: "running",
  },
  {
    id: "onboarding_flow",
    name: "Onboarding Flow Length",
    variants: [
      { id: "a", name: "3-step quick", weight: 0.33 },
      { id: "b", name: "5-step standard", weight: 0.34 },
      { id: "c", name: "7-step detailed", weight: 0.33 },
    ],
    metric: "completion_rate",
    status: "running",
  },
  {
    id: "credit_upsell",
    name: "Credit Upsell Timing",
    variants: [
      { id: "a", name: "After 5 credits used", weight: 0.5 },
      { id: "b", name: "After 8 credits used", weight: 0.5 },
    ],
    metric: "purchase_rate",
    status: "running",
  },
];

export function assignVariant(testId: string, userId: string): string {
  const test = ACTIVE_TESTS.find(t => t.id === testId);
  if (!test) return "control";
  
  // Deterministic assignment based on user ID
  const hash = userId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (hash % 100) / 100;
  
  let cumulative = 0;
  for (const variant of test.variants) {
    cumulative += variant.weight;
    if (random < cumulative) {
      return variant.id;
    }
  }
  
  return test.variants[0].id;
}

// ==================== CONVERSION FUNNEL ====================
// Track and optimize the money path

export interface FunnelStage {
  name: string;
  description: string;
  targetConversion: number;
  actions: string[];
}

export const CONVERSION_FUNNEL: FunnelStage[] = [
  {
    name: "Awareness",
    description: "User discovers ATHLYNX",
    targetConversion: 0.30, // 30% click through
    actions: ["Social media ads", "Influencer posts", "SEO content", "Referral links"],
  },
  {
    name: "Interest",
    description: "User visits landing page",
    targetConversion: 0.40, // 40% sign up
    actions: ["Compelling hero", "Social proof", "Clear value prop", "Easy signup"],
  },
  {
    name: "Signup",
    description: "User creates account",
    targetConversion: 0.60, // 60% complete profile
    actions: ["Gamified onboarding", "Progress indicators", "Immediate value"],
  },
  {
    name: "Activation",
    description: "User completes profile",
    targetConversion: 0.25, // 25% use paid feature
    actions: ["Free credits", "Feature highlights", "Personalized recommendations"],
  },
  {
    name: "Conversion",
    description: "User makes first purchase",
    targetConversion: 0.50, // 50% become recurring
    actions: ["Subscription value", "Credit bundles", "Limited time offers"],
  },
  {
    name: "Retention",
    description: "User becomes recurring customer",
    targetConversion: 0.80, // 80% stay active
    actions: ["Regular engagement", "New features", "Community", "Success stories"],
  },
  {
    name: "Referral",
    description: "User refers others",
    targetConversion: 0.20, // 20% refer at least 1
    actions: ["Referral rewards", "Easy sharing", "Social proof"],
  },
];

// Calculate expected revenue per visitor
export function calculateLTV(): number {
  let conversionRate = 1;
  for (const stage of CONVERSION_FUNNEL) {
    conversionRate *= stage.targetConversion;
  }
  
  // Average revenue per converted user
  const avgSubscriptionValue = 19.99 * 12; // Annual value
  const avgCreditPurchases = 50; // Per year
  const avgReferralValue = 30; // Per referral
  
  const ltv = (avgSubscriptionValue + avgCreditPurchases + avgReferralValue) * conversionRate * 100;
  
  return Math.round(ltv * 100) / 100;
}
