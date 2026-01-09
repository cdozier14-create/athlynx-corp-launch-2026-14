# ATHLYNX Platform - Error Audit (January 9, 2026)

## Current Status
- Site: athlynx.ai (LIVE but has errors)
- Netlify: athylxaicorprationnewlaunch2026
- Database: TiDB MySQL (configured)
- AWS: SES/SNS (needs verification)

## REAL ERRORS (From Chad's Screenshots)

### 1. Mobile Layout Issues
- [ ] VIP signup form not visible on mobile
- [ ] Portal login button doesn't fit on screen
- [ ] Crab logo looks bad on mobile
- [ ] Buttons not centered/properly sized
- [ ] Page layout "pinched"

### 2. Email Verification Not Working
- [ ] "Unable to transform response from server" error
- [ ] Verification codes not sending
- [ ] AWS SES email not verified (code: 584042)

### 3. TypeScript/Build Errors
- [ ] pgTable errors from failed PostgreSQL conversion
- [ ] Dev server errors in console
- [ ] Need to restore MySQL schema

### 4. User Flow Issues
- [ ] Wrong order: Should be VIP Signup → Code → Login → Portal → Apps
- [ ] Founders button placement wrong
- [ ] Need AI wizard with hamburger menu

### 5. Services to Remove
- [ ] Remove Twilio completely
- [ ] Remove Resend completely
- [ ] Use AWS SES/SNS only

## NEXT ACTIONS
1. Restore MySQL schema (undo PostgreSQL conversion)
2. Fix mobile CSS for iOS/Android
3. Verify AWS SES email with code 584042
4. Test signup flow end-to-end
5. Deploy and get Chad logged in as User #1
