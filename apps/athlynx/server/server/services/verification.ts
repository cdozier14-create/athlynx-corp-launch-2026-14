/**
 * Verification Service - SMS + Email
 * ATHLYNX AI Corporation
 * 
 * @author ATHLYNX AI Corporation
 * @date January 8, 2026
 */

import { getDb } from '../db';
import { verificationCodes } from '../../drizzle/schema';
import { sendSMS } from './aws-sns';
import { sendVerificationEmail } from './aws-ses';
import { eq, and, gt, sql } from 'drizzle-orm';

/**
 * Generate 6-digit verification code
 */
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send verification code via SMS and Email
 */
export async function sendVerificationCode(
  email: string,
  phone?: string,
  type: 'signup' | 'login' | 'password_reset' = 'signup'
): Promise<{
  success: boolean;
  error?: string;
  smsSent?: boolean;
  emailSent?: boolean;
}> {
  try {
    // Generate code
    const code = generateCode();
    
    // Calculate expiration (10 minutes from now)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    
    // Save to database
    const db = await getDb();
    if (!db) throw new Error('Database not available');
    
    await db.insert(verificationCodes).values({
      email,
      phone: phone || null,
      code,
      type,
      verified: false,
      expiresAt,
    });
    
    // Send via Email (PRIMARY)
    const emailResult = await sendVerificationEmail(email, code);
    
    // Send via SMS (BACKUP) if phone provided
    let smsResult = { success: false };
    if (phone) {
      smsResult = await sendSMS(phone, code);
    }
    
    return {
      success: true,
      emailSent: emailResult.success,
      smsSent: smsResult.success,
    };
  } catch (error) {
    console.error('[Verification Error]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send verification code',
    };
  }
}

/**
 * Verify code
 */
export async function verifyCode(
  email: string,
  code: string
): Promise<{
  valid: boolean;
  error?: string;
}> {
  try {
    // Find verification code
    const db = await getDb();
    if (!db) throw new Error('Database not available');
    
    const now = sql`NOW()`;
    const [verification] = await db
      .select()
      .from(verificationCodes)
      .where(
        and(
          eq(verificationCodes.email, email),
          eq(verificationCodes.code, code),
          eq(verificationCodes.verified, false),
          gt(verificationCodes.expiresAt, now)
        )
      )
      .limit(1);
    
    if (!verification) {
      return { valid: false, error: 'Invalid or expired code' };
    }
    
    // Mark as verified
    await db
      .update(verificationCodes)
      .set({ verified: true })
      .where(eq(verificationCodes.id, verification.id));
    
    return { valid: true };
  } catch (error) {
    console.error('[Verification Error]', error);
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Verification failed',
    };
  }
}

/**
 * Clean up expired codes (run periodically)
 */
export async function cleanupExpiredCodes(): Promise<void> {
  try {
    const db = await getDb();
    if (!db) return;
    
    const now = sql`NOW()`;
    await db
      .delete(verificationCodes)
      .where(gt(now, verificationCodes.expiresAt));
  } catch (error) {
    console.error('[Cleanup Error]', error);
  }
}

export default {
  sendVerificationCode,
  verifyCode,
  cleanupExpiredCodes,
};
