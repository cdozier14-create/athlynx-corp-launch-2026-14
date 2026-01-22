/**
 * ATHLYNX Stripe Checkout & Webhook Handlers
 * A DOZIER HOLDINGS GROUP COMPANY
 * 
 * THE LION'S MONEY-MAKING MACHINE - RUNS 24/7
 */

import Stripe from "stripe";
import { SUBSCRIPTION_TIERS, ONE_TIME_PRODUCTS, getTierById } from "./products";

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-12-15.clover",
});

export interface CreateCheckoutParams {
  userId: number;
  userEmail: string;
  userName: string;
  tierId?: string;
  productId?: string;
  billingCycle?: "monthly" | "yearly";
  origin: string;
}

/**
 * Create a Stripe Checkout Session for subscriptions or one-time purchases
 */
export async function createCheckoutSession(params: CreateCheckoutParams): Promise<{ url: string; sessionId: string }> {
  const { userId, userEmail, userName, tierId, productId, billingCycle = "monthly", origin } = params;

  // Determine if this is a subscription or one-time purchase
  if (tierId) {
    // Subscription checkout
    const tier = getTierById(tierId);
    if (!tier) {
      throw new Error(`Invalid tier: ${tierId}`);
    }

    if (tier.priceMonthly === 0) {
      throw new Error("Cannot checkout free tier");
    }

    const price = billingCycle === "yearly" ? tier.priceYearly : tier.priceMonthly;
    const interval = billingCycle === "yearly" ? "year" : "month";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: userEmail,
      client_reference_id: userId.toString(),
      allow_promotion_codes: true,
      metadata: {
        user_id: userId.toString(),
        customer_email: userEmail,
        customer_name: userName,
        tier_id: tierId,
        tier_name: tier.name,
        billing_cycle: billingCycle,
        company: "Dozier Holdings Group",
      },
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `ATHLYNX ${tier.name}`,
              description: tier.description,
              metadata: {
                tier_id: tierId,
                company: "A Dozier Holdings Group Company",
              },
            },
            unit_amount: Math.round(price * 100), // Convert to cents
            recurring: {
              interval: interval,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?canceled=true`,
    });

    console.log(`[STRIPE] Checkout session created: ${session.id} for user ${userId} - ${tier.name} (${billingCycle})`);
    
    return {
      url: session.url || "",
      sessionId: session.id,
    };
  } else if (productId) {
    // One-time purchase checkout
    const product = ONE_TIME_PRODUCTS.find(p => p.id === productId);
    if (!product) {
      throw new Error(`Invalid product: ${productId}`);
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: userEmail,
      client_reference_id: userId.toString(),
      allow_promotion_codes: true,
      metadata: {
        user_id: userId.toString(),
        customer_email: userEmail,
        customer_name: userName,
        product_id: productId,
        product_name: product.name,
        company: "Dozier Holdings Group",
      },
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              description: product.description,
              metadata: {
                product_id: productId,
                company: "A Dozier Holdings Group Company",
              },
            },
            unit_amount: Math.round(product.price * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?canceled=true`,
    });

    console.log(`[STRIPE] Checkout session created: ${session.id} for user ${userId} - ${product.name}`);
    
    return {
      url: session.url || "",
      sessionId: session.id,
    };
  }

  throw new Error("Must specify either tierId or productId");
}

/**
 * Get customer's subscription status
 */
export async function getSubscriptionStatus(stripeCustomerId: string): Promise<{
  active: boolean;
  tierId?: string;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
}> {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: "active",
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return { active: false };
    }

    const subscription = subscriptions.data[0];
    const tierId = subscription.metadata?.tier_id;

    return {
      active: true,
      tierId,
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    };
  } catch (error) {
    console.error("[STRIPE] Failed to get subscription status:", error);
    return { active: false };
  }
}

/**
 * Cancel subscription at period end
 */
export async function cancelSubscription(subscriptionId: string): Promise<boolean> {
  try {
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
    console.log(`[STRIPE] Subscription ${subscriptionId} set to cancel at period end`);
    return true;
  } catch (error) {
    console.error("[STRIPE] Failed to cancel subscription:", error);
    return false;
  }
}

/**
 * Create or get Stripe customer
 */
export async function getOrCreateCustomer(userId: number, email: string, name: string): Promise<string> {
  try {
    // Search for existing customer
    const customers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (customers.data.length > 0) {
      return customers.data[0].id;
    }

    // Create new customer
    const customer = await stripe.customers.create({
      email: email,
      name: name,
      metadata: {
        user_id: userId.toString(),
        company: "A Dozier Holdings Group Company",
      },
    });

    console.log(`[STRIPE] Created customer ${customer.id} for user ${userId}`);
    return customer.id;
  } catch (error) {
    console.error("[STRIPE] Failed to get/create customer:", error);
    throw error;
  }
}

/**
 * Get customer portal URL for subscription management
 */
export async function createPortalSession(stripeCustomerId: string, returnUrl: string): Promise<string> {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: returnUrl,
    });
    return session.url;
  } catch (error) {
    console.error("[STRIPE] Failed to create portal session:", error);
    throw error;
  }
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(payload: Buffer, signature: string): Stripe.Event {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET not configured");
  }
  
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}

export { stripe };
