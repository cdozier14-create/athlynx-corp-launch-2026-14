# Unified Platform Deployment Guide

**Dozier Holdings Group - Complete Deployment Instructions**

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Domain Configuration](#domain-configuration)
3. [Netlify Setup](#netlify-setup)
4. [Backend API Deployment](#backend-api-deployment)
5. [Database Setup](#database-setup)
6. [Environment Variables](#environment-variables)
7. [Stripe Configuration](#stripe-configuration)
8. [Security & Access Control](#security--access-control)
9. [Testing & Verification](#testing--verification)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Accounts
- ✅ **GitHub:** cdozier14-create (repository owner)
- ✅ **Netlify:** cdozier14-create account ONLY
- ✅ **Neon:** PostgreSQL database
- ✅ **Stripe:** Payment processing
- ✅ **AWS:** SES (email) + SNS (SMS)
- ✅ **Domain Registrar:** For DNS configuration

### Required Tools
- Node.js 20+
- Python 3.11+
- pnpm 10+
- Git
- Netlify CLI (optional)

---

## Domain Configuration

### Domains to Configure

1. **dozierholdingsgroup.com** (Primary - DHG Master Site)
2. **athlynx.ai** (Athlynx Platform)
3. **athlynxapp.vip** (Athlynx VIP Portal)
4. **transferportal.ai** (Transfer Portal)
5. **diamond-grind.ai** (Diamond Grind)

### DNS Configuration

For each domain, add these DNS records:

```
Type: A
Name: @
Value: 75.2.60.5 (Netlify Load Balancer)

Type: CNAME
Name: www
Value: [your-site-name].netlify.app
```

**Example for athlynx.ai:**
```
A     @      75.2.60.5
CNAME www    athlynx.netlify.app
```

### SSL/TLS Configuration
- Netlify automatically provisions Let's Encrypt certificates
- Enable "Force HTTPS" in Netlify settings
- Enable HSTS (configured in netlify.toml)

---

## Netlify Setup

### Step 1: Create Netlify Sites

Create a separate Netlify site for each domain:

1. **DHG Master Site**
   - Site name: `dhg-master`
   - Domain: `dozierholdingsgroup.com`
   - Build command: `cd apps/dhg && pnpm install && pnpm run build`
   - Publish directory: `apps/dhg/dist`

2. **Athlynx Platform**
   - Site name: `athlynx-platform`
   - Domain: `athlynx.ai`
   - Build command: `cd apps/athlynx && pnpm install && pnpm run build`
   - Publish directory: `apps/athlynx/dist`

3. **Athlynx VIP**
   - Site name: `athlynxapp-vip`
   - Domain: `athlynxapp.vip`
   - Build command: `cd apps/athlynxapp-vip && pnpm install && pnpm run build`
   - Publish directory: `apps/athlynxapp-vip/dist`

4. **Transfer Portal**
   - Site name: `transferportal-ai`
   - Domain: `transferportal.ai`
   - Build command: `cd apps/transferportal && pnpm install && pnpm run build`
   - Publish directory: `apps/transferportal/dist`

5. **Diamond Grind**
   - Site name: `diamond-grind`
   - Domain: `diamond-grind.ai`
   - Build command: `cd apps/diamond-grind && pnpm install && pnpm run build`
   - Publish directory: `apps/diamond-grind/dist`

### Step 2: Configure Build Settings

In each Netlify site settings:

**Build & Deploy > Environment:**
- Node version: `20`
- Package manager: `pnpm`

**Build & Deploy > Build settings:**
- Repository: `https://github.com/cdozier14-create/athlynx-corp-launch-2026-14`
- Branch: `main`
- Use netlify.toml settings: ✅

### Step 3: Connect Custom Domains

For each site:
1. Go to **Domain management**
2. Click **Add custom domain**
3. Enter the domain (e.g., `athlynx.ai`)
4. Follow DNS verification steps
5. Enable HTTPS
6. Set as primary domain

### Step 4: Remove Unauthorized Access

**CRITICAL:** Ensure only cdozier14-create has access

1. Go to **Site settings > Team & collaborators**
2. Remove "manus" or any other unauthorized users
3. Set access to **Owner only**
4. Enable **Protected branches** for main

---

## Backend API Deployment

### Option 1: Render.com (Recommended)

1. **Create New Web Service**
   - Name: `dhg-unified-api`
   - Repository: Link to GitHub
   - Branch: `main`
   - Root directory: `services/api`

2. **Configure Build Settings**
   - Environment: `Python 3.11`
   - Build command: `pip install -r requirements.txt`
   - Start command: `gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT`

3. **Environment Variables**
   - Add all variables from `.env.example`
   - Use Render's secret management

4. **Custom Domain**
   - Add `api.dozierholdingsgroup.com`
   - Configure CNAME: `your-service.onrender.com`

### Option 2: Railway.app

1. **Create New Project**
   - Connect GitHub repository
   - Select `services/api` directory

2. **Configure**
   - Buildpack: Python
   - Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

3. **Add Environment Variables**
   - Import from `.env.example`

4. **Deploy**
   - Railway auto-deploys on push to main

---

## Database Setup

### Neon PostgreSQL Configuration

1. **Database Details**
   - Host: `ep-silent-bonus-ahftzrvu-pooler.c-3.us-east-1.aws.neon.tech`
   - Database: `neondb`
   - User: `neondb_owner`
   - SSL Mode: `require`

2. **Connection String**
   ```
   postgresql://neondb_owner:npg_u3rLRXtnoc0J@ep-silent-bonus-ahftzrvu-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```

3. **Run Migrations**
   ```bash
   cd services/database
   drizzle-kit generate
   drizzle-kit migrate
   ```

4. **Verify Tables**
   ```bash
   cd services/api
   python test_neon.py
   ```

### Database Schema

Key tables:
- `users` - User accounts
- `athletes` - Athlete profiles
- `posts` - Social feed
- `nil_deals` - NIL marketplace
- `transfers` - Transfer portal
- `crm_contacts` - CRM data
- `stripe_customers` - Payment data

---

## Environment Variables

### Netlify Environment Variables

Configure in **Site settings > Environment variables** for each site:

**Common Variables (All Sites):**
```
DATABASE_URL=postgresql://...
API_URL=https://api.dozierholdingsgroup.com
JWT_SECRET=your_jwt_secret
NODE_ENV=production
```

**Stripe Variables:**
```
STRIPE_PUBLISHABLE_KEY=pk_live_...
```

**AWS Variables (if needed client-side):**
```
AWS_REGION=us-east-1
```

### API Environment Variables

Configure in Render/Railway:

```
DATABASE_URL=postgresql://...
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_SES_FROM_EMAIL=noreply@athlynx.ai
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
JWT_SECRET=...
OPENAI_API_KEY=sk-...
```

---

## Stripe Configuration

### Step 1: Products & Prices

Create products in Stripe Dashboard:

1. **Athlynx Pro** - $29/month
2. **Athlynx Elite** - $99/month
3. **VIP Access** - $199/month
4. **Credits Package (Small)** - $10
5. **Credits Package (Medium)** - $50
6. **Credits Package (Large)** - $100

### Step 2: Webhook Configuration

1. Go to **Developers > Webhooks**
2. Add endpoint: `https://api.dozierholdingsgroup.com/api/stripe/webhook`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

4. Copy webhook secret to environment variables

### Step 3: Test Payment Flow

```bash
# Use test mode first
STRIPE_SECRET_KEY=sk_test_...

# Test card numbers:
# Success: 4242 4242 4242 4242
# Decline: 4000 0000 0000 0002
```

### Step 4: Go Live

1. Complete Stripe account verification
2. Switch to live API keys
3. Update all environment variables
4. Test with real card (refund immediately)

---

## Security & Access Control

### GitHub Repository

1. ✅ **Set to Private**
2. ✅ **Owner:** cdozier14-create only
3. ✅ **Branch Protection:**
   - Require PR reviews
   - Require status checks
   - Prevent force pushes

### Netlify Access

1. ✅ **Team Settings:**
   - Remove all team members except cdozier14-create
   - No collaborators
   - No guest access

2. ✅ **Deploy Keys:**
   - Use personal access tokens
   - Rotate regularly

### AWS IAM

1. Create dedicated IAM user for each service
2. Use principle of least privilege
3. Enable MFA
4. Rotate access keys quarterly

### Stripe

1. Use different keys for test/production
2. Restrict API key permissions
3. Enable webhook signature verification
4. Monitor transactions regularly

---

## Testing & Verification

### Frontend Testing

Test each domain:

```bash
# DHG Master Site
curl -I https://dozierholdingsgroup.com
# Should return 200 OK

# Athlynx
curl -I https://athlynx.ai
# Should return 200 OK

# Check HTTPS redirect
curl -I http://athlynx.ai
# Should return 301 redirect to HTTPS
```

### API Testing

```bash
# Health check
curl https://api.dozierholdingsgroup.com/api/health

# Auth endpoint
curl -X POST https://api.dozierholdingsgroup.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test"}'
```

### Database Testing

```bash
cd services/api
python test_neon.py
```

### Payment Testing

1. Go to pricing page on any app
2. Click subscription button
3. Use test card: `4242 4242 4242 4242`
4. Verify webhook received
5. Check database for subscription record

---

## Troubleshooting

### Build Failures

**Problem:** Netlify build fails

**Solutions:**
1. Check Node version (should be 20)
2. Verify pnpm is installed
3. Check build command path
4. Review build logs

### Database Connection Errors

**Problem:** Cannot connect to Neon

**Solutions:**
1. Verify connection string
2. Check SSL mode (`sslmode=require`)
3. Ensure IP whitelisting (if enabled)
4. Test with `test_neon.py`

### Stripe Webhook Not Receiving

**Problem:** Webhooks not triggering

**Solutions:**
1. Verify endpoint URL is correct
2. Check webhook secret matches
3. Ensure API is accessible publicly
4. Review Stripe webhook logs
5. Test with Stripe CLI

### CORS Errors

**Problem:** Frontend cannot call API

**Solutions:**
1. Add domain to CORS whitelist in `main.py`
2. Verify API URL in frontend
3. Check preflight requests (OPTIONS)
4. Review browser console

### Domain Not Resolving

**Problem:** Custom domain shows error

**Solutions:**
1. Wait for DNS propagation (up to 48 hours)
2. Verify DNS records
3. Check domain status in Netlify
4. Clear DNS cache: `ipconfig /flushdns`

---

## Deployment Checklist

- [ ] All domains purchased and configured
- [ ] DNS records added for each domain
- [ ] 5 Netlify sites created (one per app)
- [ ] Custom domains connected to Netlify
- [ ] HTTPS enabled on all domains
- [ ] Backend API deployed to Render/Railway
- [ ] Database migrations run successfully
- [ ] All environment variables configured
- [ ] Stripe products and prices created
- [ ] Stripe webhooks configured
- [ ] Test payments completed successfully
- [ ] All unauthorized users removed from Netlify
- [ ] GitHub repository set to private
- [ ] Branch protection enabled
- [ ] Security headers configured
- [ ] Monitoring and alerts setup
- [ ] Backup strategy implemented
- [ ] Documentation complete

---

## Support

**Owner:** Chad Dozier  
**GitHub:** @cdozier14-create  
**Email:** Contact via GitHub

---

**Last Updated:** January 22, 2026  
**Version:** 1.0.0
