import { loadStripe } from '@stripe/stripe-js';
import Stripe from 'stripe';

// Client-side Stripe
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  console.error('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable');
}

export const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

// Server-side Stripe (only available on server)
let stripe: Stripe | null = null;

if (typeof window === 'undefined') {
  // Only initialize on server-side
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  
  if (stripeSecretKey) {
    stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-07-30.basil',
    });
  } else {
    console.error('Missing STRIPE_SECRET_KEY environment variable');
  }
}

export { stripe };

