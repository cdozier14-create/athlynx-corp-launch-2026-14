# Environment Variables Reference

## Required for All Domains

Copy these environment variables to each Netlify site:

### Database
```bash
DATABASE_URL=postgresql://username:password@ep-host.region.neon.tech/database?sslmode=require
```
**Where to get it:**
- Neon Dashboard → Database → Connection String
- Use the "Pooled connection" string

---

### Authentication
```bash
JWT_SECRET=athlynx-secret-2026
```
**Notes:**
- This can be any secure random string
- Must be the same across all domains for shared authentication
- Keep it secret and never commit to version control

---

### AWS Configuration
```bash
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AWS_REGION=us-east-1
```
**Where to get it:**
- AWS Console → IAM → Users → Security Credentials
- Create new access key if needed
- Ensure user has permissions for SES and SNS

---

### AWS SES (Email)
```bash
SES_SENDER_EMAIL=noreply@athlynx.ai
```
**Notes:**
- Must be a verified email address in AWS SES
- Or a verified domain in AWS SES
- Can be different per domain if needed

---

### AWS SNS (SMS)
```bash
SNS_PHONE_NUMBER=+16014985282
```
**Notes:**
- Must be in E.164 format (+1XXXXXXXXXX)
- Must be verified in AWS SNS if in sandbox mode
- Can be different per domain if needed

---

### Stripe
```bash
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```
**Where to get it:**
- Stripe Dashboard → Developers → API Keys
- Use **live** keys for production (sk_live_*, pk_live_*)
- Use **test** keys for staging (sk_test_*, pk_test_*)

**Webhook Secret:**
- Stripe Dashboard → Developers → Webhooks
- Create endpoint: `https://yourdomain.com/api/stripe/webhook`
- Events to listen for:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`

---

### Optional (Production Settings)
```bash
ENVIRONMENT=production
PORT=8000
```

---

## Setting Variables in Netlify

### Via Netlify UI
1. Go to Site Settings
2. Click "Environment variables" in sidebar
3. Click "Add a variable"
4. Enter key and value
5. Click "Create variable"
6. Repeat for all variables

### Via Netlify CLI
```bash
netlify env:set DATABASE_URL "postgresql://..."
netlify env:set JWT_SECRET "athlynx-secret-2026"
netlify env:set AWS_ACCESS_KEY_ID "AKIA..."
# ... etc
```

### Via netlify.toml (NOT RECOMMENDED FOR SECRETS)
**⚠️ WARNING: Do NOT put secrets in netlify.toml - it's version controlled!**

Only use for non-secret configuration:
```toml
[build.environment]
  PYTHON_VERSION = "3.11"
  ENVIRONMENT = "production"
```

---

## Verification Checklist

After setting all variables:

- [ ] DATABASE_URL - Test with: `python test_neon.py`
- [ ] JWT_SECRET - Any secure string (min 32 characters)
- [ ] AWS_ACCESS_KEY_ID - Verify in AWS Console
- [ ] AWS_SECRET_ACCESS_KEY - Verify in AWS Console
- [ ] AWS_REGION - Should be `us-east-1` unless you have specific reason
- [ ] SES_SENDER_EMAIL - Must be verified in AWS SES
- [ ] SNS_PHONE_NUMBER - Must be in +1XXXXXXXXXX format
- [ ] STRIPE_SECRET_KEY - Starts with `sk_live_` for production
- [ ] STRIPE_PUBLISHABLE_KEY - Starts with `pk_live_` for production
- [ ] STRIPE_WEBHOOK_SECRET - Starts with `whsec_`

---

## Per-Domain Differences

Most variables should be **identical** across all domains for consistency.

However, you **may** want different values for:

### SES_SENDER_EMAIL
- dozierholdingsgroup.com → `noreply@dozierholdingsgroup.com`
- athlynx.ai → `noreply@athlynx.ai`
- athlynxapp.vip → `noreply@athlynxapp.vip`
- transferportal.ai → `noreply@transferportal.ai`

### STRIPE_WEBHOOK_SECRET
Each domain needs its own webhook endpoint in Stripe:
- Create separate webhook for each domain
- Each gets its own `whsec_` secret

---

## Security Best Practices

1. **Never commit secrets to git**
   - Use `.env` file locally (already in `.gitignore`)
   - Use Netlify environment variables in production

2. **Rotate secrets regularly**
   - Change JWT_SECRET every 90 days
   - Rotate AWS keys annually
   - Rotate Stripe keys if compromised

3. **Use different values for staging vs production**
   - Test keys for staging
   - Live keys for production
   - Different databases for each

4. **Monitor access**
   - Check AWS CloudTrail for suspicious activity
   - Monitor Stripe dashboard for unusual transactions
   - Review Neon database access logs

---

## Troubleshooting

### "Database connection failed"
- Check DATABASE_URL is correct
- Verify Neon database is running
- Ensure `?sslmode=require` is at the end of URL

### "AWS credentials not valid"
- Check AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
- Verify user has correct permissions (SES, SNS)
- Check AWS_REGION is correct

### "Stripe error"
- Verify you're using correct keys (live vs test)
- Check STRIPE_SECRET_KEY matches STRIPE_PUBLISHABLE_KEY environment
- Verify webhook secret matches Stripe dashboard

### "Email not sending"
- Verify SES_SENDER_EMAIL is verified in AWS SES
- Check AWS region supports SES (us-east-1, us-west-2, eu-west-1)
- Review SES sending limits (sandbox vs production)

### "SMS not sending"
- Verify SNS_PHONE_NUMBER is in +1XXXXXXXXXX format
- Check phone number is verified in AWS SNS (if sandbox)
- Verify AWS account has SNS enabled

---

## Quick Copy Template

For easy copying to Netlify:

```bash
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
JWT_SECRET=athlynx-secret-2026
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
SES_SENDER_EMAIL=noreply@athlynx.ai
SNS_PHONE_NUMBER=+16014985282
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
ENVIRONMENT=production
```

---

**Last Updated:** January 22, 2026  
**Domains:** dozierholdingsgroup.com, athlynx.ai, athlynxapp.vip, transferportal.ai  
**Stack:** Python 3.11 + FastAPI + Neon PostgreSQL + Netlify  

🦁 **Dreams Do Come True 2026**
