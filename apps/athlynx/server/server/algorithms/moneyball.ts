/**
 * ATHLYNX MONEYBALL ALGORITHMS
 * A DOZIER HOLDINGS GROUP COMPANY
 * Powered by Manus AI
 * 
 * "DATA IS THE NEW OIL" - The fuel that runs everything
 * 
 * THE SECRET SAUCE - Like Facebook/Meta monetization
 * Athletes use FREE → We collect data → Brands PAY for insights
 */

// ==================== NIL VALUATION ALGORITHM ====================
// Like Moneyball: Find undervalued athletes before they blow up

export interface AthleteMetrics {
  // Social Metrics
  instagramFollowers: number;
  instagramEngagementRate: number;
  tiktokFollowers: number;
  tiktokEngagementRate: number;
  twitterFollowers: number;
  youtubeSubscribers: number;
  
  // Performance Metrics
  sport: string;
  position: string;
  division: string; // D1, D2, D3, NAIA, JUCO
  stats: Record<string, number>;
  awards: string[];
  
  // Market Metrics
  schoolMarketSize: number; // 1-10 scale
  mediaMarketRank: number;
  conferencePrestige: number; // 1-10
  
  // Engagement Metrics
  profileViews: number;
  brandInquiries: number;
  dealHistory: number;
  averageDealValue: number;
}

export interface NILValuation {
  baseValue: number;
  socialValue: number;
  performanceValue: number;
  marketValue: number;
  potentialValue: number;
  totalValue: number;
  confidence: number;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond";
  insights: string[];
  undervalued: boolean;
  growthPotential: number; // 0-100%
}

/**
 * THE MONEYBALL ALGORITHM
 * Calculate true NIL value - find hidden gems
 */
export function calculateNILValuation(metrics: AthleteMetrics): NILValuation {
  // SOCIAL VALUE (40% weight)
  // Instagram: $0.01-0.05 per follower based on engagement
  const igValue = metrics.instagramFollowers * (0.01 + (metrics.instagramEngagementRate * 0.04));
  // TikTok: Higher viral potential
  const ttValue = metrics.tiktokFollowers * (0.008 + (metrics.tiktokEngagementRate * 0.05));
  // Twitter: Lower but valuable for sports
  const twValue = metrics.twitterFollowers * 0.005;
  // YouTube: Highest per-subscriber value
  const ytValue = metrics.youtubeSubscribers * 0.02;
  
  const socialValue = igValue + ttValue + twValue + ytValue;
  
  // PERFORMANCE VALUE (30% weight)
  // Base by division
  const divisionMultiplier: Record<string, number> = {
    "D1": 1.5,
    "D2": 0.8,
    "D3": 0.5,
    "NAIA": 0.4,
    "JUCO": 0.6,
    "HS": 0.3,
  };
  
  // Sport multipliers (based on market demand)
  const sportMultiplier: Record<string, number> = {
    "Football": 2.0,
    "Basketball": 1.8,
    "Baseball": 1.2,
    "Soccer": 1.0,
    "Volleyball": 0.9,
    "Track & Field": 0.7,
    "Swimming": 0.6,
    "Golf": 1.1,
    "Tennis": 0.8,
    "Softball": 0.8,
  };
  
  const divMult = divisionMultiplier[metrics.division] || 1.0;
  const sportMult = sportMultiplier[metrics.sport] || 1.0;
  const awardsBonus = metrics.awards.length * 500;
  
  const performanceValue = (5000 * divMult * sportMult) + awardsBonus;
  
  // MARKET VALUE (20% weight)
  const marketValue = 
    (metrics.schoolMarketSize * 200) +
    (metrics.conferencePrestige * 300) +
    ((100 - metrics.mediaMarketRank) * 10);
  
  // POTENTIAL VALUE (10% weight)
  // Based on engagement trends and brand interest
  const engagementScore = (metrics.profileViews / 100) + (metrics.brandInquiries * 50);
  const dealHistoryBonus = metrics.dealHistory > 0 
    ? metrics.averageDealValue * 0.5 
    : 0;
  
  const potentialValue = engagementScore + dealHistoryBonus;
  
  // TOTAL VALUATION
  const baseValue = socialValue + performanceValue + marketValue + potentialValue;
  
  // Apply confidence factor (higher data = higher confidence)
  const dataPoints = [
    metrics.instagramFollowers > 0,
    metrics.tiktokFollowers > 0,
    metrics.stats && Object.keys(metrics.stats).length > 0,
    metrics.awards.length > 0,
    metrics.profileViews > 0,
  ].filter(Boolean).length;
  
  const confidence = Math.min(95, 50 + (dataPoints * 9));
  
  // Determine tier
  let tier: NILValuation["tier"];
  if (baseValue >= 100000) tier = "Diamond";
  else if (baseValue >= 50000) tier = "Platinum";
  else if (baseValue >= 20000) tier = "Gold";
  else if (baseValue >= 5000) tier = "Silver";
  else tier = "Bronze";
  
  // MONEYBALL INSIGHT: Is this athlete undervalued?
  const expectedValue = socialValue * 2.5; // Market typically overvalues social
  const undervalued = performanceValue + marketValue > expectedValue;
  const growthPotential = Math.min(100, (potentialValue / baseValue) * 200);
  
  // Generate insights
  const insights: string[] = [];
  if (undervalued) {
    insights.push("🎯 MONEYBALL ALERT: This athlete is undervalued by the market!");
  }
  if (metrics.tiktokEngagementRate > 0.05) {
    insights.push("📈 High TikTok engagement - viral potential detected");
  }
  if (growthPotential > 50) {
    insights.push("🚀 Strong growth trajectory - consider early partnership");
  }
  if (metrics.brandInquiries > 5) {
    insights.push("🔥 High brand interest - competitive market");
  }
  
  return {
    baseValue: Math.round(baseValue),
    socialValue: Math.round(socialValue),
    performanceValue: Math.round(performanceValue),
    marketValue: Math.round(marketValue),
    potentialValue: Math.round(potentialValue),
    totalValue: Math.round(baseValue),
    confidence,
    tier,
    insights,
    undervalued,
    growthPotential: Math.round(growthPotential),
  };
}

// ==================== VIRAL PREDICTION ALGORITHM ====================
// Predict which athletes are about to blow up

export interface ViralPrediction {
  score: number; // 0-100
  probability: number; // 0-1
  timeframe: string;
  triggers: string[];
  recommendedAction: string;
}

export function predictViralPotential(
  metrics: AthleteMetrics,
  recentActivity: {
    followerGrowthRate: number; // % per week
    engagementSpike: boolean;
    mediaAppearances: number;
    upcomingEvents: string[];
  }
): ViralPrediction {
  let score = 0;
  const triggers: string[] = [];
  
  // Follower growth rate (exponential growth indicator)
  if (recentActivity.followerGrowthRate > 10) {
    score += 30;
    triggers.push("Exponential follower growth detected");
  } else if (recentActivity.followerGrowthRate > 5) {
    score += 15;
    triggers.push("Strong follower growth");
  }
  
  // Engagement spike
  if (recentActivity.engagementSpike) {
    score += 25;
    triggers.push("Recent engagement spike - content going viral");
  }
  
  // Media appearances
  if (recentActivity.mediaAppearances > 0) {
    score += recentActivity.mediaAppearances * 10;
    triggers.push(`${recentActivity.mediaAppearances} recent media appearances`);
  }
  
  // Upcoming events (championship, draft, etc.)
  if (recentActivity.upcomingEvents.length > 0) {
    score += recentActivity.upcomingEvents.length * 15;
    triggers.push(`Upcoming: ${recentActivity.upcomingEvents.join(", ")}`);
  }
  
  // Base engagement quality
  const avgEngagement = (metrics.instagramEngagementRate + metrics.tiktokEngagementRate) / 2;
  if (avgEngagement > 0.08) {
    score += 20;
    triggers.push("Exceptional engagement rate");
  }
  
  score = Math.min(100, score);
  const probability = score / 100;
  
  let timeframe: string;
  let recommendedAction: string;
  
  if (score >= 80) {
    timeframe = "1-2 weeks";
    recommendedAction = "URGENT: Lock in partnership NOW before price increases";
  } else if (score >= 60) {
    timeframe = "1-2 months";
    recommendedAction = "HIGH PRIORITY: Initiate contact immediately";
  } else if (score >= 40) {
    timeframe = "3-6 months";
    recommendedAction = "WATCH: Add to monitoring list";
  } else {
    timeframe = "6+ months";
    recommendedAction = "NURTURE: Build relationship for future opportunity";
  }
  
  return {
    score,
    probability,
    timeframe,
    triggers,
    recommendedAction,
  };
}

// ==================== BRAND MATCH ALGORITHM ====================
// Match athletes with perfect brand partners

export interface BrandProfile {
  id: string;
  name: string;
  industry: string;
  targetAudience: string[];
  budget: number;
  values: string[];
  preferredSports: string[];
  preferredDivisions: string[];
  minFollowers: number;
  maxFollowers: number;
}

export interface MatchResult {
  score: number; // 0-100
  reasons: string[];
  estimatedROI: number;
  suggestedDealValue: number;
  dealType: "Post" | "Ambassador" | "Long-term" | "Event";
}

export function matchAthleteToBrand(
  athlete: AthleteMetrics,
  brand: BrandProfile
): MatchResult {
  let score = 0;
  const reasons: string[] = [];
  
  // Sport match
  if (brand.preferredSports.includes(athlete.sport)) {
    score += 25;
    reasons.push(`Sport alignment: ${athlete.sport}`);
  }
  
  // Division match
  if (brand.preferredDivisions.includes(athlete.division)) {
    score += 15;
    reasons.push(`Division match: ${athlete.division}`);
  }
  
  // Follower range match
  const totalFollowers = athlete.instagramFollowers + athlete.tiktokFollowers + athlete.twitterFollowers;
  if (totalFollowers >= brand.minFollowers && totalFollowers <= brand.maxFollowers) {
    score += 20;
    reasons.push("Audience size within target range");
  }
  
  // Engagement quality
  const avgEngagement = (athlete.instagramEngagementRate + athlete.tiktokEngagementRate) / 2;
  if (avgEngagement > 0.05) {
    score += 20;
    reasons.push("High engagement rate = better ROI");
  } else if (avgEngagement > 0.03) {
    score += 10;
    reasons.push("Good engagement rate");
  }
  
  // Market alignment
  if (athlete.schoolMarketSize >= 7) {
    score += 10;
    reasons.push("Large market exposure");
  }
  
  // Conference prestige
  if (athlete.conferencePrestige >= 8) {
    score += 10;
    reasons.push("High-profile conference");
  }
  
  score = Math.min(100, score);
  
  // Calculate estimated ROI
  const cpm = 15; // Cost per 1000 impressions
  const estimatedReach = totalFollowers * avgEngagement * 10;
  const estimatedROI = (estimatedReach / 1000) * cpm;
  
  // Suggest deal value
  const suggestedDealValue = Math.round(estimatedROI * 0.3); // 30% of estimated value
  
  // Determine deal type
  let dealType: MatchResult["dealType"];
  if (score >= 80 && brand.budget >= 10000) {
    dealType = "Ambassador";
  } else if (score >= 60) {
    dealType = "Long-term";
  } else if (score >= 40) {
    dealType = "Post";
  } else {
    dealType = "Event";
  }
  
  return {
    score,
    reasons,
    estimatedROI: Math.round(estimatedROI),
    suggestedDealValue,
    dealType,
  };
}

// ==================== TRENDING ALGORITHM ====================
// What's hot right now - sell this data to media/brands

export interface TrendingAthlete {
  athleteId: string;
  name: string;
  sport: string;
  trendScore: number;
  trendReason: string;
  momentum: "rising" | "stable" | "falling";
  predictedPeakDays: number;
}

export function calculateTrendingScore(
  athleteId: string,
  name: string,
  sport: string,
  activity: {
    profileViewsToday: number;
    profileViewsYesterday: number;
    mentionsToday: number;
    searchesThisWeek: number;
    newFollowersToday: number;
  }
): TrendingAthlete {
  // View momentum
  const viewGrowth = activity.profileViewsYesterday > 0
    ? (activity.profileViewsToday - activity.profileViewsYesterday) / activity.profileViewsYesterday
    : activity.profileViewsToday > 0 ? 1 : 0;
  
  // Calculate trend score
  let trendScore = 0;
  trendScore += Math.min(40, activity.profileViewsToday / 10);
  trendScore += Math.min(30, activity.mentionsToday * 5);
  trendScore += Math.min(20, activity.searchesThisWeek / 5);
  trendScore += Math.min(10, activity.newFollowersToday / 100);
  
  trendScore = Math.min(100, Math.round(trendScore));
  
  // Determine momentum
  let momentum: TrendingAthlete["momentum"];
  if (viewGrowth > 0.2) momentum = "rising";
  else if (viewGrowth < -0.2) momentum = "falling";
  else momentum = "stable";
  
  // Determine trend reason
  let trendReason: string;
  if (activity.mentionsToday > 10) {
    trendReason = "High social media mentions";
  } else if (activity.profileViewsToday > 500) {
    trendReason = "Surge in profile views";
  } else if (activity.newFollowersToday > 1000) {
    trendReason = "Rapid follower growth";
  } else {
    trendReason = "Consistent engagement";
  }
  
  // Predict peak
  const predictedPeakDays = momentum === "rising" ? 3 : momentum === "stable" ? 1 : 0;
  
  return {
    athleteId,
    name,
    sport,
    trendScore,
    trendReason,
    momentum,
    predictedPeakDays,
  };
}

// ==================== REVENUE OPTIMIZATION ALGORITHM ====================
// Maximize platform revenue - THE MONEY MACHINE

export interface RevenueOpportunity {
  type: "subscription_upsell" | "credit_purchase" | "brand_lead" | "data_sale" | "premium_feature";
  targetUserId: string;
  estimatedValue: number;
  probability: number;
  recommendedAction: string;
  urgency: "low" | "medium" | "high" | "critical";
}

export function identifyRevenueOpportunities(
  userId: string,
  userType: "athlete" | "brand",
  currentTier: string,
  activity: {
    daysActive: number;
    featuresUsed: string[];
    creditsRemaining: number;
    lastPurchase: Date | null;
    profileCompleteness: number;
  }
): RevenueOpportunity[] {
  const opportunities: RevenueOpportunity[] = [];
  
  // Subscription upsell opportunity
  if (currentTier === "free" && activity.daysActive > 7 && activity.profileCompleteness > 70) {
    opportunities.push({
      type: "subscription_upsell",
      targetUserId: userId,
      estimatedValue: userType === "athlete" ? 19.99 : 99,
      probability: 0.15,
      recommendedAction: "Send personalized upgrade offer with 20% discount",
      urgency: "high",
    });
  }
  
  // Credit purchase opportunity
  if (activity.creditsRemaining < 10 && activity.featuresUsed.includes("ai_valuation")) {
    opportunities.push({
      type: "credit_purchase",
      targetUserId: userId,
      estimatedValue: 12.99,
      probability: 0.25,
      recommendedAction: "Show low credit warning with bonus offer",
      urgency: "critical",
    });
  }
  
  // Brand lead opportunity (for athletes with high engagement)
  if (userType === "athlete" && activity.profileCompleteness > 80) {
    opportunities.push({
      type: "brand_lead",
      targetUserId: userId,
      estimatedValue: 50, // Lead value to brands
      probability: 0.4,
      recommendedAction: "Include in brand discovery feed",
      urgency: "medium",
    });
  }
  
  // Data sale opportunity (aggregate insights)
  if (activity.daysActive > 30) {
    opportunities.push({
      type: "data_sale",
      targetUserId: userId,
      estimatedValue: 5, // Per-user data value
      probability: 1.0,
      recommendedAction: "Include in market insights report",
      urgency: "low",
    });
  }
  
  return opportunities;
}

// ==================== SOCIAL MEDIA VIRAL KEYWORDS ====================
// SEO and social media optimization

export const VIRAL_KEYWORDS = {
  primary: [
    "NIL deals",
    "NIL portal",
    "athlete NIL",
    "college athlete money",
    "NIL marketplace",
    "athlete sponsorship",
    "student athlete NIL",
  ],
  secondary: [
    "transfer portal",
    "college football NIL",
    "basketball NIL",
    "athlete brand deals",
    "NIL valuation",
    "athlete monetization",
    "sports marketing",
  ],
  hashtags: [
    "#NIL",
    "#NILDeals",
    "#CollegeAthletes",
    "#AthleteLife",
    "#StudentAthlete",
    "#NILPortal",
    "#ATHLYNX",
    "#DreamsComeTrue",
    "#ManusAI",
    "#DHG",
  ],
  longTail: [
    "how to get NIL deals",
    "best NIL platform for athletes",
    "NIL deal calculator",
    "how much is my NIL worth",
    "college athlete sponsorship opportunities",
    "NIL agent for college athletes",
    "free NIL platform",
  ],
};

export const SOCIAL_MEDIA_TEMPLATES = {
  twitter: [
    "🚀 Your NIL journey starts here. Join @ATHLYNX and discover your true value. Powered by @Manus_AI #NIL #ATHLYNX",
    "💰 Stop leaving money on the table. Get your FREE NIL valuation today. #NILDeals #CollegeAthletes",
    "🦁 The lion protects his pride. @ATHLYNX protects your future. #DreamsComeTrue #NIL",
  ],
  instagram: [
    "Your talent deserves to be valued. 💎 Get your FREE NIL valuation and see what you're really worth. Link in bio! #NIL #ATHLYNX #StudentAthlete",
    "From the field to the boardroom. 🏆 ATHLYNX helps athletes build their brand and secure their future. #NILDeals #AthleteLife",
  ],
  tiktok: [
    "POV: You just found out your NIL is worth more than you thought 🤯 #NIL #CollegeAthlete #ATHLYNX",
    "The secret platform college athletes are using to get brand deals 👀 #NILDeals #StudentAthlete",
  ],
  linkedin: [
    "Excited to announce our partnership with Manus AI to revolutionize the NIL marketplace. Athletes deserve data-driven insights to maximize their potential. #NIL #SportsBusiness #Innovation",
  ],
};
