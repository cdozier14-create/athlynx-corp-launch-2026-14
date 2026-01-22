# Database Service

## Purpose
Unified database schemas, migrations, and configuration for all DHG applications.

## Database Provider
**Neon PostgreSQL** - Serverless Postgres with auto-scaling

## Connection Details
- **Host:** ep-bold-bar-aegw1i6x-pooler.us-east-2.aws.neon.tech
- **Database:** neondb
- **SSL:** Required
- **Pooling:** Enabled (connection pooler)

## Schema Organization

### Core Tables
- `users` - User accounts across all apps
- `sessions` - Authentication sessions
- `api_keys` - API key management

### Athlynx Tables
- `athletes` - Athlete profiles
- `posts` - Social feed posts
- `nil_deals` - NIL marketplace deals
- `verifications` - Athlete verifications

### Transfer Portal Tables
- `transfers` - Transfer requests and status
- `schools` - School profiles
- `transfer_matches` - AI-powered matches

### CRM Tables
- `crm_contacts` - Contact management
- `crm_interactions` - Interaction tracking
- `crm_campaigns` - Marketing campaigns
- `crm_analytics` - Analytics data

### Payment Tables
- `stripe_customers` - Stripe customer records
- `subscriptions` - Subscription management
- `credits` - Credit system tracking
- `transactions` - Payment transactions

## Migrations
Located in `/services/database/migrations/`

Run migrations:
```bash
cd /services/database
drizzle-kit generate
drizzle-kit migrate
```

## Backup Strategy
- Automated daily backups via Neon
- Point-in-time recovery enabled
- Manual backup scripts in `/scripts/backup/`
