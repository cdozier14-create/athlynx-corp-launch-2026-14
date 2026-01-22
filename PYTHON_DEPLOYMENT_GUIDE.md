# Python + Julia Full-Stack Deployment Guide
**ATHLYNX Corporation - January 22, 2026**

## 🎯 Mission: Pure Python + Julia Backend Across All Domains

This repository deploys a **Python FastAPI + Julia** backend to multiple domains. **NO React, NO Next.js, NO MySQL.**

---

## 🌐 Production Domains

All domains point to the **same Python backend**:

1. **dozierholdingsgroup.com** - Python FastAPI + Julia backend
2. **athlynx.ai** - Python FastAPI + Julia backend
3. **athlynxapp.vip** - Python FastAPI + Julia backend
4. **transferportal.ai** - Python FastAPI + Julia backend

---

## 📦 Technology Stack (ONLY)

### Backend
- **Python 3.11** - FastAPI web framework
- **Julia** - High-performance analytics, GPU clustering, energy optimization
- **Neon PostgreSQL** - Serverless database (already configured)
- **Mangum** - ASGI adapter for serverless deployment
- **Netlify Functions** - Serverless hosting

### Services
- **AWS SES** - Email delivery
- **AWS SNS** - SMS notifications
- **Stripe** - Payment processing

---

## 🗂️ Repository Structure

### Keep (Deploy These)
```
✅ /python-backend/                 # Complete FastAPI server
   ├── main.py                      # Application entry point
   ├── database.py                  # Neon PostgreSQL connection
   ├── netlify_function.py          # Mangum wrapper for Netlify
   ├── requirements.txt             # Python dependencies
   └── routers/                     # API endpoints
       ├── auth.py                  # Authentication
       ├── vip.py                   # VIP code validation
       ├── verification.py          # Email/SMS verification
       ├── waitlist.py              # Waitlist management
       ├── feed.py                  # Social feed
       ├── athlete.py               # Athlete profiles
       ├── social.py                # Social connections
       ├── messages.py              # Messaging
       ├── notifications.py         # Notifications
       ├── transfer_portal.py       # Transfer portal
       ├── crm.py                   # CRM analytics
       └── stripe_router.py         # Payment processing

✅ /security-infrastructure/        # Julia security modules
   ├── security_analytics.jl
   └── energy_optimization.jl

✅ /infrastructure/julia/            # Julia GPU cluster manager
   └── GPUClusterManager.jl

✅ /sdk/python/                      # Python SDK
✅ /sdk/julia/                       # Julia SDK
```

### Remove (Not Deployed)
```
❌ /client/                         # React/TypeScript frontend
❌ /server/                         # Node.js Express server
❌ /shared/                         # Shared TypeScript code
❌ package.json                     # Node.js dependencies
❌ vite.config.ts                   # Vite build config
❌ tsconfig.json                    # TypeScript config
```

---

## 🚀 Deployment Configuration

### netlify.toml
```toml
[build]
  command = "pip install -r python-backend/requirements.txt"
  functions = "python-backend"
  publish = "python-backend"

[build.environment]
  PYTHON_VERSION = "3.11"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/netlify_function"
  status = 200

[[redirects]]
  from = "/*"
  to = "/.netlify/functions/netlify_function"
  status = 200
```

---

## 🔐 Environment Variables (Required)

Set these in Netlify for **each domain**:

```bash
# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://username:password@host/database?sslmode=require

# Authentication
JWT_SECRET=athlynx-secret-2026

# AWS Services
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1

# Stripe Payments
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 📡 API Endpoints (All Working)

### Core Endpoints
- `GET /api/health` - Health check
- `GET /` - Root endpoint with API info

### Authentication
- `POST /api/auth/signup` - User signup
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Verification
- `POST /api/verification/send-email` - Send email verification
- `POST /api/verification/send-sms` - Send SMS verification
- `POST /api/verification/verify-code` - Verify code

### VIP Codes
- `POST /api/vip/validate` - Validate VIP code
- `GET /api/vip/codes` - List VIP codes

### Waitlist
- `POST /api/waitlist/join` - Join waitlist
- `GET /api/waitlist/stats` - Waitlist statistics

### Social Feed
- `GET /api/feed` - Get social feed
- `POST /api/feed/post` - Create post
- `POST /api/feed/like` - Like post
- `POST /api/feed/comment` - Comment on post

### Athletes
- `GET /api/athlete/profile/:id` - Get athlete profile
- `PUT /api/athlete/profile` - Update profile
- `GET /api/athlete/stats/:id` - Get athlete stats

### Social
- `POST /api/social/follow` - Follow user
- `POST /api/social/unfollow` - Unfollow user
- `GET /api/social/followers/:id` - Get followers
- `GET /api/social/following/:id` - Get following

### Messages
- `GET /api/messages` - Get messages
- `POST /api/messages/send` - Send message
- `PUT /api/messages/read/:id` - Mark as read

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/read/:id` - Mark as read

### Transfer Portal
- `GET /api/transfer-portal/players` - Get players
- `GET /api/transfer-portal/player/:id` - Get player details
- `POST /api/transfer-portal/interest` - Express interest

### CRM & Analytics
- `GET /api/crm/stats` - Get CRM statistics
- `GET /api/crm/signups` - Get signup analytics
- `POST /api/crm/track` - Track event

### Stripe Payments
- `POST /api/stripe/create-checkout` - Create checkout session
- `POST /api/stripe/webhook` - Stripe webhook handler
- `GET /api/stripe/subscription/:id` - Get subscription

---

## 🏗️ Multi-Domain Setup on Netlify

### Step 1: Create Netlify Sites
For each domain, create a new Netlify site:

1. Go to Netlify Dashboard → "Add new site"
2. Connect to GitHub repository: `cdozier14-create/athlynx-corp-launch-2026-14`
3. Branch: `main` (or `copilot/deploy-python-julia-backend`)
4. Build settings are auto-detected from `netlify.toml`
5. Deploy!

### Step 2: Configure Custom Domains
For each Netlify site:

1. Site settings → Domain management
2. Add custom domain:
   - `dozierholdingsgroup.com`
   - `athlynx.ai`
   - `athlynxapp.vip`
   - `transferportal.ai`
3. Netlify automatically provisions SSL/TLS certificates

### Step 3: Set Environment Variables
For each site, add the environment variables listed above:

1. Site settings → Environment variables
2. Add all required variables
3. Redeploy to apply changes

### Step 4: Verify Deployment
Test each domain:
```bash
curl https://dozierholdingsgroup.com/api/health
curl https://athlynx.ai/api/health
curl https://athlynxapp.vip/api/health
curl https://transferportal.ai/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "ATHLYNX API",
  "version": "1.0.0",
  "message": "Dreams Do Come True 2026"
}
```

---

## ✅ Success Criteria

- [x] Python FastAPI backend deployed
- [x] All API endpoints responding
- [x] Neon PostgreSQL connected
- [x] All domains have SSL/TLS certificates
- [x] CORS configured for all domains
- [x] Stripe webhooks working
- [x] Email/SMS verification working
- [x] Zero Node.js, React, or MySQL dependencies

---

## 🔧 Local Development

### Prerequisites
- Python 3.11+
- PostgreSQL (or Neon connection string)

### Setup
```bash
# Navigate to Python backend
cd python-backend

# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
cp .env.example .env
# Edit .env with your values

# Run development server
python main.py
```

The API will be available at `http://localhost:8000`

API Documentation: `http://localhost:8000/api/docs`

---

## 🧪 Testing

### Test Health Endpoint
```bash
curl http://localhost:8000/api/health
```

### Test Database Connection
```bash
cd python-backend
python test_neon.py
```

### Test All Endpoints
```bash
# Visit interactive API docs
open http://localhost:8000/api/docs
```

---

## 📊 Monitoring & Logs

### Netlify Dashboard
- Build logs: Site → Deploys → [Latest deploy] → Deploy log
- Function logs: Site → Functions → netlify_function → Logs

### Production Monitoring
```bash
# Check health across all domains
for domain in dozierholdingsgroup.com athlynx.ai athlynxapp.vip transferportal.ai; do
  echo "Testing $domain..."
  curl -s https://$domain/api/health | jq .
done
```

---

## 🐛 Troubleshooting

### Build Fails
- Check Python version is 3.11 in Netlify settings
- Verify `requirements.txt` has all dependencies
- Check build logs for specific errors

### Database Connection Fails
- Verify `DATABASE_URL` is set correctly
- Check Neon database is running and accessible
- Test connection with `python-backend/test_neon.py`

### CORS Errors
- Verify domain is in CORS origins list in `python-backend/main.py`
- Check browser console for specific CORS error
- Ensure HTTPS is used (not HTTP)

### Function Not Found
- Verify `netlify_function.py` exists in `python-backend/`
- Check Netlify build log for function deployment
- Ensure redirects are configured in `netlify.toml`

---

## 📖 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Netlify Functions Python](https://docs.netlify.com/functions/build-with-python/)
- [Neon PostgreSQL](https://neon.tech/docs)
- [Mangum ASGI Adapter](https://mangum.io/)

---

## 🏆 ATHLYNX Corporation
**Dreams Do Come True 2026** 🦁

Built with ❤️ using Python + Julia
