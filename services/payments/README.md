# Payment Service

## Purpose
Unified Stripe payment processing for all DHG applications.

## Features
- **Subscription Management** - Handle recurring payments across all apps
- **One-time Payments** - Process single transactions
- **Credit System** - Manage credit purchases and usage
- **Webhooks** - Handle Stripe events (payment success, failures, etc.)
- **Multi-tier Pricing** - Support different pricing tiers per app

## Stripe Configuration

### Products & Prices
Configured in Stripe Dashboard for:
- Athlynx Pro ($29/month)
- Athlynx Elite ($99/month)
- VIP Access ($199/month)
- Credits ($10, $50, $100 packages)

### Webhook Events
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

## API Endpoints

### Create Checkout Session
```
POST /api/stripe/create-checkout-session
```

### Create Payment Intent
```
POST /api/stripe/create-payment-intent
```

### Handle Webhook
```
POST /api/stripe/webhook
```

### Get Customer Portal
```
POST /api/stripe/create-customer-portal
```

## Usage Example

### Python (FastAPI)
```python
from services.payments import create_checkout_session

session = await create_checkout_session(
    customer_email="user@example.com",
    price_id="price_xxx",
    success_url="https://athlynx.ai/success",
    cancel_url="https://athlynx.ai/pricing"
)
```

### TypeScript
```typescript
import { createCheckoutSession } from '@/services/payments';

const session = await createCheckoutSession({
  customerEmail: 'user@example.com',
  priceId: 'price_xxx',
  successUrl: 'https://athlynx.ai/success',
  cancelUrl: 'https://athlynx.ai/pricing'
});
```

## Environment Variables
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Webhook signing secret
- `STRIPE_PUBLISHABLE_KEY` - Publishable key (for frontend)

## Testing
Use Stripe test mode credentials for development.

Test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
