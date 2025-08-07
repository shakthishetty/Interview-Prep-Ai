'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';

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

    // Test 1: Check if Google Pay API is available
    try {
      if (window.google && window.google.payments && window.google.payments.api) {
        results.googlePayApiAvailable = true;
        
        // Test 2: Check if Google Pay is ready
        const paymentsClient = new window.google.payments.api.PaymentsClient({ environment: 'TEST' });
        
        const isReadyToPayRequest = {
          apiVersion: 2,
          apiVersionMinor: 0,
          allowedPaymentMethods: [
            {
              type: 'CARD',
              parameters: {
                allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                allowedCardNetworks: ['MASTERCARD', 'VISA']
              }
            }
          ]
        };

        const isReadyToPay = await paymentsClient.isReadyToPay(isReadyToPayRequest);
        results.googlePayReady = isReadyToPay.result;
        
      } else {
        results.googlePayApiAvailable = false;
        results.reason = 'Google Pay API not loaded';
      }
    } catch (error) {
      results.googlePayApiAvailable = false;
      results.error = error;
    }

    // Test 3: Check browser and device compatibility
    results.userAgent = navigator.userAgent;
    results.isHttps = window.location.protocol === 'https:';
    results.isChrome = /Chrome/.test(navigator.userAgent);
    results.isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Test 4: Check if running on localhost or supported domain
    results.domain = window.location.hostname;
    results.supportedDomain = window.location.hostname === 'localhost' || window.location.protocol === 'https:';

    setTestResults(results);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Google Pay Debug Tool</h1>
      
      <div className="mb-6 text-center">
        <button
          onClick={runGooglePayTests}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Run Google Pay Tests'}
        </button>
      </div>

      {Object.keys(testResults).length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Test Results:</h2>
          
          <div className="grid gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Environment Check</h3>
              <div className="space-y-2 text-sm">
                <div>🌐 Domain: <code className="bg-gray-100 px-2 py-1 rounded">{testResults.domain}</code></div>
                <div>🔒 HTTPS: <span className={testResults.isHttps ? 'text-green-600' : 'text-red-600'}>{testResults.isHttps ? '✓' : '✗'}</span></div>
                <div>🌍 Supported Domain: <span className={testResults.supportedDomain ? 'text-green-600' : 'text-red-600'}>{testResults.supportedDomain ? '✓' : '✗'}</span></div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Browser & Device</h3>
              <div className="space-y-2 text-sm">
                <div>🌐 Chrome: <span className={testResults.isChrome ? 'text-green-600' : 'text-red-600'}>{testResults.isChrome ? '✓' : '✗'}</span></div>
                <div>📱 Mobile: <span className={testResults.isMobile ? 'text-green-600' : 'text-gray-600'}>{testResults.isMobile ? '✓' : '✗'}</span></div>
                <div className="text-xs text-gray-500 mt-2">
                  <details>
                    <summary>User Agent</summary>
                    <code className="text-xs">{testResults.userAgent}</code>
                  </details>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Google Pay API</h3>
              <div className="space-y-2 text-sm">
                <div>📦 API Available: <span className={testResults.googlePayApiAvailable ? 'text-green-600' : 'text-red-600'}>{testResults.googlePayApiAvailable ? '✓' : '✗'}</span></div>
                {testResults.googlePayReady !== undefined && (
                  <div>💳 Ready to Pay: <span className={testResults.googlePayReady ? 'text-green-600' : 'text-red-600'}>{testResults.googlePayReady ? '✓' : '✗'}</span></div>
                )}
                {testResults.reason && (
                  <div className="text-red-600">❌ Reason: {testResults.reason}</div>
                )}
                {testResults.error && (
                  <div className="text-red-600 text-xs mt-2">
                    <details>
                      <summary>Error Details</summary>
                      <pre>{JSON.stringify(testResults.error, null, 2)}</pre>
                    </details>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">💡 Tips for Google Pay in Test Mode:</h3>
            <ul className="space-y-2 text-sm">
              <li>• Google Pay only shows on HTTPS domains (or localhost)</li>
              <li>• Works best in Chrome browser</li>
              <li>• User must be signed into Google account</li>
              <li>• User must have Google Pay set up with test cards</li>
              <li>• Test cards: Use 4111 1111 1111 1111 (Visa) or 5555 5555 5555 4444 (Mastercard)</li>
              <li>• May not show if no compatible payment methods are available</li>
            </ul>
          </div>
        </div>
      )}

      <script src="https://pay.google.com/gp/p/js/pay.js" async></script>
    </div>
  );
}
