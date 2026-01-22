# Email Service

## Purpose
Unified email service for all DHG applications using AWS SES and Sendgrid.

## Providers

### AWS SES (Primary)
- **Region:** us-east-1
- **From Email:** noreply@athlynx.ai
- **Use Cases:** Transactional emails, auth emails, notifications

### Sendgrid (Backup)
- **Use Cases:** Marketing emails, bulk sending, campaigns

## Email Templates
Located in `/services/email/templates/`

### Template Categories
- **Auth:** Login codes, password resets, verification
- **Notifications:** Activity updates, mentions, messages
- **Marketing:** Newsletters, announcements, campaigns
- **Transactional:** Receipts, confirmations, invoices

## Usage

### Python (FastAPI)
```python
from services.email import send_email

await send_email(
    to="user@example.com",
    subject="Welcome to Athlynx",
    template="welcome",
    data={"name": "John Doe"}
)
```

### TypeScript (Node.js)
```typescript
import { sendEmail } from '@/services/email';

await sendEmail({
  to: 'user@example.com',
  subject: 'Welcome to Athlynx',
  template: 'welcome',
  data: { name: 'John Doe' }
});
```

## Configuration
See `.env.example` for required AWS SES credentials.
