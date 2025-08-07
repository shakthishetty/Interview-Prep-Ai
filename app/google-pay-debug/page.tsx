"use client";

import { useEffect, useState } from "react";

const GooglePayDebug = () => {
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const checkGooglePayConditions = () => {
      const info: any = {
        timestamp: new Date().toISOString(),
        browser: {
          userAgent: navigator.userAgent,
          isChrome: navigator.userAgent.includes('Chrome'),
          isSafari: navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome'),
          isFirefox: navigator.userAgent.includes('Firefox'),
        },
        protocol: {
          isHTTPS: window.location.protocol === 'https:',
          currentURL: window.location.href,
        },
        googlePay: {
          googlePayAvailable: typeof (window as any).google !== 'undefined',
          paymentRequestSupported: typeof window.PaymentRequest !== 'undefined',
        },
        device: {
          isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
          platform: navigator.platform,
        }
      };

      // Check if Payment Request API is supported
      if (window.PaymentRequest) {
        try {
          const supportedInstruments = [{
            supportedMethods: 'https://google.com/pay',
            data: {
              apiVersion: 2,
              apiVersionMinor: 0,
              allowedPaymentMethods: [{
                type: 'CARD',
                parameters: {
                  allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                  allowedCardNetworks: ['MASTERCARD', 'VISA']
                }
              }]
            }
          }];

          const details = {
            total: {
              label: 'Test',
              amount: { currency: 'USD', value: '10.00' }
            }
          };

          const paymentRequest = new PaymentRequest(supportedInstruments, details);
          
          if (paymentRequest.canMakePayment) {
            paymentRequest.canMakePayment().then(result => {
              setDebugInfo((prev: any) => ({
                ...prev,
                googlePay: {
                  ...prev.googlePay,
                  canMakePayment: result
                }
              }));
            });
          }
        } catch (error) {
          info.googlePay.error = error instanceof Error ? error.message : 'Unknown error';
        }
      }

      setDebugInfo(info);
    };

    checkGooglePayConditions();
  }, []);

  const testStripeCheckout = async () => {
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'debug-user',
          userEmail: 'debug@test.com',
          userName: 'Debug User',
        }),
      });
      
      const data = await response.json();
      
      if (data.sessionId) {
        // Redirect to Stripe checkout to see Google Pay
        const stripe = (await import('@/lib/stripe')).stripePromise;
        const stripeInstance = await stripe;
        if (stripeInstance) {
          await stripeInstance.redirectToCheckout({ sessionId: data.sessionId });
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Google Pay Debug Information</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Browser Check */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h2 className="font-semibold text-lg mb-3">Browser Requirements</h2>
          <div className="space-y-2 text-sm">
            <p>✅ Chrome Browser: <span className={debugInfo.browser?.isChrome ? 'text-green-600' : 'text-red-600'}>
              {debugInfo.browser?.isChrome ? 'Yes' : 'No'}
            </span></p>
            <p>🔒 HTTPS: <span className={debugInfo.protocol?.isHTTPS ? 'text-green-600' : 'text-orange-600'}>
              {debugInfo.protocol?.isHTTPS ? 'Yes' : 'No (Required for production)'}
            </span></p>
            <p className="text-xs text-gray-600">Current: {debugInfo.protocol?.currentURL}</p>
          </div>
        </div>

        {/* Google Pay Support */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h2 className="font-semibold text-lg mb-3">Google Pay Support</h2>
          <div className="space-y-2 text-sm">
            <p>💳 Payment Request API: <span className={debugInfo.googlePay?.paymentRequestSupported ? 'text-green-600' : 'text-red-600'}>
              {debugInfo.googlePay?.paymentRequestSupported ? 'Supported' : 'Not Supported'}
            </span></p>
            <p>🎯 Can Make Payment: <span className="text-blue-600">
              {debugInfo.googlePay?.canMakePayment !== undefined ? 
                (debugInfo.googlePay?.canMakePayment ? 'Yes' : 'No') : 
                'Checking...'}
            </span></p>
          </div>
        </div>

        {/* Device Info */}
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h2 className="font-semibold text-lg mb-3">Device Information</h2>
          <div className="space-y-2 text-sm">
            <p>📱 Mobile Device: <span className={debugInfo.device?.isMobile ? 'text-green-600' : 'text-blue-600'}>
              {debugInfo.device?.isMobile ? 'Yes' : 'No'}
            </span></p>
            <p>🖥️ Platform: <span className="text-gray-600">{debugInfo.device?.platform}</span></p>
          </div>
        </div>

        {/* Test Button */}
        <div className="bg-purple-50 p-4 rounded-lg">
          <h2 className="font-semibold text-lg mb-3">Test Google Pay</h2>
          <button 
            onClick={testStripeCheckout}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Open Stripe Checkout
          </button>
          <p className="text-xs text-gray-600 mt-2">
            This will open Stripe's checkout page where Google Pay should appear if supported.
          </p>
        </div>
      </div>

      {/* Raw Debug Data */}
      <div className="mt-8 bg-gray-100 p-4 rounded-lg">
        <h2 className="font-semibold text-lg mb-3">Raw Debug Data</h2>
        <pre className="text-xs overflow-auto bg-white p-3 rounded border">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-orange-50 p-4 rounded-lg">
        <h2 className="font-semibold text-lg mb-3">📋 To See Google Pay:</h2>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Use Chrome browser</li>
          <li>Be signed into your Google account</li>
          <li>Have at least one card saved in your Google account</li>
          <li>Use HTTPS (deploy to production for full testing)</li>
          <li>Click "Open Stripe Checkout" above</li>
        </ol>
      </div>
    </div>
  );
};

export default GooglePayDebug;
