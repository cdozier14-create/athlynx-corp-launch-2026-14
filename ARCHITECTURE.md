# Unified Platform Architecture

**Dozier Holdings Group - Technical Architecture Overview**

## 📐 System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER (Netlify)                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │     DHG      │  │   Athlynx    │  │  Athlynx VIP │              │
│  │  Master Site │  │   Platform   │  │    Portal    │              │
│  │              │  │              │  │              │              │
│  │ dozierhol... │  │ athlynx.ai   │  │athlynxapp.vip│              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐                                │
│  │  Transfer    │  │   Diamond    │                                │
│  │   Portal     │  │    Grind     │                                │
│  │              │  │              │                                │
│  │transferpor...│  │ diamond-gr...│                                │
│  └──────────────┘  └──────────────┘                                │
│                                                                       │
│         React 19 + TypeScript + Vite + Tailwind CSS                 │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    API GATEWAY / LOAD BALANCER                       │
│                   api.dozierholdingsgroup.com                        │
└─────────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
┌─────────────────────────┐  ┌─────────────────────────┐
│   PYTHON FASTAPI        │  │   NODE.JS EXPRESS       │
│   Backend Service       │  │   tRPC Server           │
│   (Render/Railway)      │  │   (Optional)            │
│                         │  │                         │
│  - Auth Module          │  │  - Real-time features   │
│  - CRM Module           │  │  - WebSocket support    │
│  - Stripe Module        │  │  - Type-safe API        │
│  - Verification         │  │                         │
│  - Transfer Portal API  │  │                         │
│  - Social Feed API      │  │                         │
└─────────────────────────┘  └─────────────────────────┘
                    │                   │
                    └─────────┬─────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER (Neon PostgreSQL)                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │    Users     │  │   Athletes   │  │     Posts    │              │
│  │              │  │              │  │              │              │
│  │ - id         │  │ - id         │  │ - id         │              │
│  │ - email      │  │ - user_id    │  │ - athlete_id │              │
│  │ - role       │  │ - sport      │  │ - content    │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  NIL Deals   │  │  Transfers   │  │     CRM      │              │
│  │              │  │              │  │              │              │
│  │ - id         │  │ - id         │  │ - contacts   │              │
│  │ - athlete_id │  │ - athlete_id │  │ - campaigns  │              │
│  │ - amount     │  │ - from_school│  │ - analytics  │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                       │
│  ┌──────────────┐                                                   │
│  │    Stripe    │  Subscriptions, Payments, Credits                │
│  │              │                                                   │
│  │ - customers  │                                                   │
│  │ - subscript. │                                                   │
│  │ - credits    │                                                   │
│  └──────────────┘                                                   │
└─────────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
┌─────────────────────────┐  ┌─────────────────────────┐
│   EXTERNAL SERVICES     │  │   FILE STORAGE          │
├─────────────────────────┤  ├─────────────────────────┤
│                         │  │                         │
│  ┌────────────────┐     │  │  ┌────────────────┐    │
│  │     Stripe     │     │  │  │    AWS S3      │    │
│  │   Payments     │     │  │  │  File Storage  │    │
│  └────────────────┘     │  │  └────────────────┘    │
│                         │  │                         │
│  ┌────────────────┐     │  │                         │
│  │    AWS SES     │     │  │                         │
│  │     Email      │     │  │                         │
│  └────────────────┘     │  │                         │
│                         │  │                         │
│  ┌────────────────┐     │  │                         │
│  │    AWS SNS     │     │  │                         │
│  │      SMS       │     │  │                         │
│  └────────────────┘     │  │                         │
│                         │  │                         │
│  ┌────────────────┐     │  │                         │
│  │    OpenAI      │     │  │                         │
│  │   AI Features  │     │  │                         │
│  └────────────────┘     │  │                         │
└─────────────────────────┘  └─────────────────────────┘
```

---

## 🏗️ Repository Structure

```
athlynx-corp-launch-2026-14/
│
├── apps/                           # Frontend applications
│   ├── dhg/                        # DHG Master Site
│   │   ├── client/
│   │   │   ├── src/
│   │   │   │   ├── components/
│   │   │   │   ├── pages/
│   │   │   │   └── App.tsx
│   │   │   ├── public/
│   │   │   └── index.html
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   └── README.md
│   │
│   ├── athlynx/                    # Athlynx Platform
│   │   ├── client/
│   │   ├── server/                 # Node.js backend (optional)
│   │   ├── package.json
│   │   └── README.md
│   │
│   ├── athlynxapp-vip/            # Athlynx VIP Portal
│   ├── transferportal/            # Transfer Portal
│   └── diamond-grind/             # Diamond Grind
│
├── services/                       # Backend services
│   ├── api/                        # Python FastAPI
│   │   ├── routers/
│   │   │   ├── auth.py
│   │   │   ├── stripe_router.py
│   │   │   ├── crm.py
│   │   │   ├── verification.py
│   │   │   ├── transfer_portal.py
│   │   │   └── ...
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── requirements.txt
│   │   └── README.md
│   │
│   ├── database/                   # Database schemas & migrations
│   │   ├── migrations/
│   │   ├── schema.sql
│   │   └── README.md
│   │
│   ├── email/                      # Email service
│   │   ├── templates/
│   │   └── README.md
│   │
│   ├── payments/                   # Stripe service
│   │   └── README.md
│   │
│   └── auth/                       # Auth service
│       └── README.md
│
├── .github/
│   └── workflows/
│       └── deploy.yml              # CI/CD pipeline
│
├── docs/                           # Documentation
├── scripts/                        # Utility scripts
├── netlify.toml                    # Multi-domain config
├── .env.example                    # Environment template
├── README_UNIFIED_PLATFORM.md      # Main README
├── DEPLOYMENT_GUIDE.md             # Deployment instructions
├── SECURITY_ACCESS_CONTROL.md      # Security policies
└── ARCHITECTURE.md                 # This file
```

---

## 🔄 Data Flow

### User Authentication Flow

```
1. User visits athlynx.ai
2. Clicks "Login"
3. Frontend sends request to api.dozierholdingsgroup.com/api/auth/login
4. API validates credentials against database
5. API generates JWT token
6. Frontend stores token in localStorage
7. Subsequent requests include token in Authorization header
8. API validates token and returns data
```

### Payment Flow (Stripe)

```
1. User clicks "Subscribe to Pro"
2. Frontend creates checkout session via API
3. API calls Stripe API to create session
4. Stripe returns checkout URL
5. Frontend redirects to Stripe checkout
6. User completes payment
7. Stripe sends webhook to api.dozierholdingsgroup.com/api/stripe/webhook
8. API processes webhook, updates database
9. User redirected to success page
10. Frontend shows subscription status
```

### Multi-App Authentication (SSO)

```
1. User logs in on athlynx.ai
2. JWT token generated with apps: ["athlynx"]
3. User navigates to transferportal.ai
4. Frontend detects existing token
5. API validates token
6. API checks if "transferportal" in allowed apps
7. If yes, grant access
8. If no, prompt for additional authentication
```

---

## 🌐 Domain Routing

### Netlify Configuration

Each domain has its own Netlify site:

| Domain | Netlify Site | Build Dir | Publish Dir |
|--------|-------------|-----------|-------------|
| dozierholdingsgroup.com | dhg-master | apps/dhg | apps/dhg/dist |
| athlynx.ai | athlynx-platform | apps/athlynx | apps/athlynx/dist |
| athlynxapp.vip | athlynxapp-vip | apps/athlynxapp-vip | apps/athlynxapp-vip/dist |
| transferportal.ai | transferportal-ai | apps/transferportal | apps/transferportal/dist |
| diamond-grind.ai | diamond-grind | apps/diamond-grind | apps/diamond-grind/dist |

### API Routing

All apps route to unified API:

```
athlynx.ai/api/* → api.dozierholdingsgroup.com/api/*
transferportal.ai/api/* → api.dozierholdingsgroup.com/api/*
...
```

API routes requests based on:
- Domain/subdomain in request headers
- App identifier in request payload
- User's authorized apps in JWT token

---

## 🗄️ Database Schema

### Core Tables

**users**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  role VARCHAR(50) DEFAULT 'fan',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**athletes**
```sql
CREATE TABLE athletes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  sport VARCHAR(100),
  school VARCHAR(255),
  position VARCHAR(100),
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**stripe_customers**
```sql
CREATE TABLE stripe_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  stripe_customer_id VARCHAR(255) UNIQUE,
  subscription_status VARCHAR(50),
  subscription_tier VARCHAR(50),
  credits INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔌 API Endpoints

### Authentication (`/api/auth`)

- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/register` - Create new account
- `POST /api/auth/logout` - End session
- `POST /api/auth/magic-link` - Request magic link
- `GET /api/auth/oauth/google` - Google OAuth
- `POST /api/auth/verify-email` - Verify email

### Stripe (`/api/stripe`)

- `POST /api/stripe/create-checkout-session` - Create checkout
- `POST /api/stripe/create-payment-intent` - Create payment
- `POST /api/stripe/webhook` - Handle webhooks
- `POST /api/stripe/create-customer-portal` - Customer portal

### CRM (`/api/crm`)

- `GET /api/crm/contacts` - List contacts
- `POST /api/crm/contacts` - Create contact
- `GET /api/crm/analytics` - Get analytics
- `POST /api/crm/campaigns` - Create campaign

### Transfer Portal (`/api/transferportal`)

- `GET /api/transferportal/transfers` - List transfers
- `POST /api/transferportal/transfers` - Submit transfer
- `GET /api/transferportal/schools` - List schools
- `POST /api/transferportal/match` - AI matching

---

## 🔐 Security Architecture

### Defense in Depth

**Layer 1: Network**
- Netlify Edge protection
- DDoS mitigation
- IP whitelisting (where applicable)

**Layer 2: Application**
- HTTPS/TLS encryption
- CORS policies
- Rate limiting
- Input validation

**Layer 3: Authentication**
- JWT tokens
- OAuth 2.0
- Multi-factor authentication (optional)

**Layer 4: Authorization**
- Role-based access control (RBAC)
- Resource-level permissions
- API key management

**Layer 5: Data**
- Encryption at rest
- Encrypted backups
- PII protection

---

## 📊 Scalability

### Horizontal Scaling

**Frontend (Netlify):**
- Automatic CDN distribution
- Edge caching
- Serverless functions

**Backend (Render/Railway):**
- Multiple instances
- Load balancing
- Auto-scaling based on traffic

**Database (Neon):**
- Auto-scaling storage
- Connection pooling
- Read replicas (if needed)

### Performance Optimization

**Frontend:**
- Code splitting
- Lazy loading
- Image optimization
- Asset compression

**Backend:**
- Database query optimization
- Caching (Redis if needed)
- Async processing
- Background jobs

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

```yaml
1. Code pushed to main branch
2. Run linting and type checking
3. Run unit tests
4. Build all apps
5. Run integration tests
6. Deploy to staging (optional)
7. Deploy to production
8. Run smoke tests
9. Send notifications
```

### Deployment Strategy

**Blue-Green Deployment:**
- Deploy new version alongside old
- Switch traffic when ready
- Rollback instantly if issues

---

## 📈 Monitoring & Observability

### Application Monitoring

**Metrics:**
- Request rate
- Error rate
- Response time
- Database query time

**Logs:**
- Application logs
- Access logs
- Error logs
- Audit logs

**Alerts:**
- High error rate
- Slow response time
- Failed deployments
- Security incidents

---

## 🔧 Technology Stack Summary

### Frontend
- React 19
- TypeScript
- Vite 7
- Tailwind CSS 4
- Wouter (routing)
- Tanstack Query
- Framer Motion

### Backend
- Python 3.11
- FastAPI
- Uvicorn
- Node.js 20 (optional)
- Express (optional)
- tRPC (optional)

### Database
- PostgreSQL (Neon)
- Drizzle ORM

### Deployment
- Netlify (Frontend)
- Render/Railway (Backend)
- GitHub Actions (CI/CD)

### Services
- Stripe (Payments)
- AWS SES (Email)
- AWS SNS (SMS)
- AWS S3 (Storage)
- OpenAI (AI features)

---

**Last Updated:** January 22, 2026  
**Version:** 1.0.0  
**Maintained by:** cdozier14-create
