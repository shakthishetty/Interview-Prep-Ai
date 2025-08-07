"use client";

import { useState } from "react";

const DebugPage = () => {
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testStripeCheckout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'test-user-123',
          userEmail: 'test@example.com',
          userName: 'Test User',
        }),
      });

      const result = await response.json();
      setTestResult({ success: response.ok, data: result, status: response.status });
    } catch (error) {
      setTestResult({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
    setIsLoading(false);
  };

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Environment Variables & Stripe Debug</h1>
      
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-3">Environment Variables</h2>
        <div className="space-y-2">
          <p>
            <strong>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:</strong>{" "}
            {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? "✅ Available" : "❌ Not Available"}
          </p>
          <p>
            <strong>Key starts with pk_:</strong>{" "}
            {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_') ? "✅ Valid" : "❌ Invalid"}
          </p>
          <p>
            <strong>Key value (first 20 chars):</strong>{" "}
            {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.substring(0, 20) || "N/A"}...
          </p>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Test Stripe Checkout API</h2>
        <button 
          onClick={testStripeCheckout}
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Testing...' : 'Test Checkout Session'}
        </button>
        
        {testResult && (
          <div className="mt-4 p-3 bg-white rounded border">
            <h3 className="font-semibold">Test Result:</h3>
            <pre className="mt-2 text-sm overflow-auto">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebugPage;
