"use client";

import { Button } from "@/components/ui/button";
import { stripePromise } from "@/lib/stripe";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface PaymentPageProps {
  userId: string;
  userEmail: string;
  userName: string;
}

const PaymentPage = ({ userId, userEmail, userName }: PaymentPageProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Debug environment variables
  console.log('Stripe publishable key available:', !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

  const handlePayment = async () => {
    try {
      setIsLoading(true);

      // Check if Stripe is available
      if (!stripePromise) {
        throw new Error('Stripe is not configured. Please check your environment variables.');
      }

      // Create checkout session
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          userEmail,
          userName,
        }),
      });

      console.log('Checkout API response status:', response.status);
      console.log('Checkout API response ok:', response.ok);

      const responseData = await response.json();
      console.log('Checkout API response data:', responseData);

      if (!response.ok) {
        throw new Error(`API Error: ${responseData.error || 'Unknown error'}. Details: ${responseData.details || 'No details'}`);
      }

      const { sessionId } = responseData;

      if (!sessionId) {
        throw new Error('No session ID received from server');
      }

      // Redirect to Stripe checkout
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="card-border">
        <div className="flex flex-col gap-8 card py-14 px-10 max-w-lg">
          {/* Logo and Title */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-row justify-center gap-2">
              <Image 
                src="/logo.svg"
                alt="Logo"
                width={38}
                height={32}
              />
              <h2 className="text-primary-100">InterviewPrep</h2>
            </div>
            <h1 className="text-2xl font-bold text-center">Unlock Your Interview Potential</h1>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">What You'll Get:</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm">Unlimited AI-powered interview practice sessions</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm">Detailed feedback on communication skills & technical knowledge</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm">Real-time voice interaction with AI interviewer</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm">Personalized improvement recommendations</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm">Lifetime access - pay once, use forever</p>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gray-100 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-gray-800">$10</div>
            <div className="text-sm text-gray-600">One-time payment</div>
            <div className="text-xs text-gray-500 mt-1">Lifetime access</div>
          </div>

          {/* Payment Button */}
          <Button 
            onClick={handlePayment}
            disabled={isLoading}
            className="btn w-full h-12 text-lg"
          >
            {isLoading ? 'Processing...' : 'Get Lifetime Access - $10'}
          </Button>

          {/* Trust Indicators */}
          <div className="text-center text-xs text-gray-500">
            <p>🔒 Secure payment powered by Stripe</p>
            <p className="mt-1">✨ Join thousands of successful candidates</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
