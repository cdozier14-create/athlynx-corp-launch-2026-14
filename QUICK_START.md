# 🚀 QUICK START - Deployment Guide

**Get your unified platform live in 5 steps!**

---

## Step 1: Read the Documentation (5 minutes)

Start here:
1. **MASTER_INDEX.md** - Overview of all documentation
2. **DEPLOYMENT_GUIDE.md** - Full deployment instructions

---

## Step 2: Setup Netlify (30 minutes)

### Create 5 Netlify Sites

For each site:

1. **DHG Master Site**
   ```
   Site name: dhg-master
   Build command: cd apps/dhg && pnpm install && pnpm run build
   Publish directory: apps/dhg/dist
   Domain: dozierholdingsgroup.com
   ```

2. **Athlynx Platform**
   ```
   Site name: athlynx-platform
   Build command: cd apps/athlynx && pnpm install && pnpm run build
   Publish directory: apps/athlynx/dist
   Domain: athlynx.ai
   ```

3. **Athlynx VIP**
   ```
   Site name: athlynxapp-vip
   Build command: cd apps/athlynxapp-vip && pnpm install && pnpm run build
   Publish directory: apps/athlynxapp-vip/dist
   Domain: athlynxapp.vip
   ```

4. **Transfer Portal**
   ```
   Site name: transferportal-ai
   Build command: cd apps/transferportal && pnpm install && pnpm run build
   Publish directory: apps/transferportal/dist
   Domain: transferportal.ai
   ```

5. **Diamond Grind**
   ```
   Site name: diamond-grind
   Build command: cd apps/diamond-grind && pnpm install && pnpm run build
   Publish directory: apps/diamond-grind/dist
   Domain: diamond-grind.ai
   ```

### ⚠️ CRITICAL: Remove Unauthorized Access
- Go to each site → Settings → Team
- Remove "manus" or any other users
- Set to "Owner only" (cdozier14-create)

---

## Step 3: Deploy Backend API (20 minutes)

### Using Render.com

1. Create new Web Service
2. Connect to GitHub: `cdozier14-create/athlynx-corp-launch-2026-14`
3. Configure:
   ```
   Name: dhg-unified-api
   Root Directory: services/api
   Environment: Python 3.11
   Build Command: pip install -r requirements.txt
   Start Command: gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT
   ```

4. Add environment variables from `.env.example`

5. Add custom domain: `api.dozierholdingsgroup.com`

---

## Step 4: Configure Environment Variables (15 minutes)

### For Each Netlify Site

Add these in Site Settings → Environment Variables:

```bash
# Required for all sites
DATABASE_URL=your_neon_db_url
API_URL=https://api.dozierholdingsgroup.com
NODE_ENV=production

# Stripe (publishable key only for frontend)
STRIPE_PUBLISHABLE_KEY=pk_live_...

# Optional
JWT_SECRET=your_jwt_secret
```

### For Backend API (Render/Railway)

Add these environment variables:

```bash
# Database
DATABASE_URL=postgresql://...

# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_SES_FROM_EMAIL=noreply@athlynx.ai

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Auth
JWT_SECRET=...
OAUTH_GOOGLE_CLIENT_ID=...
OAUTH_GOOGLE_CLIENT_SECRET=...
```

---

## Step 5: Configure Domains (30 minutes)

### DNS Configuration

For each domain, add these DNS records:

```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: [your-site-name].netlify.app
```

### In Netlify

For each site:
1. Go to Domain management
2. Add custom domain
3. Verify DNS
4. Enable HTTPS
5. Force HTTPS redirect

---

## ✅ Verification Checklist

Test each domain:

```bash
# DHG Master Site
curl -I https://dozierholdingsgroup.com

# Athlynx
curl -I https://athlynx.ai

# Athlynx VIP
curl -I https://athlynxapp.vip

# Transfer Portal
curl -I https://transferportal.ai

# Diamond Grind
curl -I https://diamond-grind.ai

# API
curl https://api.dozierholdingsgroup.com/api/health
```

All should return `200 OK`

---

## 🔐 Security Checklist

Before going live:

- [ ] Remove "manus" from ALL Netlify sites
- [ ] Set all sites to "Owner only"
- [ ] Verify only cdozier14-create has access
- [ ] Rotate all API keys
- [ ] Enable MFA on all accounts
- [ ] Test backup procedures

---

## 📞 Need Help?

**Documentation:**
- MASTER_INDEX.md - Complete guide
- DEPLOYMENT_GUIDE.md - Detailed instructions
- SECURITY_ACCESS_CONTROL.md - Security procedures

**Issues:**
- Check logs in Netlify dashboard
- Check backend logs in Render/Railway
- Review TROUBLESHOOTING section in DEPLOYMENT_GUIDE.md

---

## 🎉 You're Live!

Once all 5 sites show green:

1. ✅ Test user registration
2. ✅ Test login
3. ✅ Test payments (with test card first!)
4. ✅ Verify database connections
5. ✅ Check analytics

**Congratulations! Your unified platform is live! 🚀**

---

## 📊 Monitoring

### Daily
- Check https://api.dozierholdingsgroup.com/api/health
- Review Netlify deploy logs
- Monitor Stripe transactions

### Weekly
- Check analytics
- Review error logs
- Verify backups

---

## 🦁 Dreams Do Come True 2026

**Your platform is ready. Time to grow! 🎯**
