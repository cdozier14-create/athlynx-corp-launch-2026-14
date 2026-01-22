import { describe, it, expect } from "vitest";
import { getDb, validateVipCode, getWaitlistCount } from "../db";
import { vipCodes, users, waitlist, posts } from "../../drizzle/schema";
import { sql } from "drizzle-orm";

describe("Database Connection", () => {
  it("should connect to the database", async () => {
    const db = await getDb();
    expect(db).toBeDefined();
  });
});

describe("VIP Codes", () => {
  it("should have VIP codes in the database", async () => {
    const db = await getDb();
    if (!db) {
      console.warn("Database not available, skipping test");
      return;
    }
    
    const result = await db.select({ count: sql<number>`count(*)` }).from(vipCodes);
    expect(result[0].count).toBeGreaterThan(0);
  });

  it("should validate FOUNDER2026 VIP code", async () => {
    const result = await validateVipCode("FOUNDER2026");
    expect(result).not.toBeNull();
    expect(result?.code).toBe("FOUNDER2026");
    expect(result?.isActive).toBe(true);
  });

  it("should validate PERFECTSTORM VIP code", async () => {
    const result = await validateVipCode("PERFECTSTORM");
    expect(result).not.toBeNull();
    expect(result?.code).toBe("PERFECTSTORM");
  });

  it("should reject invalid VIP code", async () => {
    const result = await validateVipCode("INVALIDCODE123");
    expect(result).toBeNull();
  });

  it("should be case insensitive for VIP codes", async () => {
    const result = await validateVipCode("founder2026");
    expect(result).not.toBeNull();
    expect(result?.code).toBe("FOUNDER2026");
  });
});

describe("Waitlist", () => {
  it("should return waitlist count", async () => {
    const count = await getWaitlistCount();
    expect(typeof count).toBe("number");
    expect(count).toBeGreaterThanOrEqual(0);
  });
});

describe("Database Tables", () => {
  it("should have users table accessible", async () => {
    const db = await getDb();
    if (!db) {
      console.warn("Database not available, skipping test");
      return;
    }
    
    const result = await db.select({ count: sql<number>`count(*)` }).from(users);
    expect(result).toBeDefined();
    expect(typeof result[0].count).toBe("number");
  });

  it("should have waitlist table accessible", async () => {
    const db = await getDb();
    if (!db) {
      console.warn("Database not available, skipping test");
      return;
    }
    
    const result = await db.select({ count: sql<number>`count(*)` }).from(waitlist);
    expect(result).toBeDefined();
    expect(typeof result[0].count).toBe("number");
  });

  it("should have posts table accessible", async () => {
    const db = await getDb();
    if (!db) {
      console.warn("Database not available, skipping test");
      return;
    }
    
    const result = await db.select({ count: sql<number>`count(*)` }).from(posts);
    expect(result).toBeDefined();
    expect(typeof result[0].count).toBe("number");
  });
});
