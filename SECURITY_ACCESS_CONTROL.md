# Security & Access Control Policy

**Dozier Holdings Group - Unified Platform Security**

## 🔐 Overview

This document outlines the security measures and access control policies for the entire DHG unified platform. All security measures are designed to ensure that only authorized personnel (cdozier14-create) have access to production systems.

---

## 👤 Access Control

### Authorized Personnel

**ONLY the following user has access:**
- **GitHub:** cdozier14-create
- **Netlify:** cdozier14-create
- **Stripe:** cdozier14-create
- **AWS:** cdozier14-create
- **Neon DB:** cdozier14-create

### Unauthorized Users

**The following users MUST be removed from all systems:**
- ❌ manus (or any derivative)
- ❌ Any other team members
- ❌ Guest accounts
- ❌ Service accounts not created by cdozier14-create

---

## 🚫 Removal Procedures

### GitHub Repository Access

1. **Repository Settings**
   - Set repository to **Private**
   - Navigate to Settings > Collaborators
   - Remove all collaborators except cdozier14-create
   - Enable branch protection on `main`

2. **Branch Protection Rules**
   ```
   Branch: main
   ✅ Require pull request reviews before merging
   ✅ Require status checks to pass
   ✅ Require branches to be up to date
   ✅ Require conversation resolution before merging
   ✅ Do not allow bypassing the above settings
   ❌ Allow force pushes: Disabled
   ❌ Allow deletions: Disabled
   ```

3. **Deploy Keys**
   - Remove all unauthorized deploy keys
   - Rotate existing keys
   - Use personal access tokens only

### Netlify Access

**Critical:** Manus MUST be removed from ALL Netlify deployments

1. **Team Settings (Per Site)**
   - Login to Netlify
   - For each site:
     - Go to Site settings > Team & collaborators
     - Remove "manus" user
     - Remove any other unauthorized users
     - Set team access to **Owner only**

2. **Site List to Check:**
   - [ ] dhg-master (dozierholdingsgroup.com)
   - [ ] athlynx-platform (athlynx.ai)
   - [ ] athlynxapp-vip (athlynxapp.vip)
   - [ ] transferportal-ai (transferportal.ai)
   - [ ] diamond-grind (diamond-grind.ai)

3. **Build Hooks**
   - Rotate all build hook URLs
   - Remove any unused hooks
   - Document active hooks

4. **Environment Variables**
   - Audit all environment variables
   - Remove any credentials not owned by cdozier14-create
   - Rotate all secrets

### AWS Account Access

1. **IAM Users**
   - Remove all IAM users except root and cdozier14-create
   - Disable programmatic access for removed users
   - Rotate access keys

2. **IAM Policies**
   - Review all policies
   - Ensure least privilege
   - Remove overly permissive policies

3. **MFA Enforcement**
   - Enable MFA on root account
   - Enable MFA on cdozier14-create account
   - Require MFA for all sensitive operations

### Stripe Account

1. **Team Members**
   - Remove all team members except owner
   - Revoke API keys created by others

2. **API Keys**
   - List all API keys
   - Delete keys not created by cdozier14-create
   - Generate new keys
   - Update all applications with new keys

3. **Webhooks**
   - Review all webhook endpoints
   - Remove unauthorized endpoints
   - Rotate webhook secrets

### Neon Database

1. **Database Users**
   - List all database users
   - Remove unauthorized users
   - Rotate database password

2. **Connection Strings**
   - Update all applications with new connection string
   - Revoke old connection strings

3. **IP Whitelisting**
   - Enable IP whitelisting if supported
   - Only allow production server IPs

---

## 🔑 Credential Management

### Storage of Secrets

**Approved Secret Storage:**
1. **Netlify Environment Variables** (for frontend builds)
2. **Render/Railway Environment Variables** (for backend)
3. **AWS Secrets Manager** (for sensitive credentials)
4. **1Password** or equivalent vault (local backups)

**Prohibited Storage:**
- ❌ Plain text files in repository
- ❌ Committed .env files
- ❌ Slack messages
- ❌ Email
- ❌ Unencrypted cloud storage

### Credential Rotation Schedule

**Critical Credentials (Monthly):**
- Database passwords
- JWT secrets
- API keys

**Standard Credentials (Quarterly):**
- AWS access keys
- OAuth client secrets
- Webhook secrets

**Long-term Credentials (Annually):**
- SSL/TLS certificates (auto-renewed)
- Domain registrations

### Credential Checklist

- [ ] DATABASE_URL rotated
- [ ] AWS_ACCESS_KEY_ID rotated
- [ ] AWS_SECRET_ACCESS_KEY rotated
- [ ] STRIPE_SECRET_KEY verified (no rotation needed unless compromised)
- [ ] JWT_SECRET rotated
- [ ] All webhook secrets rotated
- [ ] OAuth secrets verified

---

## 🛡️ Security Headers

Configured in `netlify.toml`:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    # Security Headers
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "SAMEORIGIN"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"
```

### Header Explanations

- **X-Content-Type-Options:** Prevents MIME-sniffing attacks
- **X-Frame-Options:** Prevents clickjacking attacks
- **X-XSS-Protection:** Enables browser XSS filtering
- **Referrer-Policy:** Controls referrer information
- **Permissions-Policy:** Restricts browser features
- **Strict-Transport-Security:** Enforces HTTPS

---

## 🔒 Authentication & Authorization

### JWT Token Security

**Token Configuration:**
```javascript
{
  algorithm: 'HS256',
  expiresIn: '7d',
  issuer: 'dozierholdingsgroup.com',
  audience: ['athlynx.ai', 'transferportal.ai', ...]
}
```

**Token Claims:**
- `user_id` - User identifier
- `email` - User email
- `role` - User role (admin, athlete, coach, fan)
- `apps` - Authorized apps
- `exp` - Expiration timestamp
- `iat` - Issued at timestamp

### Role-Based Access Control (RBAC)

**Roles:**
1. **Super Admin** - Full platform access (cdozier14-create only)
2. **Admin** - App-specific admin access
3. **Athlete** - Athlete user access
4. **Coach** - Coach user access
5. **Fan** - Fan/supporter access

**Permissions Matrix:**

| Action | Super Admin | Admin | Athlete | Coach | Fan |
|--------|-------------|-------|---------|-------|-----|
| Manage Users | ✅ | ✅ | ❌ | ❌ | ❌ |
| View Analytics | ✅ | ✅ | ✅ | ✅ | ❌ |
| Manage CRM | ✅ | ✅ | ❌ | ❌ | ❌ |
| Process Payments | ✅ | ✅ | ❌ | ❌ | ❌ |
| Create Posts | ✅ | ✅ | ✅ | ✅ | ✅ |
| Manage Profile | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 🚨 Incident Response

### Security Incident Procedure

1. **Detection**
   - Monitor logs for suspicious activity
   - Review Stripe webhooks for fraud
   - Check database for unauthorized access

2. **Containment**
   - Immediately rotate compromised credentials
   - Block suspicious IP addresses
   - Disable compromised accounts

3. **Investigation**
   - Review audit logs
   - Identify scope of breach
   - Document timeline

4. **Recovery**
   - Restore from backups if needed
   - Apply security patches
   - Update access controls

5. **Post-Incident**
   - Update security policies
   - Implement additional monitoring
   - Notify affected users (if required)

### Contact for Security Issues

**Primary:** cdozier14-create (GitHub)  
**Severity Levels:**
- 🔴 Critical: Immediate response required
- 🟡 High: Response within 24 hours
- 🟢 Medium: Response within 72 hours
- ⚪ Low: Response within 1 week

---

## 📊 Monitoring & Auditing

### Log Retention

**Application Logs:**
- Retention: 90 days
- Storage: Render/Railway logs
- Access: cdozier14-create only

**Database Logs:**
- Retention: 30 days
- Storage: Neon built-in logs
- Access: cdozier14-create only

**Access Logs:**
- Retention: 1 year
- Storage: AWS CloudWatch / Netlify logs
- Access: cdozier14-create only

### Audit Events

**Logged Events:**
- User authentication (success/failure)
- Password changes
- Account creation/deletion
- Payment transactions
- API key usage
- Database schema changes
- Environment variable changes

### Monitoring Alerts

**Alert Triggers:**
- Multiple failed login attempts (>5 in 5 minutes)
- Unusual API usage patterns
- Failed payment transactions
- Database connection failures
- Server errors (5xx)
- Unauthorized access attempts

**Alert Destinations:**
- Email: Owner email
- SMS: Owner phone (critical alerts)
- Slack: #security-alerts (if configured)

---

## 🔐 Data Encryption

### Encryption at Rest

- **Database:** Encrypted by Neon (AES-256)
- **File Storage:** Encrypted by AWS S3
- **Backups:** Encrypted before storage

### Encryption in Transit

- **All HTTP Traffic:** TLS 1.3
- **Database Connections:** SSL/TLS required
- **API Communications:** HTTPS only
- **Email:** TLS for SMTP

### Encryption Keys

- **Storage:** AWS KMS / Netlify secrets
- **Rotation:** Annually (or upon compromise)
- **Access:** cdozier14-create only

---

## ✅ Security Checklist

### Initial Setup
- [ ] Remove all unauthorized users from GitHub
- [ ] Remove all unauthorized users from Netlify
- [ ] Remove all unauthorized users from Stripe
- [ ] Remove all unauthorized users from AWS
- [ ] Enable MFA on all accounts
- [ ] Rotate all credentials
- [ ] Enable branch protection
- [ ] Configure security headers
- [ ] Setup monitoring and alerts
- [ ] Document all access

### Monthly Tasks
- [ ] Review access logs
- [ ] Check for failed login attempts
- [ ] Verify webhook activity
- [ ] Review Stripe transactions
- [ ] Update dependencies
- [ ] Run security scans

### Quarterly Tasks
- [ ] Rotate standard credentials
- [ ] Review and update policies
- [ ] Audit user permissions
- [ ] Test backup restoration
- [ ] Review incident logs

### Annual Tasks
- [ ] Rotate long-term credentials
- [ ] Full security audit
- [ ] Penetration testing
- [ ] Policy review and update
- [ ] Disaster recovery drill

---

## 📚 Compliance

### Regulations

**Applicable Standards:**
- GDPR (if serving EU users)
- CCPA (California users)
- PCI DSS (payment card data)
- HIPAA (if health data collected)

### Data Privacy

**User Data Collection:**
- Collect only necessary data
- Obtain explicit consent
- Provide opt-out options
- Honor deletion requests

**Data Retention:**
- Active users: Indefinite
- Inactive users: 2 years
- Deleted accounts: 30 days (soft delete)
- After 30 days: Permanent deletion

---

## 🆘 Emergency Contacts

**Security Emergency:**
- GitHub: cdozier14-create
- Email: [Contact via GitHub]

**Service Providers:**
- Netlify Support: support@netlify.com
- AWS Support: Via AWS Console
- Stripe Support: support@stripe.com
- Neon Support: support@neon.tech

---

**Last Updated:** January 22, 2026  
**Version:** 1.0.0  
**Owner:** cdozier14-create
