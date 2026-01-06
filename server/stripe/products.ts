/**
 * ATHLYNX Stripe Products Configuration
 * THE LION'S MONEY-MAKING MACHINE
 * 
 * "Logic will take you from A to B. Imagination will take you everywhere." - Einstein
 * "When I eat, EVERYONE eats." - Chad Allen Dozier Sr.
 */

export interface ProductTier {
  id: string;
  name: string;
  description: string;
  features: string[];
  priceMonthly: number;
  priceYearly: number;
  stripePriceIdMonthly?: string;
  stripePriceIdYearly?: string;
  popular?: boolean;
  forRole: string[];
}

export const SUBSCRIPTION_TIERS: ProductTier[] = [
  {
    id: "free",
    name: "Rookie",
    description: "Start your journey - Everyone deserves a chance",
    features: [
      "Basic athlete profile",
      "Waitlist access to NIL deals",
      "Community feed access",
      "1 highlight video upload",
      "Basic stats tracking",
    ],
    priceMonthly: 0,
    priceYearly: 0,
    forRole: ["athlete", "parent", "coach"],
  },
  {
    id: "pro",
    name: "All-Star",
    description: "For serious athletes ready to level up",
    features: [
      "Everything in Rookie",
      "Unlimited highlight videos",
      "Priority NIL deal matching",
      "Advanced analytics dashboard",
      "Direct messaging with brands",
      "Transfer portal visibility",
      "Verified athlete badge",
      "Custom profile URL",
    ],
    priceMonthly: 19.99,
    priceYearly: 199.99, // Save $40/year
    popular: true,
    forRole: ["athlete"],
  },
  {
    id: "elite",
    name: "MVP",
    description: "The complete package for champions",
    features: [
      "Everything in All-Star",
      "1-on-1 NIL coaching sessions",
      "Personal brand strategy",
      "Contract review assistance",
      "Priority customer support",
      "Early access to new features",
      "Exclusive MVP community",
      "Annual NIL valuation report",
      "Media training resources",
    ],
    priceMonthly: 49.99,
    priceYearly: 499.99, // Save $100/year
    forRole: ["athlete"],
  },
  {
    id: "brand_starter",
    name: "Brand Starter",
    description: "For brands starting their NIL journey",
    features: [
      "Browse athlete profiles",
      "5 athlete connections/month",
      "Basic campaign tools",
      "Standard support",
    ],
    priceMonthly: 99,
    priceYearly: 999,
    forRole: ["brand"],
  },
  {
    id: "brand_pro",
    name: "Brand Pro",
    description: "For brands serious about athlete partnerships",
    features: [
      "Everything in Brand Starter",
      "Unlimited athlete connections",
      "Advanced campaign analytics",
      "Priority athlete matching",
      "Dedicated account manager",
      "Custom contract templates",
      "Multi-user team access",
    ],
    priceMonthly: 299,
    priceYearly: 2999,
    popular: true,
    forRole: ["brand"],
  },
  {
    id: "brand_enterprise",
    name: "Brand Enterprise",
    description: "For large brands and agencies",
    features: [
      "Everything in Brand Pro",
      "Custom integrations",
      "White-label options",
      "Dedicated success team",
      "Custom reporting",
      "SLA guarantees",
      "Volume discounts",
    ],
    priceMonthly: 999,
    priceYearly: 9999,
    forRole: ["brand"],
  },
];

// One-time purchases
export const ONE_TIME_PRODUCTS = [
  {
    id: "vip_founding_member",
    name: "VIP Founding Member",
    description: "Lifetime founding member status - Be part of history! Limited to first 1,000 members.",
    price: 49.99,
  },
  {
    id: "founding_supporter",
    name: "Founding Supporter",
    description: "Support ATHLYNX launch and get exclusive perks forever",
    price: 99.99,
  },
  {
    id: "profile_boost",
    name: "Profile Boost",
    description: "Get featured in brand searches for 7 days",
    price: 9.99,
  },
  {
    id: "highlight_review",
    name: "Highlight Video Review",
    description: "Professional review and feedback on your highlight reel",
    price: 29.99,
  },
  {
    id: "nil_valuation",
    name: "NIL Valuation Report",
    description: "Comprehensive analysis of your NIL market value",
    price: 49.99,
  },
  {
    id: "contract_review",
    name: "Contract Review",
    description: "Legal review of your NIL contract by our experts",
    price: 99.99,
  },
  {
    id: "media_kit",
    name: "Professional Media Kit",
    description: "Custom-designed media kit for brand outreach",
    price: 149.99,
  },
];

// Get tier by ID
export function getTierById(id: string): ProductTier | undefined {
  return SUBSCRIPTION_TIERS.find(tier => tier.id === id);
}

// Get tiers for role
export function getTiersForRole(role: string): ProductTier[] {
  return SUBSCRIPTION_TIERS.filter(tier => tier.forRole.includes(role));
}

// Calculate savings for yearly
export function calculateYearlySavings(tier: ProductTier): number {
  return (tier.priceMonthly * 12) - tier.priceYearly;
}
