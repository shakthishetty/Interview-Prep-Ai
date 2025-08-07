'use client';

import { Button } from '@/components/ui/button';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';

// Add types for Google Pay API
declare global {
  interface Window {
    google?: {
      payments?: {
        api?: any;
      };
    };
  }
}

// Test if Google Pay API is available
const isGooglePayAvailable = () => {
  if (typeof window === 'undefined') return false;
  
  return window.google && window.google.payments && 
         typeof window.google.payments.api === 'object';
};

// Test Google Pay readiness
const testGooglePayReadiness = async () => {
  if (!isGooglePayAvailable()) {
    return { available: false, reason: 'Google Pay API not loaded' };
  }

  try {
    if (!window.google?.payments?.api) {
      return { available: false, reason: 'Google Pay API not available' };
    }

    const paymentsClient = new window.google.payments.api.PaymentsClient({
      environment: 'TEST' // Use 'PRODUCTION' for live
    });

    const isReadyToPay = await paymentsClient.isReadyToPay({
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [{
        type: 'CARD',
        parameters: {
          allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
          allowedCardNetworks: ['MASTERCARD', 'VISA']
        }
      }]
    });

    return { 
      available: isReadyToPay.result,
      details: isReadyToPay
    };
  } catch (error) {
    return { 
      available: false, 
      reason: 'Error checking Google Pay readiness',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export default function GooglePayDebugPage() {
  const [stripeTest, setStripeTest] = useState<any>(null);
  const [googlePayTest, setGooglePayTest] = useState<any>(null);
  const [browserInfo, setBrowserInfo] = useState<any>(null);
  const [testResults, setTestResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Test browser environment
    const browser = {
      userAgent: navigator.userAgent,
      isChrome: navigator.userAgent.includes('Chrome'),
      isHttps: location.protocol === 'https:',
      isLocalhost: location.hostname === 'localhost',
      googlerSignedIn: document.cookie.includes('google') || document.cookie.includes('gmail'),
      url: window.location.href
    };
    setBrowserInfo(browser);

    // Test Stripe
    const testStripe = async () => {
      try {
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');
        setStripeTest({
          loaded: !!stripe,
          publicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? 'Present' : 'Missing',
          environment: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.includes('pk_test') ? 'Test' : 'Live'
        });
      } catch (error) {
        setStripeTest({
          loaded: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    };

    testStripe();
  }, []);

  const runGooglePayTest = async () => {
    setIsLoading(true);
    try {
      // First, try to load Google Pay API if not already loaded
      if (!isGooglePayAvailable()) {
        // Try to load Google Pay API
        const script = document.createElement('script');
        script.src = 'https://pay.google.com/gp/p/js/pay.js';
        document.head.appendChild(script);
        
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
          setTimeout(reject, 5000); // 5 second timeout
        });
      }

      const result = await testGooglePayReadiness();
      setGooglePayTest(result);
    } catch (error) {
      setGooglePayTest({
        available: false,
        reason: 'Failed to load Google Pay API',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createTestCheckout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'test-user-' + Date.now(),
          userEmail: 'test@example.com',
          userName: 'Test User'
        })
      });

      const data = await response.json();
      
      if (data.sessionId) {
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');
        if (stripe) {
          await stripe.redirectToCheckout({ sessionId: data.sessionId });
        }
      } else {
        setTestResults({
          success: false,
          error: data.error || 'Failed to create checkout session'
        });
      }
    } catch (error) {
      setTestResults({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">Google Pay Debug Center</h1>
        <p className="text-blue-100">
          Comprehensive testing for Google Pay integration in Stripe Checkout
        </p>
      </div>

      {/* Browser Environment */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          🌐 Browser Environment
        </h2>
        {browserInfo && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="font-medium">Browser:</span>
              <span className={`ml-2 px-2 py-1 rounded text-sm ${
                browserInfo.isChrome ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {browserInfo.isChrome ? 'Chrome ✓' : 'Not Chrome'}
              </span>
            </div>
            <div>
              <span className="font-medium">Protocol:</span>
              <span className={`ml-2 px-2 py-1 rounded text-sm ${
                browserInfo.isHttps || browserInfo.isLocalhost ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {browserInfo.isHttps ? 'HTTPS ✓' : browserInfo.isLocalhost ? 'Localhost ✓' : 'HTTP ✗'}
              </span>
            </div>
            <div className="md:col-span-2">
              <span className="font-medium">URL:</span>
              <span className="ml-2 text-sm text-gray-600 break-all">{browserInfo.url}</span>
            </div>
          </div>
        )}
      </div>

      {/* Stripe Configuration */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          💳 Stripe Configuration
        </h2>
        {stripeTest && (
          <div className="space-y-2">
            <div>
              <span className="font-medium">Stripe Loaded:</span>
              <span className={`ml-2 px-2 py-1 rounded text-sm ${
                stripeTest.loaded ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {stripeTest.loaded ? 'Yes ✓' : 'No ✗'}
              </span>
            </div>
            <div>
              <span className="font-medium">Public Key:</span>
              <span className={`ml-2 px-2 py-1 rounded text-sm ${
                stripeTest.publicKey === 'Present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {stripeTest.publicKey}
              </span>
            </div>
            <div>
              <span className="font-medium">Environment:</span>
              <span className="ml-2 px-2 py-1 rounded text-sm bg-blue-100 text-blue-800">
                {stripeTest.environment}
              </span>
            </div>
            {stripeTest.error && (
              <div className="text-red-600 text-sm mt-2">
                Error: {stripeTest.error}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Google Pay Test */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          📱 Google Pay Test
        </h2>
        <div className="space-y-4">
          <Button 
            onClick={runGooglePayTest}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? 'Testing...' : 'Test Google Pay Availability'}
          </Button>
          
          {googlePayTest && (
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <div>
                <span className="font-medium">Google Pay Available:</span>
                <span className={`ml-2 px-2 py-1 rounded text-sm ${
                  googlePayTest.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {googlePayTest.available ? 'Yes ✓' : 'No ✗'}
                </span>
              </div>
              {googlePayTest.reason && (
                <div className="mt-2 text-sm text-gray-600">
                  Reason: {googlePayTest.reason}
                </div>
              )}
              {googlePayTest.error && (
                <div className="mt-2 text-sm text-red-600">
                  Error: {googlePayTest.error}
                </div>
              )}
              {googlePayTest.details && (
                <div className="mt-2 text-sm text-gray-600">
                  <details>
                    <summary>Technical Details</summary>
                    <pre className="mt-2 text-xs">{JSON.stringify(googlePayTest.details, null, 2)}</pre>
                  </details>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Test Checkout */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          🛒 Test Checkout
        </h2>
        <div className="space-y-4">
          <p className="text-gray-600 text-sm">
            Create a test checkout session to see all available payment methods including Google Pay.
          </p>
          <Button 
            onClick={createTestCheckout}
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isLoading ? 'Creating...' : 'Create Test Checkout'}
          </Button>
          
          {testResults && (
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <div className={`text-sm ${testResults.success ? 'text-green-600' : 'text-red-600'}`}>
                {testResults.success ? 'Success!' : `Error: ${testResults.error}`}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
        <h2 className="text-xl font-semibold mb-4 text-yellow-800">
          📋 Google Pay Setup Instructions
        </h2>
        <div className="space-y-2 text-sm text-yellow-700">
          <p><strong>1. Sign into Google:</strong> Make sure you're signed into your Google account in this browser</p>
          <p><strong>2. Set up Google Pay:</strong> Go to <a href="https://pay.google.com" target="_blank" rel="noopener noreferrer" className="underline">pay.google.com</a> and add a payment method</p>
          <p><strong>3. Use Test Cards:</strong> Add these test cards to Google Pay:</p>
          <ul className="ml-6 list-disc space-y-1">
            <li>Visa: 4111 1111 1111 1111</li>
            <li>Mastercard: 5555 5555 5555 4444</li>
            <li>Expiry: Any future date (e.g., 12/25)</li>
            <li>CVC: Any 3 digits (e.g., 123)</li>
          </ul>
          <p><strong>4. Test Again:</strong> After setup, run the tests above and try the checkout</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">🔗 Quick Links</h2>
        <div className="space-y-2">
          <a href="https://pay.google.com" target="_blank" rel="noopener noreferrer" 
             className="block text-blue-600 hover:underline">
            → Google Pay Setup
          </a>
          <a href="https://dashboard.stripe.com/test/payments" target="_blank" rel="noopener noreferrer"
             className="block text-blue-600 hover:underline">
            → Stripe Dashboard (Test Mode)
          </a>
          <a href="/payment/cancel" className="block text-blue-600 hover:underline">
            → Payment Cancel Page
          </a>
          <a href="/payment/success" className="block text-blue-600 hover:underline">
            → Payment Success Page
          </a>
        </div>
      </div>
    </div>
  );
}
