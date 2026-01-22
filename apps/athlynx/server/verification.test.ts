/**
 * Verification System Tests
 * ATHLYNX AI Corporation
 * 
 * @author ATHLYNX AI Corporation
 * @date January 8, 2026
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { sendVerificationCode, verifyCode } from './services/verification';
import { getDb } from './db';
import { verificationCodes } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

describe('Verification System', () => {
  beforeAll(async () => {
    // Clean up test data
    const db = await getDb();
    if (db) {
      await db.delete(verificationCodes).where(eq(verificationCodes.email, 'test@athlynx.ai'));
    }
  });

  it('should send verification code via email', async () => {
    const result = await sendVerificationCode('test@athlynx.ai', undefined, 'signup');
    
    expect(result.success).toBe(true);
    expect(result.emailSent).toBe(true);
  });

  it('should send verification code via SMS and email', async () => {
    const result = await sendVerificationCode('test2@athlynx.ai', '+16014985282', 'signup');
    
    expect(result.success).toBe(true);
    expect(result.emailSent).toBe(true);
    // SMS may or may not succeed depending on Twilio config
  });

  it('should store verification code in database', async () => {
    await sendVerificationCode('test3@athlynx.ai', undefined, 'signup');
    
    const db = await getDb();
    expect(db).toBeTruthy();
    
    if (db) {
      const [code] = await db
        .select()
        .from(verificationCodes)
        .where(eq(verificationCodes.email, 'test3@athlynx.ai'))
        .limit(1);
      
      expect(code).toBeTruthy();
      expect(code.email).toBe('test3@athlynx.ai');
      expect(code.code).toHaveLength(6);
      expect(code.verified).toBe(false);
    }
  });

  it('should verify correct code', async () => {
    // Send code first
    await sendVerificationCode('test4@athlynx.ai', undefined, 'signup');
    
    // Get the code from database
    const db = await getDb();
    if (!db) throw new Error('Database not available');
    
    const [stored] = await db
      .select()
      .from(verificationCodes)
      .where(eq(verificationCodes.email, 'test4@athlynx.ai'))
      .limit(1);
    
    expect(stored).toBeTruthy();
    
    // Verify the code
    const result = await verifyCode('test4@athlynx.ai', stored.code);
    
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should reject incorrect code', async () => {
    await sendVerificationCode('test5@athlynx.ai', undefined, 'signup');
    
    const result = await verifyCode('test5@athlynx.ai', '000000');
    
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('should reject code for wrong email', async () => {
    await sendVerificationCode('test6@athlynx.ai', undefined, 'signup');
    
    const result = await verifyCode('wrong@athlynx.ai', '123456');
    
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('should mark code as verified after successful verification', async () => {
    await sendVerificationCode('test7@athlynx.ai', undefined, 'signup');
    
    const db = await getDb();
    if (!db) throw new Error('Database not available');
    
    const [stored] = await db
      .select()
      .from(verificationCodes)
      .where(eq(verificationCodes.email, 'test7@athlynx.ai'))
      .limit(1);
    
    await verifyCode('test7@athlynx.ai', stored.code);
    
    // Check if marked as verified
    const [updated] = await db
      .select()
      .from(verificationCodes)
      .where(eq(verificationCodes.email, 'test7@athlynx.ai'))
      .limit(1);
    
    expect(updated.verified).toBe(true);
  });

  it('should not allow reusing verified code', async () => {
    await sendVerificationCode('test8@athlynx.ai', undefined, 'signup');
    
    const db = await getDb();
    if (!db) throw new Error('Database not available');
    
    const [stored] = await db
      .select()
      .from(verificationCodes)
      .where(eq(verificationCodes.email, 'test8@athlynx.ai'))
      .limit(1);
    
    // Verify once
    await verifyCode('test8@athlynx.ai', stored.code);
    
    // Try to verify again
    const result = await verifyCode('test8@athlynx.ai', stored.code);
    
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Invalid or expired');
  });
});
