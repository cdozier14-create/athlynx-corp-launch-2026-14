# ATHLYNX.AI - NETLIFY DEPLOYMENT INSTRUCTIONS
**Deploy from GitHub to Netlify with NEON Database**

---

## STEP 1: CONNECT GITHUB TO NETLIFY

1. Go to **https://app.netlify.com/**
2. Click **"Add new site"** → **"Import an existing project"**
3. Click **"Deploy with GitHub"**
4. Authorize Netlify to access your GitHub account
5. Select repository: **cdozier14-create/Athlynx.ai**
6. Branch: **main**

---

## STEP 2: BUILD SETTINGS

Netlify will auto-detect settings from `netlify.toml`, but verify:

- **Build command:** `pnpm install && pnpm build`
- **Publish directory:** `dist`
- **Functions directory:** `server`

Click **"Show advanced"** if you need to override.

---

## STEP 3: ENVIRONMENT VARIABLES

Click **"Add environment variables"** and add these:

### Database (NEON)
```
DATABASE_URL=postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/athlynx?sslmode=require
```

### JWT Secret
```
JWT_SECRET=athlynx-production-secret-2026-change-this
```

### AWS Credentials (for SES/SNS)
```
AWS_ACCESS_KEY_ID=your_aws_access_key_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_key_here
AWS_REGION=us-east-1
```

### Email Configuration
```
FROM_EMAIL=noreply@athlynx.ai
SUPPORT_EMAIL=support@athlynx.ai
```

### Stripe
```
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### App Configuration
```
NODE_ENV=production
VITE_APP_TITLE=ATHLYNX
VITE_APP_LOGO=/logo.png
FRONTEND_URL=https://athlynx.ai
```

---

## STEP 4: DEPLOY

1. Click **"Deploy site"**
2. Wait 3-5 minutes for build to complete
3. Netlify will give you a temporary URL: `https://random-name-123.netlify.app`

---

## STEP 5: ADD CUSTOM DOMAIN

1. In Netlify dashboard, go to **"Domain settings"**
2. Click **"Add custom domain"**
3. Enter: **athlynx.ai**
4. Netlify will show you DNS records to add

### DNS Records (add these at your domain registrar):

```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: [your-site-name].netlify.app
```

5. Wait 10-60 minutes for DNS propagation
6. Netlify will automatically provision SSL certificate (Let's Encrypt)

---

## STEP 6: VERIFY DEPLOYMENT

### Test the site:
```bash
# Homepage
curl https://athlynx.ai

# API health check
curl https://athlynx.ai/api/health

# Waitlist endpoint
curl -X POST https://athlynx.ai/api/waitlist/join \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"test@example.com","role":"athlete"}'
```

### Check in browser:
- Visit https://athlynx.ai
- VIP signup form should load
- All 10 apps should be visible
- No console errors

---

## STEP 7: NEON DATABASE SETUP

### Get your NEON connection string:

1. Go to **https://console.neon.tech/**
2. Select your project
3. Click **"Connection string"**
4. Copy the PostgreSQL connection string
5. Add it to Netlify environment variables as `DATABASE_URL`

### Connection string format:
```
postgresql://username:password@ep-cool-name-123456.us-east-2.aws.neon.tech/athlynx?sslmode=require
```

### Run database migrations:

```bash
# From your local machine
cd /home/ubuntu/athlynx-perfect-storm
export DATABASE_URL="your_neon_connection_string"
pnpm db:push
```

This will create all 41 tables in NEON.

---

## STEP 8: AWS SES SETUP (Email)

### Verify domain:
1. Go to **AWS SES Console**
2. Click **"Verified identities"** → **"Create identity"**
3. Select **"Domain"**
4. Enter: **athlynx.ai**
5. AWS will give you DNS records (TXT, CNAME, MX)
6. Add these to your domain registrar

### Verify email addresses:
```
noreply@athlynx.ai
support@athlynx.ai
cdozier14@athlynx.ai
```

### Request production access:
- By default, SES is in "sandbox mode"
- Submit a request to move to production
- This allows you to send to any email address

---

## STEP 9: AWS SNS SETUP (SMS)

### Enable SMS:
1. Go to **AWS SNS Console**
2. Click **"Text messaging (SMS)"** → **"Publish text message"**
3. Test sending to: **+1-601-498-5282** (Chad's phone)
4. If it works, you're ready

### Request production access:
- By default, SNS has low sending limits
- Request a limit increase for production use

---

## STEP 10: STRIPE SETUP

### Get API keys:
1. Go to **https://dashboard.stripe.com/**
2. Switch to **"Live mode"** (toggle in top-right)
3. Go to **"Developers"** → **"API keys"**
4. Copy:
   - **Publishable key** (starts with `pk_live_`)
   - **Secret key** (starts with `sk_live_`)

### Set up webhook:
1. Go to **"Developers"** → **"Webhooks"**
2. Click **"Add endpoint"**
3. Endpoint URL: `https://athlynx.ai/api/stripe/webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **webhook secret** (starts with `whsec_`)
6. Add to Netlify env vars as `STRIPE_WEBHOOK_SECRET`

---

## TROUBLESHOOTING

### Build fails:
- Check Netlify build logs
- Verify all environment variables are set
- Check for TypeScript errors

### Database connection fails:
- Verify NEON connection string is correct
- Check that `?sslmode=require` is at the end
- Verify NEON database is running

### Email not sending:
- Check AWS SES is out of sandbox mode
- Verify domain is verified in SES
- Check AWS credentials in Netlify env vars

### SMS not sending:
- Check AWS SNS has SMS enabled
- Verify AWS credentials
- Check phone number format: +1-601-498-5282

---

## MONITORING

### Netlify Analytics:
- Enable in Netlify dashboard
- Track visitors, page views, bandwidth

### NEON Monitoring:
- Check database connections
- Monitor query performance
- Set up alerts for high usage

### AWS CloudWatch:
- Monitor SES email delivery
- Track SNS SMS delivery
- Set up alarms for failures

---

## TEAM CONTACTS

**Chad A. Dozier - CEO**
- Phone: +1-601-498-5282
- Email: cdozier14@dozierholdingsgroup.com.mx

**For Issues:**
- Check Netlify deploy logs first
- Check NEON database status
- Check AWS SES/SNS dashboards
- Contact Chad if stuck

---

## CHECKLIST

- [ ] Code pushed to GitHub
- [ ] Netlify site created
- [ ] GitHub repo connected to Netlify
- [ ] All environment variables added
- [ ] Site deployed successfully
- [ ] Custom domain added (athlynx.ai)
- [ ] DNS records configured
- [ ] SSL certificate active
- [ ] NEON database connected
- [ ] Database migrations run
- [ ] AWS SES domain verified
- [ ] AWS SES production access approved
- [ ] AWS SNS SMS tested
- [ ] Stripe live mode keys added
- [ ] Stripe webhook configured
- [ ] Site tested and working
- [ ] All 10 apps loading
- [ ] VIP signup working
- [ ] Email verification working
- [ ] SMS verification working
- [ ] Payments working

---

**Dreams Do Come True 2026! 🦁**
