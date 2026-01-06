/**
 * ATHLYNX Transfer Portal - Sample Player Seed Script
 * Seeds realistic sample players for demo purposes
 * Run with: node scripts/seed-transfer-portal.mjs
 */

import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

// Sample players data - realistic college football and basketball players
const samplePlayers = [
  // FOOTBALL - Quarterbacks
  {
    fullName: "Marcus Williams",
    sport: "football",
    position: "QB",
    height: "6-3",
    weight: 215,
    graduationYear: 2026,
    eligibilityRemaining: 2,
    gpa: 3.4,
    major: "Business Administration",
    currentSchool: "Ole Miss",
    currentConference: "SEC",
    currentDivision: "D1-FBS",
    status: "entered",
    playerRating: 0.8750,
    nilValuation: 450000,
    starRating: 4,
    instagramHandle: "@marcuswilliams_qb",
    twitterHandle: "@MWilliamsQB",
    totalFollowers: 125000,
    engagementRate: 4.2,
    hasAgent: true,
    agentName: "Elite Sports Management",
    isPublic: true,
    isVerified: true
  },
  {
    fullName: "Jaylen Thompson",
    sport: "football",
    position: "QB",
    height: "6-1",
    weight: 205,
    graduationYear: 2027,
    eligibilityRemaining: 3,
    gpa: 3.6,
    major: "Communications",
    currentSchool: "Texas A&M",
    currentConference: "SEC",
    currentDivision: "D1-FBS",
    status: "entered",
    playerRating: 0.8200,
    nilValuation: 275000,
    starRating: 4,
    instagramHandle: "@jthompson_qb1",
    totalFollowers: 85000,
    engagementRate: 5.1,
    hasAgent: false,
    isPublic: true,
    isVerified: true
  },
  // FOOTBALL - Running Backs
  {
    fullName: "DeShawn Carter",
    sport: "football",
    position: "RB",
    height: "5-10",
    weight: 195,
    graduationYear: 2026,
    eligibilityRemaining: 2,
    gpa: 3.1,
    major: "Sports Management",
    currentSchool: "Alabama",
    currentConference: "SEC",
    currentDivision: "D1-FBS",
    status: "entered",
    playerRating: 0.9100,
    nilValuation: 650000,
    starRating: 5,
    instagramHandle: "@dcarter_rb",
    twitterHandle: "@DeshawnRB",
    totalFollowers: 250000,
    engagementRate: 6.8,
    hasAgent: true,
    agentName: "Klutch Sports",
    isPublic: true,
    isVerified: true
  },
  {
    fullName: "Tyrone Jackson",
    sport: "football",
    position: "RB",
    height: "6-0",
    weight: 210,
    graduationYear: 2025,
    eligibilityRemaining: 1,
    gpa: 2.9,
    major: "Kinesiology",
    currentSchool: "Georgia",
    currentConference: "SEC",
    currentDivision: "D1-FBS",
    status: "entered",
    playerRating: 0.8400,
    nilValuation: 320000,
    starRating: 4,
    instagramHandle: "@tjackson_22",
    totalFollowers: 95000,
    engagementRate: 4.5,
    hasAgent: false,
    isPublic: true,
    isVerified: true
  },
  // FOOTBALL - Wide Receivers
  {
    fullName: "Chris Anderson",
    sport: "football",
    position: "WR",
    height: "6-2",
    weight: 185,
    graduationYear: 2026,
    eligibilityRemaining: 2,
    gpa: 3.3,
    major: "Marketing",
    currentSchool: "USC",
    currentConference: "Big Ten",
    currentDivision: "D1-FBS",
    status: "entered",
    playerRating: 0.8900,
    nilValuation: 520000,
    starRating: 5,
    instagramHandle: "@canderson_wr",
    twitterHandle: "@ChrisWR1",
    tiktokHandle: "@chrisanderson_wr",
    totalFollowers: 180000,
    engagementRate: 7.2,
    hasAgent: true,
    agentName: "CAA Sports",
    isPublic: true,
    isVerified: true
  },
  {
    fullName: "Malik Johnson",
    sport: "football",
    position: "WR",
    height: "5-11",
    weight: 175,
    graduationYear: 2027,
    eligibilityRemaining: 3,
    gpa: 3.5,
    major: "Computer Science",
    currentSchool: "Ohio State",
    currentConference: "Big Ten",
    currentDivision: "D1-FBS",
    status: "entered",
    playerRating: 0.8100,
    nilValuation: 225000,
    starRating: 4,
    instagramHandle: "@malik_wr",
    totalFollowers: 65000,
    engagementRate: 5.5,
    hasAgent: false,
    isPublic: true,
    isVerified: false
  },
  // FOOTBALL - Defensive Players
  {
    fullName: "Terrell Davis Jr.",
    sport: "football",
    position: "Edge",
    height: "6-4",
    weight: 255,
    graduationYear: 2025,
    eligibilityRemaining: 1,
    gpa: 3.0,
    major: "Criminal Justice",
    currentSchool: "Michigan",
    currentConference: "Big Ten",
    currentDivision: "D1-FBS",
    status: "entered",
    playerRating: 0.9200,
    nilValuation: 750000,
    starRating: 5,
    instagramHandle: "@tdavis_edge",
    twitterHandle: "@TerrellEdge",
    totalFollowers: 320000,
    engagementRate: 8.1,
    hasAgent: true,
    agentName: "Rosenhaus Sports",
    isPublic: true,
    isVerified: true
  },
  {
    fullName: "Brandon Mitchell",
    sport: "football",
    position: "CB",
    height: "6-0",
    weight: 185,
    graduationYear: 2026,
    eligibilityRemaining: 2,
    gpa: 3.2,
    major: "Psychology",
    currentSchool: "LSU",
    currentConference: "SEC",
    currentDivision: "D1-FBS",
    status: "entered",
    playerRating: 0.8600,
    nilValuation: 380000,
    starRating: 4,
    instagramHandle: "@bmitchell_cb",
    totalFollowers: 110000,
    engagementRate: 5.8,
    hasAgent: true,
    agentName: "Priority Sports",
    isPublic: true,
    isVerified: true
  },
  // FOOTBALL - Offensive Line
  {
    fullName: "David Thompson",
    sport: "football",
    position: "OT",
    height: "6-6",
    weight: 315,
    graduationYear: 2025,
    eligibilityRemaining: 1,
    gpa: 3.1,
    major: "Engineering",
    currentSchool: "Notre Dame",
    currentConference: "ACC",
    currentDivision: "D1-FBS",
    status: "entered",
    playerRating: 0.8800,
    nilValuation: 420000,
    starRating: 4,
    instagramHandle: "@dthompson_ot",
    totalFollowers: 45000,
    engagementRate: 3.2,
    hasAgent: true,
    agentName: "Athletes First",
    isPublic: true,
    isVerified: true
  },
  // BASKETBALL - Guards
  {
    fullName: "Jamal Richardson",
    sport: "basketball",
    position: "PG",
    height: "6-2",
    weight: 185,
    graduationYear: 2026,
    eligibilityRemaining: 2,
    gpa: 3.4,
    major: "Business",
    currentSchool: "Duke",
    currentConference: "ACC",
    currentDivision: "D1",
    status: "entered",
    playerRating: 0.9000,
    nilValuation: 580000,
    starRating: 5,
    instagramHandle: "@jrich_pg",
    twitterHandle: "@JamalPG",
    totalFollowers: 275000,
    engagementRate: 7.5,
    hasAgent: true,
    agentName: "Wasserman",
    isPublic: true,
    isVerified: true
  },
  {
    fullName: "Tyler Brooks",
    sport: "basketball",
    position: "SG",
    height: "6-4",
    weight: 195,
    graduationYear: 2027,
    eligibilityRemaining: 3,
    gpa: 3.6,
    major: "Finance",
    currentSchool: "Kentucky",
    currentConference: "SEC",
    currentDivision: "D1",
    status: "entered",
    playerRating: 0.8500,
    nilValuation: 350000,
    starRating: 4,
    instagramHandle: "@tbrooks_hoops",
    totalFollowers: 145000,
    engagementRate: 6.2,
    hasAgent: false,
    isPublic: true,
    isVerified: true
  },
  // BASKETBALL - Forwards
  {
    fullName: "Marcus Green",
    sport: "basketball",
    position: "SF",
    height: "6-7",
    weight: 215,
    graduationYear: 2025,
    eligibilityRemaining: 1,
    gpa: 3.0,
    major: "Communications",
    currentSchool: "Kansas",
    currentConference: "Big 12",
    currentDivision: "D1",
    status: "entered",
    playerRating: 0.8700,
    nilValuation: 425000,
    starRating: 4,
    instagramHandle: "@mgreen_sf",
    totalFollowers: 165000,
    engagementRate: 5.9,
    hasAgent: true,
    agentName: "Excel Sports",
    isPublic: true,
    isVerified: true
  },
  {
    fullName: "Andre Williams",
    sport: "basketball",
    position: "PF",
    height: "6-9",
    weight: 235,
    graduationYear: 2026,
    eligibilityRemaining: 2,
    gpa: 3.2,
    major: "Sports Management",
    currentSchool: "UCLA",
    currentConference: "Big Ten",
    currentDivision: "D1",
    status: "entered",
    playerRating: 0.8300,
    nilValuation: 290000,
    starRating: 4,
    instagramHandle: "@awilliams_pf",
    totalFollowers: 98000,
    engagementRate: 4.8,
    hasAgent: false,
    isPublic: true,
    isVerified: false
  },
  // BASKETBALL - Center
  {
    fullName: "Isaiah Johnson",
    sport: "basketball",
    position: "C",
    height: "7-0",
    weight: 265,
    graduationYear: 2026,
    eligibilityRemaining: 2,
    gpa: 3.1,
    major: "Sociology",
    currentSchool: "UConn",
    currentConference: "Big East",
    currentDivision: "D1",
    status: "entered",
    playerRating: 0.8900,
    nilValuation: 480000,
    starRating: 5,
    instagramHandle: "@ijohnson_center",
    twitterHandle: "@IsaiahC",
    totalFollowers: 195000,
    engagementRate: 6.5,
    hasAgent: true,
    agentName: "Octagon",
    isPublic: true,
    isVerified: true
  },
  // MISSISSIPPI PLAYERS (Chad's home state!)
  {
    fullName: "Darius Moore",
    sport: "football",
    position: "WR",
    height: "6-1",
    weight: 180,
    graduationYear: 2026,
    eligibilityRemaining: 2,
    gpa: 3.3,
    major: "Business",
    currentSchool: "Mississippi State",
    currentConference: "SEC",
    currentDivision: "D1-FBS",
    status: "entered",
    playerRating: 0.8200,
    nilValuation: 245000,
    starRating: 4,
    instagramHandle: "@dmoore_ms",
    totalFollowers: 72000,
    engagementRate: 5.3,
    hasAgent: false,
    isPublic: true,
    isVerified: true
  },
  {
    fullName: "Jordan Lee",
    sport: "football",
    position: "LB",
    height: "6-2",
    weight: 235,
    graduationYear: 2025,
    eligibilityRemaining: 1,
    gpa: 3.0,
    major: "Criminal Justice",
    currentSchool: "Southern Miss",
    currentConference: "Sun Belt",
    currentDivision: "D1-FBS",
    status: "entered",
    playerRating: 0.7800,
    nilValuation: 125000,
    starRating: 3,
    instagramHandle: "@jlee_lb",
    totalFollowers: 35000,
    engagementRate: 4.1,
    hasAgent: false,
    isPublic: true,
    isVerified: false
  },
  // D2/D3/JUCO Players for variety
  {
    fullName: "Kevin Harris",
    sport: "football",
    position: "QB",
    height: "6-2",
    weight: 200,
    graduationYear: 2026,
    eligibilityRemaining: 2,
    gpa: 3.5,
    major: "Education",
    currentSchool: "Delta State",
    currentConference: "Gulf South",
    currentDivision: "D2",
    status: "entered",
    playerRating: 0.7500,
    nilValuation: 45000,
    starRating: 3,
    instagramHandle: "@kharris_qb",
    totalFollowers: 12000,
    engagementRate: 3.8,
    hasAgent: false,
    isPublic: true,
    isVerified: false
  },
  {
    fullName: "Anthony Brown",
    sport: "basketball",
    position: "G",
    height: "6-3",
    weight: 190,
    graduationYear: 2027,
    eligibilityRemaining: 3,
    gpa: 3.7,
    major: "Pre-Med",
    currentSchool: "Hinds CC",
    currentConference: "MACCC",
    currentDivision: "JUCO",
    status: "entered",
    playerRating: 0.7200,
    nilValuation: 25000,
    starRating: 3,
    instagramHandle: "@abrown_hoops",
    totalFollowers: 8500,
    engagementRate: 4.5,
    hasAgent: false,
    isPublic: true,
    isVerified: false
  },
  // Women's Basketball
  {
    fullName: "Aaliyah Thompson",
    sport: "basketball",
    position: "PG",
    height: "5-8",
    weight: 145,
    graduationYear: 2026,
    eligibilityRemaining: 2,
    gpa: 3.8,
    major: "Biology",
    currentSchool: "South Carolina",
    currentConference: "SEC",
    currentDivision: "D1",
    status: "entered",
    playerRating: 0.9100,
    nilValuation: 380000,
    starRating: 5,
    instagramHandle: "@aaliyah_hoops",
    twitterHandle: "@AaliyahPG",
    totalFollowers: 225000,
    engagementRate: 8.2,
    hasAgent: true,
    agentName: "WME Sports",
    isPublic: true,
    isVerified: true
  },
  {
    fullName: "Jasmine Davis",
    sport: "basketball",
    position: "SF",
    height: "6-1",
    weight: 165,
    graduationYear: 2027,
    eligibilityRemaining: 3,
    gpa: 3.6,
    major: "Psychology",
    currentSchool: "Stanford",
    currentConference: "ACC",
    currentDivision: "D1",
    status: "entered",
    playerRating: 0.8600,
    nilValuation: 275000,
    starRating: 4,
    instagramHandle: "@jdavis_sf",
    totalFollowers: 135000,
    engagementRate: 6.8,
    hasAgent: false,
    isPublic: true,
    isVerified: true
  }
];

async function seedTransferPortal() {
  console.log("🏈🏀 ATHLYNX Transfer Portal - Seeding Sample Players...\n");
  
  const connection = await mysql.createConnection(DATABASE_URL);
  
  try {
    // Check if we already have players
    const [existing] = await connection.execute(
      "SELECT COUNT(*) as count FROM transfer_portal_entries"
    );
    
    if (existing[0].count > 0) {
      console.log(`⚠️  Transfer Portal already has ${existing[0].count} players.`);
      console.log("   Skipping seed to avoid duplicates.\n");
      return;
    }
    
    // Insert each player
    for (const player of samplePlayers) {
      const sql = `
        INSERT INTO transfer_portal_entries (
          fullName, sport, position, height, weight,
          graduationYear, eligibilityRemaining, gpa, major,
          currentSchool, currentConference, currentDivision,
          status, playerRating, nilValuation, starRating,
          instagramHandle, twitterHandle, tiktokHandle,
          totalFollowers, engagementRate, hasAgent, agentName,
          isPublic, isVerified, enteredPortalAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `;
      
      await connection.execute(sql, [
        player.fullName,
        player.sport,
        player.position,
        player.height,
        player.weight,
        player.graduationYear,
        player.eligibilityRemaining,
        player.gpa,
        player.major,
        player.currentSchool,
        player.currentConference,
        player.currentDivision,
        player.status,
        player.playerRating,
        player.nilValuation,
        player.starRating,
        player.instagramHandle || null,
        player.twitterHandle || null,
        player.tiktokHandle || null,
        player.totalFollowers || 0,
        player.engagementRate || 0,
        player.hasAgent ? 1 : 0,
        player.agentName || null,
        player.isPublic ? 1 : 0,
        player.isVerified ? 1 : 0
      ]);
      
      console.log(`✅ Added: ${player.fullName} (${player.position}) - ${player.currentSchool}`);
    }
    
    console.log(`\n🎉 Successfully seeded ${samplePlayers.length} players into Transfer Portal!`);
    console.log("\n📊 Summary:");
    console.log(`   - Football players: ${samplePlayers.filter(p => p.sport === 'football').length}`);
    console.log(`   - Basketball players: ${samplePlayers.filter(p => p.sport === 'basketball').length}`);
    console.log(`   - 5-star players: ${samplePlayers.filter(p => p.starRating === 5).length}`);
    console.log(`   - 4-star players: ${samplePlayers.filter(p => p.starRating === 4).length}`);
    console.log(`   - Mississippi players: ${samplePlayers.filter(p => p.currentSchool.includes('Miss') || p.currentSchool.includes('Southern')).length}`);
    
  } catch (error) {
    console.error("❌ Error seeding Transfer Portal:", error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

// Run the seed
seedTransferPortal()
  .then(() => {
    console.log("\n✅ Transfer Portal seeding complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Seeding failed:", error);
    process.exit(1);
  });
