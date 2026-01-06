/**
 * ATHLYNX CRM Seed Script
 * Seeds partner access codes and milestones for the CRM dashboard
 */

import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

async function seedCRM() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  console.log('🌱 Seeding CRM data...\n');

  // Partner Access Codes
  const partners = [
    { name: 'Chad A. Dozier', email: 'chad@athlynx.ai', role: 'founder', accessLevel: 'admin', accessCode: 'CHAD-FOUNDER-2026' },
    { name: 'Glenn Tse', email: 'glenn@dhg.com', role: 'partner', accessLevel: 'full', accessCode: 'GLENN-PARTNER-2026' },
    { name: 'Lee Marshall', email: 'lee@dhg.com', role: 'partner', accessLevel: 'full', accessCode: 'LEE-PARTNER-2026' },
    { name: 'Jimmy Boyd', email: 'jimmy@dhg.com', role: 'partner', accessLevel: 'full', accessCode: 'JIMMY-PARTNER-2026' },
    { name: 'Andrew Kustes', email: 'andrew@dhg.com', role: 'partner', accessLevel: 'full', accessCode: 'ANDREW-PARTNER-2026' },
    { name: 'Nicki Leggett', email: 'mom@dhg.com', role: 'advisor', accessLevel: 'view_only', accessCode: 'MOM-ADVISOR-2026' },
    { name: 'David Ford', email: 'david@dhg.com', role: 'advisor', accessLevel: 'view_only', accessCode: 'DAVID-ADVISOR-2026' },
  ];

  console.log('👥 Creating partner access codes...');
  for (const partner of partners) {
    try {
      await connection.execute(
        `INSERT INTO partner_access (name, email, role, accessLevel, accessCode, isActive) 
         VALUES (?, ?, ?, ?, ?, true)
         ON DUPLICATE KEY UPDATE name = VALUES(name), role = VALUES(role), accessLevel = VALUES(accessLevel)`,
        [partner.name, partner.email, partner.role, partner.accessLevel, partner.accessCode]
      );
      console.log(`  ✅ ${partner.name}: ${partner.accessCode}`);
    } catch (error) {
      console.log(`  ⚠️ ${partner.name}: Already exists or error`);
    }
  }

  // Milestones
  const milestones = [
    // Signup milestones
    { name: '🎉 First Signup!', type: 'signup', target: 1, celebration: 'THE JOURNEY BEGINS! First user signed up!' },
    { name: '🔥 10 Users', type: 'signup', target: 10, celebration: 'Double digits! 10 users on the platform!' },
    { name: '💯 100 Users', type: 'signup', target: 100, celebration: 'TRIPLE DIGITS! 100 users and growing!' },
    { name: '🚀 500 Users', type: 'signup', target: 500, celebration: 'HALF A THOUSAND! The movement is real!' },
    { name: '🏆 1,000 Users', type: 'signup', target: 1000, celebration: 'ONE THOUSAND STRONG! Dreams coming true!' },
    { name: '👑 5,000 Users', type: 'signup', target: 5000, celebration: 'FIVE THOUSAND! Building an empire!' },
    { name: '🌟 10,000 Users', type: 'signup', target: 10000, celebration: 'TEN THOUSAND! The Perfect Storm is here!' },
    
    // Revenue milestones
    { name: '💰 First Paying Customer!', type: 'revenue', target: 1, celebration: 'MONEY IN THE BANK! First paying customer!' },
    { name: '💵 $100 Revenue', type: 'revenue', target: 100, celebration: 'First hundred dollars! Keep it rolling!' },
    { name: '💎 $1,000 Revenue', type: 'revenue', target: 1000, celebration: 'ONE THOUSAND DOLLARS! Real business now!' },
    { name: '🏦 $10,000 Revenue', type: 'revenue', target: 10000, celebration: 'TEN THOUSAND! Serious money!' },
    { name: '💸 $100,000 Revenue', type: 'revenue', target: 100000, celebration: 'SIX FIGURES! The empire grows!' },
    { name: '🤑 $1,000,000 Revenue', type: 'revenue', target: 1000000, celebration: 'ONE MILLION DOLLARS! BILLIONAIRE INCOMING!' },
  ];

  console.log('\n🎯 Creating milestones...');
  for (const milestone of milestones) {
    try {
      await connection.execute(
        `INSERT INTO milestones (milestoneName, milestoneType, targetValue, currentValue, isAchieved, celebrationMessage) 
         VALUES (?, ?, ?, 0, false, ?)
         ON DUPLICATE KEY UPDATE targetValue = VALUES(targetValue)`,
        [milestone.name, milestone.type, milestone.target, milestone.celebration]
      );
      console.log(`  ✅ ${milestone.name} (${milestone.target})`);
    } catch (error) {
      console.log(`  ⚠️ ${milestone.name}: Already exists or error`);
    }
  }

  console.log('\n✨ CRM seed complete!\n');
  console.log('📋 Partner Access Codes:');
  console.log('========================');
  for (const partner of partners) {
    console.log(`${partner.name}: ${partner.accessCode}`);
  }
  
  await connection.end();
}

seedCRM().catch(console.error);
