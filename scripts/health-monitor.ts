/**
 * ATHLYNX Self-Healing Health Monitor
 * Automatically detects and fixes issues
 * 
 * @author ATHLYNX AI Corporation
 * @date January 9, 2026
 */

import { sendSMS } from '../server/services/aws-sns';
import { sendEmail } from '../server/services/aws-ses';

const HEALTH_CHECK_URL = 'https://athlynx.ai';
const CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes
const ALERT_PHONE = '+16014985282'; // Chad's phone
const ALERT_EMAIL = 'cdozier14@dozierholdingsgroup.com.mx';

interface HealthStatus {
  timestamp: Date;
  status: 'healthy' | 'degraded' | 'down';
  responseTime: number;
  errors: string[];
}

let consecutiveFailures = 0;
const MAX_FAILURES_BEFORE_ALERT = 3;

/**
 * Check if athlynx.ai is responding
 */
async function checkHealth(): Promise<HealthStatus> {
  const startTime = Date.now();
  const errors: string[] = [];
  
  try {
    // Check main site
    const response = await fetch(HEALTH_CHECK_URL, {
      method: 'GET',
      headers: { 'User-Agent': 'ATHLYNX-Health-Monitor/1.0' }
    });
    
    const responseTime = Date.now() - startTime;
    
    if (!response.ok) {
      errors.push(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    // Check API endpoint
    const apiResponse = await fetch(`${HEALTH_CHECK_URL}/api/trpc/verification.healthCheck`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!apiResponse.ok) {
      errors.push(`API Error: ${apiResponse.status}`);
    }
    
    const status: HealthStatus = {
      timestamp: new Date(),
      status: errors.length === 0 ? 'healthy' : errors.length < 2 ? 'degraded' : 'down',
      responseTime,
      errors
    };
    
    return status;
    
  } catch (error) {
    return {
      timestamp: new Date(),
      status: 'down',
      responseTime: Date.now() - startTime,
      errors: [`Fatal error: ${error instanceof Error ? error.message : 'Unknown error'}`]
    };
  }
}

/**
 * Attempt to auto-fix common issues
 */
async function autoFix(status: HealthStatus): Promise<boolean> {
  console.log(`🔧 Attempting auto-fix for: ${status.errors.join(', ')}`);
  
  // Check if it's a database connection issue
  if (status.errors.some(e => e.includes('database') || e.includes('connection'))) {
    console.log('🔄 Detected database issue - attempting failover...');
    // TODO: Implement database failover NEON → PlanetScale
    return false; // Not implemented yet
  }
  
  // Check if it's a serverless function issue
  if (status.errors.some(e => e.includes('500') || e.includes('502') || e.includes('503'))) {
    console.log('🔄 Detected server error - triggering Netlify rebuild...');
    // TODO: Trigger Netlify rebuild via API
    return false; // Not implemented yet
  }
  
  // Check if it's a DNS/routing issue
  if (status.errors.some(e => e.includes('DNS') || e.includes('ENOTFOUND'))) {
    console.log('🔄 Detected DNS issue - checking domain configuration...');
    // TODO: Verify DNS records
    return false; // Not implemented yet
  }
  
  return false;
}

/**
 * Send alert to Chad
 */
async function sendAlert(status: HealthStatus) {
  const message = `🚨 ATHLYNX ALERT!\n\nStatus: ${status.status.toUpperCase()}\nErrors: ${status.errors.join(', ')}\nResponse Time: ${status.responseTime}ms\n\nTime: ${status.timestamp.toLocaleString()}`;
  
  try {
    // Send SMS
    await sendSMS(ALERT_PHONE, message);
    
    // Send Email
    await sendEmail({
      to: ALERT_EMAIL,
      subject: `🚨 ATHLYNX ${status.status.toUpperCase()} - Immediate Action Required`,
      html: `
        <h2>ATHLYNX Health Alert</h2>
        <p><strong>Status:</strong> ${status.status.toUpperCase()}</p>
        <p><strong>Response Time:</strong> ${status.responseTime}ms</p>
        <p><strong>Errors:</strong></p>
        <ul>
          ${status.errors.map(e => `<li>${e}</li>`).join('')}
        </ul>
        <p><strong>Timestamp:</strong> ${status.timestamp.toLocaleString()}</p>
        <hr>
        <p>Auto-fix attempted but failed. Manual intervention required.</p>
      `
    });
    
    console.log('✅ Alert sent to Chad');
  } catch (error) {
    console.error('❌ Failed to send alert:', error);
  }
}

/**
 * Main monitoring loop
 */
async function monitorHealth() {
  console.log(`🏥 ATHLYNX Health Monitor started - checking every ${CHECK_INTERVAL / 1000 / 60} minutes`);
  
  while (true) {
    const status = await checkHealth();
    
    console.log(`[${status.timestamp.toLocaleString()}] Status: ${status.status} | Response: ${status.responseTime}ms`);
    
    if (status.status === 'healthy') {
      consecutiveFailures = 0;
      console.log('✅ All systems operational');
    } else {
      consecutiveFailures++;
      console.log(`⚠️ Issue detected (${consecutiveFailures}/${MAX_FAILURES_BEFORE_ALERT}): ${status.errors.join(', ')}`);
      
      // Try to auto-fix
      const fixed = await autoFix(status);
      
      if (fixed) {
        console.log('✅ Auto-fix successful!');
        consecutiveFailures = 0;
      } else if (consecutiveFailures >= MAX_FAILURES_BEFORE_ALERT) {
        console.log('🚨 Max failures reached - sending alert');
        await sendAlert(status);
        consecutiveFailures = 0; // Reset to avoid spam
      }
    }
    
    // Wait before next check
    await new Promise(resolve => setTimeout(resolve, CHECK_INTERVAL));
  }
}

// Start monitoring
if (require.main === module) {
  monitorHealth().catch(error => {
    console.error('❌ Health monitor crashed:', error);
    process.exit(1);
  });
}

export { checkHealth, autoFix, sendAlert };
