# Google Pay Digital Wallet Integration Guide

## Current Status
✅ **Stripe Integration**: Configured with multiple payment methods including digital wallets (Google Pay/Apple Pay), card payments, Stripe Link, Cash App Pay, and US bank accounts  
✅ **Digital Wallet Support**: Google Pay wallet integration through Stripe's card payment method  
✅ **Debug Tools**: Available at `/debug/google-pay-v2` for comprehensive testing  
✅ **Payment Gateway**: Working with payment status tracking via Firestore  
✅ **OAuth Authentication**: Google OAuth integration for easy sign-up/sign-in  

## Google Pay Digital Wallet Requirements

### 1. Browser Requirements ⭐ CRITICAL
- **Chrome/Chromium browsers** (Edge, Brave, etc.) - **Required**
- **HTTPS connection** in production OR **localhost** in development
- **User must be signed into Google** in the browser (separate from your app login)

### 2. Google Pay Setup ⭐ CRITICAL  
**Important**: Google Pay account setup is **separate** from your app authentication.

#### Step-by-Step Setup:
1. **Sign into Google** in your browser: Go to google.com and sign in with any Google account
2. **Set up Google Pay**: Visit [pay.google.com](https://pay.google.com)
3. **Add a payment method** using these test cards for development:
   - **Best for Google Pay**: `4242 4242 4242 4242` (Visa - works best in test mode)
   - **Alternative**: `5555 5555 5555 4444` (Mastercard)
   - **Avoid**: `4111 1111 1111 1111` (can cause OR-CCSEH-21 error)
   - **Expiry**: `12/28` **CVC**: `123`
4. **Complete Google Pay profile** (may require phone verification in some regions)

### 3. Geographic Limitations
Google Pay availability varies by region:
- ✅ **Available**: US, UK, Canada, Australia, most of EU
- ❌ **Limited/Unavailable**: Some regions may not support Google Pay
- Check Google Pay availability in your region at [pay.google.com](https://pay.google.com)

### 4. Test Mode Limitations
- **Test mode is more restrictive** than production
- Some users may not see Google Pay even with proper setup
- **Expected behavior**: Google Pay may appear inconsistently in test mode

## How to Check if Google Pay is Working ✅

### Method 1: Quick Visual Test (2 minutes)
1. **Start your app**: `npm run dev`
2. **Open Chrome browser** and go to `http://localhost:3000`
3. **Sign into your app** with email/password
4. **Go to payment page** (navigate through sign-up or payment flow)
5. **Look for payment options**:
   - ✅ **Working**: You see Google Pay button/option alongside card payment
   - ❌ **Not working**: Only see regular card input fields

### Method 2: Debug Page Test (Recommended)
1. **Open**: `http://localhost:3000/debug/google-pay-v2`
2. **Check Browser Environment**:
   - Browser should show "Chrome ✓"
   - Protocol should show "HTTPS ✓" or "Localhost ✓"
3. **Check Stripe Configuration**:
   - "Stripe Loaded" should show "Yes ✓"
   - "Public Key" should show "Present"
4. **Test Google Pay**:
   - Click "Test Google Pay Availability"
   - Should show "Google Pay Available: Yes ✓"
5. **Test Full Checkout**:
   - Click "Create Test Checkout"
   - Should redirect to Stripe checkout with Google Pay visible

### Method 3: Browser Console Test
1. **Open Chrome DevTools** (F12)
2. **Go to Console tab**
3. **Run this code**:
```javascript
// Check if Google Pay API is loaded
console.log('Google Pay API available:', !!(window.google && window.google.payments));

// Test Google Pay readiness
if (window.google && window.google.payments) {
  const client = new window.google.payments.api.PaymentsClient({environment: 'TEST'});
  client.isReadyToPay({
    apiVersion: 2,
    apiVersionMinor: 0,
    allowedPaymentMethods: [{
      type: 'CARD',
      parameters: {
        allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
        allowedCardNetworks: ['MASTERCARD', 'VISA']
      }
    }]
  }).then(result => console.log('Google Pay ready:', result.result));
}
```

## What You Should See When It's Working

### ✅ Success Indicators:
- **Debug page shows**: All green checkmarks ✓
- **Payment page shows**: Google Pay wallet button/option
- **Console shows**: `Google Pay ready: true`
- **Stripe checkout shows**: Digital wallet options including Google Pay alongside card payments

### ❌ Common Issues & What They Mean:

#### "Browser: Not Chrome" 
- **Problem**: Using Safari, Firefox, or other browser
- **Solution**: Switch to Chrome, Edge, or Chromium-based browser

#### "Google Pay Available: No ✗"
- **Problem**: Google Pay API not available or user not set up
- **Solution**: Follow setup steps below

#### "Google Pay API not loaded"
- **Problem**: Network issue or ad blocker
- **Solution**: Disable ad blockers, check internet connection

#### Only see card input fields (no Google Pay button)
- **Problem**: User hasn't set up Google Pay or browser issues
- **Solution**: Complete Google Pay setup

## Step-by-Step Setup to Make It Work

### 1. Browser Setup (Required)
```bash
# Use Chrome or Chromium-based browser only
# ✅ Chrome, Edge, Brave, Arc
# ❌ Safari, Firefox
```

### 2. Google Account Setup (Required)
1. **Open new tab** → Go to `google.com`
2. **Sign in** with any Google account
3. **Keep this tab open** (stay signed in)

### 3. Google Pay Setup (Required)
1. **Visit**: `https://pay.google.com`
2. **Add payment method** with these test cards:
   - **Best**: `4242 4242 4242 4242` (Visa - most reliable in test mode)
   - **Alternative**: `5555 5555 5555 4444` (Mastercard)
   - **Expiry**: `12/28` **CVC**: `123`
3. **Complete profile** if prompted (phone verification may be required)

### 4. Test in Your App
1. **Sign into your app** (email/password - this is separate from Google)
2. **Navigate to payment page**
3. **Google Pay should now appear** alongside other payment options

## Troubleshooting Steps

### If Google Pay Still Not Showing:

#### Step 1: Verify Browser Environment
```bash
# Open Chrome DevTools (F12) → Console tab
# Run: navigator.userAgent
# Should contain "Chrome"
```

#### Step 2: Check Google Sign-in Status
```bash
# In browser address bar, go to: accounts.google.com
# Should show you're signed in
```

#### Step 3: Verify Google Pay Setup
```bash
# Go to: pay.google.com
# Should show your added payment methods
```

#### Step 4: Test API Availability
```bash
# Use the debug page: /debug/google-pay-v2
# All sections should show green checkmarks
```

#### Step 5: Clear Browser Data (if needed)
```bash
# Chrome → Settings → Privacy → Clear browsing data
# Select: Cookies, Cache
# Then repeat setup steps
```

## Troubleshooting Steps

### Quick Diagnostic
1. Visit `/debug/google-pay-v2` in your app
2. Check all green checkmarks ✓
3. Run Google Pay availability test
4. Try test checkout to see available payment methods

### Common Issues & Solutions

#### ❌ Google Pay Not Appearing (Most Common Issue)
**Quick Check - If Stripe Link shows but Google Pay doesn't:**
1. **Browser**: Are you using Chrome/Edge? (Safari/Firefox don't work)
2. **Google Sign-in**: Open google.com - are you signed in?
3. **Google Pay Setup**: Go to pay.google.com - do you have payment methods?

**Possible Causes:**
- Not signed into Google account in browser ⭐ **MOST COMMON**
- No payment methods in Google Pay ⭐ **VERY COMMON**
- Using unsupported browser (Safari, Firefox) ⭐ **COMMON**
- Geographic restrictions
- Test mode limitations

**Solutions:**
1. **Sign into Google**: Open new tab → google.com → sign in
2. **Set up Google Pay**: Visit pay.google.com → add test cards
3. **Use Chrome**: Switch to Chrome or Chromium-based browser
4. **Clear browser data**: Clear cookies/cache and retry
5. **Try incognito/private mode** with fresh Google login

#### ❌ "Google Pay API not loaded"
**Solutions:**
1. **Check internet connection**
2. **Disable ad blockers** temporarily
3. **Try different browser**
4. **Check firewall/proxy settings**

#### ❌ Google Pay Shows but Payment Fails

**Error: "OR-CCSEH-21" in Google Pay**
This error indicates Google Pay is working but there's a payment method issue:

**Solutions:**
1. **Remove existing cards from Google Pay**: Go to pay.google.com → Remove all cards
2. **Add fresh test cards**: Use these specific test cards that work better:
   - **Primary**: `4242 4242 4242 4242` (Visa)
   - **Alternative**: `5555 5555 5555 4444` (Mastercard) 
   - **Expiry**: `12/28` **CVC**: `123`
3. **Complete Google Pay profile verification**:
   - Go to pay.google.com
   - Complete phone verification if prompted
   - Add a backup payment method
4. **Clear browser data and retry**:
   - Chrome → Settings → Privacy → Clear browsing data
   - Select: Cookies, Cache, Site data
   - Re-setup Google Pay with fresh test cards
5. **Try different test cards** - some work better in test mode than others

**Other Payment Error Solutions:**
1. **Use valid test cards** (see updated list above)
2. **Complete Google Pay profile** (phone, address verification)
3. **Check Stripe dashboard** for error details
4. **Try different test card**
5. **Use incognito mode** with fresh Google Pay setup

## Testing Workflow

### For Developers:
1. **Browser Setup**:
   - Use Chrome browser
   - Sign into Google account
   - Set up Google Pay with test cards

2. **App Testing**:
   - Sign into your app (email/password - separate from Google account)
   - Navigate to payment page
   - Google Pay should appear alongside other payment methods

3. **Debug Tools**:
   - Use `/debug/google-pay-v2` for comprehensive testing
   - Check browser environment, Stripe config, and Google Pay availability
   - Create test checkout sessions

### For Users:
1. **One-time setup**:
   - Ensure you're using Chrome or Edge browser
   - Sign into your Google account in the browser
   - Set up Google Pay at pay.google.com

2. **Using the app**:
   - Sign into InterviewPrep normally (email/password)
   - When ready to pay, Google Pay will appear if properly set up
   - Your app login and Google account can be different

## Technical Configuration

### Current Stripe Setup:
```typescript
payment_method_types: [
  'card',           // Includes Google Pay & Apple Pay when available
  'link',           // Stripe Link
  'cashapp',        // Cash App Pay  
  'us_bank_account' // Bank transfers
]
```

### Google Pay Detection:
The app automatically detects if Google Pay is available based on:
- Browser compatibility
- Google Pay API availability  
- User's Google Pay setup status
- Regional availability

## Production vs Test Mode

### Test Mode (Current):
- More restrictive Google Pay visibility
- Requires proper Google Pay setup even for test transactions
- May not appear for all users even when configured correctly
- Use test card numbers in Google Pay

### Production Mode (Future):
- More reliable Google Pay visibility
- Better user experience
- Real payment methods
- Geographic restrictions still apply

## Support Resources

- **Debug Page**: `/debug/google-pay-v2` - Real-time testing and diagnostics
- **Google Pay Setup**: [pay.google.com](https://pay.google.com)
- **Stripe Dashboard**: [dashboard.stripe.com](https://dashboard.stripe.com) - View payment attempts
- **Browser Requirements**: Chrome/Chromium-based browsers only

## Key Takeaways

1. **Google Pay != App Authentication** - These are completely separate systems
2. **Chrome browser required** - Safari and Firefox don't support Google Pay integration reliably  
3. **Test mode is restrictive** - Google Pay may not appear for all users in test environment
4. **Geographic limitations** - Not available in all regions
5. **One-time setup required** - Users need to set up Google Pay in their browser once

---

*This guide covers the complete Google Pay integration for InterviewPrep. For technical issues, use the debug tools and check Stripe dashboard for detailed error information.*
