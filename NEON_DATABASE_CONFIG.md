# NEON DATABASE CONFIGURATION
**Date:** January 9, 2026  
**Project:** ATHLYNX AI Corporation  
**Final Destination:** NEON PostgreSQL Database

## NEON CONNECTION STRING
```
postgresql://neondb_owner:npg_8rFswVRXCg0c@ep-bold-bar-aegw1i6x-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
```

## NEON CREDENTIALS
- **Host:** ep-bold-bar-aegw1i6x-pooler.us-east-2.aws.neon.tech
- **Database:** neondb
- **User:** neondb_owner
- **Password:** npg_8rFswVRXCg0c
- **Port:** 5432 (default PostgreSQL)
- **Region:** AWS US East 2 (Ohio)
- **Project:** young-field-93171928

## NETLIFY ENVIRONMENT VARIABLES
Add these to Netlify site: **athlynx-ai-corporation-new-launch-2026**

```bash
# NEON Database (Final Destination)
DATABASE_URL=postgresql://neondb_owner:npg_8rFswVRXCg0c@ep-bold-bar-aegw1i6x-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require

# AWS Credentials
AWS_ACCESS_KEY_ID=AKIAWLLNO5ITXIAJKYVP
AWS_SECRET_ACCESS_KEY=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
AWS_REGION=us-east-1

# Application
NODE_ENV=production
VITE_APP_TITLE=ATHLYNX
FRONTEND_URL=https://athlynx.ai
```

## DEPLOYMENT STEPS
1. Go to: https://app.netlify.com/sites/athlynx-ai-corporation-new-launch-2026/settings/env
2. Add all environment variables above
3. Click "Save"
4. Trigger new deploy: Deploys → Trigger deploy → Deploy site
5. Wait 2-3 minutes for build to complete
6. Test at: https://athlynx.ai

## MIGRATION FROM PLANETSCALE TO NEON
Current: PlanetScale (247 users)  
Target: NEON (final destination)

**Migration script will:**
1. Export all data from PlanetScale
2. Import into NEON
3. Verify data integrity
4. Update Netlify env vars
5. Redeploy site

## CONTACT INFO UPDATE
**OLD EMAIL:** chaddozier75@gmail.com  
**NEW EMAIL:** cdozier14@dozierholdingsgroup.com  
**PASSWORD:** Reagan62277!

**Dreams Do Come True 2026! 🦁**
