import { drizzle } from "drizzle-orm/mysql2";

const db = drizzle(process.env.DATABASE_URL);

const vipCodes = [
  { code: "FOUNDER2026", description: "Founder VIP Code", maxUses: 1000, currentUses: 0, isActive: true },
  { code: "ATHLYNXVIP", description: "General VIP Code", maxUses: 500, currentUses: 0, isActive: true },
  { code: "PERFECTSTORM", description: "Perfect Storm Launch Code", maxUses: 100, currentUses: 0, isActive: true },
  { code: "DHGEMPIRE", description: "DHG Empire Code", maxUses: 50, currentUses: 0, isActive: true },
  { code: "CHAD2026", description: "Chad's Personal Code", maxUses: 10, currentUses: 0, isActive: true },
];

async function seed() {
  console.log("Seeding VIP codes...");
  
  for (const code of vipCodes) {
    try {
      await db.execute({
        sql: `INSERT INTO vip_codes (code, description, maxUses, currentUses, isActive, createdAt) 
              VALUES (?, ?, ?, ?, ?, NOW())
              ON DUPLICATE KEY UPDATE description = VALUES(description)`,
        values: [code.code, code.description, code.maxUses, code.currentUses, code.isActive]
      });
      console.log(`✓ Added VIP code: ${code.code}`);
    } catch (error) {
      console.error(`✗ Failed to add ${code.code}:`, error.message);
    }
  }
  
  console.log("Done seeding VIP codes!");
  process.exit(0);
}

seed();
