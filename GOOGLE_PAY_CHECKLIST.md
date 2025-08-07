# Google Pay Testing Checklist ✅

## Pre-Test Setup (One Time)
- [ ] Using Chrome, Edge, or Chromium-based browser (NOT Safari/Firefox)
- [ ] Signed into Google account at google.com
- [ ] Google Pay set up at pay.google.com with test cards:
  - [ ] Visa: 4111 1111 1111 1111
  - [ ] Mastercard: 5555 5555 5555 4444
  - [ ] Expiry: 12/25, CVC: 123

## Quick Visual Test (2 minutes)
- [ ] Start app: `npm run dev`
- [ ] Open: http://localhost:3000
- [ ] Sign into app with email/password
- [ ] Navigate to payment page
- [ ] **RESULT**: Google Pay button/option visible alongside card payment?

## Debug Page Test (Recommended)
- [ ] Open: http://localhost:3000/debug/google-pay-v2
- [ ] Browser shows "Chrome ✓"
- [ ] Protocol shows "HTTPS ✓" or "Localhost ✓"
- [ ] Stripe shows "Yes ✓" and "Present"
- [ ] Click "Test Google Pay Availability"
- [ ] **RESULT**: Shows "Google Pay Available: Yes ✓"?
- [ ] Click "Create Test Checkout"
- [ ] **RESULT**: Redirects to Stripe with Google Pay visible?

## Browser Console Test
- [ ] Open Chrome DevTools (F12) → Console tab
- [ ] Run: `navigator.userAgent` → Should contain "Chrome"
- [ ] Run: `!!(window.google && window.google.payments)` → Should return `true`
- [ ] Check for any error messages in red

## Common Issues Checklist
If Google Pay not showing, check:
- [ ] Wrong browser (using Safari/Firefox instead of Chrome)
- [ ] Not signed into Google account
- [ ] No payment methods in Google Pay
- [ ] Ad blocker enabled
- [ ] Geographic region doesn't support Google Pay
- [ ] Test mode limitations (normal behavior)

## Success Indicators ✅
- [ ] Debug page: All green checkmarks
- [ ] Payment page: Google Pay button visible
- [ ] Console: `Google Pay ready: true`
- [ ] Stripe checkout: Multiple payment options including Google Pay

## Failed Indicators ❌
- [ ] Debug page: Red X marks
- [ ] Payment page: Only card input fields
- [ ] Console: Google Pay errors or `false` results
- [ ] Browser not Chrome/Edge

## Quick Fixes
- [ ] Clear browser cache/cookies
- [ ] Try incognito mode
- [ ] Disable ad blocker
- [ ] Refresh Google Pay setup at pay.google.com
- [ ] Switch to Chrome if using other browser

---

**Remember**: Your app login (email/password) is SEPARATE from Google account sign-in and Google Pay setup. You need both!
