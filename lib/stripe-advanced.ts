// Advanced Stripe checkout configuration with multiple payment methods
export const createAdvancedCheckoutSession = async (stripe: any, params: {
  userId: string;
  userEmail: string;
  userName: string;
  successUrl: string;
  cancelUrl: string;
}) => {
  const { userId, userEmail, userName, successUrl, cancelUrl } = params;

  // Create the checkout session with advanced payment methods
  const session = await stripe.checkout.sessions.create({
    // Enable multiple payment methods including Google Pay
    payment_method_types: [
      'card',           // Credit/Debit cards (includes Google Pay, Apple Pay automatically)
      'link',          // Stripe Link (one-click payments)
    ],
    
    // Enable automatic payment methods for better Google Pay support
    automatic_payment_methods: {
      enabled: true,
    },
    
    // Line items
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'InterviewPrep - Lifetime Access',
            description: 'Unlimited AI-powered interview practice with detailed feedback',
            images: ['https://interview-prep-ai-nine-mu.vercel.app/logo.svg'], // Use full URL for images
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
    
    // Enhanced checkout features
    billing_address_collection: 'auto',
    
    // Customer data
    customer_creation: 'always', // Always create a customer record
    
    // Payment method options
    payment_method_options: {
      card: {
        request_three_d_secure: 'automatic',
      },
    },
    
    // Checkout session options
    expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutes
    
    metadata: {
      userId,
      userName,
      userEmail,
      product: 'InterviewPrep-Lifetime-Access',
    },
  });

  return session;
};
