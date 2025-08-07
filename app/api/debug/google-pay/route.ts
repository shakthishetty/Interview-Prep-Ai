import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: "Google Pay Debug Endpoint",
    instructions: [
      "1. Make sure you're signed into Google in this browser",
      "2. Visit pay.google.com to set up Google Pay with test cards",
      "3. Use test card: 4111 1111 1111 1111 (Visa)",
      "4. Then test payment flow in your app",
    ],
    environment: {
      userAgent: request.headers.get('user-agent'),
      host: request.headers.get('host'),
      isHttps: request.url.startsWith('https://'),
      isLocalhost: request.headers.get('host')?.includes('localhost'),
    },
    googlePayRequirements: {
      httpsOrLocalhost: true,
      chromeRecommended: true,
      googleAccountSignIn: "Required (separate from app login)",
      googlePaySetup: "Required at pay.google.com",
    }
  });
}
