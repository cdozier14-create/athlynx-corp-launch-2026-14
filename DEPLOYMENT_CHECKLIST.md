# Multi-Domain Deployment Checklist

## Pre-Deployment Verification

- [x] Python backend functional (python-backend/)
- [x] All routers working (auth, vip, verification, waitlist, etc.)
- [x] Mangum wrapper configured (netlify_function.py)
- [x] netlify.toml configured for Python deployment
- [x] CORS origins include all domains
- [x] Database connection handles missing DATABASE_URL
- [x] All imports use relative paths
- [x] Requirements.txt has all dependencies

## Deployment Steps for Each Domain

### Domain 1: dozierholdingsgroup.com

#### Netlify Site Setup
- [ ] Create new Netlify site
- [ ] Connect GitHub repository
- [ ] Select branch: `main` or `copilot/deploy-python-julia-backend`
- [ ] Build settings auto-detected from netlify.toml
- [ ] Deploy site

#### Configure Custom Domain
- [ ] Add custom domain: `dozierholdingsgroup.com`
- [ ] Configure DNS (Netlify DNS or external)
- [ ] Wait for SSL/TLS certificate
- [ ] Verify HTTPS works

#### Environment Variables
- [ ] DATABASE_URL
- [ ] JWT_SECRET
- [ ] AWS_ACCESS_KEY_ID
- [ ] AWS_SECRET_ACCESS_KEY
- [ ] AWS_REGION
- [ ] STRIPE_SECRET_KEY
- [ ] STRIPE_PUBLISHABLE_KEY
- [ ] STRIPE_WEBHOOK_SECRET
- [ ] SES_SENDER_EMAIL
- [ ] SNS_PHONE_NUMBER

#### Test Deployment
- [ ] `curl https://dozierholdingsgroup.com/api/health` returns 200
- [ ] Visit `https://dozierholdingsgroup.com/api/docs` works
- [ ] Test auth endpoint: `POST /api/auth/login`
- [ ] Test database connection (waitlist, etc.)

---

### Domain 2: athlynx.ai

#### Netlify Site Setup
- [ ] Create new Netlify site
- [ ] Connect GitHub repository
- [ ] Select branch: `main` or `copilot/deploy-python-julia-backend`
- [ ] Build settings auto-detected from netlify.toml
- [ ] Deploy site

#### Configure Custom Domain
- [ ] Add custom domain: `athlynx.ai`
- [ ] Configure DNS (Netlify DNS or external)
- [ ] Wait for SSL/TLS certificate
- [ ] Verify HTTPS works

#### Environment Variables
- [ ] DATABASE_URL (same as dozierholdingsgroup.com)
- [ ] JWT_SECRET (same)
- [ ] AWS_ACCESS_KEY_ID (same)
- [ ] AWS_SECRET_ACCESS_KEY (same)
- [ ] AWS_REGION (same)
- [ ] STRIPE_SECRET_KEY (same)
- [ ] STRIPE_PUBLISHABLE_KEY (same)
- [ ] STRIPE_WEBHOOK_SECRET (same)
- [ ] SES_SENDER_EMAIL (same)
- [ ] SNS_PHONE_NUMBER (same)

#### Test Deployment
- [ ] `curl https://athlynx.ai/api/health` returns 200
- [ ] Visit `https://athlynx.ai/api/docs` works
- [ ] Test VIP code: `POST /api/vip/validate`
- [ ] Test athlete endpoints: `GET /api/athlete/profile/:id`

---

### Domain 3: athlynxapp.vip

#### Netlify Site Setup
- [ ] Create new Netlify site (or verify existing)
- [ ] Connect GitHub repository
- [ ] Select branch: `main` or `copilot/deploy-python-julia-backend`
- [ ] Build settings auto-detected from netlify.toml
- [ ] Deploy site

#### Configure Custom Domain
- [ ] Add custom domain: `athlynxapp.vip`
- [ ] Configure DNS (Netlify DNS or external)
- [ ] Wait for SSL/TLS certificate
- [ ] Verify HTTPS works

#### Environment Variables
- [ ] DATABASE_URL (same as others)
- [ ] JWT_SECRET (same)
- [ ] AWS_ACCESS_KEY_ID (same)
- [ ] AWS_SECRET_ACCESS_KEY (same)
- [ ] AWS_REGION (same)
- [ ] STRIPE_SECRET_KEY (same)
- [ ] STRIPE_PUBLISHABLE_KEY (same)
- [ ] STRIPE_WEBHOOK_SECRET (same)
- [ ] SES_SENDER_EMAIL (same)
- [ ] SNS_PHONE_NUMBER (same)

#### Test Deployment
- [ ] `curl https://athlynxapp.vip/api/health` returns 200
- [ ] Visit `https://athlynxapp.vip/api/docs` works
- [ ] Test verification: `POST /api/verification/send-email`
- [ ] Test waitlist: `POST /api/waitlist/join`

---

### Domain 4: transferportal.ai

#### Netlify Site Setup
- [ ] Create new Netlify site
- [ ] Connect GitHub repository
- [ ] Select branch: `main` or `copilot/deploy-python-julia-backend`
- [ ] Build settings auto-detected from netlify.toml
- [ ] Deploy site

#### Configure Custom Domain
- [ ] Add custom domain: `transferportal.ai`
- [ ] Configure DNS (Netlify DNS or external)
- [ ] Wait for SSL/TLS certificate
- [ ] Verify HTTPS works

#### Environment Variables
- [ ] DATABASE_URL (same as others)
- [ ] JWT_SECRET (same)
- [ ] AWS_ACCESS_KEY_ID (same)
- [ ] AWS_SECRET_ACCESS_KEY (same)
- [ ] AWS_REGION (same)
- [ ] STRIPE_SECRET_KEY (same)
- [ ] STRIPE_PUBLISHABLE_KEY (same)
- [ ] STRIPE_WEBHOOK_SECRET (same)
- [ ] SES_SENDER_EMAIL (same)
- [ ] SNS_PHONE_NUMBER (same)

#### Test Deployment
- [ ] `curl https://transferportal.ai/api/health` returns 200
- [ ] Visit `https://transferportal.ai/api/docs` works
- [ ] Test transfer portal: `GET /api/transfer-portal/players`
- [ ] Test filtering: `GET /api/transfer-portal/players?sport=football`

---

## Post-Deployment Verification

### All Domains Health Check
```bash
# Run this script to test all domains
for domain in dozierholdingsgroup.com athlynx.ai athlynxapp.vip transferportal.ai; do
  echo "Testing $domain..."
  curl -s https://$domain/api/health | jq .
  echo "---"
done
```

Expected output for each:
```json
{
  "status": "healthy",
  "service": "ATHLYNX API",
  "version": "1.0.0",
  "message": "Dreams Do Come True 2026"
}
```

### Test API Documentation
- [ ] https://dozierholdingsgroup.com/api/docs
- [ ] https://athlynx.ai/api/docs
- [ ] https://athlynxapp.vip/api/docs
- [ ] https://transferportal.ai/api/docs

### Test Core Endpoints

#### Authentication
```bash
# Test signup on each domain
curl -X POST https://athlynx.ai/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","fullName":"Test User"}'
```

#### Verification
```bash
# Test email verification
curl -X POST https://athlynx.ai/api/verification/send-email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","type":"signup"}'
```

#### VIP Codes
```bash
# Test VIP validation
curl -X POST https://athlynx.ai/api/vip/validate \
  -H "Content-Type: application/json" \
  -d '{"code":"ATHLYNX2026"}'
```

#### Waitlist
```bash
# Test waitlist join
curl -X POST https://athlynx.ai/api/waitlist/join \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"test@example.com","role":"athlete"}'
```

#### Transfer Portal
```bash
# Test transfer portal
curl https://transferportal.ai/api/transfer-portal/players?limit=10
```

### Database Verification
- [ ] Users table accessible
- [ ] Verification codes table working
- [ ] VIP codes table functional
- [ ] Waitlist table operational
- [ ] Transfer portal data loading
- [ ] CRM analytics tracking

### Payment Processing
- [ ] Stripe webhook configured for each domain
- [ ] Test checkout session creation
- [ ] Verify webhook events received
- [ ] Test subscription management

### Email & SMS
- [ ] AWS SES configured and sending
- [ ] Email templates rendering correctly
- [ ] AWS SNS configured for SMS
- [ ] SMS codes delivering

---

## Success Criteria

- [x] **Backend Deployed**: Python FastAPI + Julia
- [ ] **All Domains Live**: 4/4 domains responding
- [ ] **SSL/TLS Configured**: All domains have HTTPS
- [ ] **Database Connected**: All domains connect to Neon PostgreSQL
- [ ] **API Endpoints Working**: All 45+ routes functional
- [ ] **Authentication Working**: JWT tokens, login/signup
- [ ] **Verification Working**: Email/SMS codes sending
- [ ] **VIP Codes Working**: Code validation functional
- [ ] **Waitlist Working**: Users can join waitlist
- [ ] **Stripe Working**: Payment processing operational
- [ ] **CRM Working**: Analytics tracking signups
- [ ] **Transfer Portal Working**: Player data loading
- [ ] **Zero React/Node.js**: Pure Python + Julia stack
- [ ] **Zero MySQL**: Pure Neon PostgreSQL

---

## Rollback Plan (If Needed)

If deployment fails:

1. **Check Netlify build logs** for errors
2. **Verify environment variables** are set correctly
3. **Test locally** with same DATABASE_URL
4. **Check database** connection and tables
5. **Review CORS** configuration
6. **Inspect function logs** in Netlify dashboard
7. **Rollback to previous deploy** if necessary

---

## Monitoring & Maintenance

### Daily Checks
- [ ] Check Netlify dashboard for build status
- [ ] Monitor function invocations
- [ ] Review error logs
- [ ] Check database performance

### Weekly Checks
- [ ] Review API usage patterns
- [ ] Check Stripe transactions
- [ ] Verify email/SMS delivery rates
- [ ] Monitor database storage

### Monthly Checks
- [ ] Review security logs
- [ ] Update dependencies if needed
- [ ] Check SSL certificate expiration
- [ ] Audit user signups and conversions

---

## Documentation Links

- [README.md](./README.md) - Main repository documentation
- [PYTHON_DEPLOYMENT_GUIDE.md](./PYTHON_DEPLOYMENT_GUIDE.md) - Detailed deployment guide
- [Netlify Documentation](https://docs.netlify.com/) - Netlify platform docs
- [FastAPI Documentation](https://fastapi.tiangolo.com/) - FastAPI framework docs
- [Neon PostgreSQL](https://neon.tech/docs) - Database documentation

---

## Notes

- All domains share the **same backend code**
- All domains connect to the **same Neon database**
- Environment variables can be different per domain if needed
- Netlify automatically handles SSL/TLS certificates
- Each domain is a separate Netlify site for flexibility

---

**Last Updated**: January 22, 2026  
**Status**: Ready for Deployment  
**Owner**: cdozier14-create  

**Dreams Do Come True 2026** 🦁
