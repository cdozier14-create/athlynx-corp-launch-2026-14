# ATHLYNX Corporation - Multi-Domain Deployment

[![Python](https://img.shields.io/badge/Python-3.11-blue.svg)](https://www.python.org/)
[![Julia](https://img.shields.io/badge/Julia-1.9-purple.svg)](https://julialang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-green.svg)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-cyan.svg)](https://neon.tech/)

**Dreams Do Come True 2026** 🦁

---

## 🌐 Live Production Domains

This repository powers **multiple production domains** with a unified **Python + Julia** backend:

- 🏢 **[dozierholdingsgroup.com](https://dozierholdingsgroup.com)** - Corporate holding group
- 🏆 **[athlynx.ai](https://athlynx.ai)** - Athlete ecosystem platform
- 💎 **[athlynxapp.vip](https://athlynxapp.vip)** - VIP athlete portal
- 🎯 **[transferportal.ai](https://transferportal.ai)** - Transfer portal analytics

All domains share the **same Python FastAPI backend** with **Julia-powered analytics**.

---

## 🚀 Technology Stack

### Backend (Production)
- **Python 3.11** - FastAPI web framework
- **Julia** - High-performance analytics & GPU clustering
- **Neon PostgreSQL** - Serverless database
- **Mangum** - ASGI adapter for Netlify Functions
- **Netlify** - Serverless deployment platform

### Services
- **AWS SES** - Email delivery
- **AWS SNS** - SMS notifications  
- **Stripe** - Payment processing

### **What We DON'T Use** ❌
- ~~React/Next.js~~ (Python backend only)
- ~~Node.js/Express~~ (Python FastAPI only)
- ~~MySQL~~ (Neon PostgreSQL only)

---

## 📁 Repository Structure

```
athlynx-corp-launch-2026-14/
├── python-backend/              # ✅ PRODUCTION BACKEND
│   ├── main.py                  # FastAPI application
│   ├── database.py              # Neon PostgreSQL connection
│   ├── netlify_function.py      # Mangum handler
│   ├── requirements.txt         # Python dependencies
│   └── routers/                 # API endpoints
│       ├── auth.py              # Authentication
│       ├── vip.py               # VIP codes
│       ├── verification.py      # Email/SMS
│       ├── waitlist.py          # Waitlist
│       ├── feed.py              # Social feed
│       ├── athlete.py           # Athletes
│       ├── social.py            # Social
│       ├── messages.py          # Messaging
│       ├── notifications.py     # Notifications
│       ├── transfer_portal.py   # Transfer portal
│       ├── crm.py               # CRM analytics
│       └── stripe_router.py     # Payments
│
├── security-infrastructure/     # ✅ JULIA SECURITY
│   ├── security_analytics.jl
│   └── energy_optimization.jl
│
├── infrastructure/julia/        # ✅ JULIA GPU CLUSTER
│   └── GPUClusterManager.jl
│
├── sdk/                         # ✅ SDKs
│   ├── python/                  # Python SDK
│   └── julia/                   # Julia SDK
│
├── netlify.toml                 # ✅ Deployment config
├── PYTHON_DEPLOYMENT_GUIDE.md   # ✅ Deployment guide
└── README.md                    # This file

# NOT DEPLOYED (Legacy/Development only)
├── client/                      # ❌ React frontend (not deployed)
├── server/                      # ❌ Node.js server (not deployed)
├── shared/                      # ❌ TypeScript shared (not deployed)
└── package.json                 # ❌ Node dependencies (not deployed)
```

---

## 🔧 Quick Start (Local Development)

### Prerequisites
- Python 3.11+
- PostgreSQL or Neon database URL

### Setup
```bash
# Navigate to Python backend
cd python-backend

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your DATABASE_URL and API keys

# Run development server
python main.py
```

Server runs at: `http://localhost:8000`  
API Docs: `http://localhost:8000/api/docs`

---

## 📡 API Endpoints

### Core
- `GET /` - Root endpoint
- `GET /api/health` - Health check
- `GET /api/docs` - Interactive API documentation

### Authentication
- `POST /api/auth/signup` - User signup
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Current user

### Verification
- `POST /api/verification/send-email` - Send email code
- `POST /api/verification/send-sms` - Send SMS code
- `POST /api/verification/verify-code` - Verify code

### VIP Codes
- `POST /api/vip/validate` - Validate VIP code
- `GET /api/vip/codes` - List codes (admin)

### Waitlist
- `POST /api/waitlist/join` - Join waitlist
- `GET /api/waitlist/stats` - Statistics

### Social Features
- `GET /api/feed` - Social feed
- `POST /api/feed/post` - Create post
- `POST /api/social/follow` - Follow user
- `GET /api/messages` - Messages
- `GET /api/notifications` - Notifications

### Athletes
- `GET /api/athlete/profile/:id` - Athlete profile
- `PUT /api/athlete/profile` - Update profile
- `GET /api/athlete/stats/:id` - Statistics

### Transfer Portal
- `GET /api/transfer-portal/players` - List players
- `GET /api/transfer-portal/player/:id` - Player details

### CRM & Analytics
- `GET /api/crm/stats` - CRM statistics
- `GET /api/crm/signups` - Signup analytics

### Payments
- `POST /api/stripe/create-checkout` - Create checkout
- `POST /api/stripe/webhook` - Stripe webhooks
- `GET /api/stripe/subscription/:id` - Subscription

---

## 🌍 Multi-Domain Deployment

### Netlify Configuration

Each domain is deployed as a **separate Netlify site** pointing to the **same repository**:

1. **Create Netlify Site** for each domain
2. **Connect GitHub repository**: `cdozier14-create/athlynx-corp-launch-2026-14`
3. **Branch**: `main` (or feature branch)
4. **Build settings**: Auto-detected from `netlify.toml`
5. **Custom domain**: Add domain and configure DNS
6. **Environment variables**: Set required env vars (see below)

### Required Environment Variables

Set these in Netlify for **each site**:

```bash
# Database
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

# Authentication
JWT_SECRET=athlynx-secret-2026

# AWS
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
SES_SENDER_EMAIL=noreply@athlynx.ai

# SMS
SNS_PHONE_NUMBER=+16014985282
```

---

## ✅ Deployment Verification

### Test all domains:
```bash
# Health check for each domain
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

### Test API Documentation:
- https://dozierholdingsgroup.com/api/docs
- https://athlynx.ai/api/docs
- https://athlynxapp.vip/api/docs
- https://transferportal.ai/api/docs

---

## 📚 Documentation

- **[PYTHON_DEPLOYMENT_GUIDE.md](./PYTHON_DEPLOYMENT_GUIDE.md)** - Complete deployment guide
- **[API Documentation](https://athlynx.ai/api/docs)** - Interactive API docs (Swagger)
- **[FastAPI Documentation](https://fastapi.tiangolo.com/)** - FastAPI framework docs
- **[Neon PostgreSQL](https://neon.tech/docs)** - Database documentation

---

## 🧪 Testing

### Run Python Tests
```bash
cd python-backend
python -m pytest
```

### Test Database Connection
```bash
cd python-backend
python test_neon.py
```

### Test Specific Endpoint
```bash
# Health check
curl http://localhost:8000/api/health

# API docs
open http://localhost:8000/api/docs
```

---

## 🐛 Troubleshooting

### Build Fails
- Verify Python 3.11 in Netlify settings
- Check `requirements.txt` has all dependencies
- Review build logs in Netlify

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check Neon database is running
- Test with `python test_neon.py`

### CORS Errors
- Verify domain in `main.py` CORS origins
- Ensure HTTPS is used
- Check browser console for details

### API Not Found
- Verify `netlify_function.py` exists
- Check Netlify function logs
- Review `netlify.toml` redirects

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Production Domains                       │
│  dozierholdingsgroup.com | athlynx.ai | athlynxapp.vip |   │
│                      transferportal.ai                       │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                   Netlify Functions                          │
│              (Mangum ASGI Adapter)                           │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              Python FastAPI Backend                          │
│  /api/auth | /api/vip | /api/verification | /api/waitlist  │
│  /api/feed | /api/athlete | /api/social | /api/messages    │
│  /api/transfer-portal | /api/crm | /api/stripe             │
└───────────────┬───────────────────────┬─────────────────────┘
                │                       │
                ▼                       ▼
    ┌───────────────────┐   ┌──────────────────────┐
    │ Neon PostgreSQL   │   │  Julia Analytics     │
    │   (Database)      │   │  GPU Clustering      │
    └───────────────────┘   │  Energy Optimization │
                            └──────────────────────┘
```

---

## 🤝 Contributing

This is a production repository for ATHLYNX Corporation. Internal team only.

---

## 📄 License

Proprietary - ATHLYNX Corporation © 2026

---

## 🏆 ATHLYNX Corporation

**Owner**: cdozier14-create  
**Mission**: Complete Athlete Ecosystem Platform  
**Stack**: Python + Julia  
**Deployment**: Multi-domain Netlify  

**Dreams Do Come True 2026** 🦁

---

## 📞 Support

For technical support or deployment issues, contact the ATHLYNX development team.

**API Status**: https://athlynx.ai/api/health  
**Documentation**: https://athlynx.ai/api/docs
