import { stripe } from '@/lib/stripe';
import { createAdvancedCheckoutSession } from '@/lib/stripe-advanced';
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
    
    // Create advanced checkout session with multiple payment methods
    const session = await createAdvancedCheckoutSession(stripe, {
      userId,
      userEmail,
      userName,
      successUrl,
      cancelUrl,
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
