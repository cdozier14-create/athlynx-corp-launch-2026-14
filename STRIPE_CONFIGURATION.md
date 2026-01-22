# Stripe Payment Configuration

**Dozier Holdings Group - Complete Stripe Setup Guide**

## 🎯 Overview

This document details the complete Stripe payment integration across all DHG applications with subscription tiers, one-time payments, and credit systems.

---

## 💳 Products & Pricing

### Subscription Products

#### 1. Athlynx Pro
**Product ID:** `prod_athlynx_pro`
- **Price:** $29/month
- **Features:**
  - Athlete profile & verification
  - NIL deal marketplace access
  - Basic analytics
  - Social feed access
  - 100 credits/month
- **Apps:** Athlynx Platform

#### 2. Athlynx Elite
**Product ID:** `prod_athlynx_elite`
- **Price:** $99/month
- **Features:**
  - All Pro features
  - Advanced AI wizards
  - Premium analytics
  - Priority support
  - 500 credits/month
  - Early access to new features
- **Apps:** Athlynx Platform

#### 3. VIP Access
**Product ID:** `prod_vip_access`
- **Price:** $199/month
- **Features:**
  - All Elite features
  - Exclusive VIP portal access
  - White-glove onboarding
  - Dedicated account manager
  - Unlimited credits
  - Custom branding options
- **Apps:** Athlynx Platform + Athlynx VIP

#### 4. Transfer Portal Pro
**Product ID:** `prod_transfer_pro`
- **Price:** $49/month
- **Features:**
  - Full transfer portal access
  - AI-powered school matching
  - Transfer wizard guidance
  - School analytics
  - Direct coach connections
- **Apps:** Transfer Portal

#### 5. Diamond Grind Elite
**Product ID:** `prod_diamond_grind`
- **Price:** $79/month
- **Features:**
  - Personalized training plans
  - Performance tracking
  - Mental conditioning tools
  - Nutrition guidance
  - Weekly coach check-ins
- **Apps:** Diamond Grind

### One-Time Payments (Credits)

#### Credit Packages
- **Small Package:** $10 → 100 credits
- **Medium Package:** $50 → 550 credits (10% bonus)
- **Large Package:** $100 → 1,200 credits (20% bonus)

**Credit Usage:**
- AI wizard consultation: 10 credits
- Premium content unlock: 5 credits
- NIL deal boost: 25 credits
- Transfer portal spotlight: 15 credits
- Direct message to coach: 5 credits

---

## 🔧 Stripe Dashboard Setup

### Step 1: Create Products

1. Login to Stripe Dashboard
2. Go to **Products** → **Add product**
3. For each subscription product:
   - Name: (e.g., "Athlynx Pro")
   - Description: (feature list)
   - Pricing model: **Recurring**
   - Price: (amount)
   - Billing period: **Monthly**
   - Currency: **USD**
   - Save product

4. For credit packages:
   - Name: (e.g., "100 Credits")
   - Pricing model: **One-time**
   - Price: (amount)
   - Currency: **USD**

### Step 2: Configure Webhooks

**Webhook Endpoint URL:**
```
https://api.dozierholdingsgroup.com/api/stripe/webhook
```

**Events to Subscribe:**

Essential Events:
- ✅ `payment_intent.succeeded`
- ✅ `payment_intent.payment_failed`
- ✅ `customer.subscription.created`
- ✅ `customer.subscription.updated`
- ✅ `customer.subscription.deleted`
- ✅ `invoice.payment_succeeded`
- ✅ `invoice.payment_failed`
- ✅ `customer.created`
- ✅ `customer.updated`

Optional (for advanced features):
- `charge.succeeded`
- `charge.failed`
- `charge.refunded`
- `invoice.upcoming`
- `customer.subscription.trial_will_end`

### Step 3: API Keys

**Test Mode (Development):**
```
STRIPE_PUBLISHABLE_KEY=pk_test_51...
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_WEBHOOK_SECRET=whsec_test_...
```

**Live Mode (Production):**
```
STRIPE_PUBLISHABLE_KEY=pk_live_51...
STRIPE_SECRET_KEY=sk_live_51...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 📝 Implementation Guide

### Backend API Endpoints

#### Create Checkout Session
```python
POST /api/stripe/create-checkout-session

Request:
{
  "price_id": "price_xxx",
  "customer_email": "user@example.com",
  "success_url": "https://athlynx.ai/success?session_id={CHECKOUT_SESSION_ID}",
  "cancel_url": "https://athlynx.ai/pricing",
  "app_name": "athlynx"
}

Response:
{
  "session_id": "cs_test_xxx",
  "url": "https://checkout.stripe.com/c/pay/cs_test_xxx"
}
```

#### Handle Webhook
```python
POST /api/stripe/webhook

Headers:
  stripe-signature: t=xxx,v1=xxx

Request: (Stripe webhook payload)

Response:
{
  "received": true
}
```

#### Get Customer Portal
```python
POST /api/stripe/create-customer-portal

Request:
{
  "customer_id": "cus_xxx",
  "return_url": "https://athlynx.ai/settings"
}

Response:
{
  "url": "https://billing.stripe.com/p/session/xxx"
}
```

### Frontend Integration

#### React Component Example

```typescript
import { useState } from 'react';
import { apiClient } from '@/lib/api';

export function PricingCard({ plan }) {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post('/stripe/create-checkout-session', {
        price_id: plan.priceId,
        customer_email: user.email,
        success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/pricing`,
        app_name: 'athlynx'
      });
      
      // Redirect to Stripe Checkout
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleSubscribe} disabled={loading}>
      {loading ? 'Processing...' : `Subscribe for $${plan.price}/mo`}
    </button>
  );
}
```

---

## 🔐 Security Best Practices

### 1. Webhook Signature Verification

Always verify webhook signatures:

```python
import stripe
from fastapi import HTTPException, Header

@app.post("/api/stripe/webhook")
async def stripe_webhook(
    request: Request,
    stripe_signature: str = Header(None)
):
    payload = await request.body()
    
    try:
        event = stripe.Webhook.construct_event(
            payload, 
            stripe_signature, 
            os.getenv("STRIPE_WEBHOOK_SECRET")
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")
    
    # Process event
    if event.type == 'payment_intent.succeeded':
        handle_payment_success(event.data.object)
    
    return {"received": True}
```

### 2. Idempotency Keys

Use idempotency keys for critical operations:

```python
stripe.PaymentIntent.create(
    amount=2900,
    currency="usd",
    customer=customer_id,
    idempotency_key=f"payment_{user_id}_{timestamp}"
)
```

### 3. API Key Security

- Never commit API keys to source control
- Store in environment variables only
- Use different keys for test and production
- Rotate keys regularly
- Restrict API key permissions in Stripe dashboard

---

## 📊 Database Schema for Stripe Data

### stripe_customers Table

```sql
CREATE TABLE stripe_customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    stripe_customer_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_stripe_customer_id ON stripe_customers(stripe_customer_id);
CREATE INDEX idx_user_id ON stripe_customers(user_id);
```

### subscriptions Table

```sql
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    stripe_subscription_id VARCHAR(255) UNIQUE NOT NULL,
    stripe_customer_id VARCHAR(255) NOT NULL,
    product_id VARCHAR(255) NOT NULL,
    price_id VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL, -- active, canceled, past_due, etc.
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    canceled_at TIMESTAMP,
    app_name VARCHAR(50), -- athlynx, transferportal, etc.
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX idx_user_id_subscriptions ON subscriptions(user_id);
CREATE INDEX idx_status ON subscriptions(status);
```

### credits Table

```sql
CREATE TABLE credits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL DEFAULT 0,
    transaction_type VARCHAR(50), -- purchase, usage, bonus, refund
    description TEXT,
    stripe_payment_intent_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_id_credits ON credits(user_id);
```

### transactions Table

```sql
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    stripe_payment_intent_id VARCHAR(255),
    stripe_charge_id VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'usd',
    status VARCHAR(50), -- succeeded, pending, failed
    description TEXT,
    app_name VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_stripe_payment_intent ON transactions(stripe_payment_intent_id);
CREATE INDEX idx_user_id_transactions ON transactions(user_id);
```

---

## 🧪 Testing

### Test Cards

**Success:**
- `4242 4242 4242 4242` - Visa
- `5555 5555 5555 4444` - Mastercard
- `3782 822463 10005` - American Express

**Decline:**
- `4000 0000 0000 0002` - Generic decline
- `4000 0000 0000 9995` - Insufficient funds

**Special Cases:**
- `4000 0025 0000 3155` - Requires authentication (3D Secure)
- `4000 0000 0000 0069` - Expired card

### Test Webhook Locally

Using Stripe CLI:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:8000/api/stripe/webhook

# Trigger test events
stripe trigger payment_intent.succeeded
stripe trigger customer.subscription.created
```

---

## 📈 Analytics & Reporting

### Key Metrics to Track

1. **Monthly Recurring Revenue (MRR)**
   - Sum of all active subscription amounts
   - Track by app and tier

2. **Churn Rate**
   - Percentage of subscribers who cancel
   - Monitor monthly

3. **Average Revenue Per User (ARPU)**
   - Total revenue / Total users
   - Segment by app and tier

4. **Credit Utilization**
   - Credits purchased vs. used
   - Identify popular features

5. **Conversion Rate**
   - Free users → Paid subscribers
   - Track by pricing page visits

---

## 🔄 Subscription Lifecycle

### New Subscription Flow

```
1. User clicks "Subscribe"
2. Frontend creates checkout session
3. User redirected to Stripe Checkout
4. User enters payment details
5. Stripe processes payment
6. Webhook: customer.subscription.created
7. Backend updates database
8. User redirected to success page
9. Frontend shows subscription status
```

### Cancellation Flow

```
1. User clicks "Cancel Subscription"
2. Frontend calls create-customer-portal
3. User redirected to Stripe Customer Portal
4. User cancels subscription
5. Webhook: customer.subscription.updated (cancel_at_period_end=true)
6. Backend updates database
7. User access continues until period end
8. Webhook: customer.subscription.deleted (at period end)
9. Backend revokes access
```

### Upgrade/Downgrade Flow

```
1. User selects new tier
2. Frontend calls update-subscription API
3. Backend updates subscription in Stripe
4. Stripe prorates amount
5. Webhook: customer.subscription.updated
6. Backend updates database
7. New features immediately available
```

---

## 🚨 Error Handling

### Common Errors

**Card Declined:**
```javascript
{
  "error": {
    "code": "card_declined",
    "message": "Your card was declined"
  }
}
```

**Insufficient Funds:**
```javascript
{
  "error": {
    "code": "insufficient_funds",
    "message": "Your card has insufficient funds"
  }
}
```

**Expired Card:**
```javascript
{
  "error": {
    "code": "expired_card",
    "message": "Your card has expired"
  }
}
```

### Error Response Format

```javascript
{
  "success": false,
  "error": {
    "code": "payment_failed",
    "message": "Payment could not be processed",
    "details": "card_declined"
  }
}
```

---

## 📞 Support

### Stripe Support
- Dashboard: https://dashboard.stripe.com
- Documentation: https://stripe.com/docs
- Support: https://support.stripe.com

### DHG Internal
- Owner: cdozier14-create
- API Documentation: /api/docs
- Health Check: /api/health

---

**Last Updated:** January 22, 2026  
**Version:** 1.0.0  
**Maintained by:** cdozier14-create
