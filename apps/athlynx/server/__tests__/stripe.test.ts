/**
 * ATHLYNX Stripe Integration Tests
 * Verifies Stripe configuration and basic functionality
 */

import { describe, it, expect } from "vitest";
import { SUBSCRIPTION_TIERS, ONE_TIME_PRODUCTS, getTierById, getTiersForRole } from "../stripe/products";

describe("Stripe Products Configuration", () => {
  it("should have subscription tiers defined", () => {
    expect(SUBSCRIPTION_TIERS.length).toBeGreaterThan(0);
  });

  it("should have a free tier", () => {
    const freeTier = getTierById("free");
    expect(freeTier).toBeDefined();
    expect(freeTier?.priceMonthly).toBe(0);
    expect(freeTier?.priceYearly).toBe(0);
  });

  it("should have a pro tier with correct pricing", () => {
    const proTier = getTierById("pro");
    expect(proTier).toBeDefined();
    expect(proTier?.priceMonthly).toBe(19.99);
    expect(proTier?.priceYearly).toBe(199.99);
    expect(proTier?.popular).toBe(true);
  });

  it("should have an elite tier with correct pricing", () => {
    const eliteTier = getTierById("elite");
    expect(eliteTier).toBeDefined();
    expect(eliteTier?.priceMonthly).toBe(49.99);
    expect(eliteTier?.priceYearly).toBe(499.99);
  });

  it("should have brand tiers", () => {
    const brandTiers = getTiersForRole("brand");
    expect(brandTiers.length).toBeGreaterThanOrEqual(3);
    
    const brandStarter = getTierById("brand_starter");
    expect(brandStarter).toBeDefined();
    expect(brandStarter?.priceMonthly).toBe(99);
  });

  it("should have one-time products defined", () => {
    expect(ONE_TIME_PRODUCTS.length).toBeGreaterThan(0);
    
    const profileBoost = ONE_TIME_PRODUCTS.find(p => p.id === "profile_boost");
    expect(profileBoost).toBeDefined();
    expect(profileBoost?.price).toBe(9.99);
  });

  it("should return tiers for athlete role", () => {
    const athleteTiers = getTiersForRole("athlete");
    expect(athleteTiers.length).toBeGreaterThanOrEqual(3);
    expect(athleteTiers.some(t => t.id === "free")).toBe(true);
    expect(athleteTiers.some(t => t.id === "pro")).toBe(true);
    expect(athleteTiers.some(t => t.id === "elite")).toBe(true);
  });

  it("should have all required fields for each tier", () => {
    SUBSCRIPTION_TIERS.forEach(tier => {
      expect(tier.id).toBeDefined();
      expect(tier.name).toBeDefined();
      expect(tier.description).toBeDefined();
      expect(tier.features).toBeDefined();
      expect(Array.isArray(tier.features)).toBe(true);
      expect(tier.features.length).toBeGreaterThan(0);
      expect(typeof tier.priceMonthly).toBe("number");
      expect(typeof tier.priceYearly).toBe("number");
      expect(tier.forRole).toBeDefined();
      expect(Array.isArray(tier.forRole)).toBe(true);
    });
  });
});

describe("Stripe Environment", () => {
  it("should have Stripe secret key configured", () => {
    // In test environment, we check if the env var exists
    // The actual key validation happens in the Stripe SDK
    const hasStripeKey = !!process.env.STRIPE_SECRET_KEY;
    expect(hasStripeKey).toBe(true);
  });

  it("should have Stripe publishable key for frontend", () => {
    const hasPublishableKey = !!process.env.VITE_STRIPE_PUBLISHABLE_KEY;
    expect(hasPublishableKey).toBe(true);
  });
});
