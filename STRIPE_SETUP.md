# Stripe Integration Setup Guide

## Overview
This integration adds a one-time $10 payment for new users before they can access the interview features.

## Setup Steps

### 1. Create Stripe Account
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Create an account or sign in
3. Switch to "Test mode" for development

### 2. Get Stripe Keys
From your Stripe Dashboard:
1. Go to Developers → API Keys
2. Copy the **Publishable key** (starts with `pk_test_`)
3. Copy the **Secret key** (starts with `sk_test_`)

### 3. Set Up Webhook
1. Go to Developers → Webhooks
2. Click "Add endpoint"
3. Set URL to: `https://yourdomain.com/api/stripe/webhook`
4. Select events: `checkout.session.completed`
5. Copy the **Webhook Secret** (starts with `whsec_`)

### 4. Environment Variables
Add these to your `.env.local`:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 5. Test the Integration
1. Use Stripe test card: `4242 4242 4242 4242`
2. Any future expiry date (e.g., 12/34)
3. Any CVC (e.g., 123)

## Flow
1. User signs up/signs in
2. If user hasn't paid → Redirected to `/payment`
3. User pays $10 → Redirected to `/payment/success`
4. Payment webhook updates user's `hasPaid` status
5. User can access all features

## Features
- ✅ One-time $10 payment
- ✅ Lifetime access after payment
- ✅ Secure Stripe integration
- ✅ Webhook handling for payment confirmation
- ✅ Automatic redirection flow
- ✅ Payment status tracking
- ✅ Beautiful payment UI

## User Experience
- **New users**: Sign up → Payment → Full access
- **Paid users**: Sign in → Direct access (no payment page)
- **Payment protection**: All interview routes require payment

## Production Deployment
1. Replace test keys with live keys
2. Update webhook URL to production domain
3. Test with real payment methods
