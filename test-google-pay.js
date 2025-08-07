#!/usr/bin/env node

/**
 * Google Pay Quick Test Script
 * Run this to quickly check if your Google Pay integration is working
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Google Pay Integration Test\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Please run this script from your project root directory');
  process.exit(1);
}

// Test 1: Check environment variables
console.log('1. Checking Environment Variables...');
try {
  const envPath = '.env.local';
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const hasStripeKey = envContent.includes('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY');
    const hasSecretKey = envContent.includes('STRIPE_SECRET_KEY');
    
    console.log(`   ✅ Environment file exists: ${envPath}`);
    console.log(`   ${hasStripeKey ? '✅' : '❌'} Stripe publishable key`);
    console.log(`   ${hasSecretKey ? '✅' : '❌'} Stripe secret key`);
  } else {
    console.log('   ❌ .env.local file not found');
  }
} catch (error) {
  console.log('   ❌ Error checking environment variables');
}

// Test 2: Check if required files exist
console.log('\n2. Checking Required Files...');
const requiredFiles = [
  'app/api/stripe/checkout/route.ts',
  'app/debug/google-pay-v2/page.tsx',
  'lib/stripe.ts',
  'components/ui/button.tsx'
];

requiredFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`   ${exists ? '✅' : '❌'} ${file}`);
});

// Test 3: Check dependencies
console.log('\n3. Checking Dependencies...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const deps = {...packageJson.dependencies, ...packageJson.devDependencies};
  
  const requiredDeps = [
    '@stripe/stripe-js',
    'stripe',
    'next',
    'react'
  ];
  
  requiredDeps.forEach(dep => {
    const installed = deps[dep];
    console.log(`   ${installed ? '✅' : '❌'} ${dep} ${installed || '(not installed)'}`);
  });
} catch (error) {
  console.log('   ❌ Error checking dependencies');
}

// Test 4: Check if development server can start
console.log('\n4. Testing Build...');
try {
  execSync('npm run build', { stdio: 'pipe', timeout: 30000 });
  console.log('   ✅ Build successful');
} catch (error) {
  console.log('   ❌ Build failed - check for syntax errors');
}

console.log('\n📋 Next Steps:');
console.log('1. Start your app: npm run dev');
console.log('2. Open: http://localhost:3000/debug/google-pay-v2');
console.log('3. Follow the testing guide in GOOGLE_PAY_GUIDE.md');

console.log('\n💡 Quick Browser Test:');
console.log('• Use Chrome browser only');
console.log('• Sign into Google: google.com');
console.log('• Set up Google Pay: pay.google.com');
console.log('• Add test cards: 4111 1111 1111 1111 (Visa)');
console.log('• Test your payment flow');

console.log('\n🔧 If issues persist:');
console.log('• Check the debug page for detailed diagnostics');
console.log('• Verify Google Pay setup at pay.google.com');
console.log('• Try incognito mode with fresh Google login');
console.log('• Check browser console for errors (F12)');
