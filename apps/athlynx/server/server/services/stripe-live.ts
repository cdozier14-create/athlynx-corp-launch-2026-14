/**
 * ATHLYNX Stripe LIVE Payment Service
 * 
 * WARNING: This uses LIVE keys - real money transactions!
 * 
 * @author ATHLYNX AI Corporation
 */

import Stripe from 'stripe';

// LIVE Stripe configuration
const STRIPE_LIVE_SECRET_KEY = process.env.STRIPE_LIVE_SECRET_KEY || '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';
const STRIPE_LIVE_PUBLISHABLE_KEY = 'pk_live_51Sgy0SRjBH07kRLYVLbklxUYTVwBfs0ZsbIhogtnwyhXBGfpFuHS6PeTpGBRNdL8Cu9eQPejZHDU000vlU302l0';

const stripe = new Stripe(STRIPE_LIVE_SECRET_KEY, {
  apiVersion: '2025-12-15.clover',
});

export interface CreatePaymentIntentOptions {
  amount: number; // in cents
  currency?: string;
  customerId?: string;
  metadata?: Record<string, string>;
  description?: string;
}

export interface CreateSubscriptionOptions {
  customerId: string;
  priceId: string;
  metadata?: Record<string, string>;
}

/**
 * Create a payment intent for one-time payments
 */
export async function createPaymentIntent(options: CreatePaymentIntentOptions) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: options.amount,
      currency: options.currency || 'usd',
      customer: options.customerId,
      metadata: {
        platform: 'ATHLYNX',
        ...options.metadata,
      },
      description: options.description,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Create a customer in Stripe
 */
export async function createCustomer(email: string, name: string, metadata?: Record<string, string>) {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        platform: 'ATHLYNX',
        ...metadata,
      },
    });

    return {
      success: true,
      customerId: customer.id,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Create a subscription for recurring payments
 */
export async function createSubscription(options: CreateSubscriptionOptions) {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: options.customerId,
      items: [{ price: options.priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        platform: 'ATHLYNX',
        ...options.metadata,
      },
    });

    const latestInvoice = subscription.latest_invoice as any;
    const paymentIntent = latestInvoice?.payment_intent;

    return {
      success: true,
      subscriptionId: subscription.id,
      clientSecret: paymentIntent.client_secret,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Create a Stripe Connect account for athletes
 */
export async function createConnectAccount(email: string, metadata?: Record<string, string>) {
  try {
    const account = await stripe.accounts.create({
      type: 'express',
      email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      metadata: {
        platform: 'ATHLYNX',
        ...metadata,
      },
    });

    return {
      success: true,
      accountId: account.id,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Create an account link for Stripe Connect onboarding
 */
export async function createAccountLink(accountId: string, refreshUrl: string, returnUrl: string) {
  try {
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: refreshUrl,
      return_url: returnUrl,
      type: 'account_onboarding',
    });

    return {
      success: true,
      url: accountLink.url,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Transfer funds to an athlete's connected account
 */
export async function transferToAthlete(amount: number, connectedAccountId: string, description?: string) {
  try {
    const transfer = await stripe.transfers.create({
      amount,
      currency: 'usd',
      destination: connectedAccountId,
      description: description || 'ATHLYNX NIL Payment',
      metadata: {
        platform: 'ATHLYNX',
      },
    });

    return {
      success: true,
      transferId: transfer.id,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Get the publishable key for frontend use
 */
export function getPublishableKey() {
  return STRIPE_LIVE_PUBLISHABLE_KEY;
}

export default {
  createPaymentIntent,
  createCustomer,
  createSubscription,
  createConnectAccount,
  createAccountLink,
  transferToAthlete,
  getPublishableKey,
};
