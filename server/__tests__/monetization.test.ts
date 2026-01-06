import { describe, it, expect } from "vitest";
import { getDb } from "../db";
import { 
  subscriptions, userServices, userCredits, creditTransactions,
  playlists, tracks, podcasts, podcastEpisodes,
  stories, reels, marketplaceListings, marketplaceOrders,
  aiAgentSessions, aiAgentMessages
} from "../../drizzle/schema";
import { sql } from "drizzle-orm";

describe("Monetization System", () => {
  describe("Subscriptions", () => {
    it("should have subscriptions table accessible", async () => {
      const db = await getDb();
      if (!db) {
        console.warn("Database not available, skipping test");
        return;
      }
      const result = await db.select({ count: sql<number>`count(*)` }).from(subscriptions);
      expect(result).toBeDefined();
      expect(typeof result[0].count).toBe("number");
    });
  });

  describe("User Credits", () => {
    it("should have user_credits table accessible", async () => {
      const db = await getDb();
      if (!db) {
        console.warn("Database not available, skipping test");
        return;
      }
      const result = await db.select({ count: sql<number>`count(*)` }).from(userCredits);
      expect(result).toBeDefined();
      expect(typeof result[0].count).toBe("number");
    });

    it("should have credit_transactions table accessible", async () => {
      const db = await getDb();
      if (!db) {
        console.warn("Database not available, skipping test");
        return;
      }
      const result = await db.select({ count: sql<number>`count(*)` }).from(creditTransactions);
      expect(result).toBeDefined();
      expect(typeof result[0].count).toBe("number");
    });
  });

  describe("User Services", () => {
    it("should have user_services table accessible", async () => {
      const db = await getDb();
      if (!db) {
        console.warn("Database not available, skipping test");
        return;
      }
      const result = await db.select({ count: sql<number>`count(*)` }).from(userServices);
      expect(result).toBeDefined();
      expect(typeof result[0].count).toBe("number");
    });
  });

  describe("Marketplace", () => {
    it("should have marketplace_listings table accessible", async () => {
      const db = await getDb();
      if (!db) {
        console.warn("Database not available, skipping test");
        return;
      }
      const result = await db.select({ count: sql<number>`count(*)` }).from(marketplaceListings);
      expect(result).toBeDefined();
      expect(typeof result[0].count).toBe("number");
    });

    it("should have marketplace_orders table accessible", async () => {
      const db = await getDb();
      if (!db) {
        console.warn("Database not available, skipping test");
        return;
      }
      const result = await db.select({ count: sql<number>`count(*)` }).from(marketplaceOrders);
      expect(result).toBeDefined();
      expect(typeof result[0].count).toBe("number");
    });
  });

  describe("AI Agent System", () => {
    it("should have ai_agent_sessions table accessible", async () => {
      const db = await getDb();
      if (!db) {
        console.warn("Database not available, skipping test");
        return;
      }
      const result = await db.select({ count: sql<number>`count(*)` }).from(aiAgentSessions);
      expect(result).toBeDefined();
      expect(typeof result[0].count).toBe("number");
    });

    it("should have ai_agent_messages table accessible", async () => {
      const db = await getDb();
      if (!db) {
        console.warn("Database not available, skipping test");
        return;
      }
      const result = await db.select({ count: sql<number>`count(*)` }).from(aiAgentMessages);
      expect(result).toBeDefined();
      expect(typeof result[0].count).toBe("number");
    });
  });

  describe("Media System", () => {
    it("should have playlists table accessible", async () => {
      const db = await getDb();
      if (!db) {
        console.warn("Database not available, skipping test");
        return;
      }
      const result = await db.select({ count: sql<number>`count(*)` }).from(playlists);
      expect(result).toBeDefined();
      expect(typeof result[0].count).toBe("number");
    });

    it("should have tracks table accessible", async () => {
      const db = await getDb();
      if (!db) {
        console.warn("Database not available, skipping test");
        return;
      }
      const result = await db.select({ count: sql<number>`count(*)` }).from(tracks);
      expect(result).toBeDefined();
      expect(typeof result[0].count).toBe("number");
    });

    it("should have podcasts table accessible", async () => {
      const db = await getDb();
      if (!db) {
        console.warn("Database not available, skipping test");
        return;
      }
      const result = await db.select({ count: sql<number>`count(*)` }).from(podcasts);
      expect(result).toBeDefined();
      expect(typeof result[0].count).toBe("number");
    });

    it("should have podcast_episodes table accessible", async () => {
      const db = await getDb();
      if (!db) {
        console.warn("Database not available, skipping test");
        return;
      }
      const result = await db.select({ count: sql<number>`count(*)` }).from(podcastEpisodes);
      expect(result).toBeDefined();
      expect(typeof result[0].count).toBe("number");
    });
  });

  describe("Stories & Reels", () => {
    it("should have stories table accessible", async () => {
      const db = await getDb();
      if (!db) {
        console.warn("Database not available, skipping test");
        return;
      }
      const result = await db.select({ count: sql<number>`count(*)` }).from(stories);
      expect(result).toBeDefined();
      expect(typeof result[0].count).toBe("number");
    });

    it("should have reels table accessible", async () => {
      const db = await getDb();
      if (!db) {
        console.warn("Database not available, skipping test");
        return;
      }
      const result = await db.select({ count: sql<number>`count(*)` }).from(reels);
      expect(result).toBeDefined();
      expect(typeof result[0].count).toBe("number");
    });
  });
});
