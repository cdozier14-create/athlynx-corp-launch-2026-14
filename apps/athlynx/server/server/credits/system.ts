/**
 * ATHLYNX AI CREDIT SYSTEM
 * A DOZIER HOLDINGS GROUP COMPANY
 * 
 * Like Manus - Credits power AI features
 * "Imagination will take you everywhere" - Einstein
 */

// Credit costs for AI features
export const AI_FEATURE_COSTS = {
  // Analysis & Valuation
  nil_valuation_basic: 10,        // Basic NIL market value estimate
  nil_valuation_full: 50,         // Comprehensive NIL valuation report
  contract_analysis: 30,          // AI contract review and red flags
  market_comparison: 20,          // Compare to similar athletes
  
  // Content & Media
  highlight_review: 15,           // AI feedback on highlight video
  bio_generator: 5,               // Generate professional bio
  social_post_generator: 3,       // Generate social media content
  media_kit_generator: 25,        // Generate complete media kit
  
  // Matching & Discovery
  brand_match_search: 10,         // Find matching brands
  deal_opportunity_scan: 15,      // Scan for NIL opportunities
  transfer_portal_analysis: 20,   // Analyze transfer options
  
  // Communication
  pitch_generator: 10,            // Generate brand pitch
  email_template: 5,              // Generate outreach email
  negotiation_tips: 15,           // AI negotiation advice
  
  // Training & Development
  workout_plan: 10,               // AI-generated workout plan
  nutrition_advice: 10,           // AI nutrition recommendations
  mental_performance: 15,         // Mental performance coaching
  
  // Chat & Support
  ai_chat_message: 1,             // Per message with AI assistant
  ai_coach_session: 25,           // Full AI coaching session
} as const;

// Credit packages for purchase
export const CREDIT_PACKAGES = [
  {
    id: "starter",
    name: "Starter Pack",
    credits: 50,
    price: 4.99,
    pricePerCredit: 0.10,
    popular: false,
  },
  {
    id: "value",
    name: "Value Pack",
    credits: 150,
    price: 12.99,
    pricePerCredit: 0.087,
    savings: "13% savings",
    popular: true,
  },
  {
    id: "pro",
    name: "Pro Pack",
    credits: 500,
    price: 39.99,
    pricePerCredit: 0.08,
    savings: "20% savings",
    popular: false,
  },
  {
    id: "elite",
    name: "Elite Pack",
    credits: 1500,
    price: 99.99,
    pricePerCredit: 0.067,
    savings: "33% savings",
    popular: false,
  },
  {
    id: "enterprise",
    name: "Enterprise Pack",
    credits: 5000,
    price: 299.99,
    pricePerCredit: 0.06,
    savings: "40% savings",
    popular: false,
  },
];

// Monthly credit allocation by subscription tier
export const TIER_MONTHLY_CREDITS = {
  free: 10,           // Rookie - 10 free credits/month
  pro: 100,           // All-Star - 100 credits/month
  elite: 500,         // MVP - 500 credits/month
  brand_starter: 50,  // Brand Starter
  brand_pro: 250,     // Brand Pro
  brand_enterprise: 1000, // Brand Enterprise
} as const;

// Bonus credits for actions
export const BONUS_CREDITS = {
  signup: 25,              // Welcome bonus
  complete_profile: 15,    // Complete your profile
  first_highlight: 10,     // Upload first highlight
  referral_signup: 50,     // When referral signs up
  referral_subscribe: 100, // When referral subscribes
  social_share: 5,         // Share on social media
  review: 10,              // Leave a review
  streak_7_days: 15,       // 7-day login streak
  streak_30_days: 50,      // 30-day login streak
} as const;

export type AIFeature = keyof typeof AI_FEATURE_COSTS;
export type CreditPackageId = typeof CREDIT_PACKAGES[number]["id"];
export type SubscriptionTier = keyof typeof TIER_MONTHLY_CREDITS;
export type BonusAction = keyof typeof BONUS_CREDITS;

/**
 * Get credit cost for an AI feature
 */
export function getFeatureCost(feature: AIFeature): number {
  return AI_FEATURE_COSTS[feature];
}

/**
 * Get credit package by ID
 */
export function getCreditPackage(packageId: string) {
  return CREDIT_PACKAGES.find(p => p.id === packageId);
}

/**
 * Get monthly credit allocation for a tier
 */
export function getMonthlyCredits(tier: SubscriptionTier): number {
  return TIER_MONTHLY_CREDITS[tier] || 0;
}

/**
 * Get bonus credits for an action
 */
export function getBonusCredits(action: BonusAction): number {
  return BONUS_CREDITS[action];
}

/**
 * Check if user has enough credits
 */
export function hasEnoughCredits(balance: number, feature: AIFeature): boolean {
  return balance >= AI_FEATURE_COSTS[feature];
}

/**
 * Calculate credits needed
 */
export function creditsNeeded(balance: number, feature: AIFeature): number {
  const cost = AI_FEATURE_COSTS[feature];
  return Math.max(0, cost - balance);
}
