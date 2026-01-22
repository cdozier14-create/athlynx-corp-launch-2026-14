# 🔐 ATHLYNX Environment Variables Configuration

**IMPORTANT:** All these environment variables must be set in Netlify before deployment.

## Quick Setup

Go to: **Netlify Dashboard** → **Site Settings** → **Environment Variables** → **Add a variable**

---

## Required Variables

### 🗄️ Database (Neon PostgreSQL)

```bash
DATABASE_URL=postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/athlynx?sslmode=require
```

**Where to get it:**
1. Go to https://console.neon.tech
2. Select your project
3. Copy the connection string
4. Add to Netlify environment variables

---

### 💳 Stripe Payment Processing

```bash
STRIPE_SECRET_KEY=sk_live_51...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Where to get it:**
1. Go to https://dashboard.stripe.com
2. **Secret Key:** Developers → API keys → Secret key (Reveal test key)
3. **Publishable Key:** Developers → API keys → Publishable key
4. **Webhook Secret:** Developers → Webhooks → Add endpoint → Copy signing secret

---

### 📧 AWS SES (Email Service)

```bash
AWS_SES_FROM_EMAIL=noreply@dozierholdingsgroup.com
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
```

**Where to get it:**
1. Go to https://console.aws.amazon.com/ses
2. Verify domain: `dozierholdingsgroup.com`
3. Create IAM user with SES permissions
4. Copy Access Key ID and Secret Access Key

---

### 📱 Twilio (SMS Service)

```bash
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_FROM_NUMBER=+18774618601
```

**Where to get it:**
1. Go to https://console.twilio.com
2. Copy Account SID
3. Copy Auth Token
4. Get phone number from Phone Numbers section

---

### 🔑 JWT Authentication

```bash
JWT_SECRET=your-super-secret-random-string-min-32-chars
```

**How to generate:**
```bash
# Option 1: OpenSSL
openssl rand -base64 32

# Option 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Option 3: Python
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

---

### 🌐 Environment Settings

```bash
NODE_ENV=production
ENVIRONMENT=production
```

---

### 📬 Notification Settings (Owner Only)

```bash
NOTIFICATION_EMAIL=cdozier14@dozierholdingsgroup.com.mx
NOTIFICATION_PHONE=+16014985282
```

These are used to send signup notifications to Chad A. Dozier only.

---

## Patent Price IDs (Stripe)

Create these products in Stripe Dashboard and use the price IDs:

```bash
# Individual Patents ($199/year each)
STRIPE_PRICE_NIL=price_nil_valuation
STRIPE_PRICE_TRANSFER=price_transfer_portal
STRIPE_PRICE_PLAYBOOK=price_athlete_playbook
STRIPE_PRICE_COLLECTIVE=price_collective_matching
STRIPE_PRICE_CAREER=price_career_trajectory

# Bundle ($999/year)
STRIPE_PRICE_BUNDLE=price_bundle_all
```

---

## Development vs Production

### Development (.env.local)
```bash
DATABASE_URL=postgresql://localhost/athlynx_dev
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
NODE_ENV=development
```

### Production (Netlify Environment Variables)
Use the live keys as shown above.

---

## Security Best Practices

1. ✅ **Never commit** `.env` files to git
2. ✅ **Use different keys** for development and production
3. ✅ **Rotate secrets** regularly (every 90 days)
4. ✅ **Use Netlify's** encrypted environment variables
5. ✅ **Limit access** to environment variables
6. ✅ **Monitor usage** of API keys in respective dashboards

---

## Verification Checklist

After setting all environment variables in Netlify:

- [ ] Database connection works (test query)
- [ ] Stripe checkout creates sessions
- [ ] AWS SES sends emails
- [ ] Twilio sends SMS
- [ ] JWT tokens generate correctly
- [ ] All API endpoints respond
- [ ] No console errors about missing env vars

---

## Troubleshooting

### Database Connection Error
```
Error: Connection to Neon database failed
```
**Solution:** Check `DATABASE_URL` format and ensure IP is whitelisted in Neon

### Stripe Error
```
Error: No API key provided
```
**Solution:** Verify `STRIPE_SECRET_KEY` is set and starts with `sk_live_`

### Email Not Sending
```
Error: AWS SES credentials invalid
```
**Solution:** Verify AWS keys and check domain verification in SES console

### SMS Not Sending
```
Error: Twilio authentication failed
```
**Solution:** Check `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN`

---

## Contact

**For environment variable issues:**
Chad A. Dozier  
Email: cdozier14@dozierholdingsgroup.com.mx  
Phone: +1-601-498-5282

---

**Last Updated:** January 22, 2026  
**Status:** Ready for Production 🚀
