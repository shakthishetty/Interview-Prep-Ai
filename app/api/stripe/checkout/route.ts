import { stripe } from '@/lib/stripe';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('=== Stripe Checkout API Called ===');
    console.log('Stripe instance available:', !!stripe);
    console.log('Environment check - STRIPE_SECRET_KEY available:', !!process.env.STRIPE_SECRET_KEY);
    console.log('Environment check - STRIPE_SECRET_KEY starts with sk_:', process.env.STRIPE_SECRET_KEY?.startsWith('sk_'));

    if (!stripe) {
      console.error('Stripe instance is null');
      return NextResponse.json(
        { error: 'Stripe is not configured' },
        { status: 500 }
      );
    }

    const { userId, userEmail, userName } = await request.json();
    console.log('Request data:', { userId, userEmail, userName });

    if (!userId || !userEmail || !userName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    console.log('Creating Stripe checkout session...');
    
    // Get the origin URL and log it
    let origin = request.nextUrl.origin;
    console.log('Request origin:', origin);
    
    // For local development, use hardcoded localhost if needed
    if (!origin || origin === 'null' || origin.includes('localhost:0')) {
      origin = 'http://localhost:3000';
      console.log('Using fallback origin:', origin);
    }
    
    const successUrl = `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/payment/cancel`;
    
    console.log('Success URL:', successUrl);
    console.log('Cancel URL:', cancelUrl);
    
    // Create Stripe checkout session with payment methods that support Google Pay
    const session = await stripe.checkout.sessions.create({
      payment_method_types: [
        'card',           // This includes Google Pay and Apple Pay when available
        'link',           // Stripe Link
        'cashapp',        // Cash App Pay
        'us_bank_account' // Bank transfers
      ],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'InterviewPrep - Lifetime Access',
              description: 'Unlimited AI-powered interview practice with detailed feedback',
            },
            unit_amount: 1000, // $10.00 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: userEmail,
      client_reference_id: userId,
      customer_creation: 'always',
      billing_address_collection: 'auto',
      phone_number_collection: {
        enabled: true,
      },
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutes
      metadata: {
        userId,
        userName,
        userEmail,
        product: 'InterviewPrep-Lifetime-Access',
      },
      // Payment method options optimized for digital wallets
      payment_method_options: {
        card: {
          request_three_d_secure: 'automatic',
        },
        us_bank_account: {
          financial_connections: {
            permissions: ['payment_method', 'balances'],
          },
        },
      },
      // Settings that help with Google Pay visibility
      locale: 'auto',
      submit_type: 'pay',
    });

    console.log('Stripe checkout session created successfully:', session.id);
    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to create checkout session',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
