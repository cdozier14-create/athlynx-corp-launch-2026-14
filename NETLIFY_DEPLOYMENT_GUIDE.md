# ATHLYNX.AI - NETLIFY DEPLOYMENT GUIDE
## Python + Julia Full Stack → GitHub → Netlify → NEON

**Date:** January 9, 2026  
**Stack:** Python FastAPI + Julia + React + NEON PostgreSQL  
**Deployment:** GitHub → Netlify (PAID) → athlynx.ai

---

## STEP 1: PUSH TO GITHUB

```bash
cd /home/ubuntu/athlynx-perfect-storm
git add .
git commit -m "Complete Python FastAPI backend with 12 routers - ready for production"
git push origin main
```

**Repository:** cdozier14-create/Athlynx.ai

---

## STEP 2: NETLIFY CONFIGURATION

### A. Create `netlify.toml` (already exists)

```toml
[build]
  command = "cd python-backend && pip install -r requirements.txt && cd ../client && npm install && npm run build"
  publish = "client/dist"
  functions = "python-backend"

[build.environment]
  PYTHON_VERSION = "3.11"
  NODE_VERSION = "22"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### B. Create `requirements.txt` for Python backend

```txt
fastapi==0.109.0
uvicorn==0.27.0
python-dotenv==1.0.0
mysql-connector-python==8.3.0
pydantic==2.5.3
pydantic[email]==2.5.3
bcrypt==4.1.2
PyJWT==2.8.0
stripe==8.0.0
boto3==1.34.34
```

---

## STEP 3: NETLIFY ENVIRONMENT VARIABLES

**Go to:** Netlify Dashboard → Site Settings → Environment Variables

### Required Variables:

```bash
# Database (NEON PostgreSQL)
DATABASE_URL=postgresql://user:password@host.neon.tech/athlynx?sslmode=require

# JWT Secret
JWT_SECRET=athlynx-secret-key-2026-production

# AWS Credentials (for SES/SNS)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1

# Stripe
STRIPE_SECRET_KEY=sk_live_your_stripe_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key

# Email Configuration
FROM_EMAIL=noreply@athlynx.ai
SUPPORT_EMAIL=support@athlynx.ai

# App Configuration
ENVIRONMENT=production
FRONTEND_URL=https://athlynx.ai
```

---

## STEP 4: NEON DATABASE SETUP

### A. Connection String Format:
```
postgresql://username:password@ep-cool-name-123456.us-east-2.aws.neon.tech/athlynx?sslmode=require
```

### B. Required Tables (41 total):

**Core Tables:**
- users
- vip_codes
- verification_codes
- waitlist

**Social Tables:**
- posts
- post_likes
- post_comments
- user_connections
- messages
- notifications

**Athlete Tables:**
- athlete_profiles
- transfer_portal_players

**Payment Tables:**
- subscriptions
- payments

---

## STEP 5: AWS SES CONFIGURATION

### A. Verify Domain (athlynx.ai)
1. Go to AWS SES Console
2. Verify domain: athlynx.ai
3. Add DNS records to domain provider

### B. Verify Email Addresses
```
cdozier14@athlynx.ai
gtse@athlynx.ai
jboyd@athlynx.com
akustes@athlynx.ai
lmarshall@athlynx.ai
dford@athlynx.ai
noreply@athlynx.ai
support@athlynx.ai
```

### C. Move Out of Sandbox Mode
- Request production access
- Increase sending limits

---

## STEP 6: DOMAIN CONFIGURATION

### A. Point Domain to Netlify

**DNS Records for athlynx.ai:**
```
A     @       75.2.60.5
CNAME www     athlynx.netlify.app
```

### B. SSL Certificate
- Netlify automatically provisions Let's Encrypt SSL
- Enable HTTPS redirect

---

## STEP 7: DEPLOY

### A. Connect GitHub to Netlify
1. Netlify Dashboard → New Site from Git
2. Choose GitHub → cdozier14-create/Athlynx.ai
3. Branch: main
4. Build command: (from netlify.toml)
5. Publish directory: client/dist

### B. Deploy
- Push to GitHub triggers automatic deployment
- Monitor build logs
- Check for errors

---

## STEP 8: POST-DEPLOYMENT VERIFICATION

### A. Test Endpoints
```bash
# Health check
curl https://athlynx.ai/api/health

# Waitlist
curl -X POST https://athlynx.ai/api/waitlist/join \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"test@example.com","role":"athlete"}'
```

### B. Test Frontend
- Visit https://athlynx.ai
- Test VIP signup form
- Test login/register
- Check all 10 apps load

### C. Test Database Connection
- Check NEON dashboard for connections
- Verify data is being written
- Check query performance

---

## STEP 9: MONITORING

### A. Netlify Analytics
- Enable Netlify Analytics
- Monitor traffic, performance

### B. NEON Monitoring
- Check database connections
- Monitor query performance
- Set up alerts

### C. AWS CloudWatch
- Monitor SES sending
- Check SNS delivery
- Set up alarms

---

## STEP 10: BACKUP & RECOVERY

### A. Database Backups
- NEON automatic backups (daily)
- Manual backup before major changes

### B. Code Backups
- GitHub is primary backup
- Tag releases: `git tag v1.0.0`

---

## TEAM ACCESS

**Current Email:** cdozier@dozierholdingsgroup.com.mx (Reagan62277!)

**ATHLYNX Team Emails:**
1. Chad A. Dozier - cdozier14@athlynx.ai (Athynx2026!)
2. Glenn Tse - gtse@athlynx.ai (Glenn2026!)
3. Jimmy Boyd - jboyd@athlynx.com (Jimmy2026!)
4. Andrew Kustes - akustes@athlynx.ai (Andy2026!)
5. Lee Marshall - lmarshall@athlynx.ai (Lee2026!)
6. David Ford - dford@athlynx.ai

---

## DEPLOYMENT CHECKLIST

- [ ] Push Python backend to GitHub
- [ ] Create requirements.txt
- [ ] Configure netlify.toml
- [ ] Set environment variables in Netlify
- [ ] Configure NEON database connection
- [ ] Verify AWS SES domain and emails
- [ ] Point domain DNS to Netlify
- [ ] Deploy and test
- [ ] Verify all 10 apps working
- [ ] Test payment flow with Stripe
- [ ] Monitor logs and performance

---

## SUPPORT

**Issues?** Contact Chad A. Dozier
- Email: cdozier@dozierholdingsgroup.com.mx
- Phone: +1-601-498-5282
- WhatsApp: +1-601-498-5282

**Dreams Do Come True 2026! 🦁**
