# Dozier Holdings Group - Unified Platform

**Master Repository for all DHG Applications and Services**

## 🏢 About

Dozier Holdings Group (DHG) is the parent company for a comprehensive ecosystem of athlete-focused applications and services. This repository contains the complete unified platform with all applications, backend services, and infrastructure configuration.

## 📁 Repository Structure

```
/
├── apps/                           # All frontend applications
│   ├── dhg/                        # DHG Master Site (dozierholdingsgroup.com)
│   ├── athlynx/                    # Athlynx Platform (athlynx.ai)
│   ├── athlynxapp-vip/            # Athlynx VIP (athlynxapp.vip)
│   ├── transferportal/            # Transfer Portal (transferportal.ai)
│   └── diamond-grind/             # Diamond Grind (diamond-grind.ai)
│
├── services/                       # Backend services
│   ├── api/                        # Unified FastAPI backend
│   ├── database/                   # Database schemas and migrations
│   ├── email/                      # Email service (AWS SES/Sendgrid)
│   ├── payments/                   # Stripe payment processing
│   └── auth/                       # Authentication service
│
├── .github/                        # GitHub configuration
│   └── workflows/                  # CI/CD pipelines
│
├── docs/                           # Documentation
├── scripts/                        # Utility scripts
└── netlify.toml                   # Multi-domain deployment config
```

## 🌐 Domains & Applications

### Primary Domain
**dozierholdingsgroup.com** - DHG Master Site
- Corporate website
- Portfolio showcase
- Investor information

### Application Subdomains

1. **athlynx.ai** - Athlynx Platform
   - Athlete social networking
   - NIL deal marketplace
   - Career development tools
   - AI-powered wizards

2. **athlynxapp.vip** - Athlynx VIP Portal
   - Premium features
   - Advanced analytics
   - Exclusive opportunities

3. **transferportal.ai** - Transfer Portal
   - Transfer management
   - School matching
   - Analytics and insights

4. **diamond-grind.ai** - Diamond Grind
   - Elite training platform
   - Performance tracking
   - Mental conditioning

## 🛠 Technology Stack

### Frontend
- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS 4
- **UI Components:** Radix UI + shadcn/ui
- **State Management:** Tanstack Query
- **Routing:** Wouter
- **Hosting:** Netlify

### Backend
- **API:** Python 3.11 with FastAPI
- **Server:** Node.js with Express + tRPC
- **Database:** Neon PostgreSQL (Serverless)
- **ORM:** Drizzle ORM
- **Auth:** JWT + OAuth (Google, LinkedIn)
- **Payments:** Stripe
- **Email:** AWS SES + Sendgrid
- **SMS:** AWS SNS

### Infrastructure
- **CI/CD:** GitHub Actions
- **Frontend Hosting:** Netlify
- **API Hosting:** Render / Railway
- **Database:** Neon PostgreSQL
- **CDN:** Netlify Edge
- **Monitoring:** Built-in

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Python 3.11+
- pnpm 10+
- PostgreSQL (or Neon account)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/cdozier14-create/athlynx-corp-launch-2026-14.git
   cd athlynx-corp-launch-2026-14
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   pnpm install
   
   # Install app dependencies (example for Athlynx)
   cd apps/athlynx
   pnpm install
   ```

3. **Setup environment variables**
   ```bash
   # Copy example env file
   cp .env.example .env
   
   # Edit .env with your credentials
   nano .env
   ```

4. **Start development server**
   ```bash
   # For Athlynx app
   cd apps/athlynx
   pnpm run dev
   
   # For API service
   cd services/api
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

## 📦 Deployment

### Netlify Deployment (Frontend)

All apps are configured for deployment via Netlify with multi-domain support.

1. **Connect to Netlify**
   - Link your GitHub repository
   - Configure build settings from `netlify.toml`
   - Set environment variables in Netlify UI

2. **Configure Domains**
   - Add custom domains in Netlify
   - Configure DNS records
   - Enable HTTPS

3. **Deploy**
   ```bash
   # Automatic deployment on push to main
   git push origin main
   ```

### API Deployment (Backend)

Deploy Python FastAPI backend to Render or Railway.

1. **Render Deployment**
   - Connect GitHub repository
   - Use `services/api/render.yaml` configuration
   - Set environment variables

2. **Railway Deployment**
   - Connect repository
   - Configure build settings
   - Set environment variables

## 🔐 Environment Variables

### Required Variables

**Database:**
```
DATABASE_URL=postgresql://user:password@host/database
```

**AWS (Email/SMS):**
```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_SES_FROM_EMAIL=noreply@athlynx.ai
```

**Stripe:**
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

**Auth:**
```
JWT_SECRET=your_jwt_secret
OAUTH_GOOGLE_CLIENT_ID=your_client_id
OAUTH_GOOGLE_CLIENT_SECRET=your_client_secret
```

See individual app README files for complete environment variable documentation.

## 📚 Documentation

- [DHG Master Site](/apps/dhg/README.md)
- [Athlynx Platform](/apps/athlynx/README.md)
- [Athlynx VIP](/apps/athlynxapp-vip/README.md)
- [Transfer Portal](/apps/transferportal/README.md)
- [Diamond Grind](/apps/diamond-grind/README.md)
- [API Service](/services/api/README.md)
- [Database Schema](/services/database/README.md)
- [Email Service](/services/email/README.md)
- [Payment Service](/services/payments/README.md)
- [Auth Service](/services/auth/README.md)

## 🧪 Testing

```bash
# Run all tests
pnpm run test

# Run type checking
pnpm run check

# Run linting
pnpm run format
```

## 🔒 Security

### Access Control
- **Owner:** cdozier14-create only
- **Netlify Access:** cdozier14-create only (no unauthorized access)
- **Stripe Account:** cdozier14-create only
- **GitHub Repository:** Private, owner-controlled

### Security Features
- JWT-based authentication
- HTTPS enforced on all domains
- Security headers configured
- Regular security audits
- Automated dependency scanning

## 📈 Features

### CRM System
- Complete customer relationship management
- Lead tracking and analytics
- Email/SMS campaigns
- Interaction history

### Stripe Integration
- Subscription management
- One-time payments
- Credit system
- Webhook handling
- Multi-tier pricing

### Multi-app Authentication
- Single sign-on (SSO) across all apps
- OAuth integration (Google, LinkedIn)
- Magic link login
- Email/Phone verification
- Role-based access control

## 🤝 Contributing

This repository is maintained exclusively by cdozier14-create. No external contributions accepted.

## 📄 License

Proprietary - All Rights Reserved
© 2026 Dozier Holdings Group

## 📞 Contact

**Owner:** Chad Dozier
**GitHub:** [@cdozier14-create](https://github.com/cdozier14-create)
**Website:** [dozierholdingsgroup.com](https://dozierholdingsgroup.com)

---

**Last Updated:** January 22, 2026
